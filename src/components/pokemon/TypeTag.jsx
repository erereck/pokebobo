import { TYPES } from "../../game/data/types.js";

export function TypeTag({ type }) {
  return (
    <span className={`type type-${type.toLowerCase()}`}>
      {TYPES[type] || type}
    </span>
  );
}
