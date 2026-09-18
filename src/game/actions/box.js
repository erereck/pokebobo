import { CAMPAIGN_RULES } from "../config/campaign.js";
import { note } from "../career/journal.js";

function ensureBox(r) {
  if (!Array.isArray(r.box)) r.box = [];
}

export function handleBox(s, action, state) {
  const r = s.run;
  if (!["BOX_TO_RESERVE", "BOX_TO_PARTY", "BOX_SWAP"].includes(action.type))
    return state;
  if (r.phase !== "career") return state;
  ensureBox(r);

  if (action.type === "BOX_TO_RESERVE") {
    const partyIndex = r.party.findIndex((mon) => mon.id === action.id);
    if (
      partyIndex < 0 ||
      r.party.length <= 1 ||
      r.box.length >= CAMPAIGN_RULES.boxSize
    )
      return state;
    const [mon] = r.party.splice(partyIndex, 1);
    r.box.push({ ...mon, item: "" });
    note(r, `${mon.name} foi para a reserva. Continua treinando com a equipe.`);
    return s;
  }

  if (action.type === "BOX_TO_PARTY") {
    const boxIndex = r.box.findIndex((mon) => mon.id === action.id);
    if (boxIndex < 0 || r.party.length >= CAMPAIGN_RULES.partySize) return state;
    const [mon] = r.box.splice(boxIndex, 1);
    r.party.push(mon);
    note(r, `${mon.name} voltou da reserva para a equipe.`);
    return s;
  }

  const partyIndex = r.party.findIndex((mon) => mon.id === action.partyId);
  const boxIndex = r.box.findIndex((mon) => mon.id === action.boxId);
  if (partyIndex < 0 || boxIndex < 0) return state;
  const partyMon = r.party[partyIndex];
  const boxMon = r.box[boxIndex];
  r.party[partyIndex] = boxMon;
  r.box[boxIndex] = { ...partyMon, item: "" };
  note(r, `${boxMon.name} entrou na equipe. ${partyMon.name} ficou na reserva.`);
  return s;
}
