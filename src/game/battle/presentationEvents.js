const STATUS_TEXT = {
  par: "paralisado",
  brn: "queimado",
  psn: "envenenado",
  tox: "intoxicado",
  slp: "adormeceu",
  frz: "congelado",
};

const STATS = {
  atk: "ataque",
  def: "defesa",
  spa: "ataque especial",
  spd: "defesa especial",
  spe: "velocidade",
  accuracy: "precisão",
  evasion: "evasão",
};
const GUARDS = new Set([
  "Protect",
  "Detect",
  "King's Shield",
  "Spiky Shield",
  "Baneful Bunker",
  "Obstruct",
  "Wide Guard",
  "Quick Guard",
]);

const sideOf = (ref = "") => (ref.startsWith("p1") ? "player" : "enemy");
const targetId = (ref = "") => ref.replace(/^p[12][a-z]?: /, "");

function parseHealth(raw = "") {
  const parts = raw.trim().split(/\s+/).filter(Boolean);
  const hpPart = parts[0] || "";
  const status = parts.find((part) => STATUS_TEXT[part]) || "";
  const fainted = parts.includes("fnt") || hpPart === "0";
  if (hpPart.includes("/")) {
    const [hp, maxhp] = hpPart.split("/").map(Number);
    if (Number.isFinite(hp) && Number.isFinite(maxhp))
      return { hp, maxhp, status, fainted: fainted || hp <= 0 };
  }
  if (hpPart.endsWith("%")) {
    const percent = Number(hpPart.slice(0, -1));
    if (Number.isFinite(percent))
      return { percent, status, fainted: fainted || percent <= 0 };
  }
  if (fainted) return { hp: 0, status, fainted: true };
  return { status, fainted: false };
}

