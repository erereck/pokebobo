import QRCode from "qrcode";
import { battleSpriteSources } from "../../components/pokemon/battleSpriteSources.js";
import {
  CARD_COLORS as C,
  panel,
  text,
  star,
  visibleSprite,
  drawSprite,
} from "./cardDrawing.js";
import { GAME_URL } from "../../shared/regionInvitation.js";

function loadImage(source) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const fail = () => {
      clearTimeout(timer);
      image.onload = null;
      image.onerror = null;
      reject(
        Error(
          "Não foi possível carregar todos os sprites do cartão. Confira sua conexão e tente novamente.",
        ),
      );
    };
    const timer = setTimeout(fail, 12000);
    image.onload = () => {
      clearTimeout(timer);
      resolve(image);
    };
    image.onerror = fail;
    image.src = source;
  });
}

async function spriteOf(mon) {
  const source = battleSpriteSources(
    mon.name,
    false,
    import.meta.env.BASE_URL,
    mon.shiny,
  )[0];
  if (!source) return null;
  return visibleSprite(await loadImage(source));
}

export async function renderJourneyCard(canvas, model, link) {
  await Promise.all([
    document.fonts.load('700 48px "Space Grotesk"'),
    document.fonts.load('500 24px "DM Sans"'),
    document.fonts.load('400 32px "Silkscreen"'),
  ]);
  const [team, reserve] = await Promise.all([
    Promise.all(model.team.map(spriteOf)),
    Promise.all(model.reserve.map(spriteOf)),
  ]);
  canvas.width = 1080;
  canvas.height = 1350;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw Error("Seu navegador não conseguiu preparar a imagem.");
  ctx.clearRect(0, 0, 1080, 1350);
  panel(ctx, 0, 0, 1080, 1350, C.seam, 32);
  panel(ctx, 0, 0, 1080, 1338, C.ruby, 32);
  panel(ctx, 36, 142, 1008, 1172, C.rubber, 24);
  panel(ctx, 44, 150, 992, 1156, C.lcd, 18);
  ctx.beginPath();
  ctx.arc(76, 74, 32, 0, Math.PI * 2);
  ctx.fillStyle = C.seam;
  ctx.fill();
  ctx.beginPath();
  ctx.arc(76, 70, 25, 0, Math.PI * 2);
  ctx.fillStyle = C.lens;
  ctx.fill();
  ctx.beginPath();
  ctx.arc(68, 61, 7, 0, Math.PI * 2);
  ctx.fillStyle = C.white;
  ctx.fill();
  text(ctx, "POKÉBOBO", 124, 85, 36, C.white, 400, "Silkscreen");
  text(
    ctx,
    "RUN " + String(model.id).padStart(3, "0"),
    826,
    81,
    24,
    C.white,
    700,
    "Space Grotesk",
    190,
  );
  panel(ctx, 64, 178, 952, 42, model.won ? C.amber : C.dim, 8);
  text(ctx, model.title, 84, 207, 23, C.ink, 700, "Space Grotesk", 908);
  text(ctx, model.name, 64, 284, 58, C.ink, 700, "Space Grotesk", 952);
  text(
    ctx,
    model.won
      ? "Oito insígnias. Uma Liga. Uma história sua."
      : model.opponent
        ? "Último rival: " + model.opponent
        : "Cada jornada merece ser lembrada.",
    64,
    322,
    24,
    C.soft,
    500,
    "DM Sans",
    952,
  );
  const facts = [
    [model.badges + "/8", "INSÍGNIAS"],
    [String(model.week), "SEMANA FINAL"],
    [model.mode, "MODO DA JORNADA"],
  ];
  facts.forEach(([value, label], i) => {
    const x = 64 + i * 324;
    panel(ctx, x, 346, 304, 88, C.dim, 10);
    text(ctx, value, x + 16, 386, 34, C.ink, 700, "Space Grotesk", 270);
    text(ctx, label, x + 16, 414, 17, C.soft, 700, "Space Grotesk");
  });
  text(ctx, "EQUIPE FINAL", 64, 474, 22, C.soft, 700, "Space Grotesk");
  const rare = model.teamShinies;
  if (rare)
    text(
      ctx,
      "✦ " + rare + " shiny" + (rare > 1 ? "s" : "") + " na equipe e reserva",
      590,
      474,
      20,
      C.soft,
      500,
      "DM Sans",
      426,
    );
  for (let i = 0; i < 6; i++) {
    const x = 64 + (i % 3) * 324,
      y = 492 + Math.floor(i / 3) * 214;
    const mon = model.team[i];
    panel(ctx, x, y, 304, 198, mon?.shiny ? "#f5ebba" : C.bright, 10, C.line);
    if (mon) {
      if (team[i]) drawSprite(ctx, team[i], x + 152, y + 134, 210, 122);
      else text(ctx, "?", x + 136, y + 92, 46, C.soft, 700);
      text(
        ctx,
        mon.name,
        x + 16,
        y + 161,
        22,
        C.ink,
        700,
        "Space Grotesk",
        272,
      );
      text(
        ctx,
        mon.level ? "Nível " + mon.level : "Nível não registrado",
        x + 16,
        y + 185,
        18,
        C.soft,
        500,
        "DM Sans",
        272,
      );
      if (mon.shiny) star(ctx, x + 280, y + 22, 13);
    } else {
      text(
        ctx,
        model.team.length
          ? "Espaço livre"
          : model.teamRecorded
            ? model.mode === "Nuzlocke"
              ? "Sem sobreviventes"
              : "Sem Pokémon ativo"
            : "Equipe não registrada",
        x + 20,
        y + 108,
        21,
        C.soft,
        500,
        "DM Sans",
        264,
      );
    }
  }
  // Insígnias estilizadas do mesmo painel do jogo; não imitam badges de outra região.
  for (let i = 0; i < 8; i++) {
    const x = 96 + i * 72,
      earned = i < model.badges;
    ctx.beginPath();
    for (let j = 0; j < 6; j++) {
      const angle = (j * Math.PI) / 3 - Math.PI / 6;
      const px = x + Math.cos(angle) * 24,
        py = 962 + Math.sin(angle) * 24;
      if (j) ctx.lineTo(px, py);
      else ctx.moveTo(px, py);
    }
    ctx.closePath();
    ctx.fillStyle = earned ? C.amber : C.dim;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = earned ? "#9f8438" : C.line;
    ctx.stroke();
    text(
      ctx,
      String(i + 1),
      x - 7,
      970,
      21,
      earned ? C.ink : C.soft,
      700,
      "Space Grotesk",
    );
  }
  if (reserve.length) {
    text(ctx, "RESERVA", 686, 958, 16, C.soft, 700, "Space Grotesk");
    reserve.forEach((sprite, i) => {
      if (sprite) drawSprite(ctx, sprite, 824 + i * 70, 982, 52, 52);
      if (model.reserve[i].shiny) star(ctx, 840 + i * 70, 940, 7);
    });
  }
  text(
    ctx,
    "SEED " + (model.seed || "NÃO REGISTRADA"),
    64,
    1034,
    25,
    C.ink,
    700,
    "Space Grotesk",
    660,
  );
  const collection =
    model.registered !== null
      ? model.registered +
        " espécies registradas nesta jornada" +
        (model.shinySpecies
          ? " · " +
            model.shinySpecies +
            " shiny" +
            (model.shinySpecies > 1 ? "s" : "")
          : "")
      : "Registro preservado de uma aventura anterior";
  text(ctx, collection, 64, 1070, 21, C.soft, 500, "DM Sans", 660);
  const qr = document.createElement("canvas");
  await QRCode.toCanvas(qr, link || GAME_URL, {
    errorCorrectionLevel: "M",
    margin: 4,
    scale: 4,
    color: { dark: "#1b2931ff", light: "#f9fbe9ff" },
  });
  ctx.imageSmoothingEnabled = false;
  // Mantém módulos inteiros e a quiet zone de quatro módulos.
  const qrSize = qr.width;
  const qrScale = Math.max(1, Math.floor(264 / (qrSize / 4)));
  const qrPixels = (qrSize / 4) * qrScale;
  panel(ctx, 64, 1094, 952, 188, C.rubber, 12);
  panel(ctx, 744, 1028, 272, 272, C.bright, 10);
  ctx.drawImage(
    qr,
    0,
    0,
    qr.width,
    qr.height,
    Math.round(744 + (272 - qrPixels) / 2),
    Math.round(1028 + (272 - qrPixels) / 2),
    qrPixels,
    qrPixels,
  );
  text(
    ctx,
    link ? "CONSEGUE IR MAIS LONGE?" : "SUA PRÓXIMA AVENTURA",
    84,
    1134,
    24,
    C.lcd,
    700,
    "Space Grotesk",
    636,
  );
  text(
    ctx,
    link
      ? "Leia o QR e desafie a mesma região."
      : "Leia o QR e comece no Pokébobo.",
    84,
    1176,
    24,
    C.lcd,
    500,
    "DM Sans",
    636,
  );
  text(
    ctx,
    "erereck.github.io/pokebobo",
    84,
    1217,
    23,
    C.lens,
    700,
    "Space Grotesk",
    636,
  );
  text(
    ctx,
    "Roguelike Pokémon · grátis no navegador",
    84,
    1250,
    20,
    C.lcd,
    500,
    "DM Sans",
    636,
  );
  return canvas;
}

export function cardBlob(canvas) {
  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (blob) =>
        blob
          ? resolve(blob)
          : reject(Error("Não foi possível salvar a imagem. Tente novamente.")),
      "image/png",
    ),
  );
}
