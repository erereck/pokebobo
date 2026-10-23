// A apresentação lê uma ação já confirmada; nunca sorteia nem altera a run.
const GROWTH_ACTIONS = new Set([
  "TRAIN", "RESULT", "EVOLUTION_CHOICE", "EVENT_CHOICE", "MARKET_BUY_CANDY",
]);

export function actionMoments(before, after, action) {
  if (
    !GROWTH_ACTIONS.has(action?.type) || !before || !after ||
    before.number !== after.number || before.seed !== after.seed
  ) return [];
  const oldMons = new Map(
    [...(before.party || []), ...(before.box || [])].map((mon) => [mon.id, mon]),
  );
  return [...(after.party || []), ...(after.box || [])].flatMap((mon) => {
    const old = oldMons.get(mon.id);
    if (!old || old.name === mon.name) return [];
    return [{
      kind: "evolution",
      monId: mon.id,
      from: old.name,
      to: mon.name,
      level: mon.level,
      shiny: Boolean(mon.shiny),
    }];
  });
}
