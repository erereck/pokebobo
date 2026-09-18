export function finishRun(s, won, reason = won ? "champion" : "defeat") {
  const r = s.run;
  r.phase = "ended";
  r.won = won;
  s.meta.best = Math.max(s.meta.best, r.badges);
  if (won) s.meta.wins++;

  s.meta.history.unshift({
    id: r.number,
    name: r.name,
    won,
    badges: r.badges,
    week: r.week,
    opponent: r.battle?.name || "",
    team: r.party.map((m) => ({
      id: m.id,
      name: m.name,
      level: m.level,
    })),
    mode: r.mode,
    seed: r.seed || 0,
    leagueIndex: r.leagueIndex || 0,
    reason,
    route: (r.route || []).map((stop) => ({
      id: stop.id,
      name: stop.name,
      region: stop.region,
      kind: stop.kind,
    })),
    highlights: (r.journal || []).slice(0, 8),
    events: (r.eventHistory || []).length,
  });
  s.meta.history = s.meta.history.slice(0, 100);
}
