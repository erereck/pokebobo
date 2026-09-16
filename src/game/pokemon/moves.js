import catalog from "../catalog.json" with { type: "json" };
import { MOVE_RULES } from "../config/moves.js";

export function movesFor(name, level) {
  const s = catalog[name];
  const pool = s.moves.filter((m) => m.level <= level);
  const damage = pool
    .filter((m) => m.category !== "Status")
    .sort((a, b) => score(b) - score(a));
  function score(m) {
    return (
      m.power *
        (s.types.includes(m.type) ? 1.5 : 1) *
        (m.accuracy === true ? 1 : m.accuracy / 100) *
        (m.category === "Physical" ? s.stats.atk / s.stats.spa : 1) +
      m.level * 0.1
    );
  }
  const chosen = [];
  const types = new Set();
  for (const m of damage) {
    if (!types.has(m.type)) {
      chosen.push(m.id);
      types.add(m.type);
    }
    if (chosen.length === 3) break;
  }
  const status = pool
    .filter(
      (m) =>
        m.category === "Status" && MOVE_RULES.preferredStatus.includes(m.id),
    )
    .sort((a, b) => b.level - a.level)[0];
  if (status) chosen.push(status.id);
  for (const m of damage) {
    if (chosen.length === 4) break;
    if (!chosen.includes(m.id)) chosen.push(m.id);
  }
  if (chosen.length) return chosen;
  // Quem só conhece golpes de status não recebe um Tackle inventado.
  const legal = [...pool].sort(
    (a, b) => b.level - a.level || a.id.localeCompare(b.id),
  );
  if (legal.length) return [legal[0].id];
  throw Error(`Sem golpes documentados para ${name} no nível ${level}.`);
}
