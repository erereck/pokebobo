import { useEffect, useRef, useState } from "react";
import { loadPixelImage } from "./pixelAssets.js";

export function usePixelCanvas({
  sources,
  animationKey,
  draw,
  onComplete,
  duration = Infinity,
  skip = false,
}) {
  const canvasRef = useRef(null);
  const callbacks = useRef({ draw, onComplete });
  const [error, setError] = useState("");
  useEffect(() => {
    callbacks.current = { draw, onComplete };
  });
  const sourceKey = sources.join("|");
  useEffect(() => {
    let cancelled = false,
      handle,
      start,
      completed = false;
    setError("");
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
          start ??= now;
          const tick =
            (skip || reduced) && Number.isFinite(duration)
              ? duration
              : Math.min(duration, Math.floor(((now - start) * 60) / 1000));
          callbacks.current.draw(ctx, images, tick);
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
    };
  }, [sourceKey, animationKey, duration, skip]);
  return { canvasRef, error };
}
