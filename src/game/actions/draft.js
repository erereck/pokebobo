import { CAMPAIGN_RULES } from "../config/campaign.js";
import { VILLAGES } from "../data/villages.js";
import { GYMS } from "../data/gyms/index.js";
import { sample } from "../random/sample.js";

export function handleDraft(s, action, state) {
  let r = s.run;
  if (
    action.type === "DRAFT" &&
    r.phase === "draft" &&
    r.offers.includes(action.id)
  ) {
    const c = [...VILLAGES, ...GYMS].find((x) => x.id === action.id);
    r.route.push(c);
    if (r.route.length === CAMPAIGN_RULES.cityCount) {
      r.phase = "ready";
      r.offers = [];
    } else
      r.offers = sample(
        r,
        GYMS.filter(
          (x) =>
            x.order === r.route.length - 1 &&
            !r.route.some((c) => c.id === x.id),
        ),
        3,
      ).map((x) => x.id);
    return s;
  }
  return state;
}
