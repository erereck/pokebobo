import { EXPLORATION_RULES } from "../config/exploration.js";
import { random } from "../random/random.js";
import { afterWeek } from "../career/afterWeek.js";
import { note } from "../career/journal.js";

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
    spots: r.encounters.map((e, i) =>
      e.habitat === "water" ? null : spots[i],
    ),
  };
}

export function finishExploration(r) {
  r.exploration = null;
  r.phase = "career";
  afterWeek(r);
}

export function finishWildEncounter(r) {
  if (r.exploration) {
    r.exploration.activeIndex = null;
    r.phase = "exploration";
  } else {
    r.phase = "career";
    afterWeek(r);
  }
}

export function moveExplorer(r, dx, dy) {
  const e = r.exploration;
  if (
    !e ||
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
  e.x = x;
  e.y = y;
  if (terrainAt(x, y) !== "water") e.surfing = false;
  const index = e.spots.findIndex(
    (spot, i) => spot?.x === x && spot?.y === y && !r.encounters[i].used,
  );
  if (index >= 0) {
    e.activeIndex = index;
    r.phase = "encounter";
  }
  return true;
}

export function atLake(e) {
  return e && ((e.x === 8 && e.y >= 1 && e.y <= 4) || (e.y === 5 && e.x >= 9));
}

export function lakeEncounter(r, method) {
  const e = r.exploration;
  if (!atLake(e)) return false;
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
