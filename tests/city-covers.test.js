import test from "node:test";
import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import { ORIGINS } from "../src/game/data/origins.js";
import { VILLAGES } from "../src/game/data/villages.js";
import { GYMS } from "../src/game/data/gyms/index.js";
import { ROUTE_COVERS, coverFor } from "../src/game/data/routeCovers.js";

test("todas as cidades do draft possuem imagem própria, sem compartilhar por bioma", () => {
  const places = [...ORIGINS, ...VILLAGES, ...GYMS];
  const files = new Set();
  for (const place of places) {
    const cover = coverFor(place);
    assert.ok(cover, `Falta imagem: ${place.id}`);
    assert.equal(cover.id, place.id);
    assert.equal(cover.region, place.region);
    assert.ok(
      cover.name
        .toLowerCase()
        .replaceAll("'", "")
        .startsWith(place.name.toLowerCase().replaceAll("’", "")),
    );
    files.add(cover.file);
  }
  assert.equal(files.size, places.length);
  assert.equal(coverFor({ id: "indigo" }).name, "Indigo Plateau");
});

test("lugar desconhecido ou apenas bioma não recebe mapa de outra cidade", () => {
  for (const place of [
    undefined,
    null,
    {},
    { biome: "meadow" },
    { id: "missing", biome: "coast" },
    { id: "forest" },
    { id: "toString" },
    { id: "__proto__" },
  ])
    assert.equal(coverFor(place), undefined);
});

test("capas locais conferidas existem, são únicas e correspondem aos hashes publicados", async () => {
  const covers = Object.values(ROUTE_COVERS);
  for (const cover of covers) {
    assert.match(cover.file, /^[a-z]+\.webp$/);
    const file = await readFile(
      new URL(`../public/covers/${cover.file}`, import.meta.url),
    );
    assert.equal(file.length, cover.bytes);
    assert.equal(file.toString("ascii", 0, 4), "RIFF");
    assert.equal(file.toString("ascii", 8, 12), "WEBP");
    assert.equal(createHash("sha256").update(file).digest("hex"), cover.sha256);
    assert.ok(cover.width > 0 && cover.height > 0);
    assert.ok(cover.credit && cover.sourceRevision && cover.game);
    assert.equal(new URL(cover.sourceUrl).hostname, "archives.bulbagarden.net");
    assert.equal(
      new URL(cover.originalUrl).hostname,
      "archives.bulbagarden.net",
    );
    assert.ok(
      !cover.originalUrl.includes("/thumb/"),
      `${cover.id}: usar o original`,
    );
  }
  const assets = (
    await readdir(new URL("../public/covers/", import.meta.url))
  ).filter((file) => /\.(png|webp)$/.test(file));
  assert.deepEqual(assets.sort(), covers.map((cover) => cover.file).sort());
});
