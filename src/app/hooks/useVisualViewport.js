import { useEffect } from "react";

export function useVisualViewport() {
  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return;
    const style = document.documentElement.style;
    let frame;
    let previousHeight = window.innerHeight;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        // O gesto de zoom conserva o viewport nativo, sem redimensionar a UI.
        if (Math.abs(viewport.scale - 1) > 0.01) {
          style.removeProperty("--visible-height");
          style.removeProperty("--visible-top");
          return;
        }
        const height = Math.min(window.innerHeight, viewport.height);
        const shrinking = height < previousHeight - 1;
        previousHeight = height;
        style.setProperty("--visible-height", `${height}px`);
        style.setProperty("--visible-top", `${Math.max(0, viewport.offsetTop)}px`);
        const focused = document.activeElement;
        if (shrinking && height < window.innerHeight - 80 &&
            focused instanceof HTMLElement && focused.matches("input, textarea, select"))
          focused.scrollIntoView({ block: "nearest", inline: "nearest" });
      });
    };
    update();
    viewport.addEventListener("resize", update);
    viewport.addEventListener("scroll", update);
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      viewport.removeEventListener("resize", update);
      viewport.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      style.removeProperty("--visible-height");
      style.removeProperty("--visible-top");
    };
  }, []);
}
