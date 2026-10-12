import { useEffect, useState } from "react";

export function SpriteImage({
  sources, alt, back, className, shiny, style, fallbackStyle, loading, onLoad,
}) {
  const [unavailable, setUnavailable] = useState(!sources.length);
  useEffect(() => {
    if (!unavailable) return;
    const retry = () => setUnavailable(false);
    window.addEventListener("online", retry);
    return () => window.removeEventListener("online", retry);
  }, [unavailable]);
  if (unavailable)
    return (
      <span
        className={`${className} sprite-unavailable`}
        style={{ ...style, visibility: "visible", ...fallbackStyle }}
        role="img"
        aria-label={`Imagem de ${alt} indisponível`}
        title="Imagem indisponível"
      >
        ?
      </span>
    );
  return (
    <img
      draggable="false"
      loading={loading}
      className={className}
      src={sources[0]}
      data-source-index="0"
      style={style}
      onLoad={onLoad}
      onError={(event) => {
        const image = event.currentTarget;
        const nextIndex = Number(image.dataset.sourceIndex || 0) + 1;
        if (nextIndex >= sources.length) {
          setUnavailable(true);
          return;
        }
        image.dataset.sourceIndex = String(nextIndex);
        if (back && !/\/(?:ani-back(?:-shiny)?|back(?:-shiny)?)\//.test(sources[nextIndex]))
          image.alt = alt.replace(/ de costas$/, "");
        image.src = sources[nextIndex];
      }}
      data-shiny={shiny || undefined}
      alt={alt}
    />
  );
}
