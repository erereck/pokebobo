import { aiChoice } from "./ai.js";

// Hidden trapping abilities are revealed by a rejected switch. React to that
// public feedback, instead of inspecting the opponent's hidden ability.
export function submitAiChoice(
  battle,
  sideId = "p2",
  choice = aiChoice(battle, sideId),
) {
  if (!choice) return undefined;
  if (battle.choose(sideId, choice)) return choice;
  const side = battle[sideId];
  if (
    choice.startsWith("switch ") &&
    side.activeRequest?.active?.[0]?.trapped
  ) {
    const fallback = aiChoice(battle, sideId);
    if (fallback?.startsWith("move ") && battle.choose(sideId, fallback))
      return fallback;
  }
  throw Error(
    `A IA não conseguiu resolver o turno: ${side.choice.error || choice}`,
  );
}
