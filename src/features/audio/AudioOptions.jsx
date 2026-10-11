import {
  Music2,
  Sparkles,
  Volume2,
  VolumeX,
  SkipBack,
  SkipForward,
  Play,
  RotateCcw,
  Check,
} from "lucide-react";
import { useAudio } from "./AudioContext.js";
import { DEFAULT_AUDIO } from "./audioPreferences.js";

export function AudioOptions() {
  const audio = useAudio(),
    { preferences: prefs, status, tracks } = audio;
  const current = tracks.find((track) => track.id === status.track);
  const ready = status.ready && !prefs.muted;
  return (
    <div className="audio-options" data-audio-silent>
      <div className="audio-now">
        <div
          className={`audio-speaker${ready && status.playing ? " is-playing" : ""}`}
          aria-hidden="true"
        >
          <Music2 size={28} />
        </div>
        <div>
          <span className="section-label">
            {prefs.mode === "auto" ? "TRILHA DA JORNADA" : "SUA PLAYLIST"}
          </span>
          <strong>{current?.title || "Opening"}</strong>
          <small>
            {prefs.mode === "auto"
              ? audio.scene.label
              : "FireRed / LeafGreen · 20 músicas"}
          </small>
        </div>
      </div>
      <div
        className="audio-transport"
        role="group"
        aria-label="Controles de áudio"
      >
        <button
          className="button secondary"
          aria-label="Música anterior"
          onClick={() => {
            audio.advance(-1);
            audio.activate();
          }}
        >
          <SkipBack size={18} />
        </button>
        <button className="button primary audio-toggle" onClick={audio.toggle}>
          <span aria-hidden="true">
            {prefs.muted ? (
              <VolumeX size={18} />
            ) : !status.ready ? (
              <Play size={18} />
            ) : (
              <Volume2 size={18} />
            )}
          </span>
          {prefs.muted || !status.ready ? "Ativar som" : "Silenciar"}
        </button>
        <button
          className="button secondary"
          aria-label="Próxima música"
          onClick={() => {
            audio.advance(1);
            audio.activate();
          }}
        >
          <SkipForward size={18} />
        </button>
      </div>
      <p className="audio-hint" role="status">
        {status.error ||
          (prefs.muted
            ? "Som desligado. Sua escolha fica guardada neste aparelho."
            : !status.ready
              ? "Toque em Ativar som ou em qualquer botão para começar."
              : status.background
                ? "Som pausado enquanto o jogo fica em segundo plano."
                : "O som pausa ao sair da aba e volta quando você retorna.")}
      </p>
      <fieldset className="audio-levels">
        <legend>Mesa de som</legend>
        {[
          ["music", "Música", Music2],
          ["effects", "Efeitos", Sparkles],
          ["cries", "Cries dos Pokémon", Volume2],
        ].map(([key, label, Icon]) => (
          <label key={key} className="audio-volume">
            <span>
              <Icon size={16} />
              {label}
            </span>
            <output htmlFor={`audio-${key}`}>
              {Math.round(prefs[key] * 100)}%
            </output>
            <input
              id={`audio-${key}`}
              type="range"
              min="0"
              max="100"
              step="1"
              value={Math.round(prefs[key] * 100)}
              aria-label={`Volume: ${label}`}
              aria-valuetext={`${Math.round(prefs[key] * 100)} por cento`}
              onChange={(event) =>
                audio.change({ [key]: Number(event.target.value) / 100 })
              }
            />
          </label>
        ))}
        <div className="audio-tests">
          <button
            className="text-button"
            disabled={!ready || !prefs.effects}
            onClick={() => audio.cue("shake")}
          >
            <Sparkles size={15} />
            Testar efeito
          </button>
          <button
            className="text-button"
            disabled={!ready || !prefs.cries}
            onClick={() => audio.cry("Pikachu")}
          >
            <Volume2 size={15} />
            Ouvir Pikachu
          </button>
        </div>
      </fieldset>
      <fieldset className="audio-mode">
        <legend>Como tocar</legend>
        <div>
          <button
            className="button secondary"
            aria-pressed={prefs.mode === "auto"}
            onClick={() => audio.change({ mode: "auto" })}
          >
            Seguir o jogo{prefs.mode === "auto" && <Check size={16} />}
          </button>
          <button
            className="button secondary"
            aria-pressed={prefs.mode === "playlist"}
            onClick={() =>
              audio.change({
                mode: "playlist",
                track: current?.id || prefs.track,
              })
            }
          >
            Playlist livre{prefs.mode === "playlist" && <Check size={16} />}
          </button>
        </div>
        <p>
          {prefs.mode === "auto"
            ? "A música acompanha cada cena. Ao voltar da captura, a trilha da rota continua de onde parou."
            : "As músicas tocam em sequência, mesmo quando a cena muda. Escolha uma faixa abaixo."}
        </p>
      </fieldset>
      <details className="audio-library" open>
        <summary>
          FireRed / LeafGreen <span>20 faixas</span>
        </summary>
        <ol className="audio-track-list">
          {tracks.map((track, index) => (
            <li key={track.id}>
              <button
                className={track.id === current?.id ? "is-current" : ""}
                aria-label={`Tocar ${track.title}`}
                aria-pressed={track.id === current?.id}
                onClick={() => audio.select(track.id)}
              >
                <span className="audio-track-number">
                  {track.id === current?.id && status.playing ? (
                    <Music2 size={16} />
                  ) : (
                    String(index + 1).padStart(2, "0")
                  )}
                </span>
                <span>
                  <strong>{track.title}</strong>
                  <small>{track.scene}</small>
                </span>
                <span className="audio-track-duration">
                  {Math.floor(Math.round(track.duration) / 60)}:
                  {String(Math.round(track.duration) % 60).padStart(2, "0")}
                </span>
              </button>
            </li>
          ))}
        </ol>
      </details>
      <div className="audio-footer">
        <button
          className="text-button"
          onClick={() => audio.change(DEFAULT_AUDIO)}
        >
          <RotateCcw size={14} />
          Restaurar volumes e modo
        </button>
        <small>Seus três slots usam a mesma preferência.</small>
      </div>
      {!audio.saved && (
        <p role="status" className="audio-storage-message">
          O navegador não conseguiu guardar as opções. O áudio continua
          funcionando nesta visita.
        </p>
      )}
      <p className="audio-credit">
        Músicas e fanfares originais de Game Freak / Nintendo / The Pokémon
        Company. Efeitos de passos e captura criados para o Pokébobo.{" "}
        <a
          href={`${import.meta.env.BASE_URL}audio/README.md`}
          target="_blank"
          rel="noreferrer"
        >
          Fontes e créditos
        </a>
        .
      </p>
    </div>
  );
}
