import { PROGRESSION } from "../config/progression.js";

// Wild encounters follow the selected part of the journey, without the leader's catch-up boost.
export const targetLevel = (r) =>
  r.position < 2
    ? PROGRESSION.earlyTargetLevel
    : Math.max(...r.route[r.position].levels) - PROGRESSION.aceBonus;
