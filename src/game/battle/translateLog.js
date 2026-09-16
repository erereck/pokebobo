export function translateLog(log) {
  const names = new Map();
  const named = (s) => {
    const raw = (s || "").replace(/^p[12][a-z]?: /, "");
    const species = names.get(raw) || raw;
    return s?.startsWith("p1") ? `Seu ${species}` : `${species} rival`;
  };
  const stats = {
    atk: "ataque",
    def: "defesa",
    spa: "ataque especial",
    spd: "defesa especial",
    spe: "velocidade",
    accuracy: "precisão",
    evasion: "evasão",
  };
  const result = [];
  for (let i = 0; i < log.length; i++) {
    const p = log[i].split("|"),
      type = p[1];
    if (type === "split") {
      i++;
      continue;
    }
    if (type === "switch" || type === "detailschange")
      names.set((p[2] || "").replace(/^p[12][a-z]?: /, ""), p[3].split(",")[0]);
    if (type === "move") result.push(`${named(p[2])} usou ${p[3]}.`);
    if (type === "faint") result.push(`${named(p[2])} caiu!`);
    if (type === "-supereffective") result.push("Foi super eficaz!");
    if (type === "-resisted") result.push("Não foi muito eficaz.");
    if (type === "-immune") result.push("Não teve efeito.");
    if (type === "-crit") result.push("Acerto crítico!");
    if (type === "-miss") result.push("O golpe errou!");
    if (type === "-status")
      result.push(
        `${named(p[2])}: ${
          {
            par: "paralisado",
            brn: "queimado",
            psn: "envenenado",
            tox: "intoxicado",
            slp: "adormeceu",
            frz: "congelado",
          }[p[3]] || p[3]
        }.`,
      );
    if (type === "-heal") result.push(`${named(p[2])} recuperou energia.`);
    if (type === "switch")
      result.push(
        `${p[2].startsWith("p1") ? "Você enviou" : "Adversário enviou"} ${p[3].split(",")[0]}.`,
      );
    if (type === "-boost")
      result.push(`${named(p[2])} melhorou ${stats[p[3]] || p[3]}.`);
    if (type === "-unboost")
      result.push(`${named(p[2])} perdeu ${stats[p[3]] || p[3]}.`);
    if (type === "-enditem") result.push(`${named(p[2])} usou ${p[3]}.`);
  }
  return result.map((line) =>
    line.replace(/mon\d+/g, "Seu Pokémon").replace(/foe\d+/g, "O adversário"),
  );
}
