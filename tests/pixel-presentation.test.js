import test from "node:test";
import assert from "node:assert/strict";
import { captureTimeline } from "../src/features/encounters/captureTimeline.js";
import {
  fieldPose,
  grassUnderFeet,
} from "../src/features/encounters/fieldPresentation.js";
import { pixelLines, textWidth } from "../src/features/encounters/pixelText.js";
import metrics from "../src/features/encounters/font-metrics.json" with { type: "json" };

test("abertura, absorção e fechamento mantêm a bola no impacto sem alias entre quadros", () => {
  for (const monY of [40, 41, 53, 56, 65]) {
    for (const success of [true, false]) {
      const { frames } = captureTimeline({ success, shakes: 3 }, monY);
      for (let tick = 53; tick <= 102; tick++) {
        assert.equal(frames[tick].ball.x, 176, `x no tick ${tick}`);
        assert.equal(frames[tick].ball.y, monY - 16, `y no tick ${tick}`);
        if (tick > 53)
          assert.notEqual(frames[tick].ball, frames[tick - 1].ball);
      }
      // Queda contínua: nenhum quadro salta diretamente do impacto para o chão.
      const falling = frames.slice(102).filter((f) => f.stage === "bounce");
      for (let i = 1; i < falling.length; i++)
        assert.ok(Math.abs(falling[i].ball.y - falling[i - 1].ball.y) <= 8);
      const previousY = frames[64].ball.y;
      frames[65].ball.y = 999;
      assert.equal(frames[64].ball.y, previousY);
    }
  }
});

test("mato acompanha os pés nas quatro direções sem pintar a casa vizinha antecipadamente", () => {
  const base = { x: 3, y: 3, spots: [{ y: 1 }] };
  for (const [dx, dy] of [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ]) {
    const e = {
      ...base,
      x: base.x + dx,
      y: base.y + dy,
      walk: { fromX: base.x, fromY: base.y },
    };
    const start = fieldPose(e, 0),
      end = fieldPose(e, 16);
    assert.deepEqual(start, { x: 48, y: 48 });
    assert.deepEqual(end, { x: e.x * 16, y: e.y * 16 });
    assert.deepEqual(grassUnderFeet(e, start).tiles, [{ x: 3, y: 3 }]);
    for (let tick = 0; tick <= 16; tick++) {
      const { clip, tiles } = grassUnderFeet(e, fieldPose(e, tick));
      assert.equal(clip.width, 12);
      assert.equal(clip.height, 9);
      for (const tile of tiles) {
        assert.ok(
          tile.x * 16 < clip.x + clip.width && (tile.x + 1) * 16 > clip.x,
        );
        assert.ok(
          tile.y * 16 < clip.y + clip.height && (tile.y + 1) * 16 > clip.y,
        );
      }
    }
  }
});

test("texto de captura respeita palavras, duas linhas e o limite da caixa de HP", () => {
  assert.deepEqual(pixelLines("O que você\nvai fazer?", 80), [
    "O que você",
    "vai fazer?",
  ]);
  const width = textWidth("Um Pokémon");
  const wrapped = pixelLines("Um Pokémon selvagem apareceu", width);
  assert.equal(wrapped[0], "Um Pokémon");
  assert.equal(wrapped.length, 2);
  assert.ok(wrapped[1].endsWith("..."));
  assert.ok(wrapped.every((line) => textWidth(line) <= width));
  for (const name of ["CORVIKNIGHT", "CHARIZARD", "MEOWSCARADA", "WO-CHIEN"]) {
    const lines = pixelLines(name, 60, 1);
    assert.equal(lines.length, 1);
    assert.ok(textWidth(lines[0]) <= 60);
  }
  for (const char of "ãõÃÕ") assert.ok(Number.isInteger(metrics.chars[char]));
});
