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
import { EXPLORATION_RULES } from "../config/exploration.js";
import { recordBattleHeroes } from "../heroes/heroes.js";
import {
  addEquipment,
  returnEquipment,
  itemName,
} from "../equipment/equipment.js";
import { rememberRivalDuel } from "../rival/rival.js";

export function handleResult(s, action, state) {
  let r = s.run;
  if (action.type === "RESULT" && r.phase === "result") {
    const won = battleVictory(r);
    recordBattleHeroes(r, won);
    if (won && r.battle.kind === "rival") rememberRivalDuel(r);
    if (!won) {
      note(
        r,
        noSurvivors(r)
          ? "Seu último Pokémon caiu. A run Nuzlocke terminou sem sobreviventes."
          : `${r.battle.name} encerrou a run. O mapa foi seu. A história também.`,
      );
      finishRun(s, false, {
        ending: "defeat",
        opponent: r.battle?.name || "",
      });
      return s;
    }
    const survivors = r.outcome.player
      .filter((p) => !p.fainted)
      .map((p) => p.id);
    if (r.mode === "nuzlocke") {
      // O item pode ter sido consumido ou trocado no combate. Só devolva
      // o que o integrante realmente carrega no resultado confirmado.
      for (const mon of r.party.filter((p) => !survivors.includes(p.id))) {
        returnEquipment(r, {
          item: r.outcome.player.find((p) => p.id === mon.id)?.item || "",
        });
      }
      r.party = r.party.filter((p) => survivors.includes(p.id));
    }
    r.party = r.party.map((p) => ({
      ...p,
      item: r.outcome.player.find((m) => m.id === p.id)?.item || "",
    }));
    const kind = r.battle.kind;
    if (kind === "rival") {
      r.rival.victories.push(r.battle.rivalStage);
      addEquipment(r, r.battle.rivalReward);
      r.phase = r.rivalReturnPhase === "market" ? "market" : "career";
      r.rivalReturnPhase = null;
      note(
        r,
        `${r.battle.name} reconhece sua vitória. Você recebeu ${itemName(r.battle.rivalReward)} na mochila. Equipe recuperada; nenhuma semana gasta. O próximo reencontro será diferente.`,
      );
    } else if (kind === "gym") {
      r.badges++;
      if (r.badges === EXPLORATION_RULES.fishingBadges)
        note(
          r,
          "Você ganhou a Fishing Rod! Pescar nos lagos das rotas agora está liberado.",
        );
      if (r.badges === EXPLORATION_RULES.surfBadges)
        note(
          r,
          "Você ganhou acesso a Surf! Os lagos agora oferecem uma segunda seleção de Pokémon.",
        );
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
        r.inLeague = false;
        r.phase = "market";
        note(
          r,
          "Oito insígnias! O Mercado da Liga está aberto. Venda Pokémon e ensine TMs antes da Elite 4.",
        );
      } else advance(r);
    } else if (kind === "league") {
      r.leagueIndex++;
      const training = train(r, PROGRESSION.leagueVictoryLevels);
      note(
        r,
        `${r.battle.name} ficou para trás. Equipe recuperada. ${training}`,
      );
      if (r.leagueIndex === CAMPAIGN_RULES.leagueBattles)
        finishRun(s, true, {
          ending: "champion",
          opponent: r.battle?.name || "",
        });
      else r.phase = "career";
    } else {
      train(r, PROGRESSION.ambushVictoryLevels);
      const eventReward = claimEventBattleReward(r);
      note(
        r,
        `${r.battle.name} foi derrotado. Equipe recuperada. O caminho está livre.${eventReward ? ` Recompensa do acontecimento: ${eventReward}` : ""}`,
      );
      if (r.eventEncounterIndex != null) r.phase = "encounter";
      else {
        r.phase = "career";
        afterWeek(r, { allowAmbush: false, allowEvent: false });
      }
    }
    r.outcome = null;
    return s;
  }
  return state;
}
