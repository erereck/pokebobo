import { presentationEvents } from "./presentationEvents.js";
import { Dex } from "@pkmn/sim";
import {
  publicMonConditions,
  publicFieldConditions,
} from "./publicConditions.js";

export function battleSnapshot(b) {
  const events = presentationEvents(b.log);
  const mon = (p) => ({
    id: p.name,
    name: p.species.name,
    shiny: p.set.shiny === true,
    hp: p.hp,
    maxhp: p.maxhp,
    level: p.level,
    status: p.status,
    fainted: p.fainted,
    active: p.isActive,
    item: p.item,
    types: p.getTypes(),
    boosts: { ...p.boosts },
    conditions: publicMonConditions(p),
  });
  return {
    turn: b.turn,
    ended: b.ended,
    winner: b.winner,
    player: b.p1.pokemon.map(mon),
    enemy: b.p2.pokemon.map(mon),
    active: mon(b.p1.active[0]),
    foe: mon(b.p2.active[0]),
    request: b.p1.activeRequest,
    field: publicFieldConditions(b),
    futureMoves: [b.p1, b.p2].flatMap((side) => {
      const future = side.slotConditions[0]?.futuremove;
      return future
        ? [
            {
              side: side.id === "p1" ? "player" : "enemy",
              move: Dex.moves.get(future.move).name,
              turnsRemaining: Math.max(
                1,
                future.endingTurn - b.getOverflowedTurnCount() + 1,
              ),
            },
          ]
        : [];
    }),
    log: events
      .map((event) => event.text)
      .filter(Boolean)
      .slice(-60),
    events: events.slice(-120),
  };
}
