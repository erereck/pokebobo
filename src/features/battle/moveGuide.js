import { Dex } from "@pkmn/sim";

export const STAT_LABELS = {
  atk: "Ataque",
  def: "Defesa",
  spa: "At. especial",
  spd: "Def. especial",
  spe: "Velocidade",
  accuracy: "Precisão",
  evasion: "Evasão",
};
export const STATUS_LABELS = {
  par: "Paralisia",
  brn: "Queimadura",
  psn: "Veneno",
  tox: "Veneno crescente",
  slp: "Sono",
  frz: "Congelamento",
};
const CONDITIONS = {
  confusion: "confusão",
  flinch: "recuo",
  leechseed: "sementes que drenam HP a cada turno",
  taunt: "bloqueio de golpes de status",
  encore: "repetição do último golpe",
  substitute: "um substituto que absorve golpes",
  aquaring: "recuperação de HP a cada turno",
  focusenergy: "chance maior de acerto crítico",
};
const SPECIFICS = {
  bodypress:
    "Calcula o dano com a Defesa do usuário, incluindo seus estágios. Continua sendo um golpe físico.",
  foulplay:
    "Usa o Ataque e os estágios do alvo para calcular o dano. Habilidade, item e queimadura do usuário ainda se aplicam.",
  gyroball:
    "Fica mais forte quanto menor for a Velocidade do usuário em relação à do alvo, até poder 150.",
  electroball:
    "Fica mais forte quanto maior for a Velocidade do usuário em relação à do alvo, com poder de 40 a 150.",
  storedpower:
    "Começa com poder 20 e soma 20 por estágio positivo do usuário. Estágios negativos não reduzem esse bônus.",
  powertrip:
    "Começa com poder 20 e soma 20 por estágio positivo do usuário. Estágios negativos não reduzem esse bônus.",
  counter:
    "Se o último ataque recebido neste turno foi físico, devolve o dobro do HP perdido (mínimo 1), contando só o último acerto. Falha sem esse ataque; imunidades ainda se aplicam.",
  mirrorcoat:
    "Se o último ataque recebido neste turno foi especial, devolve o dobro do HP perdido (mínimo 1), contando só o último acerto. Falha sem esse ataque; imunidades ainda se aplicam.",
  metalburst:
    "Devolve 1,5 vez o HP perdido para o último ataque de um adversário neste turno. Precisa receber dano antes de agir.",
  futuresight:
    "Prepara um ataque que chega ao fim do terceiro turno, no Pokémon que estiver ocupando o lado alvo.",
  doomdesire:
    "Prepara um ataque de aço que chega ao fim do terceiro turno, no Pokémon que estiver ocupando o lado alvo.",
  protect:
    "Protege contra a maioria dos golpes neste turno. Repetir a proteção em turnos seguidos reduz a chance de sucesso.",
  detect:
    "Protege contra a maioria dos golpes neste turno. Repetir a proteção em turnos seguidos reduz a chance de sucesso.",
  rest: "Recupera todo o HP e remove a condição de status. O usuário adormece por dois turnos.",
  splash: "Não causa dano nem altera atributos.",
  synthesis: "Recupera HP; a quantidade muda conforme o clima.",
  morningsun: "Recupera HP; a quantidade muda conforme o clima.",
  moonlight: "Recupera HP; a quantidade muda conforme o clima.",
  roost:
    "Recupera metade do HP máximo. O usuário perde temporariamente o tipo Voador até o fim do turno.",
  bellydrum:
    "Consome metade do HP máximo para elevar o Ataque ao limite. Precisa de HP suficiente para funcionar.",
  curse:
    "Para Fantasmas, consome metade do HP máximo e amaldiçoa o alvo. Para outros tipos, aumenta Ataque/Defesa e reduz Velocidade.",
  wish: "Prepara uma cura para o próximo turno no lado do usuário, mesmo se ele trocar.",
  painsplit:
    "Soma o HP do usuário e do alvo e divide o total igualmente entre os dois.",
};
const ratio = ([n, d]) =>
  d && (n * 100) % d === 0 ? `${(n * 100) / d}%` : `${n}/${d}`;
