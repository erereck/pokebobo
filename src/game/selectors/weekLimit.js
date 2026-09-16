import { CAMPAIGN_RULES } from "../config/campaign.js";

export const weekLimit = (r) =>
  r.mode === "rush"
    ? CAMPAIGN_RULES.rushWeeksPerCity
    : CAMPAIGN_RULES.weeksPerCity;
