import { CAMPAIGN_RULES } from "../config/campaign.js";
import { HERO_RULES } from "../config/heroes.js";

export const nicknameOf = (value) =>
  [
    ...String(value || "")
      .replace(/[\u0000-\u001f\u007f-\u009f]/g, "")
      .trim()
      .replace(/\s+/g, " "),
  ]
    .slice(0, HERO_RULES.nicknameCharacters)
    .join("");
export const pokemonName = (mon) => mon.nickname || mon.name;

export function heroRecord(r, mon, status) {
  r.heroRecords ||= {};
  if (!Object.hasOwn(r.heroRecords, mon.id))
    r.heroRecords = {
      ...r.heroRecords,
      [mon.id]: {
        id: mon.id,
        battles: 0,
        wins: 0,
        knockouts: 0,
        clutches: 0,
        championFinisher: false,
      },
    };
  const record = r.heroRecords[mon.id];
  Object.assign(record, {
    name: mon.name,
    nickname: nicknameOf(mon.nickname),
    shiny: mon.shiny === true,
    level: mon.level,
  });
  if (status && record.status !== "fallen") record.status = status;
  return record;
}

export function recordBattleHeroes(r, won) {
  const feats = r.outcome.feats;
  for (const mon of r.party) {
    const record = heroRecord(r, mon, "team");
    const stat = feats?.records?.[mon.id];
    if (stat?.participated) {
      record.battles++;
      if (won) record.wins++;
      record.knockouts += stat.knockouts;
      if (stat.clutch) record.clutches++;
    }
    if (
      won &&
      r.battle.kind === "league" &&
      r.leagueIndex === CAMPAIGN_RULES.eliteCount &&
      feats?.lastFinisher === mon.id
    )
      record.championFinisher = true;
    if (
      r.mode === "nuzlocke" &&
      r.outcome.player.find((p) => p.id === mon.id)?.fainted
    )
      record.status = "fallen";
  }
}

export function heroEpithet(record) {
  if (record.championFinisher) return "Fecha a Liga";
  if (record.clutches) return "Por um fio";
  if (record.knockouts >= HERO_RULES.pillarKnockouts) return "Pilar da equipe";
  if (record.knockouts) return "Abre caminho";
  return "Companheiro de jornada";
}

export function journeyLegacy(r) {
  for (const mon of r.party) heroRecord(r, mon, "team");
  for (const mon of r.box || []) heroRecord(r, mon, "reserve");
  const heroes = Object.values(r.heroRecords || {}).map((record) => ({
    ...record,
    epithet: heroEpithet(record),
  }));
  const ranked = heroes
    .filter((record) => record.battles > 0)
    .sort(
      (a, b) =>
        b.knockouts - a.knockouts ||
        b.clutches - a.clutches ||
        b.wins - a.wins ||
        (a.id < b.id ? -1 : a.id > b.id ? 1 : 0),
    );
  return { heroes, hero: ranked[0] || null };
}
