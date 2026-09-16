import { Dex } from "@pkmn/sim";

const stage = (n) => (n >= 0 ? (2 + n) / 2 : 2 / (2 - n));
const stat = (mon, key) => mon.stats[key] * stage(mon.boosts?.[key] || 0);
const speed = (mon) => stat(mon, "spe") * (mon.status === "par" ? 0.5 : 1);
const effectiveness = (type, target) =>
  target.immunities?.includes(type) || !Dex.getImmunity(type, target.types)
    ? 0
    : 2 ** Dex.getEffectiveness(type, target.types);

// A deterministic estimate; never call simulator damage/RNG while choosing.
export function estimateDamage(me, target, move) {
  if (move.category === "Status") return 0;
  const eff = effectiveness(move.type, target);
  if (!eff) return 0;
  if (move.damage === "level") return me.level;
  if (typeof move.damage === "number") return move.damage;
  let power = move.basePower || 50;
  if (move.id === "acrobatics" && !me.item) power *= 2;
  if (move.id === "hex" && target.status) power *= 2;
  if (move.id === "facade" && me.status) power *= 2;
  if (move.id === "brine" && target.hp <= target.maxhp / 2) power *= 2;
  if (move.id === "electroball")
    power = speed(me) > speed(target) * 2 ? 120 : 60;
  if (move.id === "gyroball")
    power = Math.min(150, (25 * speed(target)) / Math.max(1, speed(me)) + 1);
  if (move.multihit) power *= Array.isArray(move.multihit) ? 3 : move.multihit;
  const physical = move.category === "Physical";
  let attack = stat(me, physical ? "atk" : "spa");
  if (
    physical &&
    me.status === "brn" &&
    me.ability !== "guts" &&
    move.id !== "facade"
  )
    attack *= 0.5;
  const stab = me.types.includes(move.type)
    ? me.ability === "adaptability"
      ? 2
      : 1.5
    : 1;
  const accuracy =
    move.accuracy === true
      ? 1
      : Math.min(
          1,
          ((move.accuracy / 100) * stage(me.boosts?.accuracy || 0)) /
            stage(target.boosts?.evasion || 0),
        );
  return (
    ((((2 * me.level) / 5 + 2) * power * attack) /
      Math.max(1, stat(target, physical ? "def" : "spd")) /
      50 +
      2) *
    stab *
    eff *
    0.925 *
    accuracy
  );
}

function statusScore(me, target, move) {
  const health = me.hp / me.maxhp;
  if (move.heal) return health < 0.55 ? (1 - health) * 78 : -10;
  if (move.status) {
    if (target.status) return -10;
    if (
      move.status === "par" &&
      (target.types.includes("Electric") || !effectiveness(move.type, target))
    )
      return -10;
    if (
      ["psn", "tox"].includes(move.status) &&
      target.types.some((t) => ["Poison", "Steel"].includes(t))
    )
      return -10;
    if (move.status === "brn" && target.types.includes("Fire")) return -10;
    if (move.flags.powder && target.types.includes("Grass")) return -10;
    return (
      ({ slp: 38, par: 26, tox: 26, brn: 30, psn: 18 }[move.status] || 5) *
      (move.accuracy === true ? 1 : move.accuracy / 100)
    );
  }
  if (move.id === "leechseed")
    return target.seeded || target.types.includes("Grass") ? -10 : 24;
  if (move.boosts) {
    const self = ["self", "allySide"].includes(move.target);
    const owner = self ? me : target;
    const useful = Object.entries(move.boosts).filter(([key, amount]) =>
      self
        ? amount > 0 && (owner.boosts[key] || 0) < 2
        : amount < 0 && (owner.boosts[key] || 0) > -2,
    );
    if (!useful.length || (self && health < 0.5)) return -10;
    const offense = useful.filter(([key]) => ["atk", "spa"].includes(key));
    if (
      self &&
      offense.length &&
      !offense.some(([key]) =>
        me.moves.some(
          (m) =>
            Dex.moves.get(m.id).category ===
            (key === "atk" ? "Physical" : "Special"),
        ),
      )
    )
      return -10;
    return self ? 20 + useful.length * 5 : 10;
  }
  return -5;
}

export function scoreMoves(me, target) {
  return me.moves
    .filter((m) => !m.disabled && m.pp > 0)
    .map((slot) => {
      const move = Dex.moves.get(slot.id),
        damage = estimateDamage(me, target, move);
      let score =
        move.category === "Status"
          ? statusScore(me, target, move)
          : (Math.min(damage, target.hp) / target.maxhp) * 100;
      if (damage >= target.hp)
        score +=
          45 +
          (move.priority > 0 ? 20 : 0) +
          (speed(me) >= speed(target) ? 12 : 0);
      if (move.recoil)
        score -= ((damage * move.recoil[0]) / move.recoil[1] / me.maxhp) * 25;
      if (move.drain && me.hp < me.maxhp)
        score +=
          (Math.min(
            me.maxhp - me.hp,
            (damage * move.drain[0]) / move.drain[1],
          ) /
            me.maxhp) *
          25;
      if (move.selfdestruct && me.hp / me.maxhp > 0.3) score -= 60;
      return { index: slot.index, score, damage };
    })
    .sort((a, b) => b.score - a.score || a.index - b.index);
}

function incomingDamage(target, me) {
  const moves = target.moves.length
    ? target.moves.map((id) => Dex.moves.get(id))
    : target.types.map((type) => ({
        type,
        basePower: 65,
        category: target.stats.atk > target.stats.spa ? "Physical" : "Special",
        accuracy: 100,
      }));
  return Math.max(0, ...moves.map((move) => estimateDamage(target, me, move)));
}

export function chooseObserved(observation) {
  if (!observation) return undefined;
  const { own, active, target, forced, trapped, justSwitched } = observation;
  const options = own
    .filter((p) => !p.fainted && !p.active)
    .map((mon) => ({
      mon,
      offense: scoreMoves(mon, target)[0]?.score || 0,
      incoming: incomingDamage(target, mon) / mon.maxhp,
    }))
    .map((c) => ({
      ...c,
      score: c.offense - c.incoming * 40 + (c.mon.hp / c.mon.maxhp) * 8,
    }))
    .sort((a, b) => b.score - a.score || a.mon.index - b.mon.index);
  if (forced)
    return options.length ? `switch ${options[0].mon.index + 1}` : undefined;
  const best = scoreMoves(active, target)[0];
  const danger = incomingDamage(target, active) / active.maxhp;
  if (!trapped && options.length && !justSwitched && best?.damage < target.hp) {
    const candidate = options[0];
    const current =
      (best?.score || 0) - danger * 40 + (active.hp / active.maxhp) * 8;
    const safeToEnter =
      candidate.incoming < candidate.mon.hp / candidate.mon.maxhp;
    if (
      safeToEnter &&
      candidate.score > current + 24 &&
      (danger > 0.45 || (best?.score || 0) < 18)
    )
      return `switch ${candidate.mon.index + 1}`;
  }
  return best ? `move ${best.index + 1}` : "move 1";
}
