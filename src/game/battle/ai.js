import { observeBattle } from "./aiObservation.js";
import { chooseObserved } from "./aiScoring.js";
export const aiChoice = (battle, side = "p2") =>
  chooseObserved(observeBattle(battle, side));
