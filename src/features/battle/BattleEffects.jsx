import { useEffect, useRef } from "react";
import { drawBattleEffect } from "./visuals/drawBattleEffect.js";
import { effectAnchor } from "./visuals/effectAnchors.js";
import {
  loadedBattleEffects,
  preloadBattleEffects,
} from "./visuals/effectAssets.js";

export function BattleEffects({ effect, arenaRef }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      preloadBattleEffects();
  }, []);
  useEffect(() => {
    const canvas = ref.current,
      arena = arenaRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx || !arena || !effect?.visual) return;
    let frame,
      disposed = false;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motion.matches) return;
    const start = performance.now();
    const images = loadedBattleEffects();
    const draw = (now) => {
      if (disposed) return;
      const box = arena.getBoundingClientRect(),
        scale = Math.min(1, 480 / box.width);
      const width = Math.max(1, Math.round(box.width * scale)),
        height = Math.max(1, Math.round(box.height * scale));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      ctx.clearRect(0, 0, width, height);
      const progress = (now - start) / effect.duration;
      if (progress >= 1 || motion.matches) return;
      if (!document.hidden) {
        const anchors = {};
        for (const [side, selector] of [
          ["player", ".ally"],
          ["enemy", ".enemy"],
        ]) {
          const sprite = arena.querySelector(`${selector} .battle-sprite`);
          if (sprite?.querySelector("img"))
            anchors[side] = effectAnchor(
              sprite.getBoundingClientRect(),
              box,
              sprite.dataset.visibleHeight,
              sprite.dataset.visibleBottom,
              scale,
              sprite.dataset.visibleWidth,
            );
        }
        drawBattleEffect(ctx, effect.visual, progress, anchors, images);
        // HP/nome são sempre legíveis, mesmo quando a trajetória cruza o HUD.
        for (const hud of arena.querySelectorAll(".health-card")) {
          const rect = hud.getBoundingClientRect();
          ctx.clearRect(
            (rect.left - box.left - 3) * scale,
            (rect.top - box.top - 3) * scale,
            (rect.width + 6) * scale,
            (rect.height + 6) * scale,
          );
        }
      }
      frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [effect, arenaRef]);
  return (
    <canvas
      ref={ref}
      className="battle-effects"
      aria-hidden="true"
      data-effect={effect?.visual?.shape || ""}
      data-element={effect?.visual?.type || ""}
    />
  );
}
