import { CAMPAIGN_RULES } from "../config/campaign.js";
import { note } from "../career/journal.js";
import { finishRun } from "../career/finishRun.js";
import { train } from "../career/training.js";
import { PROGRESSION } from "../config/progression.js";
import { sample } from "../random/sample.js";
import { ELITES } from "../data/league/elites.js";
import { pick } from "../random/pick.js";
import { CHAMPIONS } from "../data/league/champions.js";
import { advance } from "../world/advance.js";
import { afterWeek } from "../career/afterWeek.js";
import { battleVictory, noSurvivors } from "../selectors/battleVictory.js";
import { claimEventBattleReward } from "../career/weekEvents.js";

export function handleResult(s, action, state) {
  let r = s.run;
  if (action.type === "RESULT" && r.phase === "result") {
    const won = battleVictory(r);
    if (!won) {
      note(
        r,
        noSurvivors(r)
          ? "Seu último Pokémon caiu. A run Nuzlocke terminou sem sobreviventes."
          : `${r.battle.name} encerrou a run. O mapa foi seu. A história também.`,
      );
      finishRun(s, false);
      return s;
    }
    const survivors = r.outcome.player
      .filter((p) => !p.fainted)
      .map((p) => p.id);
    if (r.mode === "nuzlocke")
      r.party = r.party.filter((p) => survivors.includes(p.id));
    r.party = r.party.map((p) => ({
      ...p,
      item: r.outcome.player.find((m) => m.id === p.id)?.item || "",
    }));
    const kind = r.battle.kind;
    if (kind === "gym") {
      r.badges++;
      s.meta.best = Math.max(s.meta.best, r.badges);
      const training = train(r, PROGRESSION.gymVictoryLevels);
      note(
        r,
        `${r.battle.name} foi derrotado. Insígnia ${r.badges}/8. Equipe recuperada. ${training}`,
      );
      if (r.badges === CAMPAIGN_RULES.gymCount) {
        r.league = [
          ...sample(r, ELITES, CAMPAIGN_RULES.eliteCount),
          pick(r, CHAMPIONS),
        ];
        r.inLeague = true;
        r.phase = "career";
        note(
          r,
          "Oito insígnias. Os portões da Liga se abriram. Cinco batalhas separam você do título.",
        );
      } else advance(r);
    } else if (kind === "league") {
      r.leagueIndex++;
      const training = train(r, PROGRESSION.leagueVictoryLevels);
      note(
        r,
        `${r.battle.name} ficou para trás. Equipe recuperada. ${training}`,
      );
      if (r.leagueIndex === CAMPAIGN_RULES.leagueBattles) finishRun(s, true);
      else r.phase = "career";
    } else {
      train(r, PROGRESSION.ambushVictoryLevels);
      const eventReward = claimEventBattleReward(r);
      note(
        r,
        `${r.battle.name} foi derrotado. Equipe recuperada. O caminho está livre.${eventReward ? ` Recompensa do acontecimento: ${eventReward}` : ""}`,
      );
      r.phase = "career";
      afterWeek(r, { allowAmbush: false, allowEvent: false });
    }
    r.outcome = null;
    return s;
  }
  return state;
}
