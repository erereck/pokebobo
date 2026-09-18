export function finishRun(s, won, reason = won ? "champion" : "defeat") {
  const r = s.run;
  r.phase = "ended";
  r.won = won;
  r.endingReason = reason;
  s.meta.best = Math.max(s.meta.best, r.badges);
  if (won) s.meta.wins++;

  s.meta.history.unshift({
    id: r.number,
    name: r.name,
    won,
    reason,
    badges: r.badges,
    week: r.week,
    opponent: r.battle?.name || "",
    mode: r.mode || "normal",
    seed: r.seed || 0,
    origin: r.route?.[0]?.name || "",
    city: r.route?.[r.position]?.name || "",
    starter: r.starterName || "",
    events: r.eventSeen?.length || 0,
    team: r.party.map((m) => ({
      id: m.id,
      name: m.name,
      level: m.level,
    })),
  });
  s.meta.history = s.meta.history.slice(0, 100);
}
