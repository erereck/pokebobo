// Fonte já baixada com yt-dlp. Nunca depende de YouTube durante o jogo.
// node scripts/import-audio.mjs <frlg-ost.webm> <ffmpeg.exe>
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { Dex } from "@pkmn/sim";

const [source, ffmpeg] = process.argv.slice(2);
if (!source || !ffmpeg) throw new Error("Informe o áudio fonte e o FFmpeg.");
const specs = JSON.parse(await readFile("scripts/audio-sources.json", "utf8"));
const catalog = JSON.parse(await readFile("src/game/catalog.json", "utf8"));
const sha = (buffer) => createHash("sha256").update(buffer).digest("hex");
await mkdir("public/audio/music", { recursive: true });
await mkdir("public/audio/fanfares", { recursive: true });
await mkdir("public/audio/cries", { recursive: true });
await mkdir("src/features/audio", { recursive: true });
let manifest = {
  source: {
    ...specs,
    tracks: undefined,
    fanfares: undefined,
    sha256: sha(await readFile(source)),
  },
  processing:
    "FFmpeg: MP3 112 kbit/s, 44.1 kHz stereo; loudnorm I=-20 TP=-2 LRA=7; silêncio inicial/final removido por janelas PCM de 10 ms (-60 dB, margem 20 ms); fades 20/80 ms. Pontos de corte evitam o fade longo do álbum.",
  tracks: [],
  fanfares: [],
  cries: [],
};
if (process.argv.includes("--cries-only")) {
  const existing = JSON.parse(
    await readFile("public/audio/manifest.json", "utf8"),
  );
  if (existing.source.sha256 !== manifest.source.sha256)
    throw new Error("Áudio fonte diferente do manifesto.");
  manifest = { ...existing, cries: [] };
}
for (const group of process.argv.includes("--cries-only")
  ? []
  : ["tracks", "fanfares"]) {
  for (const [id, title, scene, requestedStart, requestedEnd] of specs[group]) {
    const pcm = spawnSync(
      ffmpeg,
      [
        "-hide_banner",
        "-loglevel",
        "error",
        "-ss",
        String(requestedStart),
        "-i",
        source,
        "-t",
        String(requestedEnd - requestedStart),
        "-ac",
        "1",
        "-ar",
        "11025",
        "-f",
        "f32le",
        "pipe:1",
      ],
      { maxBuffer: 32 * 1024 * 1024 },
    );
    if (pcm.status) throw new Error(pcm.stderr.toString());
    const samples = new Float32Array(
      pcm.stdout.buffer,
      pcm.stdout.byteOffset,
      pcm.stdout.length / 4,
    );
    const windowSize = 110,
      windows = [];
    for (let i = 0; i < samples.length; i += windowSize) {
      let peak = 0;
      for (let j = i; j < Math.min(samples.length, i + windowSize); j++)
        peak = Math.max(peak, Math.abs(samples[j]));
      windows.push(peak);
    }
    const first = windows.findIndex((peak) => peak > 0.001),
      last = windows.findLastIndex((peak) => peak > 0.001);
    if (first < 0) throw new Error(`Faixa silenciosa: ${id}`);
    const start =
      requestedStart + Math.max(0, (first * windowSize) / 11025 - 0.02);
    const end =
      requestedStart +
      Math.min(
        requestedEnd - requestedStart,
        ((last + 1) * windowSize) / 11025 + 0.02,
      );
    const duration = end - start;
    const file = `${group === "tracks" ? "music" : "fanfares"}/${id}.mp3`;
    const process = spawnSync(
      ffmpeg,
      [
        "-hide_banner",
        "-loglevel",
        "error",
        "-y",
        "-ss",
        String(start),
        "-i",
        source,
        "-t",
        String(duration),
        "-vn",
        "-af",
        `loudnorm=I=-20:TP=-2:LRA=7,afade=t=in:d=0.02,afade=t=out:st=${duration - 0.08}:d=0.08`,
        "-ar",
        "44100",
        "-ac",
        "2",
        "-codec:a",
        "libmp3lame",
        "-b:a",
        "112k",
        `public/audio/${file}`,
      ],
      { encoding: "utf8" },
    );
    if (process.status) throw new Error(process.stderr);
    const bytes = await readFile(`public/audio/${file}`);
    manifest[group].push({
      id,
      title,
      scene,
      file,
      duration,
      start,
      end,
      requestedStart,
      requestedEnd,
      bytes: bytes.length,
      sha256: sha(bytes),
    });
    console.log(file);
  }
}
const directory = await fetch(
  "https://play.pokemonshowdown.com/audio/cries/",
).then((r) => {
  if (!r.ok) throw new Error(`Índice de cries: ${r.status}`);
  return r.text();
});
const available = new Set(
  [...directory.matchAll(/href="\.\/([^"/]+\.mp3)"/g)].map((m) => m[1]),
);
const ids = {},
  requests = new Set();
for (const name of Object.keys(catalog)) {
  const mon = Dex.species.get(name);
  const base = Dex.species.get(mon.baseSpecies || name).id;
  const clean = (value) => value.toLowerCase().replace(/[^a-z0-9]/g, "");
  const forme = mon.forme
    ? `${clean(mon.baseSpecies)}-${clean(mon.forme)}`
    : mon.id;
  const cry = [forme, mon.id, base].find((id) => available.has(`${id}.mp3`));
  if (!cry) throw new Error(`Cry ausente: ${name}`);
  ids[name] = cry;
  requests.add(cry);
}
const queue = [...requests];
await Promise.all(
  Array.from({ length: 6 }, async () => {
    while (queue.length) {
      const id = queue.shift(),
        url = `https://play.pokemonshowdown.com/audio/cries/${id}.mp3`;
      try {
        const bytes = await readFile(`public/audio/cries/${id}.mp3`);
        const previous = JSON.parse(
          await readFile("public/audio/manifest.json", "utf8"),
        ).cries.find((cry) => cry.id === id);
        if (previous?.sha256 === sha(bytes)) {
          manifest.cries.push(previous);
          continue;
        }
      } catch {
        /* Primeiro download. */
      }
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Cry ${id}: ${response.status}`);
      const bytes = Buffer.from(await response.arrayBuffer());
      await writeFile(`public/audio/cries/${id}.mp3`, bytes);
      manifest.cries.push({
        id,
        url,
        file: `cries/${id}.mp3`,
        bytes: bytes.length,
        sha256: sha(bytes),
      });
    }
  }),
);
manifest.cries.sort((a, b) => a.id.localeCompare(b.id));
await writeFile(
  "public/audio/manifest.json",
  JSON.stringify(manifest, null, 2) + "\n",
);
await writeFile(
  "src/features/audio/cryIndex.json",
  JSON.stringify(ids, null, 2) + "\n",
);
await writeFile(
  "src/features/audio/tracks.json",
  JSON.stringify(
    manifest.tracks.map(({ id, title, scene, file, duration }) => ({
      id,
      title,
      scene,
      file,
      duration,
    })),
    null,
    2,
  ) + "\n",
);
console.log(
  `${manifest.tracks.length} trilhas, ${manifest.fanfares.length} fanfares, ${requests.size} cries (${Object.keys(ids).length} entradas).`,
);
