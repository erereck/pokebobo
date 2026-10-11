import { rollShiny } from "../pokemon/shiny.js";
import { makeMon } from "../pokemon/createPokemon.js";
import { PROGRESSION } from "../config/progression.js";
import { sample } from "../random/sample.js";
import { VILLAGES } from "../data/villages.js";
import { registerPokemon } from "../pokemon/collection.js";
import { challengeRoute } from "../world/regionChallenge.js";

export function handleStarter(s, action, state) {
  let r = s.run;
  if (
    action.type === "STARTER" &&
    r.phase === "starter" &&
    r.route[0].starters.includes(action.name)
  ) {
    r.party = [
      makeMon(action.name, PROGRESSION.initialLevel, "mon0", rollShiny(r)),
    ];
    registerPokemon(r, r.party[0], "starter");
    r.phase = "draft";
    r.offers = sample(r, VILLAGES, 3).map((x) => x.id);
    if (r.challenge) {
      r.route = challengeRoute(r.challenge);
      r.rng = r.challenge.rng;
      r.phase = "ready";
      r.offers = [];
    }
    return s;
  }
  return state;
}
