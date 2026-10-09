import { fieldAsset } from "./pixelAssets.js";
import { usePixelCanvas } from "./usePixelCanvas.js";
import { pixelText } from "./pixelText.js";

export function BitmapLabel({ text }) {
  const { canvasRef, error } = usePixelCanvas({
    sources: [fieldAsset("font_dark")],
    animationKey: text,
    duration: 0,
    draw: (ctx, [font]) => {
      ctx.clearRect(0, 0, 104, 16);
      pixelText(ctx, font, text, 0, 0, 104);
    },
  });
  return (
    <>
      <canvas
        ref={canvasRef}
        width={104}
        height={16}
        className="bitmap-label"
        aria-hidden="true"
      />
      {error && <span>{text}</span>}
    </>
  );
}
