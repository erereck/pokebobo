import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { Dex } from "@pkmn/sim";
import catalog from "../src/game/catalog.json" with { type: "json" };
import { spriteSources } from "../src/components/pokemon/spriteSources.js";
import geometry from "../src/components/pokemon/staticFormSpriteGeometry.json" with { type: "json" };
import forms from "../src/components/pokemon/staticFormSprites.json" with { type: "json" };
import manifest from "../public/sprites/forms-manifest.json" with { type: "json" };
import { captureSpriteSource } from "../src/features/encounters/captureSpriteSource.js";
const baseUrl = "/pokebobo/";
const hash = bytes => createHash("sha256").update(bytes).digest("hex");

test("captura conserva artes FRLG e usa forma correta nos retratos posteriores", () => {
  assert.equal(captureSpriteSource("Raichu", false, baseUrl), "/pokebobo/sprites/frlg/26.png");
  assert.equal(captureSpriteSource("Raichu", true, baseUrl), "/pokebobo/sprites/frlg-shiny/26.png");
  assert.equal(captureSpriteSource("Raichu-Alola", false, baseUrl), "/pokebobo/sprites/forms/raichu-alola.png");
  assert.equal(captureSpriteSource("Raichu-Alola", true, baseUrl), "/pokebobo/sprites/shiny/raichu-alola.png");
  for (const name of Object.keys(catalog)) for (const shiny of [false, true]) {
    const source = captureSpriteSource(name, shiny, baseUrl);
    assert.ok(existsSync(new URL(`../public/${source.slice(baseUrl.length)}`, import.meta.url)), name);
  }
});

test("retratos normais e shiny de todo o catálogo apontam para arquivos locais existentes", () => {
  for (const [name, mon] of Object.entries(catalog)) for (const shiny of [false, true]) {
    const sources = spriteSources(name, { num: mon.num, baseUrl, shiny });
    assert.equal(sources.length, 1, name);
    assert.ok(sources[0].startsWith(baseUrl), name);
    assert.ok(existsSync(new URL(`../public/${sources[0].slice(baseUrl.length)}`, import.meta.url)), name);
    if (!shiny && Dex.species.get(name).forme)
      assert.ok(sources[0].includes("/sprites/forms/"), name);
  }
});

test("formas não recebem arte comum por número nacional, embedding ou fallback remoto", () => {
  for (const name of ["Raichu-Alola", "Weezing-Galar", "Exeggutor-Alola", "Mr. Mime-Galar", "Oricorio-Pau", "Oricorio-Pa'u"]) {
    const num = catalog[name].num;
    for (const back of [false, true]) for (const battleStyle of [undefined, "2d"]) {
      const sources = spriteSources(name, { num, baseUrl, back, battleStyle, animated: true,
        embeddedFront: { [num]: "base-front" }, embeddedBack: { [num]: "base-back" } });
      assert.ok(sources.length >= 2);
      assert.equal(new Set(sources).size, sources.length);
      assert.ok(sources.every(source => !source.includes(`/sprites/${num}.png`) &&
        !source.includes(`/pokemon/back/${num}.png`) && !source.startsWith("base-")), name);
    }
  }
  assert.deepEqual(spriteSources("Raichu", { num: 26, baseUrl, embeddedFront: { 26: "base-front" } }), ["base-front"]);
  assert.equal(spriteSources("Nidoran-F", { num: 29, baseUrl })[0], "/pokebobo/sprites/29.png");
});

test("cinco retratos derivados mantêm hashes de origem, PNGs e geometria do quadro", () => {
  assert.equal(manifest.length, 5);
  for (const record of manifest) {
    const output = readFileSync(new URL(`../public/sprites/${record.file}`, import.meta.url));
    const source = readFileSync(new URL(`../public/${record.sourceFile}`, import.meta.url));
    assert.equal(hash(source), record.sourceSha256);
    assert.equal(hash(output), record.sha256);
    assert.equal(output.length, record.bytes);
    assert.equal(record.sourceFrame, 0);
    assert.equal(record.frames, 1);
    assert.deepEqual([output.readUInt32BE(16), output.readUInt32BE(20)], record.size);
    assert.deepEqual(geometry[`sprites/${record.file}`], { size: record.size, bounds: record.bounds, frames: 1 });
  }
  assert.equal(Object.keys(forms).length, 5);
});
