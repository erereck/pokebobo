import { growWithLearning } from "../pokemon/moveLearning.js";
import { levelGains, describeLevelGains } from "../selectors/levelGain.js";

function describeReserveGains(box, amount) {
  if (!box.length) return "";
  return describeLevelGains(levelGains(box, amount)).replace(/^Equipe/, "Reserva");
}

function growCollection(r, list, amount, label) {
  const before = list.map((mon) => ({ name: mon.name, level: mon.level }));
  const next = list.map((mon) => growWithLearning(r, mon, amount));
  const evolutions = next
    .map((mon, index) =>
      mon.name !== before[index].name
        ? `${before[index].name} evoluiu para ${mon.name}!`
        : "",
    )
    .filter(Boolean);
  return {
    next,
    evolutionText: evolutions.length
      ? `${label ? label + ": " : ""}${evolutions.join(" ")}`
      : "",
  };
}

export const train = (r, amount) => {
  if (!Array.isArray(r.box)) r.box = [];
  const gains = describeLevelGains(levelGains(r.party, amount));
  const reserveGains = describeReserveGains(r.box, amount);
  const partyGrowth = growCollection(r, r.party, amount, "");
  const boxGrowth = growCollection(r, r.box, amount, "Reserva");
  r.party = partyGrowth.next;
  r.box = boxGrowth.next;
  return [
    gains,
    reserveGains,
    partyGrowth.evolutionText,
    boxGrowth.evolutionText,
  ]
    .filter(Boolean)
    .join(" ");
};
