import { grow } from "../pokemon/evolution.js";
import { levelGains, describeLevelGains } from "../selectors/levelGain.js";

export const train = (r, amount) => {
  const gains = describeLevelGains(levelGains(r.party, amount));
  const before = r.party.map((m) => m.name);
  r.party = r.party.map((m) => grow(m, amount));
  const evolutions = r.party.filter((m, i) => m.name !== before[i]);
  const evolutionText = evolutions
    .map((m) => `${before[r.party.indexOf(m)]} evoluiu para ${m.name}!`)
    .join(" ");
  return [gains, evolutionText].filter(Boolean).join(" ");
};
