import { PROGRESSION } from "../config/progression.js";
import { targetLevel } from "../selectors/targetLevel.js";
import { random } from "../random/random.js";

export function revealWild(r, index) {
  const wild = r.encounters[index];
  if (wild.level == null)
    wild.level = Math.max(
      PROGRESSION.captureMinLevel,
      targetLevel(r) +
        (wild.legendary ? -5 : 0) +
        PROGRESSION.captureTargetOffset +
        Math.floor(random(r) * PROGRESSION.captureLevelSpread),
    );
}
