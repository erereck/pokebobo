import { fieldAsset } from "./pixelAssets.js";
import { usePixelCanvas } from "./usePixelCanvas.js";
import { drawField } from "./drawField.js";

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
    draw: (ctx, images, tick) => drawField(ctx, images, e, tick),
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
