import { makeMon } from "../pokemon/createPokemon.js";
import { PROGRESSION } from "../config/progression.js";
import { sample } from "../random/sample.js";
import { VILLAGES } from "../data/villages.js";

export function handleStarter(s, action, state) {
  let r = s.run;
  if (
    action.type === "STARTER" &&
    r.phase === "starter" &&
    r.route[0].starters.includes(action.name)
  ) {
    r.party = [makeMon(action.name, PROGRESSION.initialLevel, "mon0")];
    r.phase = "draft";
    r.offers = sample(r, VILLAGES, 3).map((x) => x.id);
    return s;
  }
  return state;
}
