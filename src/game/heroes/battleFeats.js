// Leia o protocolo completo do motor, não a fila visual (que pode ser pulada
// ou truncada). Só golpes diretos recebem crédito por nocaute nesta versão.
export function battleFeats(battle) {
  const records = Object.fromEntries(
    battle.p1.pokemon.map((mon) => [
      mon.name,
      { participated: false, knockouts: 0, clutch: false },
    ]),
  );
  const zeroedBy = new Map(),
    credited = new Set();
  const refId = (ref = "") => ref.replace(/^p[12][a-z]?: /, "");
  let move = null,
    lastFinisher = null;
  for (let i = 0; i < battle.log.length; i++) {
    let line = battle.log[i];
    if (line.startsWith("|split|")) {
      line = battle.log[i + 1] || "";
      i += 2;
    }
    const [, type, ref = "", value = "", ...extra] = line.split("|");
    const id = refId(ref),
      player = ref.startsWith("p1");
    if (type === "turn" || type === "upkeep") move = null;
    if (type === "switch" || type === "drag") {
      if (player && Object.hasOwn(records, id)) records[id].participated = true;
      zeroedBy.delete(ref);
    }
    if (type === "move") move = { ref, id, target: line.split("|")[4] || "" };
    if (type === "-heal") zeroedBy.delete(ref);
    if (type === "-damage") {
      const direct =
        !extra.some((part) => part.startsWith("[from]")) &&
        move?.target === ref;
      if (!direct) zeroedBy.delete(ref);
      else if (
        player &&
        move.ref.startsWith("p2") &&
        /^1\//.test(value) &&
        Object.hasOwn(records, id)
      )
        records[id].clutch = true;
      else if (
        !player &&
        move.ref.startsWith("p1") &&
        /^(0(?: fnt|\/|$))/.test(value)
      )
        zeroedBy.set(ref, move.id);
    }
    if (type === "faint" && !player && !credited.has(id)) {
      const actor = zeroedBy.get(ref);
      if (actor && Object.hasOwn(records, actor)) {
        records[actor].knockouts++;
        credited.add(id);
        lastFinisher = actor;
      } else lastFinisher = null;
    }
  }
  for (const mon of battle.p1.pokemon) {
    records[mon.name].clutch &&= battle.winner === "Você" && !mon.fainted;
  }
  return { records, lastFinisher };
}
