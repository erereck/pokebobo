export function handleReorderParty(s, action, state) {
  const r = s.run;
  if (action.type !== "REORDER_PARTY" || r.phase !== "career") return state;
  const from = r.party.findIndex((mon) => mon.id === action.sourceId);
  const to = r.party.findIndex((mon) => mon.id === action.targetId);
  if (from < 0 || to < 0 || from === to) return state;
  const [mon] = r.party.splice(from, 1);
  r.party.splice(to, 0, mon);
  return s;
}
