import catalog from "../../game/catalog.json" with { type: "json" };
import { cx } from "../../shared/classNames.js";
import { Ball } from "../icons/Ball.jsx";
import { battleSpriteSources, spriteFileId } from "./battleSpriteSources.js";

function localFront(mon, name, shiny) {
  if (shiny)
    return `${import.meta.env.BASE_URL}sprites/shiny/${spriteFileId(name)}.png`;
  return (
    window.POKEBOBO_SPRITES?.[mon.num] ||
    `${import.meta.env.BASE_URL}sprites/${mon.num}.png`
  );
}

function showdownSprite(name, back, shiny) {
  const side = back ? "ani-back" : "ani";
  return `https://play.pokemonshowdown.com/sprites/${side}${shiny ? "-shiny" : ""}/${spriteFileId(name)}.gif`;
}

function pokeApiBack(mon, shiny) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${shiny ? "shiny/" : ""}${mon.num}.png`;
}

function sourcesFor(mon, name, { back, animated, battleStyle, shiny }) {
  const local = localFront(mon, name, shiny);
  if (battleStyle === "2d")
    return [
      ...battleSpriteSources(name, back, import.meta.env.BASE_URL, shiny),
      local,
    ];

  if (back)
    return [
      !shiny && window.POKEBOBO_BACK_SPRITES?.[mon.num],
      showdownSprite(name, true, shiny),
      ...battleSpriteSources(name, true, import.meta.env.BASE_URL, shiny),
      ...(!shiny ? [pokeApiBack(mon, false)] : []),
      local,
    ].filter(Boolean);

  if (animated)
    return [
      showdownSprite(name, false, shiny),
      ...battleSpriteSources(name, false, import.meta.env.BASE_URL, shiny),
      local,
    ];

  return [local];
}

export function Sprite({
  name,
  className = "",
  back = false,
  animated = false,
  battleStyle,
  shiny = false,
  style,
  onLoad,
}) {
  const mon = catalog[name];
  if (!mon) return <Ball size={48} />;

  const sources = sourcesFor(mon, name, { back, animated, battleStyle, shiny });
  return (
    <img
      key={`${name}-${back}-${animated}-${battleStyle}-${shiny}`}
      draggable="false"
      className={cx("sprite", back && "sprite-back", className)}
      src={sources[0]}
      data-source-index="0"
      style={style}
      onLoad={onLoad}
      onError={(event) => {
        const image = event.currentTarget;
        const nextIndex = Number(image.dataset.sourceIndex || 0) + 1;
        if (nextIndex >= sources.length) return;
        image.dataset.sourceIndex = String(nextIndex);
        if (/\/front(?:-shiny)?\//.test(sources[nextIndex]))
          image.alt = `${name}${shiny ? " shiny" : ""}`;
        image.src = sources[nextIndex];
      }}
      data-shiny={shiny || undefined}
      alt={`${name}${shiny ? " shiny" : ""}${back ? " de costas" : ""}`}
    />
  );
}
