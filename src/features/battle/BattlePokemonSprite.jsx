import { useLayoutEffect, useRef, useState } from "react";
import { Sprite } from "../../components/pokemon/Sprite.jsx";
import { battleSpriteLayout } from "../../components/pokemon/battleSpriteLayout.js";

export function BattlePokemonSprite({
  mon,
  back = false,
  spriteStyle,
  visible = true,
}) {
  const container = useRef(null);
  const [box, setBox] = useState(null);
  const [image, setImage] = useState(null);
  useLayoutEffect(() => {
    const element = container.current;
    const update = () => {
      const { width, height } = element.getBoundingClientRect();
      const limit =
        parseFloat(
          getComputedStyle(element).getPropertyValue("--battle-sprite-limit"),
        ) || 160;
      setBox((previous) =>
        previous?.width === width &&
        previous?.height === height &&
        previous?.limit === limit
          ? previous
          : { width, height, limit },
      );
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    window.addEventListener("resize", update);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);
  const layout =
    box && image
      ? battleSpriteLayout({ name: mon.name, back, ...box, ...image })
      : null;
  const { visibleWidth, visibleHeight, geometryKey, ...position } =
    layout || {};
  return (
    <div
      className="battle-sprite"
      ref={container}
      data-visible-width={visibleWidth}
      data-visible-height={visibleHeight}
      data-geometry={geometryKey}
    >
      {visible && (
        <Sprite
          name={mon.name}
          shiny={mon.shiny}
          back={back}
          animated
          battleStyle={spriteStyle}
          style={{ ...position, visibility: layout ? "visible" : "hidden" }}
          onLoad={(event) => {
            const element = event.currentTarget;
            setImage({
              source: element.currentSrc || element.src,
              naturalWidth: element.naturalWidth,
              naturalHeight: element.naturalHeight,
            });
          }}
        />
      )}
    </div>
  );
}
