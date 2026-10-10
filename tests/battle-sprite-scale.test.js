import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import geometry from "../src/components/pokemon/spriteGeometry.json" with { type: "json" };
import profiles from "../src/components/pokemon/battleSpeciesScale.json" with { type: "json" };
import sprites from "../src/game/data/battleSprites.json" with { type: "json" };
import catalog from "../src/game/catalog.json" with { type: "json" };
import { spriteFileId } from "../src/components/pokemon/battleSpriteSources.js";
import {
  battleSpriteLayout,
  spriteGeometryKey,
} from "../src/components/pokemon/battleSpriteLayout.js";

function source(name, style, back, shiny = false) {
  const id = spriteFileId(name);
  return style === "2d"
    ? "/pokebobo/battle-sprites/" +
        sprites[id][
          shiny ? (back ? "shinyBack" : "shinyFront") : back ? "back" : "front"
        ]
    : "https://play.pokemonshowdown.com/sprites/ani" +
        (back ? "-back" : "") +
        (shiny ? "-shiny" : "") +
        "/" +
        id +
        ".gif";
}
function layout(
  name,
  style,
  back,
  shiny = false,
  box = { width: 144, height: 180, limit: 140 },
) {
  return battleSpriteLayout({
    name,
    source: source(name, style, back, shiny),
    back,
    ...box,
  });
}

test("Pidgey e pequenos têm menos de metade da altura visível de Charizard nos dois estilos/lados", () => {
  for (const style of ["2d", "3d"])
    for (const back of [false, true])
      for (const shiny of [false, true]) {
        const small = layout("Pidgey", style, back, shiny),
          big = layout("Charizard", style, back, shiny);
        assert.ok(
          small.visibleHeight < big.visibleHeight * 0.5,
          `${style}/${back}`,
        );
        assert.ok(small.visibleHeight >= 16);
        assert.ok(
          layout("Pidgeotto", style, back, shiny).visibleHeight >
            small.visibleHeight,
        );
        assert.ok(
          layout("Pidgeot", style, back, shiny).visibleHeight >
            layout("Pidgeotto", style, back, shiny).visibleHeight,
        );
      }
});

test("todo catálogo tem perfil e limites medidos; corpos cabem sem distorção em visores curtos ou largos", () => {
  for (const name of Object.keys(catalog)) {
    assert.ok(profiles[spriteFileId(name)], name);
    for (const style of ["2d", "3d"])
      for (const back of [false, true])
        for (const shiny of [false, true])
          for (const box of [
            { width: 64, height: 54, limit: 84 },
            { width: 144, height: 180, limit: 140 },
            { width: 280, height: 240, limit: 160 },
          ]) {
            const src = source(name, style, back, shiny),
              g = geometry[spriteGeometryKey(src)];
            assert.ok(g, src);
            const result = layout(name, style, back, shiny, box),
              [w, h] = g.size,
              [x, y, r, b] = g.bounds;
            assert.ok(result.visibleWidth <= box.width * 0.9 + 0.001, name);
            assert.ok(result.visibleHeight <= box.height * 0.81 + 0.001, name);
            assert.ok(
              Math.abs(result.width / result.height - w / h) < 1e-9,
              name,
            );
            const scale = result.width / w,
              visibleLeft = result.left + x * scale,
              visibleBottom = result.bottom + (h - b) * scale,
              visibleTop = box.height - visibleBottom - result.visibleHeight;
            assert.ok(
              visibleLeft >= -0.001 &&
                visibleLeft + result.visibleWidth <= box.width + 0.001,
              name,
            );
            assert.ok(visibleTop >= -0.001, name);
            assert.ok(visibleBottom >= box.height * 0.17 - 0.001, name);
          }
  }
});

test("cor normal/shiny conserva tamanho visual e margem transparente não muda o apoio", () => {
  for (const name of [
    "Pidgey",
    "Pikachu",
    "Charizard",
    "Onix",
    "Wailord",
    "Raichu-Alola",
  ])
    for (const style of ["2d", "3d"])
      for (const back of [false, true]) {
        const a = layout(name, style, back),
          b = layout(name, style, back, true);
        assert.ok(Math.abs(a.visibleHeight - b.visibleHeight) < 1, name);
      }
  const result = battleSpriteLayout({
    name: "Pidgey",
    source: "desconhecido",
    naturalWidth: 96,
    naturalHeight: 96,
    width: 144,
    height: 180,
  });
  assert.ok(result);
  assert.equal(result.width, result.height);
  assert.equal(
    battleSpriteLayout({
      name: "Pidgey",
      source: "",
      naturalWidth: 0,
      naturalHeight: 0,
      width: 0,
      height: 0,
    }),
    null,
  );
});

test("geometria resolve fonte efetiva de fallback e prefixo de Pages", () => {
  const changed = battleSpriteLayout({
    name: "Pidgey",
    source: source("Pidgey", "3d", true),
    back: true,
    naturalWidth: 200,
    naturalHeight: 100,
    width: 144,
    height: 180,
  });
  assert.equal(
    changed.width / changed.height,
    2,
    "fonte externa com novas dimensões usa a proporção efetiva",
  );
  assert.equal(
    spriteGeometryKey("/pokebobo/battle-sprites/back/pidgey.gif?x=1"),
    "battle-sprites/back/pidgey.gif",
  );
  assert.equal(
    spriteGeometryKey(
      "https://play.pokemonshowdown.com/sprites/ani-back/pidgey.gif",
    ),
    "sprites/ani-back/pidgey.gif",
  );
  const a = battleSpriteLayout({
    name: "Pidgey",
    source: source("Pidgey", "3d", true),
    back: true,
    width: 144,
    height: 180,
  });
  const b = battleSpriteLayout({
    name: "Pidgey",
    source: source("Pidgey", "2d", false),
    back: true,
    width: 144,
    height: 180,
  });
  assert.notEqual(a.geometryKey, b.geometryKey);
  assert.ok(b.visibleHeight < a.visibleHeight * 1.3);
});

test("geometria congelada inclui todos os quadros e cobre a animação inteira", async () => {
  const report = JSON.parse(
    await readFile(
      new URL("../docs/balance/sprite-geometry-0.16.0.json", import.meta.url),
    ),
  );
  const data = await readFile(
    new URL("../src/components/pokemon/spriteGeometry.json", import.meta.url),
  );
  const digest = (text) =>
    createHash("sha256")
      .update(text.replace(/\r\n/g, "\n"), "utf8")
      .digest("hex");
  assert.equal(report.sourceEncoding, "utf8-lf");
  assert.equal(digest(data.toString("utf8")), report.sourceSha256);
  assert.equal(
    digest(data.toString("utf8").replace(/\r?\n/g, "\r\n")),
    report.sourceSha256,
    "checkout Windows e Linux conservam a assinatura textual",
  );
  assert.equal(Object.keys(geometry).length, report.files);
  for (const source of report.sources) {
    const g = geometry[source.file],
      [x, y, r, b] = g.bounds;
    assert.ok(g.frames >= 1);
    assert.ok(x >= 0 && y >= 0 && r <= g.size[0] && b <= g.size[1]);
    for (const frame of [source.first, source.last])
      assert.ok(
        frame[0] >= x && frame[1] >= y && frame[2] <= r && frame[3] <= b,
      );
  }
  assert.ok(report.frames > 200000);
});
