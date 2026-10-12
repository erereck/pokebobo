import { Flag, Footprints, Trophy } from "lucide-react";

export function VictoryEmblem({ won, kind, badge }) {
  return (
    <div
      className={`result-emblem${won ? " victory-emblem" : " lost"}${won && kind === "gym" ? " is-badge" : ""}`}
      aria-hidden="true"
    >
      {won && Array.from({ length: 8 }, (_, index) => (
        <i
          className="reward-spark"
          key={index}
          style={{ "--spark-angle": `${index * 45}deg` }}
        />
      ))}
      {!won ? <Footprints size={42} /> : kind === "gym" ? (
        <span className="reward-badge"><b>{String(badge).padStart(2, "0")}</b></span>
      ) : kind === "league" ? <Trophy size={42} /> : <Flag size={42} />}
    </div>
  );
}
