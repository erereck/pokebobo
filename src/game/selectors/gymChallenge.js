import { PROGRESSION } from "../config/progression.js";

export function gymChallenge(run, gym = run.route[run.position]) {
  const strongestPlayer = Math.max(1, ...run.party.map((mon) => mon.level));
  const originalAce = Math.max(...gym.levels);
  const boost =
    strongestPlayer - originalAce >= PROGRESSION.gymCatchupThreshold
      ? PROGRESSION.gymCatchupLevels
      : 0;
  const levels = gym.levels.map((level) =>
    Math.min(PROGRESSION.maxLevel, level + boost),
  );
  return { levels, boost, originalAce, ace: Math.max(...levels) };
}
