import { useState } from "react";
import { coverFor } from "../../game/data/routeCovers.js";

export function RouteCover({ place, cover: override, loading = "lazy" }) {
  const cover = override || coverFor(place),
    [failed, setFailed] = useState(null);
  if (!cover || failed === cover.file) return null;
  const src = `${import.meta.env.BASE_URL}covers/${cover.file}`;
  return (
    <img
      key={cover.file}
      className={`landscape route-cover${cover.pixelArt ? "" : " route-cover-smooth"}`}
      src={src}
      width={cover.width}
      height={cover.height}
      style={{ objectPosition: cover.position || "50% 50%" }}
      alt={`${cover.name} · ${cover.game}`}
      title={`${cover.name} · ${cover.game}`}
      loading={loading}
      decoding="async"
      draggable={false}
      onError={() => setFailed(cover.file)}
    />
  );
}
