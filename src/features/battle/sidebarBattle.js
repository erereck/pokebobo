export function battleSwitchChoice(snapshot, monId, { locked = false } = {}) {
  if (!snapshot || locked) return null;
  const forced = Boolean(snapshot.request?.forceSwitch);
  const trapped = Boolean(snapshot.request?.active?.[0]?.trapped);
  if (trapped && !forced) return null;

  const index = snapshot.player?.findIndex((mon) => mon.id === monId) ?? -1;
  if (index < 0) return null;
  const mon = snapshot.player[index];
  if (!mon || mon.fainted || mon.active) return null;
  return `switch ${index + 1}`;
}
