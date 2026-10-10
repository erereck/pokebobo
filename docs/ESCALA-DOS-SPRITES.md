# Escala dos sprites de batalha — 0.16.0

A assinatura textual da geometria usa UTF-8/LF, conservando o mesmo hash entre checkouts Windows e Linux. Hashes de GIF/PNG continuam sendo dos bytes originais, sem normalização.

`components/pokemon/battleSpeciesScale.json` guarda ratios de altura visual por espécie/forma, estilo (2d/3d) e lado (front/back), mais elevação de alguns flutuantes. `spriteGeometry.json` guarda canvas, união dos limites não transparentes e número de quadros por fonte. A referência é o espaço da cena: 78% da altura disponível, limitada por largura e CSS; pequeno tem ratio menor. A altura da Pokédex deixa de determinar o tamanho final.

`battleSpriteLayout.js` aplica a calibração, perspectiva de costas de 1,12, piso de legibilidade de 16 px (subordinado ao limite da caixa), largura máxima de 90% e altura máxima de 81% menos elevação. O limite do ciclo é centrado horizontalmente e apoiado no centro da plataforma (17% da altura acima da base). Margens transparentes são descontadas da posição; largura/altura do canvas mantêm a proporção. `BattlePokemonSprite.jsx` usa ResizeObserver e load para calcular offsets fixos. Não existe leitura de pixels nem novo sorteio por frame no navegador. Ataques podem mover o sprite temporariamente, como antes.

Fonte efetiva determina geometria e estilo de calibração, inclusive fallback. Troca de Pokémon/estilo/cor recria o renderer; reload conserva a batalha por decisões. Imagens externas com dimensões diferentes das medidas usam o canvas efetivo como limite conservador, sem distorcer a proporção. Fonte customizada sem metadados usa o mesmo fallback. CSS fornece limites de referência 160 (desktop), 140 (celular), 94 (tela baixa) e 84 (paisagem); espaço real pode reduzir ainda mais.

## Reprodução

1. Node: `node scripts/fetch-sprite-geometry.mjs --out /caminho/cache`. Confere/baixa as 1.940 fontes 3D já utilizadas pelo jogo e rejeita bytes cujo hash mudou.
2. Python + Pillow: `python scripts/measure-battle-sprites.py --source-dir /caminho/cache`. Lê BW/PNGs locais e cache 3D, decodifica todos os frames e escreve geometria/relatório. O perfil ICC inválido já documentado de Mr. Mime-Galar é ignorado sem tocar seus pixels.
3. `python scripts/calibrate-battle-sprites.py`. Deriva as tabelas dos limites dos desenhos originais, aplica ajustes explícitos e mantém estilos/lados separados.
4. `npm run verify`; revisão visual em desktop, mobile e quatro golpes antes de aceitar alterações nos ratios.

Foram medidos 4.848 arquivos e 227.842 quadros com Pillow 12.3. Dados/fontes/hashes em docs/balance/sprite-geometry*.json. Não adiciona os GIFs 3D de pesquisa ao build nem modifica imagens; usa os assets e fallbacks existentes. Fontes originais de [Pokémon Showdown](https://play.pokemonshowdown.com/sprites/): ani/ani-back/ani-shiny/ani-back-shiny e conjuntos BW. Créditos/termos dos gráficos permanecem em [sprites de batalha](../public/battle-sprites/README.md) e [variantes shiny](../public/sprites/SHINY-ASSETS.md). Geometria e calibração são dados de apresentação gerados pelo Pokébobo; não atribuem autoria/licença dos gráficos ao projeto.
