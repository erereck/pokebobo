// Validação opcional dos arquivos decodificados: node scripts/audit-audio.mjs <ffmpeg> <relatório.json>
import { readFile, writeFile } from "node:fs/promises";
import { spawn } from "node:child_process";
const [ffmpeg, output] = process.argv.slice(2);
if (!ffmpeg || !output)
  throw new Error("Informe FFmpeg e caminho do relatório.");
const manifest = JSON.parse(
  await readFile("public/audio/manifest.json", "utf8"),
);
const queue = [...manifest.tracks, ...manifest.fanfares, ...manifest.cries],
  results = [];
async function decode(asset) {
  const pcm = await new Promise((resolve, reject) => {
    const child = spawn(ffmpeg, [
      "-hide_banner",
      "-loglevel",
      "error",
      "-i",
      `public/audio/${asset.file}`,
      "-ac",
      "2",
      "-ar",
      "11025",
      "-f",
      "f32le",
      "pipe:1",
    ]);
    const chunks = [];
    let error = "";
    child.stdout.on("data", (chunk) => chunks.push(chunk));
    child.stderr.on("data", (chunk) => {
      error += chunk;
    });
    child.on("error", reject);
    child.on("close", (code) =>
      code ? reject(new Error(error)) : resolve(Buffer.concat(chunks)),
    );
  });
  const samples = new Float32Array(pcm.buffer, pcm.byteOffset, pcm.length / 4);
  let peak = 0,
    sum = 0,
    clipped = 0,
    first = -1,
    last = -1;
  for (let i = 0; i < samples.length; i++) {
    const value = Math.abs(samples[i]);
    peak = Math.max(peak, value);
    sum += value * value;
    if (value >= 1) clipped++;
    if (value > 0.001) {
      if (first < 0) first = i;
      last = i;
    }
  }
  if (!samples.length || first < 0)
    throw new Error(`Áudio vazio: ${asset.file}`);
  const rate = 11025 * 2;
  return {
    file: asset.file,
    bytes: asset.bytes,
    duration: samples.length / rate,
    peak,
    rms: Math.sqrt(sum / samples.length),
    clipped,
    leadingSilence: first / rate,
    trailingSilence: (samples.length - last) / rate,
  };
}
await Promise.all(
  Array.from({ length: 4 }, async () => {
    while (queue.length) results.push(await decode(queue.shift()));
  }),
);
results.sort((a, b) => a.file.localeCompare(b.file));
const music = results.filter((asset) => !asset.file.startsWith("cries/"));
const report = {
  tracks: manifest.tracks.length,
  fanfares: manifest.fanfares.length,
  cries: manifest.cries.length,
  totalBytes: results.reduce((sum, asset) => sum + asset.bytes, 0),
  decodedFiles: results.length,
  musicClippedSamples: music.reduce((sum, asset) => sum + asset.clipped, 0),
  maxMusicLeadingSilence: Math.max(
    ...music.map((asset) => asset.leadingSilence),
  ),
  results,
  note: "PCM float estéreo a 11025 Hz; limite de silêncio -60 dB. Cries preservam bytes de Showdown; música normalizada pelo importador. Não substitui escuta em aparelhos físicos.",
};
if (report.musicClippedSamples || report.maxMusicLeadingSilence > 0.12)
  throw new Error("Reveja clipping/pausas na música.");
await writeFile(output, JSON.stringify(report, null, 2) + "\n");
console.log(JSON.stringify({ ...report, results: undefined }));
