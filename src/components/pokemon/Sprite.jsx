import catalog from "../../game/catalog.json" with { type: "json" };
import { cx } from "../../shared/classNames.js";
import { Ball } from "../icons/Ball.jsx";
import { spriteSources } from "./spriteSources.js";
import { SpriteImage } from "./SpriteImage.jsx";

export function Sprite({
  name,
  className = "",
  back = false,
  animated = false,
  battleStyle,
  shiny = false,
  style,
  fallbackStyle,
  onLoad,
  loading,
}) {
  const mon = catalog[name];
  if (!mon) return <Ball size={48} />;

  const sources = spriteSources(name, {
    num: mon.num, baseUrl: import.meta.env.BASE_URL,
    back, animated, battleStyle, shiny,
    embeddedFront: window.POKEBOBO_SPRITES,
    embeddedBack: window.POKEBOBO_BACK_SPRITES,
  });
  return (
    <SpriteImage
      key={`${name}-${back}-${animated}-${battleStyle}-${shiny}`}
      loading={loading}
      className={cx("sprite", back && "sprite-back", className)}
      sources={sources}
      back={back}
      shiny={shiny}
      style={style}
      fallbackStyle={fallbackStyle}
      onLoad={onLoad}
      alt={`${name}${shiny ? " shiny" : ""}${back ? " de costas" : ""}`}
    />
  );
}
