// Efeitos originais do Pokébobo: timbres de pulso/ruído inspirados no GBA.
// Ganhos e envelopes curtos evitam clicks, picos e caudas sobrepostas.
const tones = {
  ui: [[1200, 950, 0.035, 0.11, "square"]],
  step: [[145, 85, 0.065, 0.13, "noise"]],
  grass: [[2000, 700, 0.095, 0.12, "noise"]],
  water: [[720, 240, 0.13, 0.13, "noise"]],
  encounter: [
    [220, 1760, 0.24, 0.17, "square"],
    [880, 220, 0.24, 0.09, "triangle", 0.12],
  ],
  throw: [[420, 1500, 0.19, 0.14, "noise"]],
  open: [[1800, 400, 0.13, 0.15, "square"]],
  absorb: [[900, 130, 0.4, 0.12, "triangle"]],
  close: [[1000, 350, 0.06, 0.14, "square"]],
  bounce: [[260, 100, 0.07, 0.18, "triangle"]],
  shake: [
    [420, 300, 0.07, 0.15, "square"],
    [300, 420, 0.065, 0.1, "square", 0.085],
  ],
  breakout: [
    [400, 2000, 0.18, 0.13, "square"],
    [1100, 300, 0.17, 0.1, "noise", 0.08],
  ],
  send: [[300, 1200, 0.2, 0.13, "triangle"]],
  attack: [[600, 200, 0.16, 0.13, "noise"]],
  hit: [
    [140, 55, 0.12, 0.21, "triangle"],
    [1400, 250, 0.1, 0.1, "noise"],
  ],
  heal: [
    [523, 523, 0.12, 0.09, "triangle"],
    [659, 659, 0.12, 0.09, "triangle", 0.09],
    [784, 784, 0.2, 0.09, "triangle", 0.18],
  ],
  status: [
    [180, 180, 0.15, 0.08, "square"],
    [160, 160, 0.15, 0.08, "square", 0.15],
  ],
  faint: [[430, 70, 0.42, 0.12, "triangle"]],
  psychic: [
    [300, 1200, 0.3, 0.08, "sine"],
    [600, 1800, 0.3, 0.06, "sine", 0.08],
  ],
  psychicHit: [
    [1600, 100, 0.36, 0.13, "sine"],
    [1000, 200, 0.18, 0.09, "noise"],
  ],
  shiny: [
    [1047, 1047, 0.1, 0.07, "triangle"],
    [1319, 1319, 0.1, 0.07, "triangle", 0.08],
    [1568, 1568, 0.3, 0.07, "triangle", 0.16],
  ],
  level: [
    [523, 523, 0.09, 0.1, "square"],
    [659, 659, 0.09, 0.1, "square", 0.08],
    [1047, 1047, 0.2, 0.1, "square", 0.16],
  ],
  flee: [[900, 200, 0.14, 0.1, "noise"]],
};
export function createChipEffect(context, destination, name) {
  const recipe = tones[name];
  if (!recipe) return [];
  const nodes = [];
  for (const [from, to, duration, volume, type, delay = 0] of recipe) {
    const start = context.currentTime + delay;
    const gain = context.createGain();
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(volume, start + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    gain.connect(destination);
    let source;
    if (type === "noise") {
      const buffer = context.createBuffer(
        1,
        Math.ceil(duration * context.sampleRate),
        context.sampleRate,
      );
      const data = buffer.getChannelData(0);
      // Ruído próprio, sem Math.random (isolado até dos sorteios visuais).
      let seed = 0x45ab;
      for (let i = 0; i < data.length; i++) {
        seed = (seed * 1664525 + 1013904223) >>> 0;
        data[i] = seed / 0x80000000 - 1;
      }
      source = context.createBufferSource();
      source.buffer = buffer;
      const filter = context.createBiquadFilter();
      filter.type = "bandpass";
      filter.Q.value = 0.7;
      filter.frequency.setValueAtTime(from, start);
      filter.frequency.exponentialRampToValueAtTime(to, start + duration);
      source.connect(filter);
      filter.connect(gain);
      source.onended = () => {
        source.disconnect();
        filter.disconnect();
        gain.disconnect();
      };
    } else {
      source = context.createOscillator();
      source.type = type;
      source.frequency.setValueAtTime(from, start);
      source.frequency.exponentialRampToValueAtTime(to, start + duration);
      source.connect(gain);
      source.onended = () => {
        source.disconnect();
        gain.disconnect();
      };
    }
    source.start(start);
    source.stop(start + duration + 0.01);
    nodes.push(source);
  }
  return nodes;
}
