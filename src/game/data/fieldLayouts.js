// Campos autorais compostos com os tiles locais de FRLG. Não são mapas
// canônicos: P = trilha, T = mato alto, W = água, . = grama baixa.
export const FIELD_LAYOUTS = Object.freeze({
  clearing: [
    ".P..........",
    ".P.TTT...WWW",
    ".PTTTTTT.WWW",
    ".PTTTTTT.WWW",
    ".P.TTTTT.WWW",
    ".P.TTTT.....",
    "PPPPPPPPPPPP",
    ".P..........",
  ],
  winding: [
    ".P..........",
    ".PPPPPPP..WW",
    ".PTTTTTP.WWW",
    ".PTTTT.P.WWW",
    ".PTTTTTPT.WW",
    ".P.TTTTPT...",
    "PPPPPPPPPPPP",
    ".P..........",
  ],
  lakeside: [
    ".P..........",
    ".PTTT.TT.WWW",
    ".PTTT.TT.WWW",
    ".PTTTTTT.WWW",
    ".PTTTTTT..WW",
    ".PPPPPPPPPPP",
    "PPPPPPPPPPPP",
    ".P.TTTTTT...",
  ],
  meadow: [
    ".P..........",
    ".PTTTT....W.",
    ".PTTTT.T.WW.",
    ".PTTTTTT.WW.",
    ".PTTT.TT.WW.",
    ".PPPPPP.....",
    "PPPPPPPPPPPP",
    ".P...TTTTT..",
  ],
});
