import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import catalog from "../src/game/catalog.json" with { type: "json" };
import sprites from "../src/game/data/battleSprites.json" with { type: "json" };
import {
  battleSpriteSources,
  spriteFileId,
} from "../src/components/pokemon/battleSpriteSources.js";
import {
  BATTLE_SPRITE_KEY,
  readBattleSpriteStyle,
  writeBattleSpriteStyle,
} from "../src/app/preferences/battleSprites.js";

test("2D cobre frente e costas de todo o catálogo, preservando formas e aliases", () => {
  for (const name of Object.keys(catalog)) {
    const id = spriteFileId(name),
      sprite = sprites[id];
    assert.ok(sprite?.front && sprite?.back, name);
    for (const back of [false, true]) {
      const sources = battleSpriteSources(name, back, "/pokebobo/");
      assert.equal(
        sources[0],
        `/pokebobo/battle-sprites/${back ? sprite.back : sprite.front}`,
      );
      assert.ok(
        sources.every((s) => s.startsWith("/pokebobo/battle-sprites/")),
      );
    }
  }
  assert.notEqual(spriteFileId("Raichu"), spriteFileId("Raichu-Alola"));
  assert.notEqual(spriteFileId("Weezing"), spriteFileId("Weezing-Galar"));
  assert.equal(spriteFileId("Oricorio-Pau"), spriteFileId("Oricorio-Pa'u"));
});

test("970 arquivos 2D locais são imagens completas e correspondem ao manifesto", async () => {
  const manifest = JSON.parse(
    await readFile(
      new URL("../public/battle-sprites/manifest.json", import.meta.url),
      "utf8",
    ),
  );
  const files = new Set();
  for (const [id, sprite] of Object.entries(sprites)) {
    for (const side of ["front", "back"]) {
      const record = manifest[id][side];
      assert.equal(record.file, sprite[side]);
      assert.match(record.file, /^(front|back)\/[a-z0-9-]+\.(gif|png)$/);
      const data = await readFile(
        new URL(`../public/battle-sprites/${record.file}`, import.meta.url),
      );
      assert.equal(data.length, record.bytes);
      assert.equal(
        createHash("sha256").update(data).digest("hex"),
        record.sha256,
      );
      assert.ok(
        data.toString("ascii", 0, 3) === "GIF" ||
          data.toString("ascii", 1, 4) === "PNG",
      );
      assert.equal(
        new URL(record.sourceUrl).hostname,
        "play.pokemonshowdown.com",
      );
      files.add(record.file);
    }
  }
  assert.equal(files.size, 970);
});

test("preferência 2D/3D é global ao navegador e não altera o save da carreira", () => {
  const values = new Map([["pokebobo.save.v1", "carreira"]]),
    storage = {
      getItem: (key) => values.get(key),
      setItem: (key, value) => values.set(key, value),
    };
  assert.equal(readBattleSpriteStyle(storage), "3d");
  assert.equal(writeBattleSpriteStyle(storage, "2d"), true);
  assert.equal(readBattleSpriteStyle(storage), "2d");
  assert.equal(values.get("pokebobo.save.v1"), "carreira");
  values.set(BATTLE_SPRITE_KEY, "quebrado");
  assert.equal(readBattleSpriteStyle(storage), "3d");
  writeBattleSpriteStyle(storage, "3d");
  assert.equal(readBattleSpriteStyle(storage), "3d");
});

test("storage indisponível não impede escolher sprites nesta visita", () => {
  const denied = {
    getItem() {
      throw Error("denied");
    },
    setItem() {
      throw Error("denied");
    },
  };
  assert.equal(readBattleSpriteStyle(denied), "3d");
  assert.equal(writeBattleSpriteStyle(denied, "2d"), false);
});
