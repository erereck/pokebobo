import { useMemo, useRef } from "react";
import { drawField } from "./drawField.js";
import {
  drawEncounterTransition,
  encounterTransitionDuration,
} from "./encounterTransition.js";
import catalog from "../../game/catalog.json" with { type: "json" };
import { spriteFileId } from "../../components/pokemon/battleSpriteSources.js";
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
  shiny = false,
  level,
  balls,
  water,
  attempt,
  skip,
  onComplete,
  exploration,
  returning = false,
  selectedAction = "ball",
  ballDisabled = false,
}) {
  const fieldFrame = useRef(null);
  const num = catalog[name].num;
  const original = species[name];
  const monY = 40 + (original?.offset || 0);
  const timeline = useMemo(
    () => (attempt ? captureTimeline(attempt, monY) : null),
    [attempt, monY],
  );
  const sprite = shiny
    ? `${import.meta.env.BASE_URL}sprites/${original ? `frlg-shiny/${num}` : `shiny/${spriteFileId(name)}`}.png`
    : `${import.meta.env.BASE_URL}sprites/${original ? "frlg/" : ""}${num}.png`;
  const transitionDuration =
    exploration && !returning
      ? Math.ceil(encounterTransitionDuration(water) / 2)
      : 0;
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
      ...["terrain", "red_normal_sheet", "red_surf_sheet", "tall_grass"].map(
        fieldAsset,
      ),
    ],
    animationKey: attempt?.id || name,
    duration: timeline
      ? timeline.frames.length - 1
      : returning
        ? 0
        : transitionDuration + 40,
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
        ...fieldImages
      ],
      tick,
    ) => {
      ctx.clearRect(0, 0, 240, 160);
      if (!timeline && tick < transitionDuration) {
        if (!fieldFrame.current || fieldFrame.current.key !== exploration) {
          const native = document.createElement("canvas");
          native.width = 192;
          native.height = 128;
          drawField(
            native.getContext("2d"),
            fieldImages,
            { ...exploration, walk: null },
            50,
          );
          const snapshot = document.createElement("canvas");
          snapshot.width = 240;
          snapshot.height = 160;
          const surface = snapshot.getContext("2d");
          surface.imageSmoothingEnabled = false;
          surface.drawImage(native, 0, 0, 240, 160);
          fieldFrame.current = { key: exploration, image: snapshot };
        }
        drawEncounterTransition(ctx, fieldFrame.current.image, tick * 2, water);
        return;
      }
      const frame =
        timeline?.frames[Math.min(tick, timeline.frames.length - 1)];
      ctx.drawImage(
        tintedPixelImage(bg, [255, 255, 255], frame?.flash || 0),
        0,
        0,
      );
      const intro =
        timeline || returning
          ? 0
          : Math.max(0, 240 - (tick - transitionDuration) * 6);
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
        pixelText(ctx, font, name.toUpperCase(), 18, 16, 60, 1);
        ctx.save();
        ctx.translate(82, 18);
        ctx.scale(0.75, 0.75);
        pixelText(ctx, font, `${level}`, 0, 0, 22, 1);
        ctx.restore();
        ctx.drawImage(hp, 36, 30);
        if (shiny) {
          ctx.fillStyle = "#b88018";
          ctx.fillRect(24, 29, 3, 7);
          ctx.fillRect(22, 31, 7, 3);
          ctx.fillStyle = "#ffe078";
          ctx.fillRect(24, 31, 3, 3);
        }
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
      pixelText(ctx, whiteFont, text, 10, 120, timeline ? 220 : 80);
      if (!timeline) {
        ctx.fillStyle = "#404048";
        ctx.fillRect(96, 112, 144, 48);
        ctx.fillStyle = "#f8f8f8";
        ctx.fillRect(98, 114, 140, 44);
        ctx.fillStyle = "#d8e0d8";
        ctx.fillRect(selectedAction === "ball" ? 98 : 168, 114, 70, 44);
        ctx.fillStyle = "#a0a8a0";
        ctx.fillRect(167, 116, 1, 40);
        pixelText(ctx, font, "POKÉ BOLA", 109, 119, 58, 1);
        pixelText(ctx, font, "FUGIR", 182, 119, 52, 1);
        ctx.drawImage(ball, 0, 0, 16, 16, 107, 139, 16, 16);
        pixelText(ctx, font, `× ${balls}`, 125, 139, 38, 1);
        pixelText(ctx, font, "VOLTAR", 182, 139, 50, 1);
        const cursorX = selectedAction === "ball" ? 101 : 172;
        ctx.fillStyle = "#404048";
        for (let i = 0; i < 4; i++)
          ctx.fillRect(cursorX + i, 124 + i, 1, 7 - i * 2);
        if (ballDisabled) {
          ctx.fillStyle = "rgba(248,248,248,.55)";
          ctx.fillRect(98, 114, 69, 44);
        }
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
        aria-label={`Cena de captura: treinador Red de costas diante de ${name}${shiny ? " shiny" : ""}.`}
      />
      {error && (
        <p className="pixel-error" role="alert">
          {error}
        </p>
      )}
    </>
  );
}
