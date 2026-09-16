import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { parse } from "@babel/parser";

const root = path.resolve("src"),
  files = [];
async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(file);
    else if (/\.(js|jsx)$/.test(file)) files.push(file);
  }
}
await walk(root);
const graph = new Map(),
  failures = [];
for (const file of files) {
  const code = await readFile(file, "utf8");
  const tree = parse(code, {
    sourceType: "module",
    plugins: ["jsx", "importAttributes"],
  });
  const deps = [];
  for (const node of tree.program.body) {
    if (
      ![
        "ImportDeclaration",
        "ExportNamedDeclaration",
        "ExportAllDeclaration",
      ].includes(node.type) ||
      !node.source
    )
      continue;
    const spec = node.source.value;
    if (!spec.startsWith(".")) continue;
    const target = path.resolve(path.dirname(file), spec);
    try {
      await stat(target);
    } catch {
      failures.push(
        `Import inexistente: ${path.relative(root, file)} → ${spec}`,
      );
      continue;
    }
    if (/\.(js|jsx)$/.test(target)) deps.push(target);
    const relative = path.relative(root, file).replaceAll("\\", "/"),
      destination = path.relative(root, target).replaceAll("\\", "/");
    if (relative.startsWith("game/") && !destination.startsWith("game/"))
      failures.push(`Regra depende de interface: ${relative} → ${destination}`);
    if (
      relative.startsWith("game/data/") &&
      !destination.startsWith("game/data/")
    )
      failures.push(
        `Dados dependem de comportamento: ${relative} → ${destination}`,
      );
  }
  graph.set(file, deps);
}
const complete = new Set(),
  active = new Set();
function visit(file, trail = []) {
  if (active.has(file)) {
    failures.push(
      "Ciclo: " +
        [...trail, file].map((f) => path.relative(root, f)).join(" → "),
    );
    return;
  }
  if (complete.has(file)) return;
  active.add(file);
  for (const dep of graph.get(file) || []) visit(dep, [...trail, file]);
  active.delete(file);
  complete.add(file);
}
for (const file of files) visit(file);
if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else
  console.log(
    `Arquitetura OK: ${files.length} módulos, imports válidos, sem ciclos e sem dependências de UI no motor.`,
  );
