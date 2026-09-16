import { Compass, Users, Map, Backpack, BookOpen, Swords } from "lucide-react";
export function GameNavigation({ tab, setTab, run }) {
  const battle = run.phase === "battle";
  return (
    <nav className="game-navigation" aria-label="Navegação principal">
      {[
        ["journey", battle ? Swords : Compass, battle ? "Batalha" : "Jornada"],
        ["team", Users, "Equipe"],
        ["region", Map, "Mapa"],
        ["bag", Backpack, "Mochila"],
        ["journal", BookOpen, "Diário"],
      ].map(([id, Icon, label]) => (
        <button
          key={id}
          aria-current={tab === id ? "page" : undefined}
          className={tab === id ? "active" : ""}
          onClick={() => setTab(id)}
        >
          <Icon size={21} />
          <span>{label}</span>
          {id === "journey" && battle && (
            <i className="battle-led" aria-hidden="true" />
          )}
        </button>
      ))}
    </nav>
  );
}
