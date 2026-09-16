import { Battle } from "@pkmn/sim";
import { battleSet } from "../pokemon/battleSet.js";
import { settle } from "./settle.js";

export function startBattle(spec) {
  const battle = new Battle({
    formatid: "gen8customgame",
    seed: spec.seed,
    p1: { name: "Você", team: spec.player.map(battleSet) },
    p2: { name: spec.name, team: spec.enemy.map(battleSet) },
  });
  if (battle.requestState === "teampreview")
    battle.makeChoices("team 123456", "team 123456");
  settle(battle);
  return battle;
}
