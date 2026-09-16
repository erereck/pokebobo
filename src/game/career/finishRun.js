export function finishRun(s, won) {
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
    team: r.party.map((m) => m.name),
  });
  s.meta.history = s.meta.history.slice(0, 20);
}
