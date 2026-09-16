import { Dex } from "@pkmn/sim";

const estimatedStat = (base, level, hp = false) =>
  Math.floor(((2 * base + 31) * level) / 100) + (hp ? level + 10 : 5);

// This is the information boundary: the scorer never receives Battle, the RNG,
// the opponent's party, unrevealed moves, actual stats, ability or held item.
export function observeBattle(battle, sideId = "p2") {
  const side = battle[sideId],
    opponent = side.foe,
    target = opponent.active[0];
  const request = side.activeRequest;
  if (!request || request.wait) return null;
  const knownMoves = [];
  const revealedImmunities = new Set();
  let lastOwnSwitchTurn = -99,
    turn = 0;
  for (const line of battle.log) {
    const p = line.split("|");
    if (p[1] === "turn") turn = Number(p[2]);
    if (p[1] === "switch" && p[2]?.startsWith(side.id))
      lastOwnSwitchTurn = turn;
    if (p[1] === "move" && p[2] === `${opponent.id}a: ${target.name}`)
      knownMoves.push(Dex.moves.get(p[3]).id);
    if (p[1] === "-ability" && p[2] === `${opponent.id}a: ${target.name}`) {
      const immune = {
        Levitate: "Ground",
        "Volt Absorb": "Electric",
        "Lightning Rod": "Electric",
        "Motor Drive": "Electric",
        "Water Absorb": "Water",
        "Storm Drain": "Water",
        "Dry Skin": "Water",
        "Flash Fire": "Fire",
        "Sap Sipper": "Grass",
      }[p[3]];
      if (immune) revealedImmunities.add(immune);
    }
  }
  const species = Dex.species.get((target.illusion || target).species.name);
  const stats = Object.fromEntries(
    Object.entries(species.baseStats).map(([key, value]) => [
      key,
      estimatedStat(value, target.level, key === "hp"),
    ]),
  );
  const own = side.pokemon.map((p, index) => ({
    index,
    name: p.species.name,
    level: p.level,
    types: [...p.getTypes()],
    hp: p.hp,
    maxhp: p.maxhp,
    stats: { ...p.storedStats },
    boosts: { ...p.boosts },
    status: p.status,
    active: p.isActive,
    fainted: p.fainted,
    item: p.item,
    ability: p.ability,
    moves:
      p.isActive && request.active?.[0]
        ? request.active[0].moves.map((m, i) => ({ ...m, index: i }))
        : p.moveSlots.map((m, i) => ({ ...m, index: i })),
  }));
  return {
    own,
    active: own.find((p) => p.active),
    forced: Boolean(request.forceSwitch),
    trapped: Boolean(request.active?.[0]?.trapped),
    turn: battle.turn,
    justSwitched: battle.turn - lastOwnSwitchTurn <= 1,
    target: {
      name: species.name,
      level: target.level,
      types: [...(target.illusion ? species.types : target.getTypes())],
      hp: Math.max(1, Math.round((stats.hp * target.hp) / target.maxhp)),
      maxhp: stats.hp,
      stats,
      boosts: { ...target.boosts },
      status: target.status,
      seeded: Boolean(target.volatiles.leechseed),
      moves: [...new Set(knownMoves)],
      immunities: [...revealedImmunities],
    },
  };
}
