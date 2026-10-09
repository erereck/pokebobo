import { useMemo } from "react";
import catalog from "../../game/catalog.json" with { type: "json" };
import species from "./frlg-species.json" with { type: "json" };
import { fieldAsset, tintedPixelImage } from "./pixelAssets.js";
import { usePixelCanvas } from "./usePixelCanvas.js";
import { pixelText } from "./pixelText.js";
import {
  captureTimeline,
  trainerThrowFrame,
  drawBallParticles,
} from "./captureTimeline.js";

export function CaptureCanvas({
  name,
  level,
  balls,
  water,
  attempt,
  skip,
  onComplete,
}) {
  const num = catalog[name].num;
  const original = species[name];
  const monY = 40 + (original?.offset || 0);
  const timeline = useMemo(
    () => (attempt ? captureTimeline(attempt, monY) : null),
    [attempt, monY],
  );
  const sprite = `${import.meta.env.BASE_URL}sprites/${original ? "frlg/" : ""}${num}.png`;
  const { canvasRef, error } = usePixelCanvas({
    sources: [
      fieldAsset(water ? "capture_water" : "capture_grass"),
      fieldAsset("red_back"),
      fieldAsset("poke_ball"),
      fieldAsset("textbox"),
      fieldAsset("font_dark"),
      fieldAsset("font_light"),
      sprite,
      fieldAsset("ball_particles"),
      fieldAsset("healthbox"),
      fieldAsset("healthbar"),
    ],
    animationKey: attempt?.id || name,
    duration: timeline ? timeline.frames.length - 1 : 120,
    skip,
    onComplete,
    draw: (
      ctx,
      [
        bg,
        trainer,
        ball,
        textbox,
        font,
        whiteFont,
        mon,
        particles,
        healthbox,
        hp,
      ],
      tick,
    ) => {
      ctx.clearRect(0, 0, 240, 160);
      const frame =
        timeline?.frames[Math.min(tick, timeline.frames.length - 1)];
      ctx.drawImage(
        tintedPixelImage(bg, [255, 255, 255], frame?.flash || 0),
        0,
        0,
      );
      const intro = timeline ? 0 : Math.max(0, 240 - tick * 2);
      const [trainerFrame, trainerX] = timeline
        ? trainerThrowFrame(tick)
        : [0, 48];
      ctx.drawImage(
        trainer,
        0,
        trainerFrame * 64,
        64,
        64,
        trainerX + intro,
        48,
        64,
        64,
      );
      if (!frame || frame.monVisible) {
        const scale = frame?.monScale ?? 1;
        ctx.save();
        ctx.translate(176 - intro, Math.round(frame?.monY ?? monY));
        ctx.scale(scale, scale);
        ctx.drawImage(
          tintedPixelImage(mon, [255, 181, 247], frame?.tint || 0),
          -32,
          -32,
          64,
          64,
        );
        ctx.restore();
      }
      if (frame?.particles) drawBallParticles(ctx, particles, frame.particles);
      if (frame?.ball) {
        const b = frame.ball;
        ctx.save();
        ctx.translate(Math.round(b.x), Math.round(b.y));
        ctx.rotate(b.angle || 0);
        ctx.globalAlpha = b.alpha ?? 1;
        ctx.drawImage(
          tintedPixelImage(ball, [0, 0, 0], b.dark || 0),
          0,
          b.frame * 16,
          16,
          16,
          -8,
          -8,
          16,
          16,
        );
        ctx.restore();
      }
      if (frame?.stars) drawBallParticles(ctx, particles, frame.stars, true);
      if (!frame || !["caught", "escaped"].includes(frame.stage)) {
        ctx.drawImage(healthbox, 12, 14);
        pixelText(ctx, font, name.toUpperCase().slice(0, 10), 18, 16, 60);
        pixelText(ctx, font, `${level}`, 82, 16, 22);
        ctx.drawImage(hp, 36, 30);
      }
      ctx.drawImage(
        tintedPixelImage(textbox, [255, 255, 255], frame?.flash || 0),
        0,
        112,
        240,
        48,
        0,
        112,
        240,
        48,
      );
      const text = !frame
        ? "O que você\nvai fazer?"
        : frame.stage === "caught"
          ? `Isso! ${name}\nfoi capturado!`
          : frame.stage === "escaped" || frame.stage === "breakout"
            ? `Ah! ${name}\nescapou da Poké Bola!`
            : "Você lançou\numa Poké Bola!";
      pixelText(ctx, whiteFont, text, 10, 120, timeline ? 220 : 118);
      if (!timeline) {
        ctx.fillStyle = "#404048";
        ctx.fillRect(128, 112, 112, 48);
        ctx.fillStyle = "#f8f8f8";
        ctx.fillRect(130, 114, 108, 44);
        pixelText(ctx, font, `${balls} POKÉ BOLAS`, 136, 145, 100);
      }
    },
  });
  return (
    <>
      <canvas
        width={240}
        height={160}
        className="capture-canvas"
        ref={canvasRef}
        role="img"
        aria-label={`Cena de captura: treinador Red de costas diante de ${name}.`}
      />
      {error && (
        <p className="pixel-error" role="alert">
          {error}
        </p>
      )}
    </>
  );
}
