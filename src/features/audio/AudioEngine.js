import { createChipEffect } from "./chipEffects.js";

const ramp = (param, value, context, seconds = 0.04) => {
  param.cancelScheduledValues(context.currentTime);
  param.setValueAtTime(param.value, context.currentTime);
  param.linearRampToValueAtTime(value, context.currentTime + seconds);
};

export class AudioEngine {
  constructor({
    baseUrl,
    tracks,
    cries,
    preferences,
    onChange,
    onNext,
    environment = globalThis,
  }) {
    Object.assign(this, {
      baseUrl,
      tracks,
      cries,
      preferences,
      onChange,
      onNext,
      environment,
    });
    this.state = {
      ready: false,
      playing: false,
      background: false,
      track: null,
      error: "",
    };
    this.offsets = new Map();
    this.buffers = new Map();
    this.sources = new Map();
    this.tokens = new Map();
    this.musicToken = 0;
    this.disposed = false;
    this.visible = true;
    this.index = 0;
    this.desired = null;
    this.decks = [];
  }
  publish(values) {
    if (!this.disposed) {
      Object.assign(this.state, values);
      this.onChange?.({ ...this.state });
    }
  }
  async unlock(retry = false) {
    if (this.disposed || this.preferences.muted || !this.visible) return;
    if (this.unlocking) {
      try {
        await this.unlocking;
      } catch {
        /* A chamada original publica a falha. */
      }
      return;
    }
    if (!retry && this.state.ready && this.context?.state === "running") return;
    try {
      if (!this.context) {
        const Context =
          this.environment.AudioContext || this.environment.webkitAudioContext;
        if (!Context) {
          this.publish({ error: "Áudio indisponível neste navegador." });
          return;
        }
        const context = (this.context = new Context());
        this.master = context.createGain();
        const limiter = context.createDynamicsCompressor();
        limiter.threshold.value = -8;
        limiter.knee.value = 8;
        limiter.ratio.value = 6;
        limiter.attack.value = 0.003;
        limiter.release.value = 0.15;
        this.master.connect(limiter);
        limiter.connect(context.destination);
        this.effects = context.createGain();
        this.effects.connect(this.master);
        this.voice = context.createGain();
        this.voice.connect(this.master);
        this.decks = Array.from({ length: 2 }, () => {
          const audio = new this.environment.Audio();
          audio.preload = "none";
          const gain = context.createGain();
          gain.gain.value = 0;
          context.createMediaElementSource(audio).connect(gain);
          gain.connect(this.master);
          audio.addEventListener("timeupdate", () => this.nearEnd(audio));
          audio.addEventListener("ended", () => this.nearEnd(audio, true));
          audio.addEventListener("error", () => {
            if (audio === this.decks[this.index]?.audio && !this.disposed)
              this.publish({
                playing: false,
                error:
                  "A música não carregou. Tente outra faixa ou ative o som novamente.",
              });
          });
          return { audio, gain, id: null };
        });
        context.addEventListener("statechange", () => {
          if (this.visible && context.state !== "running")
            this.publish({ ready: false, playing: false });
        });
      }
      const resume = this.context.resume();
      this.applyVolumes();
      // play() dentro do gesto, antes de qualquer await (Safari/iOS).
      const start = this.startMusic(this.desired);
      this.unlocking = Promise.all([resume, start]);
      await this.unlocking;
      if (!this.disposed && this.context.state === "running")
        this.publish({ ready: true, error: "" });
    } catch {
      this.publish({
        ready: false,
        playing: false,
        error: "Toque em Ativar som para liberar o áudio.",
      });
    } finally {
      this.unlocking = null;
    }
  }
  setPreferences(preferences) {
    const previous = this.preferences;
    this.preferences = preferences;
    if (!this.context) return;
    this.applyVolumes();
    if (preferences.muted) {
      this.pauseMusic();
      this.stopScope();
    } else if (this.visible && this.context.state === "running") {
      if (preferences.music === 0) this.pauseMusic();
      else if (previous.muted || previous.music === 0)
        this.startMusic(this.desired).catch(() =>
          this.publish({ ready: false, playing: false }),
        );
    }
  }
  applyVolumes() {
    if (!this.context) return;
    ramp(
      this.master.gain,
      this.preferences.muted || !this.visible ? 0 : 1,
      this.context,
    );
    ramp(this.effects.gain, this.preferences.effects, this.context);
    ramp(this.voice.gain, this.preferences.cries * 0.55, this.context);
    this.decks.forEach((deck, index) =>
      ramp(
        deck.gain.gain,
        index === this.index ? this.musicLevel() : 0,
        this.context,
      ),
    );
  }
  musicLevel() {
    return (
      this.preferences.music *
      (this.context?.currentTime < (this.duckUntil || 0) ? 0.38 : 1)
    );
  }
  setTrack(id, { restart = false } = {}) {
    if (!this.tracks.some((track) => track.id === id)) return;
    if (this.desired === id && !restart) return;
    this.desired = id;
    this.publish({ track: id });
    if (
      this.context?.state === "running" &&
      this.visible &&
      !this.preferences.muted
    )
      this.startMusic(id, restart).catch(() =>
        this.publish({
          ready: false,
          playing: false,
          error: "Toque em Ativar som para continuar.",
        }),
      );
  }
  async startMusic(id, restart = false) {
    if (
      !this.context ||
      !id ||
      this.preferences.muted ||
      !this.visible ||
      !this.preferences.music ||
      this.disposed
    )
      return;
    const track = this.tracks.find((item) => item.id === id);
    if (!track) return;
    const current = this.decks[this.index];
    if (current.id === id && !restart) {
      ++this.musicToken;
      this.decks[1 - this.index].audio.pause();
      ramp(current.gain.gain, this.musicLevel(), this.context);
      if (current.audio.paused) await current.audio.play();
      this.publish({ playing: true });
      return;
    }
    const token = ++this.musicToken,
      index = 1 - this.index,
      incoming = this.decks[index];
    if (current.id) this.offsets.set(current.id, current.audio.currentTime);
    incoming.audio.pause();
    incoming.gain.gain.cancelScheduledValues(this.context.currentTime);
    incoming.gain.gain.value = 0;
    incoming.id = id;
    incoming.audio.src = `${this.baseUrl}audio/${track.file}`;
    const offset = restart ? 0 : this.offsets.get(id) || 0;
    incoming.audio.currentTime = offset < track.duration - 2 ? offset : 0;
    try {
      await incoming.audio.play();
    } catch (error) {
      if (token === this.musicToken) throw error;
      return;
    }
    if (
      token !== this.musicToken ||
      !this.visible ||
      this.preferences.muted ||
      this.disposed
    ) {
      if (token === this.musicToken) incoming.audio.pause();
      return;
    }
    this.index = index;
    ramp(incoming.gain.gain, this.musicLevel(), this.context, 0.65);
    ramp(current.gain.gain, 0, this.context, 0.65);
    clearTimeout(this.fadeTimer);
    this.fadeTimer = setTimeout(() => {
      if (token === this.musicToken) current.audio.pause();
    }, 700);
    this.publish({ playing: true, track: id, error: "" });
  }
  nearEnd(audio, ended = false) {
    if (
      audio !== this.decks[this.index]?.audio ||
      !this.state.playing ||
      this.disposed
    )
      return;
    if (
      !ended &&
      (!Number.isFinite(audio.duration) ||
        audio.duration - audio.currentTime > 0.75)
    )
      return;
    if (this.loopLock) return;
    this.loopLock = true;
    if (this.preferences.mode === "playlist") this.onNext?.();
    else
      this.startMusic(this.desired, true).catch(() =>
        this.publish({ playing: false }),
      );
    clearTimeout(this.loopTimer);
    this.loopTimer = setTimeout(() => {
      this.loopLock = false;
    }, 1000);
  }
  pauseMusic() {
    ++this.musicToken;
    clearTimeout(this.fadeTimer);
    this.decks.forEach((deck) => deck.audio.pause());
    this.publish({ playing: false });
  }
  setVisible(visible) {
    this.visible = visible;
    this.publish({ background: !visible });
    if (!visible) {
      this.pauseMusic();
      this.stopScope();
      this.publish({ ready: false });
      this.context?.suspend().catch(() => {});
    } else if (this.context && !this.preferences.muted) this.unlock(true);
  }
  active() {
    return (
      !this.disposed &&
      this.visible &&
      !this.preferences.muted &&
      this.context?.state === "running"
    );
  }
  cue(name, { scope = "ui" } = {}) {
    if (!this.active() || !this.preferences.effects) return;
    if (["caught", "item", "badge", "evolved", "recovery"].includes(name)) {
      this.stopScope(scope);
      this.sample(`fanfares/${name}.mp3`, { scope, cry: false });
      return;
    }
    const now = this.context.currentTime;
    if (name === "ui" && now - (this.lastUi || 0) < 0.06) return;
    if (name === "ui") this.lastUi = now;
    this.collect(scope, createChipEffect(this.context, this.effects, name));
  }
  collect(scope, nodes) {
    const current = this.sources.get(scope) || new Set();
    for (const node of nodes) {
      current.add(node);
      node.addEventListener(
        "ended",
        () => {
          current.delete(node);
          if (!current.size && this.sources.get(scope) === current)
            this.sources.delete(scope);
        },
        { once: true },
      );
    }
    this.sources.set(scope, current);
  }
  async buffer(file) {
    if (this.buffers.has(file)) return this.buffers.get(file);
    const pending = this.environment
      .fetch(`${this.baseUrl}audio/${file}`)
      .then((response) => {
        if (!response.ok) throw new Error("Áudio ausente");
        return response.arrayBuffer();
      })
      .then((bytes) => this.context.decodeAudioData(bytes));
    this.buffers.set(file, pending);
    // Cache limitado; arquivos ausentes podem ser tentados novamente.
    pending.catch(() => {
      this.buffers.delete(file);
    });
    if (this.buffers.size > 48)
      this.buffers.delete(this.buffers.keys().next().value);
    return pending;
  }
  preloadCry(name) {
    const id = this.cries[name];
    if (this.context && id && this.preferences.cries && !this.preferences.muted)
      this.buffer(`cries/${id}.mp3`).catch(() => {});
  }
  preloadCapture() {
    if (this.context && this.preferences.effects && !this.preferences.muted)
      this.buffer("fanfares/caught.mp3").catch(() => {});
  }
  cry(name, { scope = "cry" } = {}) {
    const id = this.cries[name];
    if (id && this.preferences.cries)
      this.sample(`cries/${id}.mp3`, { scope, cry: true });
  }
  async sample(file, { scope, cry }) {
    if (
      !this.active() ||
      !(cry ? this.preferences.cries : this.preferences.effects)
    )
      return;
    const token = this.tokens.get(scope) || 0,
      started = this.environment.performance.now();
    this.tokens.set(scope, token);
    try {
      const buffer = await this.buffer(file);
      // Não tocar cries atrasados de uma cena que já saiu da tela.
      if (
        !this.active() ||
        (this.tokens.get(scope) || 0) !== token ||
        this.environment.performance.now() - started > 600 ||
        !(cry ? this.preferences.cries : this.preferences.effects)
      )
        return;
      if (cry) this.stopScope(scope);
      const source = this.context.createBufferSource();
      source.buffer = buffer;
      const gain = this.context.createGain();
      gain.gain.value = cry ? 1 : 0.85;
      source.connect(gain);
      gain.connect(cry ? this.voice : this.effects);
      source.onended = () => {
        source.disconnect();
        gain.disconnect();
      };
      source.releaseAudio = () => {
        ramp(gain.gain, 0, this.context, 0.015);
        source.stop(this.context.currentTime + 0.02);
      };
      source.start();
      this.collect(scope, [source]);
      // Cries e fanfares abaixam a trilha, sem alterar a preferência.
      this.duckUntil = Math.max(
        this.duckUntil || 0,
        this.context.currentTime + Math.min(buffer.duration, 8),
      );
      this.duck();
    } catch {
      /* Um cry ausente nunca impede o turno nem a captura. */
    }
  }
  duck() {
    clearTimeout(this.duckTimer);
    if (!this.active()) return;
    ramp(
      this.decks[this.index].gain.gain,
      this.preferences.music * 0.38,
      this.context,
      0.06,
    );
    this.duckTimer = setTimeout(
      () => {
        if (!this.active()) return;
        if (this.context.currentTime < this.duckUntil) this.duck();
        else
          ramp(
            this.decks[this.index].gain.gain,
            this.preferences.music,
            this.context,
            0.3,
          );
      },
      Math.max(80, ((this.duckUntil || 0) - this.context.currentTime) * 1000),
    );
  }
  stopScope(scope) {
    const scopes = scope
      ? [scope]
      : [...new Set([...this.sources.keys(), ...this.tokens.keys()])];
    for (const key of scopes) {
      this.tokens.set(key, (this.tokens.get(key) || 0) + 1);
      for (const source of this.sources.get(key) || []) {
        try {
          if (source.releaseAudio) source.releaseAudio();
          else source.stop();
        } catch {
          /* Já terminou. */
        }
      }
      this.sources.delete(key);
    }
    if (!scope) {
      clearTimeout(this.duckTimer);
      this.duckUntil = 0;
    }
  }
  dispose() {
    this.pauseMusic();
    this.stopScope();
    this.disposed = true;
    clearTimeout(this.fadeTimer);
    clearTimeout(this.loopTimer);
    clearTimeout(this.duckTimer);
    this.decks.forEach((deck) => {
      deck.audio.removeAttribute("src");
      deck.audio.load();
    });
    this.context?.close().catch(() => {});
  }
}
