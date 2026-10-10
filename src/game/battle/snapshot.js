import { translateLog } from "./translateLog.js";
import { presentationEvents } from "./presentationEvents.js";
import { Dex } from "@pkmn/sim";

export function battleSnapshot(b) {
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
    log: translateLog(b.log).slice(-60),
    events: presentationEvents(b.log).slice(-120),
  };
}
