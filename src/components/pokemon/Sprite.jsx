import catalog from "../../game/catalog.json" with { type: "json" };
import { cx } from "../../shared/classNames.js";
import { Ball } from "../icons/Ball.jsx";

export function Sprite({ name, className = "" }) {
  const mon = catalog[name];
  return mon ? (
    <img
      draggable="false"
      className={cx("sprite", className)}
      src={
        window.POKEBOBO_SPRITES?.[mon.num] ||
        `${import.meta.env.BASE_URL}sprites/${mon.num}.png`
      }
      alt={name}
    />
  ) : (
    <Ball size={48} />
  );
}
