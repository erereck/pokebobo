import { usePixelCanvas } from "../encounters/usePixelCanvas.js";
import { fieldAsset } from "../encounters/pixelAssets.js";
import { useAnimationAudio } from "../audio/useAnimationAudio.js";
import { drawExpedition } from "./drawExpedition.js";

export function ExpeditionCanvas({ expedition: e, site, act }) {
  const key = `${site.id}-${e.room}-${e.steps}-${!!e.walk}`;
  const onFrame = useAnimationAudio(
    key,
    e.walk ? [{ tick: 8, sound: "step" }] : [],
  );
  const { canvasRef, error } = usePixelCanvas({
    sources: [fieldAsset("red_normal_sheet")],
    animationKey: key,
    duration: e.walk ? 16 : 0,
    onFrame,
    onComplete: e.walk
      ? () => act({ type: "EXPEDITION_STEP_COMPLETE", id: e.walk.id })
      : undefined,
    draw: (ctx, images, tick) => drawExpedition(ctx, images, e, site, tick),
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
