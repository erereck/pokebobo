import test from "node:test";
import { drafted } from "./helpers/campaign.js";
import assert from "node:assert/strict";

test("draft gera dez paradas, oito ginásios distintos e opções sem vazamento de tipo", () => {
  const s = drafted();
  assert.equal(s.run.route.length, 10);
  assert.equal(s.run.route.filter((x) => x.kind === "gym").length, 8);
  assert.equal(new Set(s.run.route.map((x) => x.id)).size, 10);
  assert.equal(s.run.party[0].name, "Bulbasaur");
  assert.equal(s.run.phase, "career");
});
