import { Info, Settings } from "lucide-react";
import { Brand } from "../brand/Brand.jsx";
import { VERSION } from "../../app/version.js";
export function AppHeader({ setModal }) {
  return (
    <header className="dex-header">
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
      <div className="dex-brand">
        <Brand />
        <span>
          POKÉDEX DE CAMPO <b>v{VERSION}</b>
        </span>
      </div>
      <div className="dex-header-tools">
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
    </header>
  );
}
