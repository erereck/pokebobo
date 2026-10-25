import assert from "node:assert/strict";
import { drafted } from "./campaign.js";
import { reducer } from "../../src/game/engine.js";
import { makeMon } from "../../src/game/pokemon.js";
import { EXPEDITION_LAYOUTS } from "../../src/game/data/expeditions.js";

export function expeditionState(id = "echo-cave") {
  const s = drafted(99);
  Object.assign(s.run, {
    position: id === "echo-cave" ? 4 : 7,
    badges: id === "echo-cave" ? 2 : 5,
    spent: 0,
    lastAmbush: 100,
    money: 0,
    moveLearningMode: "automatic",
    party: [makeMon("Garchomp", 80, "mon0")],
  });
  return reducer(s, { type: "EXPEDITION_ENTER", siteId: id });
}

// Caminho calculado só a partir do mapa. A expectativa de recompensas nos
// testes é escrita à mão, sem produzir fixtures com a regra sob teste.
export function expeditionPath(e, target) {
  const object = e.room < 2 ? { x: 8, y: 2 } : { x: 5, y: 2 };
  const queue = [{ x: e.x, y: e.y, path: [] }],
    seen = new Set();
  for (let i = 0; i < queue.length; i++) {
    const current = queue[i],
      key = `${current.x},${current.y}`;
    if (seen.has(key)) continue;
    seen.add(key);
    if (current.x === target.x && current.y === target.y) return current.path;
    for (const [dx, dy] of [
      [0, -1],
      [1, 0],
      [0, 1],
      [-1, 0],
    ]) {
      const x = current.x + dx,
        y = current.y + dy;
      if (
        EXPEDITION_LAYOUTS[e.room]?.[y]?.[x] === "." &&
        !(x === object.x && y === object.y)
      )
        queue.push({ x, y, path: [...current.path, { dx, dy }] });
    }
  }
  throw Error(`Destino inacessível: ${JSON.stringify(target)}`);
}
export function walkExpedition(s, target) {
  const e = s.run.expeditions[s.run.activeExpedition];
  for (const direction of expeditionPath(e, target)) {
    const next = reducer(s, { type: "EXPEDITION_MOVE", ...direction });
    assert.notEqual(s, next);
    s = next;
  }
  return s;
}
export function toGuardian(s, supply = "berries") {
  for (let room = 0; room < 2; room++) {
    s = walkExpedition(s, { x: 8, y: 3 });
    s = reducer(s, {
      type: "EXPEDITION_COLLECT",
      choice: room ? supply : "cache",
    });
    s = walkExpedition(s, { x: 5, y: 1 });
    s = reducer(s, { type: "EXPEDITION_ADVANCE" });
  }
  return walkExpedition(s, { x: 5, y: 3 });
}
