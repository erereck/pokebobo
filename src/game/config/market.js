export const MARKET_RULES = Object.freeze({
  referenceValue: 1300,
  referenceStats: 480,
  referenceLevel: 45,
  statsExponent: 1.35,
  levelExponent: 0.65,
  priceStep: 50,
  minimumValue: 200,
});

// A média de preço é ₽ 1.000; o Pokémon de referência rende 1,3 TMs.
// Cada oferta tem uma unidade por jornada, consumida ao ensinar o golpe.
export const MARKET_TMS = Object.freeze([
  { id: "protect", name: "Protect", type: "Normal", price: 600 },
  { id: "swordsdance", name: "Swords Dance", type: "Normal", price: 800 },
  { id: "calmmind", name: "Calm Mind", type: "Psychic", price: 800 },
  { id: "brickbreak", name: "Brick Break", type: "Fighting", price: 800 },
  { id: "rockslide", name: "Rock Slide", type: "Rock", price: 900 },
  { id: "shadowball", name: "Shadow Ball", type: "Ghost", price: 1000 },
  { id: "energyball", name: "Energy Ball", type: "Grass", price: 1000 },
  { id: "psychic", name: "Psychic", type: "Psychic", price: 1100 },
  { id: "flamethrower", name: "Flamethrower", type: "Fire", price: 1200 },
  { id: "icebeam", name: "Ice Beam", type: "Ice", price: 1200 },
  { id: "thunderbolt", name: "Thunderbolt", type: "Electric", price: 1200 },
  { id: "earthquake", name: "Earthquake", type: "Ground", price: 1400 },
]);
