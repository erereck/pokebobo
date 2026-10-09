import { EXPLORATION_RULES } from "../../game/config/exploration.js";
import { terrainAt, isTallGrass } from "../../game/world/exploration.js";
import { fieldAsset } from "./pixelAssets.js";
import { usePixelCanvas } from "./usePixelCanvas.js";

export function FieldCanvas({ exploration: e, act }) {
  const { canvasRef, error } = usePixelCanvas({
    sources: [
      "terrain",
      "red_normal_sheet",
      "red_surf_sheet",
      "tall_grass",
    ].map(fieldAsset),
    animationKey: `${e.steps || 0}-${!!e.walk}`,
    duration: e.walk ? 16 : 50,
    onComplete: e.walk
      ? () => act({ type: "ROUTE_STEP_COMPLETE", id: e.walk.id })
      : undefined,
    draw: (ctx, [tiles, trainer, surf, grass], tick) => {
      const { width, height } = EXPLORATION_RULES;
      ctx.clearRect(0, 0, width * 16, height * 16);
      for (let y = 0; y < height; y++)
        for (let x = 0; x < width; x++) {
          const terrain = terrainAt(x, y);
          const tile =
            terrain === "water"
              ? 3
              : terrain === "path"
                ? 2
                : isTallGrass(e, x, y)
                  ? 1
                  : 0;
          ctx.drawImage(tiles, tile * 16, 0, 16, 16, x * 16, y * 16, 16, 16);
          if (
            terrain === "grass" &&
            !isTallGrass(e, x, y) &&
            ((x === 0 && y % 3 === 0) || (y === 0 && x % 3 === 0))
          )
            ctx.drawImage(tiles, 64, 0, 16, 16, x * 16, y * 16, 16, 16);
        }
      const progress = e.walk ? Math.min(16, tick) : 16;
      const x = e.walk
        ? e.walk.fromX * 16 + (e.x - e.walk.fromX) * progress
        : e.x * 16;
      const y = e.walk
        ? e.walk.fromY * 16 + (e.y - e.walk.fromY) * progress
        : e.y * 16;
      const facing = e.facing || "south";
      const idle = facing === "south" ? 0 : facing === "north" ? 1 : 2;
      const steps =
        facing === "south" ? [3, 4] : facing === "north" ? [5, 6] : [7, 8];
      const frame = e.walk && tick < 8 ? steps[(e.steps - 1) % 2] : idle;
      ctx.save();
      ctx.translate(x + 8, y + 16);
      if (facing === "east") ctx.scale(-1, 1);
      const sheet = e.surfing ? surf : trainer,
        w = e.surfing ? 32 : 16;
      ctx.drawImage(sheet, frame * w, 0, w, 32, -w / 2, -32, w, 32);
      ctx.restore();
      // O mato original cobre os pés; anima apenas a casa atravessada.
      if (isTallGrass(e, e.x, e.y)) {
        const elapsed = e.walk ? tick : tick + 16;
        const fx =
          e.steps && elapsed < 50
            ? Math.min(4, Math.floor(elapsed / 10)) + 1
            : 0;
        const frameIndex = fx === 5 ? 0 : fx;
        ctx.drawImage(
          grass,
          0,
          frameIndex * 16,
          16,
          16,
          e.x * 16,
          e.y * 16,
          16,
          16,
        );
      }
    },
  });
  return (
    <>
      <canvas
        className="field-canvas"
        width={192}
        height={128}
        ref={canvasRef}
        aria-hidden="true"
      />
      {error && (
        <p className="pixel-error" role="alert">
          {error}
        </p>
      )}
    </>
  );
}
