import { ORIGINS } from "../data/origins.js";
import { VILLAGES } from "../data/villages.js";
import { GYMS } from "../data/gyms/index.js";
import { CAMPAIGN_RULES } from "../config/campaign.js";

export const CHALLENGE_FORMAT = "PB1";
export const MODE_LABELS = Object.freeze({
  normal: "Clássico",
  rush: "Correria",
  nuzlocke: "Nuzlocke",
  legacy: "Registro antigo",
});
const places = new Map(
  [...ORIGINS, ...VILLAGES, ...GYMS].map((place) => [place.id, place]),
);
const uint32 = (value) =>
  Number.isInteger(value) && value >= 1 && value <= 0xffffffff;

// Só configuração inicial: nunca aceita equipe, níveis, recursos ou decisões.
export function validateRegionChallenge(value) {
  if (
    !value ||
    value.format !== CHALLENGE_FORMAT ||
    !uint32(value.seed) ||
    !uint32(value.rng)
  )
    return null;
  if (!["normal", "rush", "nuzlocke"].includes(value.mode)) return null;
  if (
    !Array.isArray(value.cities) ||
    value.cities.length !== CAMPAIGN_RULES.cityCount ||
    new Set(value.cities).size !== value.cities.length
  )
    return null;
  const route = value.cities.map((id) => places.get(id));
  if (route[0]?.kind !== "origin" || route[1]?.kind !== "town") return null;
  if (
    route
      .slice(2)
      .some(
        (place, index) =>
          !place || place.kind !== "gym" || place.order !== index + 1,
      )
  )
    return null;
  return {
    format: CHALLENGE_FORMAT,
    seed: value.seed,
    rng: value.rng,
    mode: value.mode,
    cities: [...value.cities],
  };
}

export function challengeRoute(challenge) {
  const valid = validateRegionChallenge(challenge);
  return valid ? valid.cities.map((id) => structuredClone(places.get(id))) : [];
}

export function regionChallengeOf(run) {
  return validateRegionChallenge({
    format: CHALLENGE_FORMAT,
    seed: run.seed,
    rng: run.challengeStartRng || run.seed,
    mode: run.mode || "normal",
    cities: (Array.isArray(run.route) ? run.route : []).map(
      (place) => place?.id,
    ),
  });
}
