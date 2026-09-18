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
      push(index, "move", {
        side,
        targetId: id,
        text: `${named(ref)} usou ${p[3]}.`,
      });
      return;
    }

    if (type === "-damage") {
      push(index, "damage", {
        side,
        targetId: id,
        health: parseHealth(p[3]),
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
      push(index, "message", { text: "Não teve efeito." });
      return;
    }
    if (type === "-crit") {
      push(index, "message", { text: "Acerto crítico!" });
      return;
    }
    if (type === "-miss") {
      push(index, "message", { text: "O golpe errou!" });
      return;
    }
    if (type === "-boost") {
      push(index, "message", {
        text: `${named(ref)} melhorou ${STATS[p[3]] || p[3]}.`,
      });
      return;
    }
    if (type === "-unboost") {
      push(index, "message", {
        text: `${named(ref)} perdeu ${STATS[p[3]] || p[3]}.`,
      });
      return;
    }
    if (type === "-enditem")
      push(index, "message", {
        text: `${named(ref)} usou ${p[3]}.`,
      });
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
