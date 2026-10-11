import { useEffect } from "react";

export function useBattleMotion(arenaRef, effect) {
  useEffect(() => {
    if (
      !effect ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const side = effect.side === "player" ? ".ally" : ".enemy";
    const sprite = arenaRef.current?.querySelector(
      `${side} .battle-sprite .sprite`,
    );
    if (!sprite?.animate) return;
    const direction = effect.side === "player" ? 1 : -1;
    const frames = {
      attack: [
        { transform: "translate(0,0)" },
        {
          transform: `translate(${direction * 18}px,${direction * -6}px)`,
          offset: 0.45,
        },
        { transform: "translate(0,0)" },
      ],
      cast: [
        { transform: "translateY(0)" },
        { transform: "translateY(-3px)", offset: 0.45 },
        { transform: "translateY(0)" },
      ],
      hit: [
        { transform: "translateX(0)", opacity: 1 },
        {
          transform: `translateX(${direction * -6}px)`,
          opacity: 0.6,
          offset: 0.25,
        },
        {
          transform: `translateX(${direction * 4}px)`,
          opacity: 1,
          offset: 0.55,
        },
        { transform: "translateX(0)", opacity: 1 },
      ],
      faint: [
        { opacity: 1, transform: "translateY(0)" },
        { opacity: 0, transform: "translateY(18px)" },
      ],
      switch: [
        { opacity: 0.2, transform: "translateY(7px)" },
        { opacity: 1, transform: "translateY(0)" },
      ],
    }[effect.type];
    if (!frames) return;
    const animation = sprite.animate(frames, {
      duration: effect.duration * 0.9,
      easing: "cubic-bezier(.2,.8,.2,1)",
      fill: effect.type === "faint" ? "forwards" : "none",
    });
    return () => animation.cancel();
  }, [effect, arenaRef]);
}
