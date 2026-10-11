import { useEffect, useRef, useState } from "react";
import { Upload, FileJson, Download } from "lucide-react";
import { Modal } from "../../components/ui/Modal.jsx";
import {
  MAX_BACKUP_BYTES,
  parseSaveBackup,
} from "../../game/persistence/importSave.js";

const PHASES = {
  origin: "Escolha da origem",
  starter: "Escolha do inicial",
  draft: "Montagem da região",
  ready: "Região pronta",
  career: "Jornada",
  battle: "Batalha",
  result: "Resultado da batalha",
  exploration: "Exploração",
  encounter: "Encontro selvagem",
  capture: "Captura em andamento",
  event: "Acontecimento",
  ended: "Jornada encerrada",
  "move-choice": "Escolha de golpe",
  "evolution-choice": "Escolha de evolução",
};
export function ImportSaveDialog({
  slots,
  activeSlot,
  onImport,
  onExportSlot,
  onClose,
}) {
  const [slot, setSlot] = useState(
    () => slots.find((candidate) => candidate.empty)?.slot || activeSlot,
  );
  const [incoming, setIncoming] = useState(null),
    [error, setError] = useState(""),
    [reading, setReading] = useState(false);
  const token = useRef(0);
  useEffect(
    () => () => {
      token.current++;
    },
    [],
  );
  const read = async (event) => {
    const file = event.target.files?.[0],
      current = ++token.current;
    setIncoming(null);
    setError("");
    if (!file) return;
    setReading(true);
    try {
      if (file.size > MAX_BACKUP_BYTES)
        throw Error("Escolha um backup JSON de até 8 MB.");
      const text = await file.text();
      if (current !== token.current) return;
      setIncoming({ state: parseSaveBackup(text), name: file.name });
    } catch (err) {
      if (current === token.current)
        setError(err.message || "Não foi possível abrir este arquivo.");
    } finally {
      if (current === token.current) setReading(false);
    }
  };
  const destination = slots.find((candidate) => candidate.slot === slot);
  const restore = () => {
    if (!incoming) return;
    try {
      if (onImport(incoming.state, slot) !== false) onClose();
    } catch (err) {
      setError(err.message);
    }
  };
  return (
    <Modal
      title="Restaurar backup"
      onClose={onClose}
      className="import-save-dialog"
    >
      <p>
        Abra o arquivo JSON exportado em Opções. Confira a jornada e escolha
        onde continuar.
      </p>
      <label className="backup-file-label">
        <FileJson size={18} />
        <span>Arquivo de backup</span>
        <input
          type="file"
          accept=".json,application/json"
          onChange={read}
          disabled={reading}
        />
      </label>
      {reading && <p role="status">Conferindo o arquivo…</p>}
      {error && (
        <p className="backup-error" role="alert">
          {error}
        </p>
      )}
      {incoming && (
        <section className="backup-preview" aria-label="Prévia do backup">
          <span className="section-label">{incoming.name}</span>
          <h3>{incoming.state.run?.name || "Arquivo sem jornada ativa"}</h3>
          <p>
            {incoming.state.run
              ? `${PHASES[incoming.state.run.phase]} · ${incoming.state.run.badges}/8 insígnias · semana ${incoming.state.run.week}`
              : `${incoming.state.meta.runs} runs · ${incoming.state.meta.wins} títulos`}
          </p>
          <p>
            {incoming.state.run?.party
              .map((mon) => `${mon.name} Nv. ${mon.level}`)
              .join(" · ") || "Os recordes deste arquivo serão restaurados."}
          </p>
        </section>
      )}
      <fieldset className="backup-destination">
        <legend>Restaurar em qual slot?</legend>
        <div>
          {slots.map((candidate) => (
            <button
              key={candidate.slot}
              onClick={() => setSlot(candidate.slot)}
              aria-pressed={candidate.slot === slot}
            >
              <strong>Slot {candidate.slot}</strong>
              <span>
                {candidate.empty
                  ? "Vazio"
                  : candidate.corrupt
                    ? "Danificado"
                    : candidate.trainer || "Com recordes"}
              </span>
            </button>
          ))}
        </div>
      </fieldset>
      {!destination?.empty && (
        <div className="backup-replacement">
          <p>
            O conteúdo do Slot {slot} será substituído. Os outros slots
            continuam intactos.
          </p>
          <button
            className="button secondary full"
            onClick={() => onExportSlot(slot)}
          >
            <Download size={16} />
            Exportar Slot {slot} antes de substituir
          </button>
        </div>
      )}
      <button
        className="button primary full"
        disabled={!incoming || reading}
        onClick={restore}
      >
        <Upload size={18} />
        {destination?.empty
          ? `Restaurar no Slot ${slot}`
          : `Substituir Slot ${slot} pelo backup`}
      </button>
    </Modal>
  );
}
