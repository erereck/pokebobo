import { moveGuide } from "../battle/moveGuide.js";

export function MoveSummary({ id, explain = false }) {
  const info = moveGuide(id);
  if (!info) return null;
  return (
    <span className="move-summary">
      <span>
        {info.category} · Poder {info.power} ·{" "}
        {info.accuracy === "Sem teste"
          ? "Sem teste de precisão"
          : `${info.accuracy} precisão`}
        {info.priority !== "0" ? ` · Prioridade ${info.priority}` : ""}
      </span>
      {explain && <span>{info.notes.join(" ")}</span>}
    </span>
  );
}
