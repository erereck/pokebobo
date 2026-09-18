import { Dex } from "@pkmn/sim";
import catalog from "../../game/catalog.json" with { type: "json" };
import { cx } from "../../shared/classNames.js";
import { Ball } from "../icons/Ball.jsx";

function spriteFileId(name) {
  const species = Dex.species.get(name);
  if (!species?.exists)
    return name.toLowerCase().replace(/[^a-z0-9-]/g, "");

  const clean = (value = "") =>
    value.toLowerCase().replace(/[^a-z0-9]/g, "");
  const base = clean(species.baseSpecies || species.name);
  const forme = clean(species.forme);
  return forme ? `${base}-${forme}` : base;
}

function frontSprite(mon) {
  return (
    window.POKEBOBO_SPRITES?.[mon.num] ||
    `${import.meta.env.BASE_URL}sprites/${mon.num}.png`
  );
}

function backSprite(mon, name) {
  return (
    window.POKEBOBO_BACK_SPRITES?.[mon.num] ||
    `https://play.pokemonshowdown.com/sprites/gen5ani-back/${spriteFileId(name)}.gif`
  );
}

export function Sprite({ name, className = "", back = false }) {
  const mon = catalog[name];
  if (!mon) return <Ball size={48} />;

  const fallback = frontSprite(mon);
  return (
    <img
      draggable="false"
      className={cx("sprite", back && "sprite-back", className)}
      src={back ? backSprite(mon, name) : fallback}
      onError={
        back
          ? (event) => {
              const image = event.currentTarget;
              if (image.dataset.backFallback === "1") return;
              image.dataset.backFallback = "1";
              image.src = fallback;
            }
          : undefined
      }
      alt={back ? `${name} de costas` : name}
    />
  );
}
