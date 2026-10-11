import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import catalog from "../src/game/catalog.json" with { type: "json" };
import cries from "../src/features/audio/cryIndex.json" with { type: "json" };
import tracks from "../src/features/audio/tracks.json" with { type: "json" };
import {
  AUDIO_KEY,
  DEFAULT_AUDIO,
  normalizeAudioPreferences,
  readAudioPreferences,
  writeAudioPreferences,
} from "../src/features/audio/audioPreferences.js";
import { audioScene, nextTrack } from "../src/features/audio/audioScene.js";
import {
  captureCues,
  crossedCues,
  battleAudioCue,
} from "../src/features/audio/audioCues.js";
import { captureTimeline } from "../src/features/encounters/captureTimeline.js";
import { AudioEngine } from "../src/features/audio/AudioEngine.js";
import { drafted } from "./helpers/campaign.js";

test("áudio: preferências inválidas, volume zero, mute e storage indisponível", () => {
  assert.deepEqual(normalizeAudioPreferences(null, tracks), DEFAULT_AUDIO);
  assert.equal(
    normalizeAudioPreferences(
      { effects: 0, cries: -10, music: 99, mode: "other", muted: "false" },
      tracks,
    ).music,
    1,
  );
  assert.deepEqual(
    normalizeAudioPreferences({ music: NaN, effects: 0, cries: -10 }, tracks),
    { ...DEFAULT_AUDIO, effects: 0, cries: 0 },
  );
  const map = new Map(),
    storage = {
      getItem: (key) => map.get(key),
      setItem: (key, value) => map.set(key, value),
    };
  const settings = {
    ...DEFAULT_AUDIO,
    muted: true,
    mode: "playlist",
    track: "surf",
    music: 0,
  };
  assert.equal(writeAudioPreferences(storage, settings), true);
  assert.deepEqual(readAudioPreferences(storage, tracks), settings);
  map.set(AUDIO_KEY, "{broken");
  assert.deepEqual(readAudioPreferences(storage, tracks), DEFAULT_AUDIO);
  const unavailable = {
    getItem() {
      throw Error();
    },
    setItem() {
      throw Error();
    },
  };
  assert.deepEqual(readAudioPreferences(unavailable, tracks), DEFAULT_AUDIO);
  assert.equal(writeAudioPreferences(unavailable, settings), false);
});

test("áudio: cenas e playlist não consomem RNG nem alteram a campanha", () => {
  const { run } = drafted(1234),
    original = structuredClone(run);
  assert.equal(audioScene(null).track, "opening");
  assert.equal(audioScene({ ...run, phase: "draft" }).track, "welcome");
  assert.equal(audioScene({ ...run, phase: "career" }, "team").track, "center");
  assert.equal(
    audioScene({ ...run, phase: "exploration", exploration: { surfing: true } })
      .track,
    "surf",
  );
  assert.equal(
    audioScene({ ...run, phase: "battle", battle: { kind: "gym" } }, "bag")
      .track,
    "gym",
  );
  assert.equal(
    audioScene({
      ...run,
      phase: "battle",
      leagueIndex: 4,
      league: Array(5),
      battle: { kind: "league" },
    }).track,
    "champion",
  );
  assert.equal(
    audioScene({
      ...run,
      phase: "result",
      battle: { kind: "gym" },
      outcome: { winner: "Você", player: [] },
    }).track,
    "victory",
  );
  assert.equal(
    audioScene({ ...run, phase: "ended", won: false }).track,
    "ending",
  );
  assert.equal(audioScene(run, "journey", "hall").track, "hall");
  assert.equal(
    audioScene({
      ...run,
      phase: "encounter",
      encounters: [{ name: "Mew", legendary: true }],
    }).track,
    "legendary",
  );
  assert.equal(nextTrack(tracks, tracks.at(-1).id), tracks[0].id);
  assert.equal(nextTrack(tracks, tracks[0].id, -1), tracks.at(-1).id);
  assert.deepEqual(run, original);
});

