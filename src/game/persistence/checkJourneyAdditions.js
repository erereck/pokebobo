import catalog from "../catalog.json" with { type: "json" };
import { HELD_ITEMS } from "../config/equipment.js";
import { RIVALS } from "../data/rivals.js";
import { RIVAL_STAGES } from "../config/rival.js";
import { nicknameOf } from "../heroes/heroes.js";

const object = (value) =>
  value && typeof value === "object" && !Array.isArray(value);
const counter = (value, max = 100000) =>
  Number.isSafeInteger(value) && value >= 0 && value <= max;
const validNickname = (value) =>
  typeof value === "string" && nicknameOf(value) === value;
export function checkJourneyAdditions(r) {
  if (
    [...(r.party || []), ...(r.box || [])].some(
      (mon) => mon.nickname !== undefined && !validNickname(mon.nickname),
    )
  )
    return false;
  if (
    r.heldItems !== undefined &&
    (!object(r.heldItems) ||
      Object.entries(r.heldItems).some(
        ([id, count]) =>
          !HELD_ITEMS.some((item) => item.id === id) || !counter(count, 999),
      ))
  )
    return false;
  if (
    r.heroRecords !== undefined &&
    (!object(r.heroRecords) ||
      Object.entries(r.heroRecords).some(
        ([id, record]) =>
          !object(record) ||
          record.id !== id ||
          !catalog[record.name] ||
          !counter(record.level, 100) ||
          !validNickname(record.nickname) ||
          !["battles", "wins", "knockouts", "clutches"].every((key) =>
            counter(record[key]),
          ) ||
          typeof record.championFinisher !== "boolean" ||
          (record.status !== undefined &&
            !["team", "reserve", "fallen", "sold", "released"].includes(
              record.status,
            )),
      ))
  )
    return false;
  if (r.rival != null) {
    const rival = r.rival;
    if (
      !object(rival) ||
      !RIVALS.some((p) => p.id === rival.profile) ||
      !r.route?.[0]?.starters?.includes(rival.starter) ||
      !Array.isArray(rival.victories) ||
      rival.victories.length > 3 ||
      new Set(rival.victories).size !== rival.victories.length ||
      rival.victories.some(
        (n) =>
          !RIVAL_STAGES.some((stage) => stage.badges === n) || n > r.badges,
      )
    )
      return false;
    if (
      rival.memories !== undefined &&
      (!Array.isArray(rival.memories) ||
        rival.memories.length > 3 ||
        rival.memories.some(
          (memory) =>
            !object(memory) ||
            !catalog[memory.name] ||
            !validNickname(memory.nickname) ||
            !rival.victories.includes(memory.badges) ||
            !counter(memory.turns),
        ))
    )
      return false;
  }
  if (r.battle?.kind === "rival" && ["battle", "result"].includes(r.phase)) {
    const stage = RIVAL_STAGES.find(
      (value) => value.badges === r.battle.rivalStage,
    );
    if (
      !r.rival ||
      !stage ||
      stage.reward !== r.battle.rivalReward ||
      !["career", "market"].includes(r.rivalReturnPhase)
    )
      return false;
  }
  return true;
}
