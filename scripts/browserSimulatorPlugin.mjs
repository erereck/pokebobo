// O catálogo local já contém os golpes aprendidos. A aplicação usa apenas
// Battle/Dex e não valida equipes nem consulta learnsets do Showdown em runtime.
// Não altera scripts, movimentos, espécies, regras, textos ou o build Node.
export function browserSimulatorPlugin() {
  return {
    name: "pokebobo-compiled-learnsets",
    apply: "build",
    enforce: "pre",
    buildStart() {
      return checkCompiledLearnsets();
    },
    load(id) {
      const path = id.replaceAll("\\", "/");
      if (
        /\/node_modules\/@pkmn\/sim\/build\/esm\/data\/(?:mods\/[^/]+\/)?(?:learnsets|legality)\.mjs$/.test(
          path,
        )
      )
        return "export const Learnsets = {}; export const Legality = {};";
    },
  };
}
import { checkCompiledLearnsets } from "./checkCompiledLearnsets.mjs";
