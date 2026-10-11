import { build } from "vite";
import { mkdtemp, readdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
import { pathToFileURL } from "node:url";
import { browserSimulatorPlugin } from "./browserSimulatorPlugin.mjs";

const tempRoot = path.resolve(tmpdir());
const output = await mkdtemp(path.join(tempRoot, "pokebobo-browser-sim-"));
try {
  await build({
    configFile: false,
    plugins: [browserSimulatorPlugin()],
    logLevel: "warn",
    build: {
      lib: {
        entry: path.resolve("scripts/browserSimulatorEntry.mjs"),
        formats: ["es"],
        fileName: () => "simulator.mjs",
      },
      outDir: output,
      emptyOutDir: false,
      minify: false,
      chunkSizeWarningLimit: 15000,
    },
  });
  const files = (await readdir("tests"))
    .filter(
      (name) => name.endsWith(".test.js") && name !== "move-policy.test.js",
    )
    .map((name) => path.join("tests", name));
  // A política de aprendizado consulta tabelas completas no gerador Node.
  // Ela já roda no npm test normal. Todo o restante roda também no motor
  // empacotado para browser, com a mesma transformação do build publicado.
  const code = await new Promise((resolve, reject) => {
    const child = spawn(
      process.execPath,
      [
        "--experimental-loader",
        pathToFileURL(path.resolve("scripts/browserSimulatorLoader.mjs")).href,
        "--test",
        ...files,
      ],
      {
        stdio: "inherit",
        env: {
          ...process.env,
          POKEBOBO_BROWSER_SIM: path.join(output, "simulator.mjs"),
          NODE_NO_WARNINGS: "1",
        },
      },
    );
    child.on("error", reject);
    child.on("exit", resolve);
  });
  if (code !== 0) process.exitCode = code || 1;
} finally {
  const resolved = path.resolve(output);
  if (
    !resolved.startsWith(tempRoot + path.sep) ||
    !path.basename(resolved).startsWith("pokebobo-browser-sim-")
  )
    throw Error("Pasta temporária fora do limite esperado.");
  await rm(resolved, { recursive: true, force: true });
}
