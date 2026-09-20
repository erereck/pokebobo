export function newBattleEvents(before, after) {
  const lastIndex = before.events?.at(-1)?.index ?? -1;
  return (after.events || []).filter((event) => event.index > lastIndex);
}

function healthValue(health, maxhp, fallback) {
  if (Number.isFinite(health?.hp)) return health.hp;
  if (Number.isFinite(health?.percent) && maxhp)
    return Math.round((maxhp * health.percent) / 100);
  return fallback;
}

function updateTarget(snapshot, event, finalSnapshot, change) {
  const listKey = event.side === "player" ? "player" : "enemy";
  const activeKey = event.side === "player" ? "active" : "foe";
  const list = snapshot[listKey];
  const index = list.findIndex((mon) => mon.id === event.targetId);
  const finalMon = finalSnapshot[listKey].find(
    (mon) => mon.id === event.targetId,
  );
  const current = index >= 0 ? list[index] : finalMon;
  if (!current) return snapshot;
  const changed = change({ ...current }, finalMon);
  if (index >= 0) list[index] = changed;
  else list.push(changed);
  if (snapshot[activeKey]?.id === event.targetId)
    snapshot[activeKey] = { ...changed };
  return snapshot;
}

export function applyBattleEvent(currentSnapshot, event, finalSnapshot) {
  const next = structuredClone(currentSnapshot);
  const listKey = event.side === "player" ? "player" : "enemy";
  const activeKey = event.side === "player" ? "active" : "foe";

  if (event.type === "switch") {
    next[listKey] = next[listKey].map((mon) => ({ ...mon, active: false }));
    const finalMon = finalSnapshot[listKey].find(
      (mon) => mon.id === event.targetId,
    );
    const previous = next[listKey].find((mon) => mon.id === event.targetId);
    if (!finalMon && !previous) return next;
    const base = { ...(finalMon || previous) };
    const maxhp = event.health?.maxhp || base.maxhp;
    const switched = {
      ...base,
      name: event.name || base.name,
      maxhp,
      hp: healthValue(event.health, maxhp, base.hp),
      status: event.health?.status ?? base.status,
      fainted: Boolean(event.health?.fainted),
      active: true,
    };
    const index = next[listKey].findIndex(
      (mon) => mon.id === event.targetId,
    );
    if (index >= 0) next[listKey][index] = switched;
    else next[listKey].push(switched);
    next[activeKey] = { ...switched };
    return next;
  }

  if (event.type === "damage" || event.type === "heal") {
    return updateTarget(next, event, finalSnapshot, (mon) => {
      const maxhp = event.health?.maxhp || mon.maxhp;
      const hp = healthValue(event.health, maxhp, mon.hp);
      return {
        ...mon,
        maxhp,
        hp,
        status: event.health?.status ?? mon.status,
        // Showdown já marca o dano final com "fnt", mas o sprite só deve
        // entrar no estado de desmaio quando o evento |faint| chegar.
        fainted:
          event.type === "damage"
            ? mon.fainted
            : Boolean(event.health?.fainted || hp <= 0),
      };
    });
  }

  if (event.type === "status" || event.type === "curestatus")
    return updateTarget(next, event, finalSnapshot, (mon) => ({
      ...mon,
      status: event.status || "",
    }));

  if (event.type === "faint")
    return updateTarget(next, event, finalSnapshot, (mon) => ({
      ...mon,
      hp: 0,
      fainted: true,
    }));

  return next;
}

export function battleEffect(event) {
  if (event.type === "move") return { type: "attack", side: event.side };
  if (event.type === "damage") return { type: "hit", side: event.side };
  if (event.type === "heal") return { type: "heal", side: event.side };
  if (event.type === "status") return { type: "status", side: event.side };
  if (event.type === "faint") return { type: "faint", side: event.side };
  if (event.type === "switch") return { type: "switch", side: event.side };
  return null;
}

export function battleEventDuration(type, speed = "normal") {
  const normal = {
    move: 360,
    damage: 420,
    heal: 420,
    status: 500,
    curestatus: 260,
    faint: 620,
    switch: 500,
    message: 300,
  };
  const duration = normal[type] ?? 220;
  return speed === "fast" ? Math.max(90, Math.round(duration * 0.45)) : duration;
}
