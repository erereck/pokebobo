import { FIELD_LAYOUTS } from "../data/fieldLayouts.js";
export const fieldLayout = (id) =>
  Object.hasOwn(FIELD_LAYOUTS, id) ? FIELD_LAYOUTS[id] : null;

// O campo não consome RNG de encontros/capturas e permanece igual ao voltar.
export function routeLayoutId(run) {
  const text = `${run.seed}|${run.currentRoute?.id || run.routeName || ""}`;
  let hash = 2166136261;
  for (const char of text)
    hash = Math.imul(hash ^ char.charCodeAt(0), 16777619);
  const ids = Object.keys(FIELD_LAYOUTS);
  return ids[(hash >>> 0) % ids.length];
}
