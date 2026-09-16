import { TypeTag } from "../../components/pokemon/TypeTag.jsx";

export function MoveOptions({ available, currentMon, locked, move }) {
  return (
    <div className="moves-grid">
      {available.map((m, i) => {
        const info = currentMon.moves.find((x) => x.id === m.id);
        return (
          <button
            key={m.id}
            className={
              "move-button move-" + (info?.type.toLowerCase() || "normal")
            }
            data-move-index={i + 1}
            disabled={locked || m.disabled || m.pp <= 0}
            onClick={() => move(`move ${i + 1}`)}
          >
            <span>
              <strong>
                <kbd aria-hidden="true">{i + 1}</kbd>
                {m.move}
              </strong>
              <small>
                {m.pp}/{m.maxpp} PP
              </small>
            </span>
            <span>
              {info && <TypeTag type={info.type} />}
              <small>
                {info?.category === "Status"
                  ? "Status"
                  : `Poder ${info?.power || "—"}`}
              </small>
            </span>
          </button>
        );
      })}
    </div>
  );
}
