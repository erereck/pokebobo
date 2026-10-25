import { EXPEDITION_SITES, EXPEDITION_RULES } from "../config/expeditions.js";
import { expeditionFloor } from "../expeditions/expeditions.js";

const integer = (n, min, max = Number.MAX_SAFE_INTEGER) =>
  Number.isSafeInteger(n) && n >= min && n <= max;
export function checkExpeditions(r) {
  const records = r.expeditions;
  if (r.activeExpedition != null && typeof r.activeExpedition !== "string")
    return false;
  if (
    records !== undefined &&
    (!records || typeof records !== "object" || Array.isArray(records))
  )
    return false;
  for (const [id, e] of Object.entries(records || {})) {
    const site = EXPEDITION_SITES.find((candidate) => candidate.id === id);
    if (
      !site ||
      site.badges > r.badges ||
      !e ||
      !["active", "won", "cleared", "escaped", "defeated"].includes(e.status) ||
      !integer(e.room, 0, 2) ||
      !integer(e.x, 0, EXPEDITION_RULES.width - 1) ||
      !integer(e.y, 0, EXPEDITION_RULES.height - 1) ||
      !expeditionFloor(e.room, e.x, e.y) ||
      !["north", "south", "east", "west"].includes(e.facing) ||
      !integer(e.steps, 0) ||
      !Array.isArray(e.collected) ||
      e.collected.length < Math.min(e.room, 2) ||
      e.collected.some((room, i) => room !== i || room > Math.min(e.room, 1)) ||
      ![null, "balls", "berries"].includes(e.supply) ||
      e.collected.includes(1) !== Boolean(e.supply)
    )
      return false;
    const obstacle =
      e.room < 2 ? EXPEDITION_RULES.cache : EXPEDITION_RULES.guardian;
    if (e.x === obstacle.x && e.y === obstacle.y) return false;
    if (
      ![null, ...site.rewards].includes(e.reward) ||
      (e.status === "cleared") !== Boolean(e.reward)
    )
      return false;
    if (
      ["won", "cleared", "defeated"].includes(e.status) &&
      (e.room !== 2 || e.collected.length !== 2)
    )
      return false;
    if (
      e.walk &&
      (e.status !== "active" ||
        !integer(e.walk.id, 1) ||
        e.walk.id !== e.steps ||
        !integer(e.walk.fromX, 0, EXPEDITION_RULES.width - 1) ||
        !integer(e.walk.fromY, 0, EXPEDITION_RULES.height - 1) ||
        !expeditionFloor(e.room, e.walk.fromX, e.walk.fromY) ||
        Math.abs(e.x - e.walk.fromX) + Math.abs(e.y - e.walk.fromY) !== 1)
    )
      return false;
    if (["active", "won"].includes(e.status) && r.activeExpedition !== id)
      return false;
  }
  const e = records?.[r.activeExpedition];
  if (
    r.activeExpedition &&
    (!e || !["active", "won", "cleared"].includes(e.status))
  )
    return false;
  if (r.phase === "expedition" && !e) return false;
  if (
    r.activeExpedition &&
    ![
      "expedition",
      "battle",
      "result",
      "move-choice",
      "evolution-choice",
      "ended",
    ].includes(r.phase)
  )
    return false;
  if (
    r.activeExpedition &&
    ["battle", "result"].includes(r.phase) &&
    r.battle?.kind !== "expedition"
  )
    return false;
  if (
    ["battle", "result"].includes(r.phase) &&
    r.battle?.kind === "expedition" &&
    (!e ||
      e.status !== "active" ||
      e.room !== 2 ||
      r.battle.expeditionId !== r.activeExpedition)
  )
    return false;
  return true;
}
