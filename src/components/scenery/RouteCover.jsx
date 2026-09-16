import { useState } from "react";
import { Landscape } from "./Landscape.jsx";
import { coverFor } from "../../game/data/routeCovers.js";

export function RouteCover({ place, cover: override }) {
  const cover = override || coverFor(place),
    [failed, setFailed] = useState(null);
  if (!cover || failed === cover.file)
    return <Landscape biome={place?.biome || "meadow"} />;
  const href = window.POKEBOBO_COVERS?.[cover.file] || `./covers/${cover.file}`;
  return (
    <svg
      className="landscape route-cover"
      viewBox={cover.crop.join(" ")}
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={`Paisagem de referência: ${cover.name}, Pokémon Emerald`}
    >
      <title>
        {cover.name} · extração: {cover.credit} · paisagem de referência
      </title>
      <image
        href={href}
        width={cover.width}
        height={cover.height}
        onError={() => setFailed(cover.file)}
      />
    </svg>
  );
}
