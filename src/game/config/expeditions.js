// Orçamento fixo: uma exploração, três salas, uma visita a cada lugar.
export const EXPEDITION_RULES = Object.freeze({
  width: 12,
  height: 8,
  lastBadge: 7,
  entrance: { x: 0, y: 6 },
  spawn: { x: 5, y: 6 },
  cache: { x: 8, y: 2 },
  gate: { x: 5, y: 1 },
  guardian: { x: 5, y: 2 },
  supplies: { balls: 3, berries: 2 },
});

export const EXPEDITION_SITES = Object.freeze([
  {
    id: "echo-cave",
    badges: 2,
    theme: "cave",
    cacheMoney: 200,
    cacheBalls: 2,
    victoryMoney: 200,
    rewards: ["focussash", "leftovers"],
    team: [
      { name: "Sandshrew", level: 22 },
      { name: "Golbat", level: 23 },
      { name: "Graveler", level: 24 },
    ],
  },
  {
    id: "sunken-ruins",
    badges: 5,
    theme: "ruins",
    cacheMoney: 300,
    cacheBalls: 2,
    victoryMoney: 300,
    rewards: ["choicescarf", "leftovers"],
    team: [
      { name: "Sigilyph", level: 34 },
      { name: "Bronzong", level: 35 },
      { name: "Claydol", level: 36 },
    ],
  },
]);