test("áudio: captura sincroniza impacto, chão, shakes reais, fuga e resultado; pular não despeja cues", () => {
  for (const shakes of [0, 1, 2, 3]) {
    const timeline = captureTimeline({ shakes, success: shakes === 3 }, 40),
      cues = captureCues(timeline.frames);
    assert.equal(cues.find((cue) => cue.sound === "throw").tick, 20);
    assert.equal(
      timeline.frames[cues.find((cue) => cue.sound === "open").tick].stage,
      "open",
    );
    assert.equal(cues.filter((cue) => cue.sound === "shake").length, shakes);
    assert.equal(cues.filter((cue) => cue.sound === "bounce").length, 4);
    assert.equal(cues.at(-1).sound, shakes === 3 ? "caught" : "breakout");
    const skipped = crossedCues(cues, -1, timeline.frames.length, true);
    assert.deepEqual(skipped, [cues.at(-1)]);
    assert.equal(crossedCues(cues, 20, 20).length, 0);
  }
  assert.deepEqual(battleAudioCue({ type: "switch", name: "Pidgey" }), {
    sound: "send",
    cry: "Pidgey",
  });
  assert.equal(battleAudioCue({ type: "futurehit" }).sound, "psychicHit");
  assert.equal(battleAudioCue({ type: "message" }).sound, undefined);
});

test("áudio: todos os Pokémon têm cry local e as músicas/fanfares correspondem aos hashes", async () => {
  const manifest = JSON.parse(
    await readFile("public/audio/manifest.json", "utf8"),
  );
  for (const name of Object.keys(catalog))
    assert.ok(
      manifest.cries.some((cry) => cry.id === cries[name]),
      name,
    );
  const files = [...manifest.tracks, ...manifest.fanfares, ...manifest.cries];
  for (const asset of files) {
    const bytes = await readFile(`public/audio/${asset.file}`);
    assert.equal(bytes.length, asset.bytes, asset.file);
    assert.equal(
      createHash("sha256").update(bytes).digest("hex"),
      asset.sha256,
      asset.file,
    );
  }
  assert.equal(tracks.length, 20);
  assert.equal(new Set(tracks.map((track) => track.id)).size, 20);
  assert.deepEqual(
    tracks,
    manifest.tracks.map(({ id, title, scene, file, duration }) => ({
      id,
      title,
      scene,
      file,
      duration,
    })),
  );
});

