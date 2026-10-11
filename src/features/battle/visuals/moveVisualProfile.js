import catalog from "../../../game/catalog.json" with { type: "json" };

// Somente apresentação. Não consulta nem altera o motor ou o RNG da batalha.
const moveIndex = new Map();
for (const mon of Object.values(catalog))
  for (const move of mon.moves)
    if (!moveIndex.has(move.id)) moveIndex.set(move.id, move);

export const EFFECT_PALETTES = {
  Normal: ["#fff2c5", "#bdb18d"],
  Fire: ["#ffc65c", "#ed593e"],
  Water: ["#a0f0fa", "#448dce"],
  Grass: ["#b2e567", "#438757"],
  Electric: ["#fff3a4", "#e9bd3d"],
  Ice: ["#e0fffa", "#72c8db"],
  Fighting: ["#ffd79a", "#bd5d46"],
  Poison: ["#d69aea", "#8553a6"],
  Ground: ["#e9cb91", "#ab784b"],
  Flying: ["#edf6ff", "#99b8d2"],
  Psychic: ["#ffc5ec", "#bb63c5"],
  Bug: ["#e0ed93", "#849950"],
  Rock: ["#e6d1a4", "#8c795a"],
  Ghost: ["#c3a5e5", "#66548e"],
  Dragon: ["#b6d5ff", "#7261cc"],
  Dark: ["#bab0c4", "#66546c"],
  Steel: ["#e5f3f3", "#8ca6ad"],
  Fairy: ["#ffe4f3", "#df8bb7"],
};
const idOf = (name = "") => name.toLowerCase().replace(/[^a-z0-9]/g, "");
const healing = new Set([
  "recover",
  "roost",
  "rest",
  "synthesis",
  "moonlight",
  "morningsun",
  "softboiled",
  "milkdrink",
  "slackoff",
  "healorder",
  "lifedew",
  "wish",
  "healpulse",
  "shoreup",
]);
const shields = new Set([
  "protect",
  "detect",
  "kingsshield",
  "spikyshield",
  "banefulbunker",
  "reflect",
  "lightscreen",
  "safeguard",
  "auroraveil",
  "wideguard",
  "quickguard",
]);
const beams = new Set([
  "icebeam",
  "aurorabeam",
  "psybeam",
  "hyperbeam",
  "solarbeam",
  "dragonpulse",
  "watergun",
  "hydropump",
  "flamethrower",
  "flashcannon",
  "signalbeam",
  "chargebeam",
  "doomdesire",
]);

export function moveVisualProfile(name) {
  const id = idOf(name),
    move = moveIndex.get(id);
  const type =
    move?.type ||
    (id === "futuresight"
      ? "Psychic"
      : id === "doomdesire"
        ? "Steel"
        : "Normal");
  const category = move?.category || "Physical";
  const shape =
    id === "splash"
      ? "splash"
      : shields.has(id)
        ? "shield"
        : healing.has(id)
          ? "heal"
          : id === "futuresight" || id === "doomdesire"
            ? "charge"
            : category === "Status"
              ? "aura"
              : beams.has(id)
                ? "beam"
                : category === "Physical"
                  ? "strike"
                  : "projectile";
  return {
    id,
    type,
    category,
    shape,
    palette: EFFECT_PALETTES[type] || EFFECT_PALETTES.Normal,
  };
}

export function battleVisual(event) {
  if (!event) return null;
  const profile = moveVisualProfile(event.move);
  if (event.type === "move")
    return {
      ...profile,
      side: event.side,
      targetSide: event.targetSide || event.side,
      shape: event.outcome === "prepare" ? "charge" : profile.shape,
      outcome: event.outcome,
    };
  if (event.type === "futurehit")
    return {
      ...profile,
      side: event.side,
      targetSide: event.side,
      shape: "arrival",
    };
  if (event.type === "heal" || event.type === "curestatus")
    return {
      side: event.side,
      targetSide: event.side,
      shape: "heal",
      palette: EFFECT_PALETTES.Grass,
    };
  if (event.type === "status") {
    const type =
      {
        par: "Electric",
        brn: "Fire",
        frz: "Ice",
        slp: "Psychic",
        psn: "Poison",
        tox: "Poison",
      }[event.status] || "Normal";
    return {
      side: event.side,
      targetSide: event.side,
      shape: "status",
      status: event.status,
      type,
      palette: EFFECT_PALETTES[type],
    };
  }
  if (event.change)
    return {
      side: event.side,
      targetSide: event.side,
      shape: event.change,
      palette: EFFECT_PALETTES[event.change === "boost" ? "Grass" : "Fire"],
    };
  if (event.type === "damage")
    return {
      side: event.side,
      targetSide: event.side,
      shape: "impact",
      palette: EFFECT_PALETTES.Normal,
    };
  return null;
}
