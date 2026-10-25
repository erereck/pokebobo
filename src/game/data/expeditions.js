// Cenas e mapas autorais; # = parede, . = chão. Sem sorteios na apresentação.
export const EXPEDITION_STORIES = {
  "echo-cave": {
    name: "Caverna dos Ecos",
    guardian: "Guardiã dos Ecos",
    intro:
      "Um fio de ar frio atravessa a rocha. Marcas antigas indicam um abrigo de viajantes — e algo ainda protege o fundo da caverna.",
    rooms: [
      {
        title: "O abrigo esquecido",
        text: "Entre os cristais, uma caixa de viajantes continua intacta. A passagem ao norte leva mais fundo.",
        found: "Você encontrou moedas e Poké Bolas protegidas da umidade.",
      },
      {
        title: "Dois caminhos, uma escolha",
        text: "Uma ponte cedeu. Você consegue resgatar apenas uma das duas bolsas antes que as pedras deslizem.",
        found: "A outra bolsa ficou sob as pedras. Sua escolha está a salvo.",
      },
      {
        title: "O coração da caverna",
        text: "Uma exploradora guarda os cristais. Ela só entrega seu equipamento a quem vencer um combate. A saída continua livre.",
      },
    ],
    victory:
      "O eco se aquieta. A guardiã abre o estojo e deixa você escolher um equipamento.",
  },
  "sunken-ruins": {
    name: "Ruínas da Aurora",
    guardian: "Sentinela da Aurora",
    intro:
      "Além do lago, um arco coberto de musgo leva a um santuário. A luz atravessa o teto quebrado, mas os últimos salões ainda têm uma sentinela.",
    rooms: [
      {
        title: "O pátio das oferendas",
        text: "Uma arca repousa entre colunas. As moedas e suprimentos deixados por exploradores podem ajudar na reta final da jornada.",
        found: "A arca guardava moedas e Poké Bolas em bom estado.",
      },
      {
        title: "A galeria inundada",
        text: "A água está subindo. Há tempo para recuperar uma bolsa: Poké Bolas junto à escada ou kits de berries no altar.",
        found:
          "Você alcançou a margem com a bolsa escolhida. A outra ficou para trás.",
      },
      {
        title: "O salão da sentinela",
        text: "A última porta se abre para uma arena antiga. A sentinela propõe um duelo pelo tesouro. Você pode dar meia-volta com seus achados.",
      },
    ],
    victory:
      "A sentinela reconhece sua equipe. O tesouro da Aurora agora tem uma nova história.",
  },
};

export const EXPEDITION_LAYOUTS = [
  [
    "############",
    "#..........#",
    "#..#.......#",
    "#..#..##...#",
    "#..........#",
    "#..##......#",
    "#..........#",
    "############",
  ],
  [
    "############",
    "#..........#",
    "#..##......#",
    "#......#...#",
    "#..#...#...#",
    "#..#.......#",
    "#..........#",
    "############",
  ],
  [
    "############",
    "#..........#",
    "#..........#",
    "#..#....#..#",
    "#..#....#..#",
    "#..........#",
    "#..........#",
    "############",
  ],
];