class Parameter {
  constructor() {
    this.value = 1;
  }
  cancelScheduledValues() {}
  setValueAtTime(value) {
    this.value = value;
  }
  linearRampToValueAtTime(value) {
    this.value = value;
  }
}
class Node extends EventTarget {
  constructor() {
    super();
    this.gain = new Parameter();
  }
  connect() {}
  disconnect() {}
  start() {
    this.started = true;
  }
  stop() {
    this.stopped = true;
  }
}
class Media extends EventTarget {
  constructor() {
    super();
    this.paused = true;
    this.currentTime = 0;
    this.duration = 60;
  }
  async play() {
    this.paused = false;
  }
  pause() {
    this.paused = true;
  }
  removeAttribute() {}
  load() {}
}
class Context extends EventTarget {
  constructor() {
    super();
    this.state = "suspended";
    this.currentTime = 0;
    this.destination = {};
  }
  async resume() {
    this.state = "running";
  }
  async suspend() {
    this.state = "suspended";
  }
  async close() {
    this.state = "closed";
  }
  createGain() {
    return new Node();
  }
  createMediaElementSource() {
    return new Node();
  }
  createBufferSource() {
    const node = new Node();
    this.lastSource = node;
    return node;
  }
  createDynamicsCompressor() {
    const node = new Node();
    for (const key of ["threshold", "knee", "ratio", "attack", "release"])
      node[key] = new Parameter();
    return node;
  }
  async decodeAudioData() {
    return { duration: 1 };
  }
}
function engine(
  preferences = DEFAULT_AUDIO,
  fetch = async () => ({
    ok: true,
    arrayBuffer: async () => new ArrayBuffer(1),
  }),
) {
  return new AudioEngine({
    baseUrl: "/pokebobo/",
    preferences,
    tracks,
    cries,
    environment: {
      Audio: Media,
      AudioContext: Context,
      fetch,
      performance: { now: () => 0 },
    },
  });
}
test("áudio: sem downloads antes do gesto/mute, troca de trilha mantém posição e pausa ao ocultar", async () => {
  let downloads = 0;
  const player = engine(DEFAULT_AUDIO, async () => {
    downloads++;
    return { ok: true, arrayBuffer: async () => new ArrayBuffer(1) };
  });
  player.setTrack("pallet");
  assert.equal(player.context, undefined);
  assert.equal(downloads, 0);
  await player.unlock();
  assert.equal(player.state.ready, true);
  assert.equal(player.state.playing, true);
  player.decks[player.index].audio.currentTime = 12;
  await player.startMusic("wild");
  await player.startMusic("pallet");
  assert.equal(player.decks[player.index].audio.currentTime, 12);
  player.setVisible(false);
  assert.equal(player.state.playing, false);
  assert.ok(player.decks.every((deck) => deck.audio.paused));
  player.setVisible(true);
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(player.state.playing, true);
  player.setPreferences({ ...DEFAULT_AUDIO, muted: true });
  player.cry("Pikachu");
  await player.unlock();
  assert.equal(downloads, 0);
  assert.equal(player.state.playing, false);
  player.dispose();
  assert.equal(player.context.state, "closed");
});
test("áudio: cry atrasado é cancelado ao sair da cena ou silenciar; rede falhando não trava gameplay", async () => {
  let deliver;
  const player = engine(
    DEFAULT_AUDIO,
    () =>
      new Promise((resolve) => {
        deliver = resolve;
      }),
  );
  player.setTrack("pallet");
  await player.unlock();
  const sample = player.sample("cries/pikachu.mp3", {
    scope: "capture",
    cry: true,
  });
  player.stopScope("capture");
  deliver({ ok: true, arrayBuffer: async () => new ArrayBuffer(1) });
  await sample;
  assert.equal(player.context.lastSource, undefined);
  player.buffers.clear();
  const sample2 = player.sample("cries/pikachu.mp3", {
    scope: "capture",
    cry: true,
  });
  player.setPreferences({ ...DEFAULT_AUDIO, muted: true });
  deliver({ ok: true, arrayBuffer: async () => new ArrayBuffer(1) });
  await sample2;
  assert.equal(player.context.lastSource, undefined);
  player.dispose();
  const broken = engine(DEFAULT_AUDIO, async () => ({ ok: false }));
  await broken.unlock();
  await broken.sample("cries/mew.mp3", { scope: "capture", cry: true });
  assert.equal(broken.buffers.size, 0);
  broken.dispose();
});

test("áudio: troca rápida descarta música velha; playlist avança uma vez e falha de autoplay tem recuperação", async () => {
  const player = engine();
  player.setTrack("pallet");
  await player.unlock();
  const old = player.decks[player.index],
    incoming = player.decks[1 - player.index];
  let finish;
  incoming.audio.play = () => {
    incoming.audio.paused = false;
    return new Promise((resolve) => {
      finish = resolve;
    });
  };
  const pending = player.startMusic("wild");
  await player.startMusic("pallet");
  finish();
  await pending;
  assert.equal(player.decks[player.index], old);
  assert.equal(old.id, "pallet");
  assert.equal(incoming.audio.paused, true);
  assert.equal(old.gain.gain.value, DEFAULT_AUDIO.music);
  let advances = 0;
  player.onNext = () => {
    advances++;
  };
  player.preferences = { ...DEFAULT_AUDIO, mode: "playlist" };
  old.audio.currentTime = 59.5;
  player.nearEnd(old.audio);
  player.nearEnd(old.audio, true);
  assert.equal(advances, 1);
  player.dispose();
  class BlockedMedia extends Media {
    async play() {
      throw new Error("NotAllowedError");
    }
  }
  const blocked = engine();
  blocked.environment.Audio = BlockedMedia;
  blocked.setTrack("opening");
  await Promise.all([blocked.unlock(), blocked.unlock(true)]);
  assert.equal(blocked.state.ready, false);
  assert.match(blocked.state.error, /Ativar som/);
  blocked.decks.forEach((deck) => {
    deck.audio.play = Media.prototype.play;
  });
  await blocked.unlock(true);
  assert.equal(blocked.state.ready, true);
  assert.equal(blocked.state.playing, true);
  blocked.dispose();
});
