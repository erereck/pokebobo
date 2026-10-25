import { EXPLORATION_RULES } from "../config/exploration.js";
import { random } from "../random/random.js";
import { afterWeek } from "../career/afterWeek.js";
import { note } from "../career/journal.js";
import { revealWild } from "./revealWild.js";
import { routeLayoutId, fieldLayout } from "./fieldLayout.js";

export function terrainAt(x, y, exploration) {
  const layout = fieldLayout(exploration?.layoutId);
  if (layout) {
    const tile =
      layout[Math.max(0, Math.min(7, y))]?.[Math.max(0, Math.min(11, x))];
    return tile === "W" ? "water" : tile === "P" ? "path" : "grass";
  }
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
    layoutId: routeLayoutId(r),
    x: 1,
    y: 6,
    surfing: false,
    activeIndex: null,
    facing: "south",
    steps: 0,
    grassSteps: 0,
    cooldown: 0,
    usedAtStart: r.encounters.filter((mon) => mon.used).length,
    spots: r.encounters.map((e, i) =>
      e.habitat === "water" ? null : spots[i],
    ),
  };
}

// As áreas são contínuas, com bordas acessíveis para entrar e sair do mato.
// A seed já definiu os centros; desenhar o campo não consome sorteios.
export function isTallGrass(e, x, y) {
  const layout = fieldLayout(e.layoutId);
  if (layout) return layout[y]?.[x] === "T";
  if (terrainAt(x, y, e) !== "grass") return false;
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
  if (terrainAt(x, y, e) === "water" && !e.surfing) return false;
  const fromX = e.x,
    fromY = e.y;
  e.facing = dy < 0 ? "north" : dy > 0 ? "south" : dx < 0 ? "west" : "east";
  e.steps = (e.steps || 0) + 1;
  e.x = x;
  e.y = y;
  if (terrainAt(x, y, e) !== "water") e.surfing = false;
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
  return Boolean(lakeDirection(e));
}

export function lakeDirection(e) {
  if (!e || terrainAt(e.x, e.y, e) === "water") return false;
  const directions = [
    { dx: 0, dy: -1, direction: "north" },
    { dx: 1, dy: 0, direction: "east" },
    { dx: 0, dy: 1, direction: "south" },
    { dx: -1, dy: 0, direction: "west" },
  ];
  directions.sort(
    (a, b) =>
      Number(b.direction === e.facing) - Number(a.direction === e.facing),
  );
  return directions.find(({ dx, dy }) => {
    const x = e.x + dx,
      y = e.y + dy;
    return (
      x >= 0 &&
      y >= 0 &&
      x < EXPLORATION_RULES.width &&
      y < EXPLORATION_RULES.height &&
      terrainAt(x, y, e) === "water"
    );
  });
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
  e.facing = lakeDirection(e).direction;
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
