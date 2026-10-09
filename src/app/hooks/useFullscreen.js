import { useEffect, useState } from "react";

export function useFullscreen() {
  const [active, setActive] = useState(() =>
    Boolean(document.fullscreenElement),
  );
  const [error, setError] = useState("");
  const supported = Boolean(
    document.fullscreenEnabled && document.documentElement.requestFullscreen,
  );
  useEffect(() => {
    const change = () => {
      setActive(Boolean(document.fullscreenElement));
      setError("");
    };
    document.addEventListener("fullscreenchange", change);
    return () => document.removeEventListener("fullscreenchange", change);
  }, []);
  const toggle = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
      setError("");
    } catch {
      setError(
        "O navegador não permitiu tela cheia. Tente novamente pelo botão.",
      );
    }
  };
  return { active, supported, error, toggle };
}
