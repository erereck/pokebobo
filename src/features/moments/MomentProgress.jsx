import { useEffect, useRef, useState } from "react";

const DURATION = 4000;

export function MomentProgress({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const complete = useRef(onComplete);
  useEffect(() => { complete.current = onComplete; }, [onComplete]);
  useEffect(() => {
    let elapsed = 0;
    let previous = performance.now();
    let frame;
    let cancelled = false;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const visibility = () => { previous = null; };
    const tick = (now) => {
      if (cancelled) return;
      if (!document.hidden && previous !== null)
        elapsed = Math.min(DURATION, elapsed + Math.max(0, now - previous));
      previous = now;
      const value = (elapsed / DURATION) * 100;
      setProgress(motion.matches ? Math.floor(value / 25) * 25 : value);
      if (elapsed >= DURATION) {
        complete.current();
        return;
      }
      frame = requestAnimationFrame(tick);
    };
    document.addEventListener("visibilitychange", visibility);
    frame = requestAnimationFrame(tick);
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);
  return (
    <div
      className="moment-progress"
      role="progressbar"
      aria-label="Avanço automático da evolução em 4 segundos"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress)}
      title="Avança automaticamente após 4 segundos"
    >
      <span style={{ transform: `scaleX(${progress / 100})` }} />
    </div>
  );
}
