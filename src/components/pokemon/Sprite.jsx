import catalog from "../../game/catalog.json" with { type: "json" };
import { cx } from "../../shared/classNames.js";
import { Ball } from "../icons/Ball.jsx";
import { battleSpriteSources, spriteFileId } from "./battleSpriteSources.js";

function localFront(mon) {
  return (
    window.POKEBOBO_SPRITES?.[mon.num] ||
    `${import.meta.env.BASE_URL}sprites/${mon.num}.png`
  );
}

function showdownSprite(name, back) {
  const side = back ? "ani-back" : "ani";
  return `https://play.pokemonshowdown.com/sprites/${side}/${spriteFileId(name)}.gif`;
}

function pokeApiBack(mon) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${mon.num}.png`;
}

function sourcesFor(mon, name, { back, animated, battleStyle }) {
  const local = localFront(mon);
  if (battleStyle === "2d")
    return [
      ...battleSpriteSources(name, back, import.meta.env.BASE_URL),
      local,
    ];

  if (back)
    return [
      window.POKEBOBO_BACK_SPRITES?.[mon.num],
      showdownSprite(name, true),
      pokeApiBack(mon),
      local,
    ].filter(Boolean);

  if (animated) return [showdownSprite(name, false), local];

  return [local];
}

export function Sprite({
  name,
  className = "",
  back = false,
  animated = false,
  battleStyle,
}) {
  const mon = catalog[name];
  if (!mon) return <Ball size={48} />;

  const sources = sourcesFor(mon, name, { back, animated, battleStyle });
  return (
    <img
      key={`${name}-${back}-${animated}-${battleStyle}`}
      draggable="false"
      className={cx("sprite", back && "sprite-back", className)}
      src={sources[0]}
      data-source-index="0"
      onError={(event) => {
        const image = event.currentTarget;
        const nextIndex = Number(image.dataset.sourceIndex || 0) + 1;
        if (nextIndex >= sources.length) return;
        image.dataset.sourceIndex = String(nextIndex);
        if (battleStyle === "2d" && sources[nextIndex].includes("/front/"))
          image.alt = name;
        image.src = sources[nextIndex];
      }}
      alt={back ? `${name} de costas` : name}
    />
  );
}
