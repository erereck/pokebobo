import {
  CHALLENGE_FORMAT,
  validateRegionChallenge,
} from "../game/world/regionChallenge.js";

export const GAME_URL = "https://erereck.github.io/pokebobo/";
const modeCodes = { normal: "c", rush: "r", nuzlocke: "n" };

export function encodeInvitation(challenge) {
  const valid = validateRegionChallenge(challenge);
  if (!valid)
    throw Error("Esta jornada não tem uma região completa para compartilhar.");
  return [
    CHALLENGE_FORMAT,
    valid.seed.toString(36),
    modeCodes[valid.mode],
    valid.rng.toString(36),
    valid.cities.join("~"),
  ].join(".");
}

export function invitationLink(challenge, base = GAME_URL) {
  const url = new URL(base);
  url.search = "";
  url.hash = `desafio=${encodeInvitation(challenge)}`;
  return url.href;
}

export function parseInvitation(input) {
  let text = String(input || "").trim();
  if (!text) return null;
  if (text.length > 1800)
    throw Error(
      "O convite é muito longo. Cole apenas o link ou o código do desafio.",
    );
  if (/^https?:\/\//i.test(text)) {
    let url;
    try {
      url = new URL(text);
    } catch {
      throw Error(
        "Esse link está incompleto. Copie o convite inteiro novamente.",
      );
    }
    text = new URLSearchParams(url.hash.slice(1)).get("desafio") || "";
    if (!text) throw Error("Esse link não contém um desafio do Pokébobo.");
  }
  if (/^[0-9]+$/.test(text)) {
    const seed = Number(text);
    if (Number.isInteger(seed) && seed >= 1 && seed <= 0xffffffff)
      return { seed, challenge: null };
    throw Error("Use uma seed entre 1 e 4294967295.");
  }
  const parts = text.split(".");
  if (parts[0] !== CHALLENGE_FORMAT)
    throw Error(
      "Convite desconhecido ou de outra versão. Peça um novo link ao seu amigo.",
    );
  if (
    parts.length !== 5 ||
    !/^[0-9a-z]+$/.test(parts[1]) ||
    !/^[0-9a-z]+$/.test(parts[3])
  )
    throw Error("O convite está incompleto. Copie o link inteiro novamente.");
  const challenge = validateRegionChallenge({
    format: parts[0],
    seed: parseInt(parts[1], 36),
    mode: Object.keys(modeCodes).find((mode) => modeCodes[mode] === parts[2]),
    rng: parseInt(parts[3], 36),
    cities: parts[4].split("~"),
  });
  if (!challenge)
    throw Error(
      "O convite contém uma região inválida. Peça um novo link ao seu amigo.",
    );
  return { seed: challenge.seed, challenge };
}

export function invitationFromLocation(location) {
  const code = new URLSearchParams(location.hash.slice(1)).get("desafio");
  return code || "";
}
