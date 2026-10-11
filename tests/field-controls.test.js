import test from "node:test";
import assert from "node:assert/strict";
import {
  holdDirection,
  releaseDirection,
} from "../src/features/encounters/heldDirections.js";

test("soltar a última direção retoma a tecla ainda segurada, inclusive misturando toque e teclado", () => {
  const pressed = new Map();
  holdDirection(pressed, "arrowright", [1, 0]);
  holdDirection(pressed, "arrowup", [0, -1]);
  assert.deepEqual(releaseDirection(pressed, "arrowup"), {
    token: "arrowright",
    direction: [1, 0],
  });
  holdDirection(pressed, "pointer-3", [-1, 0]);
  assert.deepEqual(releaseDirection(pressed, "arrowright"), {
    token: "pointer-3",
    direction: [-1, 0],
  });
  holdDirection(pressed, "w", [0, -1]);
  assert.deepEqual(releaseDirection(pressed, "pointer-3"), {
    token: "w",
    direction: [0, -1],
  });
  assert.equal(releaseDirection(pressed, "w"), null);
  assert.equal(pressed.size, 0);
  assert.equal(releaseDirection(pressed, "w"), null);
});
