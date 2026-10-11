import {
  MODE_LABELS,
  regionChallengeOf,
} from "../../game/world/regionChallenge.js";
import catalog from "../../game/catalog.json" with { type: "json" };

const integer = (value, fallback = 0) =>
  Number.isFinite(Number(value))
    ? Math.max(0, Math.trunc(Number(value)))
    : fallback;
export function journeyMons(names, levels = []) {
  const recordedLevels = Array.isArray(levels) ? levels : [];
  return (Array.isArray(names) ? names : [])
    .map((mon, index) => ({
      name: typeof mon === "string" ? mon : mon?.name,
      shiny: mon?.shiny === true,
      level: Math.min(100, integer(recordedLevels[index] ?? mon?.level)),
    }))
    .filter((mon) => typeof mon.name === "string" && mon.name);
}

export function journeyCardModel(run) {
  const team = journeyMons(run.team, run.levels).slice(0, 6);
  const reserve = journeyMons(run.box, run.boxLevels).slice(0, 3);
  const records = (Array.isArray(run.collection) ? run.collection : []).filter(
    (record) =>
      record &&
      typeof record.species === "string" &&
      Object.hasOwn(catalog, record.species),
  );
  const species = new Set(
    records.map((record) => catalog[record.species].name),
  );
  const shinySpecies = new Set(
    records
      .filter(
        (record) =>
          record.shiny === true && Object.hasOwn(catalog, record.species),
      )
      .map((record) => catalog[record.species].name),
  );
  const exactCollection = records.length > 0;
  return {
    name: (String(run.name || "Treinador").trim() || "Treinador").slice(0, 24),
    id: integer(run.id, 1),
    title:
      run.won || run.ending === "champion"
        ? "CAMPEÃO DA LIGA"
        : run.ending === "retired"
          ? "JORNADA ENCERRADA"
          : "ATÉ A PRÓXIMA AVENTURA",
    won: Boolean(run.won || run.ending === "champion"),
    badges: Math.min(8, integer(run.badges)),
    week: Math.max(1, integer(run.week, 1)),
    mode: MODE_LABELS[run.mode] || MODE_LABELS.legacy,
    seed: integer(run.seed),
    team,
    teamRecorded: Array.isArray(run.team),
    reserve,
    registered: exactCollection ? species.size : null,
    shinySpecies: exactCollection ? shinySpecies.size : null,
    teamShinies: [...team, ...reserve].filter((mon) => mon.shiny).length,
    opponent: String(run.opponent || "").slice(0, 48),
    challenge: regionChallengeOf(run),
    legacyChallenge: !run.challengeStartRng,
  };
}

export function cardFilename(model) {
  return (
    "pokebobo-run-" + model.id + "-seed-" + (model.seed || "antiga") + ".png"
  );
}
