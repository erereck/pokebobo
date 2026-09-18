import { translateLog } from "./translateLog.js";
import { presentationEvents } from "./presentationEvents.js";

export function battleSnapshot(b) {
  const mon = (p) => ({
    id: p.name,
    name: p.species.name,
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
    log: translateLog(b.log).slice(-60),
    events: presentationEvents(b.log).slice(-120),
  };
}
