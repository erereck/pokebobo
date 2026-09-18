import { city } from "../selectors/city.js";
import { targetLevel } from "../selectors/targetLevel.js";
import { PROGRESSION } from "../config/progression.js";
import { pick } from "../random/pick.js";
import { sample } from "../random/sample.js";
import { POOLS } from "../data/encounters/index.js";
import { makeMon } from "../pokemon/createPokemon.js";
import { random } from "../random/random.js";
import { note } from "../career/journal.js";
import { gymChallenge } from "../selectors/gymChallenge.js";
import { ensureMoveLearningState } from "../pokemon/moveLearning.js";

export function beginBattle(r, kind) {
  ensureMoveLearningState(r);
  if (r.pendingMoveChoices.length) {
    r.pendingBattleKind = kind;
    r.phase = "move-choice";
    return;
  }

  let name,
    roster,
    level,
    source = "",
    levels,
    boost = 0;
  if (kind === "gym") {
    const c = city(r);
    name = c.leader;
    roster = c.team;
    const challenge = gymChallenge(r, c);
    levels = challenge.levels;
    boost = challenge.boost;
    source = c.source;
  } else if (kind === "league") {
    const t = r.league[r.leagueIndex];
    name = t.name;
    roster = t.team;
    level =
      PROGRESSION.leagueFirstLevel +
      r.leagueIndex * PROGRESSION.leagueLevelStep;
    source = t.source;
  } else {
    name = pick(r, [
      "Treinadora Lia",
      "Mochileiro Caio",
      "Rival Nico",
      "Treinadora Bia",
    ]);
    roster = sample(r, POOLS[city(r).biome], r.badges > 3 ? 3 : 2);
    level = Math.max(8, targetLevel(r) - 4);
  }
  const enemy = roster.map((n, i) =>
    makeMon(
      n,
      levels?.[i] ??
        level + (i === roster.length - 1 ? PROGRESSION.aceBonus : 0),
      `foe${i}`,
    ),
  );
  r.battle = {
    kind,
    name,
    source,
    boost,
    enemy,
    player: structuredClone(r.party),
    seed: Array.from(
      {
        length: 4,
      },
      () => Math.floor(random(r) * 65536),
    ),
    choices: [],
  };
  r.phase = "battle";
  r.lastAmbush = kind === "ambush" ? r.week : r.lastAmbush;
  note(
    r,
    kind === "ambush"
      ? `${name} apareceu no caminho. Era bom ter vindo preparado.`
      : `Hora de enfrentar ${name}. Uma tentativa.${boost ? ` Líder preparado: +${boost} níveis em toda a equipe.` : ""}`,
  );
}
