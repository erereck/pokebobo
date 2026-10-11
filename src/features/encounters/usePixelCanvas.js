import { useEffect, useRef, useState } from "react";
import { loadPixelImage } from "./pixelAssets.js";

export function usePixelCanvas({
  sources,
  animationKey,
  draw,
  onComplete,
  onFrame,
  duration = Infinity,
  skip = false,
}) {
  const canvasRef = useRef(null);
  const callbacks = useRef({ draw, onComplete, onFrame });
  const surface = useRef(null);
  const [error, setError] = useState("");
  useEffect(() => {
    callbacks.current = { draw, onComplete, onFrame };
    const frame = surface.current;
    if (frame?.key === `${animationKey}|${sources.join("|")}`)
      draw(frame.ctx, frame.images, frame.tick);
  });
  const sourceKey = sources.join("|");
  useEffect(() => {
    let cancelled = false,
      handle,
      previous,
      elapsed = 0,
      completed = false;
    setError("");
    surface.current = null;
    const visibility = () => {
      previous = undefined;
    };
    document.addEventListener("visibilitychange", visibility);
    Promise.all(sourceKey.split("|").map(loadPixelImage))
      .then((images) => {
        if (cancelled) return;
        const ctx = canvasRef.current?.getContext("2d");
        if (!ctx) return;
        ctx.imageSmoothingEnabled = false;
        const reduced = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;
        const render = (now) => {
          if (cancelled) return;
          if (!document.hidden)
            elapsed += previous == null ? 0 : Math.min(50, now - previous);
          previous = now;
          const tick =
            (skip || reduced) && Number.isFinite(duration)
              ? duration
              : Math.min(duration, Math.floor((elapsed * 60) / 1000));
          surface.current = {
            key: `${animationKey}|${sourceKey}`,
            ctx,
            images,
            tick,
          };
          callbacks.current.draw(ctx, images, tick);
          callbacks.current.onFrame?.(tick, skip || reduced);
          if (tick >= duration && !completed) {
            completed = true;
            callbacks.current.onComplete?.();
          }
          if (tick < duration) handle = requestAnimationFrame(render);
        };
        handle = requestAnimationFrame(render);
      })
      .catch((reason) => {
        if (!cancelled) {
          setError(reason.message);
          callbacks.current.onComplete?.();
        }
      });
    return () => {
      cancelled = true;
      cancelAnimationFrame(handle);
      surface.current = null;
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [sourceKey, animationKey, duration, skip]);
  return { canvasRef, error };
}
