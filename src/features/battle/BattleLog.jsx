import { BookOpen } from "lucide-react";

export function BattleLog({ snap }) {
  return (
    <details className="battle-log">
      <summary>
        <BookOpen size={15} />
        Registro da batalha
      </summary>
      <div>
        {snap.log.map((l, i) => (
          <p key={i}>{l}</p>
        ))}
      </div>
    </details>
  );
}