export function presentationEvents(log) {
  const names = new Map();
  const events = [];
  const lastMoves = new Map();
  const futureMoves = new Map();
  const futureNames = new Set(["Future Sight", "Doom Desire"]);
  let visualMove;

  const named = (ref = "") => {
    const id = targetId(ref);
    const species = names.get(id) || id;
    return sideOf(ref) === "player" ? `Seu ${species}` : `${species} rival`;
  };

  const push = (index, type, data = {}) =>
    events.push({ index, type, ...data });

  const parseLine = (line, index) => {
    const p = line.split("|");
    const type = p[1];
    const ref = p[2] || "";
    const side = sideOf(ref);
    const id = targetId(ref);

    if (type === "switch" || type === "drag" || type === "detailschange") {
      const species = (p[3] || "").split(",")[0];
      if (species) names.set(id, species);
      if (type !== "detailschange")
        push(index, "switch", {
          side,
          targetId: id,
          name: species,
          health: parseHealth(p[4]),
          text: `${side === "player" ? "Você enviou" : "Adversário enviou"} ${species}.`,
        });
      return;
    }

    if (type === "move") {
      const recipient = p[4] || "";
      lastMoves.set(ref, {
        name: p[3],
        targetSide: p[4]
          ? sideOf(p[4])
          : side === "player"
            ? "enemy"
            : "player",
      });
      push(index, "move", {
        side,
        targetId: id,
        move: p[3],
        targetSide: recipient ? sideOf(recipient) : side,
        recipientId: targetId(recipient) || id,
        text: `${named(ref)} usou ${p[3]}.`,
      });
      visualMove = events.at(-1);
      return;
    }

    if (type === "-prepare" && visualMove) {
      visualMove.outcome = "prepare";
      return;
    }
    if (
      type === "-activate" &&
      GUARDS.has((p[3] || "").replace(/^move: /, ""))
    ) {
      const guard = (p[3] || "").replace(/^move: /, "");
      if (visualMove && visualMove.targetSide === side)
        visualMove.outcome = "blocked";
      push(index, "message", {
        side,
        targetId: id,
        text: `${named(ref)} bloqueou o golpe com ${guard}.`,
      });
      return;
    }
    if (type === "cant") {
      const reason =
        {
          slp: "está dormindo",
          par: "ficou paralisado",
          frz: "está congelado",
          flinch: "recuou",
          recharge: "precisa recarregar",
          "move: Taunt": "não pode usar esse golpe de status sob provocação",
        }[p[3]] || "não conseguiu agir";
      push(index, "message", {
        side,
        targetId: id,
        text: `${named(ref)} ${reason}.`,
      });
      return;
    }

    const futureName = (p[3] || "").replace(/^move: /, "");
    if (type === "-start" && futureNames.has(futureName)) {
      const targetSide =
        lastMoves.get(ref)?.targetSide ||
        (side === "player" ? "enemy" : "player");
      futureMoves.set(targetSide, futureName);
      push(index, "futurestart", {
        side,
        targetSide,
        move: futureName,
        text: `${named(ref)} preparou ${futureName}!`,
      });
      return;
    }
    if (type === "-end" && futureNames.has(futureName)) {
      visualMove = null;
      futureMoves.delete(side);
      push(index, "futurehit", {
        side,
        targetId: id,
        move: futureName,
        text: `${named(ref)} é o alvo de ${futureName}!`,
      });
      return;
    }
    if (type === "-fail") {
      if (visualMove) visualMove.outcome = "fail";
      const previous = lastMoves.get(ref);
      push(index, "message", {
        text:
          futureNames.has(previous?.name) &&
          futureMoves.has(previous.targetSide)
            ? `Já existe um ataque preparado para esse lado. ${previous.name} falhou.`
            : `${named(ref)} não conseguiu usar o golpe.`,
      });
      return;
    }

    if (type === "-damage") {
      const source = p
        .slice(4)
        .find((part) => part.startsWith("[from] "))
        ?.slice(7);
      const cause = {
        brn: "queimadura",
        psn: "veneno",
        tox: "veneno",
        confusion: "confusão",
        "move: Leech Seed": "Leech Seed",
        Sandstorm: "tempestade de areia",
        Hail: "granizo",
      }[source];
      push(index, "damage", {
        side,
        targetId: id,
        health: parseHealth(p[3]),
        ...(cause ? { text: `${named(ref)} sofreu dano de ${cause}.` } : {}),
      });
      return;
    }

    if (type === "-heal") {
      push(index, "heal", {
        side,
        targetId: id,
        health: parseHealth(p[3]),
        text: `${named(ref)} recuperou energia.`,
      });
      return;
    }

    if (type === "-status") {
      push(index, "status", {
        side,
        targetId: id,
        status: p[3] || "",
        text: `${named(ref)}: ${STATUS_TEXT[p[3]] || p[3]}.`,
      });
      return;
    }

    if (type === "-curestatus") {
      push(index, "curestatus", {
        side,
        targetId: id,
        status: "",
      });
      return;
    }

    if (type === "faint") {
      push(index, "faint", {
        side,
        targetId: id,
        text: `${named(ref)} caiu!`,
      });
      return;
    }

    if (type === "-supereffective") {
      push(index, "message", { text: "Foi super eficaz!" });
      return;
    }
    if (type === "-resisted") {
      push(index, "message", { text: "Não foi muito eficaz." });
      return;
    }
    if (type === "-immune") {
      if (visualMove && visualMove.targetSide === side)
        visualMove.outcome = "immune";
      push(index, "message", { text: "Não teve efeito." });
      return;
    }
    if (type === "-crit") {
      push(index, "message", { text: "Acerto crítico!" });
      return;
    }
    if (type === "-miss") {
      if (visualMove) visualMove.outcome = "miss";
      push(index, "message", { text: "O golpe errou!" });
      return;
    }
    if (type === "-boost") {
      push(index, "message", {
        side,
        targetId: id,
        change: "boost",
        text: `${named(ref)} melhorou ${STATS[p[3]] || p[3]}.`,
      });
      return;
    }
    if (type === "-unboost") {
      push(index, "message", {
        side,
        targetId: id,
        change: "unboost",
        text: `${named(ref)} perdeu ${STATS[p[3]] || p[3]}.`,
      });
      return;
    }
    if (type === "-enditem") {
      const source = p
        .slice(4)
        .find((part) => part.startsWith("[from] move: "))
        ?.slice(13);
      push(index, "message", {
        text:
          source === "Fling"
            ? `${named(ref)} arremessou ${p[3]}.`
            : source
              ? `${named(ref)} perdeu ${p[3]} por ${source}.`
              : `${named(ref)} usou ${p[3]}.`,
      });
    }
  };

  for (let i = 0; i < log.length; i++) {
    const type = log[i].split("|")[1];
    if (type === "split" && log[i + 1]) {
      parseLine(log[i + 1], i + 1);
      i += log[i + 2] ? 2 : 1;
      continue;
    }
    parseLine(log[i], i);
  }

  return events.map((event) => ({
    ...event,
    text: event.text
      ?.replace(/mon\d+/g, "Seu Pokémon")
      .replace(/foe\d+/g, "O adversário"),
  }));
}
