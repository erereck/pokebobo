import {
  Info,
  Settings,
  Trophy,
  BookOpen,
  Maximize,
  Minimize,
} from "lucide-react";
import { useFullscreen } from "../../app/hooks/useFullscreen.js";
import { Brand } from "../brand/Brand.jsx";
import { VERSION } from "../../app/version.js";
import { AudioButton } from "../../features/audio/AudioButton.jsx";
export function AppHeader({ setModal }) {
  const fullscreen = useFullscreen();
  const FullscreenIcon = fullscreen.active ? Minimize : Maximize;
  return (
    <header className="dex-header has-audio-tools">
      <div className="dex-sensors" aria-hidden="true">
        <div className="dex-lens">
          <i />
        </div>
        <div className="sensor-lights">
          <i />
          <i />
          <i />
        </div>
      </div>
      <div className="dex-brand" aria-label="Pokébobo">
        <Brand />
        <span>
          POKÉDEX DE CAMPO <b>v{VERSION}</b>
        </span>
      </div>
      <div className="dex-header-tools">
        <AudioButton />
        <button
          className="hardware-button"
          aria-label="Sua Pokédex"
          onClick={() => setModal("pokedex")}
        >
          <BookOpen size={20} />
          <span>Pokédex</span>
        </button>
        <button
          className="hardware-button fullscreen-button"
          aria-label={
            fullscreen.active ? "Sair da tela cheia" : "Entrar em tela cheia"
          }
          aria-pressed={fullscreen.active}
          disabled={!fullscreen.supported}
          title={
            !fullscreen.supported
              ? "Tela cheia indisponível neste navegador"
              : fullscreen.active
                ? "Sair da tela cheia (Esc)"
                : "Entrar em tela cheia"
          }
          onClick={fullscreen.toggle}
        >
          <FullscreenIcon size={20} />
          <span>Tela cheia</span>
        </button>
        <button
          className="hardware-button"
          aria-label="Hall da Fama"
          onClick={() => setModal("hall")}
        >
          <Trophy size={20} />
          <span>Hall</span>
        </button>
        <button
          className="hardware-button"
          aria-label="Como jogar e créditos"
          onClick={() => setModal("help")}
        >
          <Info size={20} />
          <span>Ajuda</span>
        </button>
        <button
          className="hardware-button"
          aria-label="Opções e progresso"
          onClick={() => setModal("settings")}
        >
          <Settings size={20} />
          <span>Opções</span>
        </button>
      </div>
      {fullscreen.error && (
        <span className="fullscreen-message" role="status">
          {fullscreen.error}
        </span>
      )}
    </header>
  );
}
