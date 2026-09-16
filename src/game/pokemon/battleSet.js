import catalog from "../catalog.json" with { type: "json" };

export function battleSet(mon) {
  const s = catalog[mon.name];
  return {
    name: mon.id,
    species: mon.name,
    ability: s.ability,
    moves: mon.moves,
    level: mon.level,
    item: mon.item || "",
    nature: "Hardy",
    evs: {
      hp: 0,
      atk: 0,
      def: 0,
      spa: 0,
      spd: 0,
      spe: 0,
    },
    ivs: {
      hp: 20,
      atk: 20,
      def: 20,
      spa: 20,
      spd: 20,
      spe: 20,
    },
  };
}
