import { fieldAsset } from "./pixelAssets.js";
import { usePixelCanvas } from "./usePixelCanvas.js";
import { drawField } from "./drawField.js";
import { useAnimationAudio } from "../audio/useAnimationAudio.js";
import { isTallGrass } from "../../game/world/exploration.js";
import { LAKE_DURATION } from "./lakePresentation.js";

export function FieldCanvas({
  exploration: e,
  act,
  preparation,
  onPrepared,
  passage,
}) {
  const onAudioFrame = useAnimationAudio(
    `field-${e.steps}-${!!e.walk}-${preparation || "walk"}`,
    preparation
      ? [
          { tick: preparation === "fish" ? 12 : 8, sound: "water" },
          ...(preparation === "fish" ? [{ tick: 40, sound: "open" }] : []),
        ]
      : e.walk
        ? [
            {
              tick: 8,
              sound: e.surfing
                ? "water"
                : isTallGrass(e, e.x, e.y)
                  ? "grass"
                  : "step",
            },
          ]
        : [],
  );
  const { canvasRef, error } = usePixelCanvas({
    sources: [
      "terrain",
      "red_normal_sheet",
      "red_surf_sheet",
      "tall_grass",
      ...(preparation === "fish" ? ["red_fish_sheet"] : []),
    ].map(fieldAsset),
    animationKey: `${e.steps || 0}-${!!e.walk}-${preparation || "walk"}`,
    duration: preparation ? LAKE_DURATION[preparation] : e.walk ? 16 : 50,
    onFrame: onAudioFrame,
    onComplete: preparation
      ? onPrepared
      : e.walk
        ? () => act({ type: "ROUTE_STEP_COMPLETE", id: e.walk.id })
        : undefined,
    draw: (ctx, images, tick) =>
      drawField(ctx, images, e, tick, preparation, passage),
  });
  return (
    <>
      <canvas
        className="field-canvas"
        width={192}
        height={144}
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
