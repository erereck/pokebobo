import { PROGRESSION } from "../config/progression.js";

export const canTrain = (party) =>
  party.some((mon) => mon.level < PROGRESSION.maxLevel);

export function levelGains(party, amount) {
  return party.map((mon) => ({
    id: mon.id,
    name: mon.name,
    before: mon.level,
    after: Math.min(PROGRESSION.maxLevel, mon.level + amount),
    gain: Math.min(amount, Math.max(0, PROGRESSION.maxLevel - mon.level)),
  }));
}

export function describeLevelGains(changes) {
  if (!changes.length) return "Nenhum integrante recebe níveis.";
  if (changes.every((mon) => mon.gain === 0)) return "Equipe no nível máximo.";
  if (changes.every((mon) => mon.gain === changes[0].gain)) {
    const gain = changes[0].gain;
    return `Equipe +${gain} ${gain === 1 ? "nível" : "níveis"}.`;
  }
  return (
    levelGainLabel(changes) +
    ". " +
    changes
      .map(
        (mon) =>
          `${mon.name}: ${mon.gain ? "+" + mon.gain : "máximo"} (nv. ${mon.after})`,
      )
      .join(" · ") +
    "."
  );
}

export function levelGainLabel(changes) {
  const growing = changes.filter((mon) => mon.gain > 0);
  if (!growing.length) return "Equipe no nível máximo";
  const min = Math.min(...growing.map((mon) => mon.gain));
  const max = Math.max(...growing.map((mon) => mon.gain));
  return `+${min === max ? min : min + "–" + max} ${max === 1 ? "nível" : "níveis"} · ${growing.length}/${changes.length} integrantes`;
}
