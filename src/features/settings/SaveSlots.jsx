import { Check, FolderOpen, Gamepad2, Save } from "lucide-react";

function modeLabel(mode) {
  return mode === "rush"
    ? "Correria"
    : mode === "nuzlocke"
      ? "Nuzlocke"
      : "Clássico";
}

export function SaveSlots({ activeSlot, slots, onSwitch }) {
  return (
    <section className="save-slots" aria-label="Arquivos de save">
      <div className="section-head save-slots-head">
        <div>
          <Save size={18} />
          <h3>Arquivos de save</h3>
        </div>
        <span className="mono">3 SLOTS</span>
      </div>
      <p className="muted small">
        Cada pessoa pode ter sua própria carreira. O Hall da Fama é compartilhado
        por todos os slots deste aparelho.
      </p>
      <div className="save-slot-grid">
        {slots.map((slot) => {
          const active = slot.slot === activeSlot;
          return (
            <article
              className={
                "save-slot-card" +
                (active ? " is-active" : "") +
                (slot.corrupt ? " is-corrupt" : "")
              }
              key={slot.slot}
            >
              <div className="save-slot-top">
                <span>SLOT {String(slot.slot).padStart(2, "0")}</span>
                {active && (
                  <b>
                    <Check size={13} /> EM USO
                  </b>
                )}
              </div>
              {slot.corrupt ? (
                <>
                  <strong>Save danificado</strong>
                  <small>A recuperação automática será tentada ao abrir.</small>
                </>
              ) : slot.empty ? (
                <>
                  <strong>Novo arquivo</strong>
                  <small>Uma carreira nova pode começar aqui.</small>
                </>
              ) : (
                <>
                  <strong>{slot.trainer || "Treinador"}</strong>
                  <small>
                    {slot.hasRun
                      ? `${slot.badges}/8 insígnias · semana ${slot.week} · ${modeLabel(slot.mode)}`
                      : `${slot.runs} runs · ${slot.wins} títulos · melhor ${slot.best}/8`}
                  </small>
                </>
              )}
              <button
                className="button secondary full"
                disabled={active}
                onClick={() => onSwitch(slot.slot)}
              >
                {active ? <Gamepad2 size={16} /> : <FolderOpen size={16} />}
                {active ? "Jogando neste slot" : "Abrir este slot"}
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}
