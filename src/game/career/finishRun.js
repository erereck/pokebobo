export function finishRun(s, won, details = won ? "champion" : "defeat") {
  const r = s.run;
  const options =
    details && typeof details === "object" && !Array.isArray(details)
      ? details
      : {};
  const ending =
    options.ending ||
    (details === "abandoned" ? "retired" : won ? "champion" : "defeat");
  const reason =
    typeof details === "string"
      ? details
      : ending === "retired"
        ? "abandoned"
        : ending;
  const opponent =
    options.opponent ?? (ending === "retired" ? "" : r.battle?.name || "");

  r.phase = "ended";
  r.won = won;
  s.meta.best = Math.max(s.meta.best, r.badges);
  if (won) s.meta.wins++;

  const team = r.party.map((mon) => ({
    id: mon.id,
    name: mon.name,
    level: mon.level,
  }));
  const box = (r.box || []).map((mon) => ({
    id: mon.id,
    name: mon.name,
    level: mon.level,
  }));

  s.meta.history.unshift({
    id: r.number,
    name: r.name,
    won,
    badges: r.badges,
    week: r.week,
    opponent,
    team,
    levels: team.map((mon) => mon.level),
    box,
    boxLevels: box.map((mon) => mon.level),
    mode: r.mode || "normal",
    seed: r.seed || 0,
    leagueIndex: r.leagueIndex || 0,
    reason,
    ending,
    route: (r.route || []).map((stop) => ({
      id: stop.id,
      name: stop.name,
      region: stop.region,
      kind: stop.kind,
    })),
    highlights: (r.journal || []).slice(0, 8),
    events: (r.eventHistory || []).length,
  });
}
