import { pathToFileURL } from "node:url";
export function resolve(specifier, context, nextResolve) {
  if (specifier === "@pkmn/sim" && process.env.POKEBOBO_BROWSER_SIM)
    return {
      url: pathToFileURL(process.env.POKEBOBO_BROWSER_SIM).href,
      shortCircuit: true,
    };
  return nextResolve(specifier, context);
}
