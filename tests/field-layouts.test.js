import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { FIELD_LAYOUTS } from "../src/game/data/fieldLayouts.js";
import { routeLayoutId } from "../src/game/world/fieldLayout.js";
import {
  terrainAt,
  isTallGrass,
  lakeDirection,
} from "../src/game/world/exploration.js";
import { fishingPose } from "../src/features/encounters/lakePresentation.js";
import { drafted } from "./helpers/campaign.js";
import { reducer } from "../src/game/state/reducer.js";
import { parseSaveBackup } from "../src/game/persistence/importSave.js";

test("campos têm trilhas/mato acessíveis, lago conectado e margem alcançável sem Surf", () => {
  const drawings = new Set();
  for (const [layoutId, rows] of Object.entries(FIELD_LAYOUTS)) {
    assert.equal(rows.length, 8);
    assert.ok(rows.every((row) => row.length === 12 && /^[.PTW]+$/.test(row)));
    drawings.add(rows.join(""));
    const e = { layoutId },
      visited = new Set(["1,6"]),
      queue = [[1, 6]];
    while (queue.length) {
      const [x, y] = queue.shift();
      for (const [dx, dy] of [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ]) {
        const a = x + dx,
          b = y + dy,
          key = `${a},${b}`;
        if (
          a >= 0 &&
          a < 12 &&
          b >= 0 &&
          b < 8 &&
          !visited.has(key) &&
          terrainAt(a, b, e) !== "water"
        ) {
          visited.add(key);
          queue.push([a, b]);
        }
      }
    }
    let grass = 0,
      shore = 0;
    for (let y = 0; y < 8; y++)
      for (let x = 0; x < 12; x++) {
        if (terrainAt(x, y, e) !== "water")
          assert.ok(visited.has(`${x},${y}`), `${layoutId} ${x},${y}`);
        if (isTallGrass(e, x, y)) grass++;
        if (lakeDirection({ ...e, x, y })) shore++;
      }
    assert.ok(grass >= 20);
    assert.ok(shore >= 4);
    assert.equal(terrainAt(1, 6, e), "path");
    assert.equal(terrainAt(9, 3, e), "water");
  }
  assert.equal(drawings.size, 4);
});

test("layout é estável por seed/rota, não consulta RNG e save antigo mantém seu campo", () => {
  const ids = new Set();
  for (let seed = 1; seed <= 100; seed++) {
    const r = { seed, rng: 12345, currentRoute: { id: "pallet--sandgem" } },
      before = structuredClone(r);
    const id = routeLayoutId(r);
    ids.add(id);
    assert.equal(routeLayoutId(r), id);
    assert.deepEqual(r, before);
  }
  assert.equal(ids.size, 4);
  const state = reducer(drafted(1234), { type: "EXPLORE" });
  assert.equal(
    parseSaveBackup(JSON.stringify(state)).run.exploration.layoutId,
    state.run.exploration.layoutId,
  );
  delete state.run.exploration.layoutId;
  const restored = parseSaveBackup(JSON.stringify(state));
  assert.equal(restored.run.exploration.layoutId, undefined);
  assert.equal(terrainAt(9, 1, restored.run.exploration), "water");
  assert.equal(
    isTallGrass({ ...restored.run.exploration, spots: [{ y: 1 }] }, 3, 3),
    true,
  );
  state.run.exploration.layoutId = "constructor";
  assert.throws(() => parseSaveBackup(JSON.stringify(state)), /inválidos/);
});

test("vara conserva offsets/duração dos quadros de lançamento originais e bytes da folha", () => {
  assert.deepEqual(
    [0, 4, 8, 12].map((t) => fishingPose("west", t).frame),
    [0, 1, 2, 3],
  );
  assert.deepEqual(
    [0, 4, 8, 12].map((t) => fishingPose("north", t).frame),
    [4, 5, 6, 7],
  );
  assert.deepEqual(
    [0, 4, 8, 12].map((t) => fishingPose("south", t).frame),
    [8, 9, 10, 11],
  );
  assert.equal(fishingPose("west", 12).offsetX, -8);
  assert.equal(fishingPose("east", 12).offsetX, 8);
  assert.equal(fishingPose("north", 4).offsetY, -8);
  assert.equal(fishingPose("south", 12).offsetY, 8);
  const manifest = JSON.parse(
    readFileSync(
      new URL("../public/field/fishing-manifest.json", import.meta.url),
    ),
  );
  const bytes = readFileSync(
    new URL("../public/field/red_fish_sheet.png", import.meta.url),
  );
  assert.equal(
    createHash("sha256").update(bytes).digest("hex"),
    manifest.sha256,
  );
  assert.equal(bytes.readUInt32BE(16), 384);
  assert.equal(bytes.readUInt32BE(20), 32);
});
