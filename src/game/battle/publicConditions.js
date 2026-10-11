import {
  VOLATILE_CONDITIONS,
  SIDE_CONDITIONS,
  FIELD_CONDITIONS,
} from "../data/battleConditions.js";

// Somente identificadores/contagem pública de camadas. Nunca expor duração
// interna, item/ability, sourceEffect, objeto Pokémon ou RNG ao caderno.
const known = (states, labels) =>
  Object.keys(labels).filter((id) => states?.[id]);
export const publicMonConditions = (pokemon) =>
  known(pokemon.volatiles, VOLATILE_CONDITIONS);
export function publicFieldConditions(battle) {
  return {
    weather: battle.field.weather || "",
    terrain: battle.field.terrain || "",
    effects: known(battle.field.pseudoWeather, FIELD_CONDITIONS),
    sides: [battle.p1, battle.p2].map((side) => ({
      side: side.id === "p1" ? "player" : "enemy",
      conditions: known(side.sideConditions, SIDE_CONDITIONS).map((id) => ({
        id,
        layers: ["spikes", "toxicspikes"].includes(id)
          ? side.sideConditions[id].layers || 1
          : 1,
      })),
    })),
  };
}
