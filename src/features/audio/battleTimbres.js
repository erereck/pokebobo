// Timbres próprios; não são gravações dos efeitos sonoros do cartucho.
// Ganhos contidos e envelopes curtos deixam espaço para cries e música.
export const BATTLE_TIMBRES = {
  "attack-fire": [
    [2200, 450, 0.28, 0.11, "noise"],
    [210, 90, 0.2, 0.045, "sawtooth", 0.04],
  ],
  "attack-water": [
    [700, 250, 0.22, 0.08, "noise"],
    [420, 1050, 0.09, 0.06, "sine"],
    [800, 260, 0.1, 0.055, "triangle", 0.12],
  ],
  "attack-grass": [
    [3800, 900, 0.18, 0.09, "noise"],
    [1100, 600, 0.1, 0.04, "triangle", 0.08],
  ],
  "attack-electric": [
    [1800, 900, 0.13, 0.06, "square"],
    [6800, 1600, 0.18, 0.07, "noise"],
    [1200, 2200, 0.09, 0.04, "square", 0.13],
  ],
  "attack-ice": [
    [1800, 1200, 0.16, 0.05, "sine"],
    [2400, 1800, 0.18, 0.04, "triangle", 0.05],
    [4200, 2000, 0.12, 0.04, "noise", 0.08],
  ],
  "attack-fighting": [
    [150, 55, 0.16, 0.12, "triangle"],
    [1200, 180, 0.12, 0.09, "noise", 0.025],
  ],
  "attack-poison": [
    [520, 170, 0.16, 0.06, "sine"],
    [250, 650, 0.11, 0.045, "triangle", 0.09],
    [1100, 350, 0.1, 0.05, "noise", 0.12],
  ],
  "attack-ground": [
    [95, 45, 0.26, 0.09, "triangle"],
    [500, 100, 0.25, 0.1, "noise"],
  ],
  "attack-flying": [
    [3500, 500, 0.25, 0.1, "noise"],
    [140, 340, 0.12, 0.04, "sine"],
  ],
  "attack-psychic": [
    [300, 1700, 0.26, 0.06, "sine"],
    [1250, 450, 0.22, 0.045, "triangle", 0.07],
  ],
  "attack-bug": [
    [450, 850, 0.2, 0.055, "sawtooth"],
    [1400, 750, 0.16, 0.04, "triangle", 0.04],
  ],
  "attack-rock": [
    [1000, 150, 0.09, 0.08, "noise"],
    [600, 90, 0.1, 0.065, "noise", 0.07],
    [180, 60, 0.15, 0.07, "triangle", 0.06],
  ],
  "attack-ghost": [
    [220, 75, 0.28, 0.065, "triangle"],
    [450, 110, 0.25, 0.07, "noise"],
    [800, 180, 0.18, 0.04, "sine", 0.08],
  ],
  "attack-dragon": [
    [360, 90, 0.24, 0.06, "sawtooth"],
    [1900, 550, 0.24, 0.08, "noise"],
    [150, 65, 0.19, 0.055, "triangle", 0.06],
  ],
  "attack-dark": [
    [300, 80, 0.24, 0.08, "noise"],
    [130, 55, 0.19, 0.055, "triangle"],
  ],
  "attack-steel": [
    [2400, 1200, 0.16, 0.05, "triangle"],
    [760, 300, 0.19, 0.05, "square"],
    [4800, 1700, 0.07, 0.035, "noise"],
  ],
  "attack-fairy": [
    [1200, 1200, 0.08, 0.045, "triangle"],
    [1500, 1500, 0.09, 0.04, "triangle", 0.06],
    [2000, 2000, 0.17, 0.04, "sine", 0.12],
  ],
  guard: [
    [600, 1200, 0.18, 0.055, "triangle"],
    [900, 1800, 0.2, 0.04, "sine", 0.04],
  ],
  failure: [[500, 220, 0.12, 0.045, "triangle"]],
};
