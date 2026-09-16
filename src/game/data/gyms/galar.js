import { gym } from "./createGym.js";

export const GALAR_GYMS = [
  {
    id: "turffield",
    name: "Turffield",
    region: "Galar",
    leader: "Milo",
    order: 1,
    team: ["Gossifleur", "Eldegoss"],
    levels: [19, 20],
    biome: "meadow",
    source: "Sword / Shield",
    sourceUrl: "https://pokemondb.net/sword-shield/gymleaders",
  },
  {
    id: "hulbury",
    name: "Hulbury",
    region: "Galar",
    leader: "Nessa",
    order: 2,
    team: ["Goldeen", "Arrokuda", "Drednaw"],
    levels: [22, 23, 24],
    biome: "coast",
    source: "Sword / Shield",
    sourceUrl: "https://pokemondb.net/sword-shield/gymleaders",
  },
].map(gym);
