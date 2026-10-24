import { heroRecord, nicknameOf, pokemonName } from "../heroes/heroes.js";
import { canManageEquipment } from "../equipment/equipment.js";
import { note } from "../career/journal.js";

export function handleNickname(s, action, state) {
  const r = s.run;
  if (!canManageEquipment(r) || typeof action.nickname !== "string")
    return state;
  const mon = [...r.party, ...(r.box || [])].find((m) => m.id === action.monId);
  const nickname = nicknameOf(action.nickname);
  if (!mon || (mon.nickname || "") === nickname) return state;
  mon.nickname = nickname;
  heroRecord(r, mon);
  note(
    r,
    nickname
      ? `${mon.name} agora atende por ${pokemonName(mon)}.`
      : `${mon.name} voltou a usar o nome da espécie.`,
  );
  return s;
}
