import { RIVALS } from "../data/rivals.js";
import { RIVAL_STAGES } from "../config/rival.js";
import { grow } from "../pokemon/evolution.js";
import { makeMon } from "../pokemon/createPokemon.js";
import { movesFor } from "../pokemon/moves.js";
import { PROGRESSION } from "../config/progression.js";

export function createRival(r, starter) {
  const starters = r.route[0].starters;
  return {
    profile: RIVALS[(r.seed >>> 0) % RIVALS.length].id,
    starter: starters[(starters.indexOf(starter) + 1) % starters.length],
    victories: [],
    memories: [],
  };
}
export const rivalProfile = (r) =>
  RIVALS.find((profile) => profile.id === r.rival?.profile);
export function rivalStage(r) {
  if (!r.rival || !["career", "market"].includes(r.phase) || r.inLeague)
    return null;
  const stage = RIVAL_STAGES.filter((value) => r.badges >= value.badges).at(-1);
  return stage && !r.rival.victories.includes(stage.badges) ? stage : null;
}
export function rivalTeam(r, stage) {
  const profile = rivalProfile(r);
  if (!profile) return [];
  const roots = [...profile.team.slice(0, stage.size - 1), r.rival.starter];
  return roots.map((name, index) => {
    const level =
      stage.level + (index === roots.length - 1 ? PROGRESSION.aceBonus : 0);
    const evolved = grow(makeMon(name, 1, `foe${index}`), level - 1);
    return { ...evolved, moves: movesFor(evolved.name, level) };
  });
}

export function rememberRivalDuel(r) {
  const seen = r.party.filter(
    (mon) => r.outcome.feats?.records?.[mon.id]?.participated,
  );
  const partner = seen.sort(
    (a, b) =>
      (r.outcome.feats.records[b.id]?.knockouts || 0) -
      (r.outcome.feats.records[a.id]?.knockouts || 0),
  )[0];
  if (partner)
    r.rival.memories = [
      ...(r.rival.memories || []),
      {
        badges: r.battle.rivalStage,
        name: partner.name,
        nickname: partner.nickname || "",
        turns: r.outcome.turn,
      },
    ].slice(-3);
}
