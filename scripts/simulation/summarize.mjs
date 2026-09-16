export function wilson(wins, n) {
  if (!n) return null;
  const z = 1.96,
    p = wins / n,
    d = 1 + (z * z) / n,
    center = (p + (z * z) / (2 * n)) / d,
    half = (z * Math.sqrt((p * (1 - p)) / n + (z * z) / (4 * n * n))) / d;
  return [center - half, center + half].map((v) => Math.round(v * 10000) / 100);
}
const rate = (wins, n) => (n ? Math.round((wins / n) * 10000) / 100 : null);
const median = (values) =>
  values.length
    ? [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)]
    : null;
function groups(rows, key) {
  const map = new Map();
  for (const row of rows) {
    const name = key(row);
    if (!map.has(name)) map.set(name, []);
    map.get(name).push(row);
  }
  return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
}
export function summarizeCampaigns(rows) {
  const complete = rows.filter((r) => !r.censored),
    wins = complete.filter((r) => r.won).length;
  const levels = rows.flatMap((r) =>
    r.battles
      .filter((b) => b.kind === "league")
      .slice(0, 1)
      .map((b) => b.playerMaxLevel),
  );
  const deaths = {};
  for (const run of complete.filter((r) => !r.won)) {
    const last = run.battles.at(-1);
    const stage =
      last?.kind === "league"
        ? "Liga " + (last.leagueIndex || run.leagueWins + 1)
        : last?.kind === "ambush"
          ? "Emboscada · etapa " + (run.badges + 1)
          : "Ginásio " + (run.badges + 1);
    deaths[stage] = (deaths[stage] || 0) + 1;
  }
  return {
    runs: rows.length,
    completed: complete.length,
    censored: rows.length - complete.length,
    wins,
    winRate: rate(wins, complete.length),
    winRate95: wilson(wins, complete.length),
    meanBadges: rows.length
      ? rows.reduce((n, r) => n + r.badges, 0) / rows.length
      : 0,
    leagueEntries: levels.length,
    medianLeagueLevel: median(levels),
    deaths,
    uniqueFinalSpecies: new Set(rows.flatMap((r) => r.party.map((p) => p.name)))
      .size,
  };
}
export function breakdowns(rows) {
  return {
    byStarter: groups(rows, (r) => r.starter).map(([starter, runs]) => ({
      starter,
      ...summarizeCampaigns(runs),
    })),
    byOpponent: groups(
      rows.flatMap((r) => r.battles),
      (b) => b.kind + "|" + b.name,
    ).map(([key, battles]) => {
      const completed = battles.filter((b) => !b.censored),
        defeats = completed.filter((b) => b.winner !== "Você").length;
      return {
        kind: battles[0].kind,
        name: battles[0].name,
        encounters: battles.length,
        completed: completed.length,
        censored: battles.length - completed.length,
        playerDefeats: defeats,
        defeatRate: rate(defeats, completed.length),
        defeatRate95: wilson(defeats, completed.length),
        medianTurns: median(completed.map((b) => b.turns)),
        medianPlayerLevel: median(completed.map((b) => b.playerMaxLevel)),
        meanPartySize: completed.length
          ? completed.reduce((n, b) => n + b.partySize, 0) / completed.length
          : null,
      };
    }),
  };
}