function boostText(boosts, owner) {
  return Object.entries(boosts || {}).map(
    ([stat, amount]) =>
      `${amount > 0 ? "Eleva" : "Reduz"} ${STAT_LABELS[stat] || stat} ${owner} em ${Math.abs(amount)} ${Math.abs(amount) === 1 ? "estágio" : "estágios"}.`,
  );
}
function secondaryText(effect) {
  const clauses = [];
  if (effect.status)
    clauses.push(
      `pode causar ${STATUS_LABELS[effect.status]?.toLowerCase() || effect.status}`,
    );
  if (effect.volatileStatus && CONDITIONS[effect.volatileStatus])
    clauses.push(`pode causar ${CONDITIONS[effect.volatileStatus]}`);
  for (const text of boostText(effect.boosts, "do alvo"))
    clauses.push(text.replace(/\.$/, ""));
  for (const text of boostText(effect.self?.boosts, "do usuário"))
    clauses.push(text.replace(/\.$/, ""));
  return clauses.length
    ? `${effect.chance ?? 100}% de chance: ${clauses.join("; ")}.`
    : null;
}

export function moveGuide(id) {
  const move = Dex.forGen(8).moves.get(id);
  if (!move.exists) return null;
  const notes = [];
  const specific = SPECIFICS[move.id];
  if (specific) notes.push(specific);
  else {
    if (move.heal)
      notes.push(`Recupera ${ratio(move.heal)} do HP máximo do usuário.`);
    if (move.status)
      notes.push(
        `Pode causar ${STATUS_LABELS[move.status]?.toLowerCase() || move.status} no alvo.`,
      );
    notes.push(
      ...boostText(
        move.boosts,
        move.target === "self" ? "do usuário" : "do alvo",
      ),
    );
    if (CONDITIONS[move.volatileStatus])
      notes.push(`Aplica ${CONDITIONS[move.volatileStatus]}.`);
  }
  if (move.flags.charge)
    notes.push("Normalmente prepara no primeiro turno e ataca no seguinte.");
  if (move.flags.recharge)
    notes.push(
      "O usuário precisa recarregar no turno seguinte se o golpe acertar.",
    );
  if (move.drain)
    notes.push(
      `Recupera HP equivalente a ${ratio(move.drain)} do dano causado.`,
    );
  if (move.recoil)
    notes.push(
      `O usuário perde HP equivalente a ${ratio(move.recoil)} do dano causado.`,
    );
  if (move.multihit)
    notes.push(
      `Acerta ${Array.isArray(move.multihit) ? move.multihit.join(" a ") : move.multihit} vezes; o poder é por acerto.`,
    );
  if (move.selfdestruct) notes.push("O usuário cai ao usar este golpe.");
  if (move.forceSwitch)
    notes.push("Força o alvo a trocar quando as condições permitem.");
  if (move.selfSwitch) notes.push("Permite trocar o usuário após o golpe.");
  if (move.critRatio > 1) notes.push("Tem chance maior de acerto crítico.");
  if (move.overrideDefensiveStat === "def")
    notes.push("Calcula o dano contra a Defesa do alvo, mesmo sendo um golpe especial.");
  for (const secondary of move.secondaries || []) {
    const text = secondaryText(secondary);
    if (text) notes.push(text);
  }
  if (move.damage === "level")
    notes.push(
      "Causa dano igual ao nível do usuário, se o alvo não for imune.",
    );
  else if (typeof move.damage === "number")
    notes.push(`Causa ${move.damage} de dano, se o alvo não for imune.`);
  if (!notes.length)
    notes.push(
      move.category === "Status"
        ? "Seu efeito depende das condições da batalha."
        : "Causa dano ao alvo.",
    );
  return {
    id: move.id,
    name: move.name,
    type: move.type,
    category: { Physical: "Físico", Special: "Especial", Status: "Status" }[
      move.category
    ],
    power: move.damage
      ? "Dano fixo"
      : move.basePower || (move.category === "Status" ? "—" : "Variável"),
    accuracy: move.accuracy === true ? "Sem teste" : `${move.accuracy}%`,
    priority: move.priority > 0 ? `+${move.priority}` : String(move.priority),
    contact: Boolean(move.flags.contact),
    notes,
  };
}
