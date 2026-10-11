import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import atlas from "../src/features/battle/visuals/effectAtlas.json" with { type: "json" };
import manifest from "../public/battle-effects/manifest.json" with { type: "json" };
import { drawOriginalGlyph } from "../src/features/battle/visuals/effectAssets.js";
import { BATTLE_TIMBRES } from "../src/features/audio/battleTimbres.js";
import { battleAudioCue } from "../src/features/audio/audioCues.js";

test("folhas FRLG locais têm hash/dimensões congelados e todos os recortes ficam dentro da imagem", async () => {
  assert.equal(Object.keys(atlas.types).length, 18);
  assert.equal(Object.keys(atlas.sheets).length, 18);
  const images = new Map();
  let total = 0;
  for (const [name, meta] of Object.entries(atlas.sheets)) {
    const entry = manifest.files[meta.file],
      bytes = await readFile(
        new URL(`../public/battle-effects/${meta.file}`, import.meta.url),
      );
    assert.equal(
      createHash("sha256").update(bytes).digest("hex"),
      entry.sha256,
    );
    assert.deepEqual(
      [bytes.readUInt32BE(16), bytes.readUInt32BE(20)],
      entry.size,
    );
    assert.equal(entry.source.includes(manifest.revision), true);
    total += bytes.length;
    images.set(name, { width: entry.size[0], height: entry.size[1] });
  }
  assert.ok(total < 20000);
  const ctx = {
    save() {},
    restore() {},
    translate() {},
    rotate() {},
    drawImage(image, x, y, w, h, ...destination) {
      assert.ok(
        x >= 0 && y >= 0 && x + w <= image.width && y + h <= image.height,
      );
      assert.ok(destination.every(Number.isFinite));
      assert.ok(destination[2] > 0 && destination[3] > 0);
    },
  };
  for (const type of [...Object.keys(atlas.types), "impact"])
    for (const phase of [0, 0.05, 0.5, 0.99, 1, 2])
      assert.equal(
        drawOriginalGlyph(ctx, images, type, 40, 60, 12, phase),
        true,
      );
  assert.equal(
    drawOriginalGlyph(ctx, new Map(), "Fire", 40, 60, 12, 0.5),
    false,
  );
});

test("timbres de batalha respeitam envelopes/headroom e cues distinguem tipos/proteção/falha", () => {
  for (const [name, recipe] of Object.entries(BATTLE_TIMBRES)) {
    assert.ok(recipe.length <= 3, name);
    for (const [from, to, duration, gain, type, delay = 0] of recipe) {
      assert.ok(from > 0 && to > 0 && from < 12000 && to < 12000);
      assert.ok(duration > 0 && duration + delay <= 0.4);
      assert.ok(gain > 0 && gain <= 0.15);
      assert.ok(
        ["noise", "sine", "triangle", "square", "sawtooth"].includes(type),
      );
    }
  }
  assert.equal(
    battleAudioCue({ type: "move", move: "Flamethrower" }).sound,
    "attack-fire",
  );
  assert.equal(
    battleAudioCue({ type: "move", move: "Water Gun" }).sound,
    "attack-water",
  );
  assert.equal(
    battleAudioCue({ type: "move", move: "Protect" }).sound,
    "guard",
  );
  assert.equal(
    battleAudioCue({ type: "move", move: "Protect", outcome: "fail" }).sound,
    "failure",
  );
  assert.equal(
    battleAudioCue({ type: "move", move: "Tackle" }).sound,
    "attack",
  );
});
