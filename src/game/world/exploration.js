import { EXPLORATION_RULES } from "../config/exploration.js";
import { random } from "../random/random.js";
import { afterWeek } from "../career/afterWeek.js";
import { note } from "../career/journal.js";
import { revealWild } from "./revealWild.js";

export function terrainAt(x, y) {
  if (x >= 9 && y >= 1 && y <= 4) return "water";
  if (y === 6 || x === 1) return "path";
  return "grass";
}

export function createExploration(r) {
  const spots = [];
  for (let i = 0; i < r.encounters.length; i++) {
    // Faixas separadas garantem matinhos distintos e acessíveis.
    spots.push({
      x: 2 + i * 2 + Math.floor(random(r) * 2),
      y: 1 + Math.floor(random(r) * 5),
    });
  }
  r.exploration = {
    x: 1,
    y: 6,
    surfing: false,
    activeIndex: null,
    facing: "south",
    steps: 0,
    grassSteps: 0,
    cooldown: 0,
    spots: r.encounters.map((e, i) =>
      e.habitat === "water" ? null : spots[i],
    ),
  };
}

// As áreas são contínuas, com bordas acessíveis para entrar e sair do mato.
// A seed já definiu os centros; desenhar o campo não consome sorteios.
export function isTallGrass(e, x, y) {
  if (terrainAt(x, y) !== "grass") return false;
  const offset = (e.spots[0]?.y ?? 1) % 2;
  return (
    (x >= 2 && x <= 4 && y >= 1 + offset && y <= 3 + offset) ||
    (x >= 5 && x <= 7 && y >= 2 && y <= 4) ||
    (x >= 3 && x <= 6 && y === 5)
  );
}

export function completeRouteStep(r, id) {
  const e = r.exploration;
  if (!e?.walk || e.walk.id !== id) return false;
  const index = e.walk.encounterIndex;
  e.walk = null;
  if (e.steps >= EXPLORATION_RULES.maxRouteSteps) {
    finishExploration(r);
    return true;
  }
  if (index != null) {
    revealWild(r, index);
    e.activeIndex = index;
    r.phase = "encounter";
  }
  return true;
}

export function finishExploration(r) {
  r.exploration = null;
  r.phase = "career";
  afterWeek(r);
}

export function finishWildEncounter(r) {
  if (r.exploration) {
    if (r.exploration.steps >= EXPLORATION_RULES.maxRouteSteps) {
      finishExploration(r);
      return;
    }
    r.exploration.activeIndex = null;
    r.exploration.grassSteps = 0;
    r.exploration.cooldown = EXPLORATION_RULES.encounterCooldown;
    r.phase = "exploration";
  } else {
    r.phase = "career";
    afterWeek(r);
  }
}

export function moveExplorer(r, dx, dy, animate = false) {
  const e = r.exploration;
  if (
    !e ||
    e.walk ||
    !Number.isInteger(dx) ||
    !Number.isInteger(dy) ||
    Math.abs(dx) + Math.abs(dy) !== 1
  )
    return false;
  const x = e.x + dx,
    y = e.y + dy;
  if (
    x < 0 ||
    y < 0 ||
    x >= EXPLORATION_RULES.width ||
    y >= EXPLORATION_RULES.height
  )
    return false;
  if (terrainAt(x, y) === "water" && !e.surfing) return false;
  const fromX = e.x,
    fromY = e.y;
  e.facing = dy < 0 ? "north" : dy > 0 ? "south" : dx < 0 ? "west" : "east";
  e.steps = (e.steps || 0) + 1;
  e.x = x;
  e.y = y;
  if (terrainAt(x, y) !== "water") e.surfing = false;
  const candidates = r.encounters.flatMap((mon, i) =>
    !mon.used && mon.habitat !== "water" ? [i] : [],
  );
  let index = null;
  if (e.steps >= EXPLORATION_RULES.maxRouteSteps) index = null;
  else if (e.cooldown > 0) e.cooldown--;
  else if (isTallGrass(e, x, y) && candidates.length && r.balls > 0) {
    e.grassSteps = (e.grassSteps || 0) + 1;
    if (
      random(r) < EXPLORATION_RULES.grassEncounterChance ||
      e.grassSteps >= EXPLORATION_RULES.maxGrassSteps
    ) {
      index = candidates[Math.floor(random(r) * candidates.length)];
      e.grassSteps = 0;
    }
  }
  e.walk = { id: e.steps, fromX, fromY, encounterIndex: index };
  if (!animate) completeRouteStep(r, e.steps);
  return true;
}

export function atLake(e) {
  return e && ((e.x === 8 && e.y >= 1 && e.y <= 4) || (e.y === 5 && e.x >= 9));
}

export function lakeEncounter(r, method) {
  const e = r.exploration;
  if (!atLake(e) || e.walk || !r.balls || !["fish", "surf"].includes(method))
    return false;
  if (method === "fish" && r.badges < EXPLORATION_RULES.fishingBadges)
    return false;
  if (method === "surf" && r.badges < EXPLORATION_RULES.surfBadges)
    return false;
  const index = r.encounters.findIndex(
    (mon) => mon.habitat === "water" && !mon.used,
  );
  if (index < 0) return false;
  const wild = r.encounters[index];
  wild.name = method === "surf" ? wild.surfName : wild.fishName;
  wild.method = method;
  revealWild(r, index);
  e.activeIndex = index;
  e.surfing = method === "surf";
  r.phase = "encounter";
  note(
    r,
    method === "surf"
      ? "Você entrou no lago usando Surf. Algo se moveu na água!"
      : "A boia afundou. Um Pokémon mordeu a isca!",
  );
  return true;
}
