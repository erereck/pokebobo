# Capas de cidades e exploração de campo

## 0.13.0 — todas as cidades com imagem própria

48 cidades selecionáveis (sete origens, quatro passagens e 37 ginásios) e Indigo Plateau têm 49 imagens locais correspondentes ao lugar. O manifesto seleciona por id, sem imagem genérica por bioma. Os seis arquivos do piloto de Emerald e a paisagem SVG foram removidos; em caso de falha não se mostra um destino diferente. Os registros do piloto abaixo são históricos, inclusive suas referências a fallback e standalone.

Bulbagarden Archives fornecem os originais; edições, responsáveis pelo upload, revisões, dimensões, URLs e SHA-256 estão em `src/game/data/cityCovers.json`. A autoria dos gráficos permanece Game Freak / Nintendo / The Pokémon Company. [Fontes e termos por arquivo](../public/covers/README.md). Hau'oli usa arte oficial USUM, e Galar conserva os rótulos japoneses do mapa SwSh.

WebP sem perdas ocupa 6,03 MiB no conjunto e conserva cada pixel RGBA em resolução original. `scripts/import-city-covers.py` verifica o original e a conversão, com fonte congelada por hash; reproduzido com Pillow 12.3.0/libwebp 1.6.0. O jogo usa arquivos locais e carrega sob demanda. Enquadramento por CSS, sem adulterar as folhas. Draft, partida, cidade e arena compartilham a imagem; a Liga usa Indigo Plateau. Galeria de créditos com filtro de região.

## 0.12.0 — bordas de trilha e lago

O atlas de terreno passou de seis para 32 quadros. Treze bordas originais de trilha permitem cruzamentos, casas estreitas e cantos internos. Outros treze quadros combinam o contorno irregular de grama dessas bordas com a textura original de água. `terrainPresentation.js` escolhe cada quadrante a partir dos vizinhos, e `drawField.js` desenha sem interpolação. A colisão e a localização do lago permanecem em `game/world/exploration.js`; nenhum sorteio depende dos gráficos. O campo atual usa canvas, compartilhado com a transição de captura. Fonte congelada, transformações e termos em [FRLG-ASSETS](../licenses/FRLG-ASSETS.md).

## 0.9.0 — campo com tiles de FireRed / LeafGreen

A caminhada usa metatiles e os sprites de Red originais de FRLG, extraídos de uma referência congelada de `pret/pokefirered`. Os mapas pequenos, os matinhos e as oportunidades são uma curadoria procedural do Pokébobo. São três PNGs locais em `public/field/`; fonte, titularidade, transformação e termos estão em [FRLG-ASSETS](../licenses/FRLG-ASSETS.md). O importador reproduzível é `scripts/import-field-assets.py`.

O terreno é montado por CSS numa grade de 12×8. Posições dos matinhos vêm da seed e ficam no save durante a caminhada. Lago, trilha, treinador, foco e marcadores de encontro são conferidos em PC, 390 px e 320 px. As capas abaixo continuam atendendo cidade, draft, captura e batalha.

## Piloto de capas implementado na 0.2

Seis folhas de mapas de Pokémon Emerald foram conferidas no navegador e incorporadas localmente. A pesquisa anterior está em [archive/ARTES-E-ROTAS-0.1.1.md](archive/ARTES-E-ROTAS-0.1.1.md).

## Seleção e procedência

| Folha                                                                                             | Crédito registrado na ficha | Uso no piloto             |
| ------------------------------------------------------------------------------------------------- | --------------------------- | ------------------------- |
| [Littleroot Town](https://www.spriters-resource.com/game_boy_advance/pokemonemerald/asset/19776/) | Previous                    | Cidade inicial Littleroot |
| [Petalburg Woods](https://www.spriters-resource.com/game_boy_advance/pokemonemerald/asset/19778/) | Andrew the Hedgehog         | Floresta                  |
| [Mt. Chimney](https://www.spriters-resource.com/game_boy_advance/pokemonemerald/asset/18615/)     | Andrew the Hedgehog         | Montanha                  |
| [Safari Zone](https://www.spriters-resource.com/game_boy_advance/pokemonemerald/asset/18616/)     | Andrew the Hedgehog         | Campo                     |
| [Faraway Island](https://www.spriters-resource.com/game_boy_advance/pokemonemerald/asset/8358/)   | Kaori                       | Lago/água                 |
| [Abandoned Ship](https://www.spriters-resource.com/game_boy_advance/pokemonemerald/asset/19774/)  | Andrew the Hedgehog         | Litoral                   |

Essas imagens são **paisagens de referência de Hoenn**, não uma afirmação de que todas as cidades de outras regiões possuem esses mapas. A ajuda e os textos acessíveis identificam o lugar de origem. A neve mantém o cenário SVG.

## Implementação

- PNGs originais em `public/covers/`, preservando inclusive as notas das folhas completas. O conjunto ocupa cerca de 819 KB.
- `game/data/routeCovers.js`: fonte, autor/extrator, dimensões e recorte. `RouteCover.jsx` aplica um viewport SVG sobre a folha, sem alterar o PNG.
- O componente atende cidade, draft, encontro e arena. Ausência de entrada ou falha da imagem retorna a `Landscape.jsx`.
- A galeria na ajuda mostra seis referências com créditos. Não há hotlink: fontes, sprites e capas entram no HTML portátil, de aproximadamente 9,4 MB.
- A meta anterior de 100 KB por capa não foi aplicada rigidamente: foram mantidas as folhas completas para preservar a origem e permitir rever os recortes. Ampliar dezenas de capas exigirá novo orçamento.

[Termos do Spriters Resource](https://www.spriters-resource.com/page/tou/) consultados em 13/09/2026 para este protótipo local e não comercial. Os gráficos são de Game Freak / Nintendo / The Pokémon Company; os créditos de extração não equivalem a uma licença geral desses direitos. Créditos completos também em [public/covers/README.md](../public/covers/README.md).

## Referências dos ginásios

Posição, elenco e níveis foram conferidos por edição, sem usar rematches:

- Kanto: [FireRed / LeafGreen](https://pokemondb.net/firered-leafgreen/gymleaders-elitefour).
- Johto: [HeartGold / SoulSilver](https://pokemondb.net/heartgold-soulsilver/gymleaders-elitefour).
- Hoenn: [Emerald](https://pokemondb.net/emerald/gymleaders-elitefour).
- Sinnoh: [Platinum](https://pokemondb.net/platinum/gymleaders-elitefour), incluindo Fantina em terceiro.
- Unova: [Black / White](https://pokemondb.net/black-white/gymleaders-elitefour).
- Galar: [Sword / Shield](https://pokemondb.net/sword-shield/gymleaders).

Cada entrada guarda `order`, `levels`, `source` e `sourceUrl`. O +6 é calculado no desafio, sem modificar a tabela. Golpes são adaptados automaticamente, e Mossdeep usa singles. Não se promete reproduzir integralmente o combate original.

## Interface 0.3.0

As seis folhas e seus créditos permanecem iguais. A carcaça da Pokédex, lente, dobradiça, botões e mapa de nós foram desenhados em CSS/SVG neste projeto. A direção utiliza a skill [interface-design](https://github.com/Dammyjay93/interface-design), conforme pedido do usuário.

A fonte [Silkscreen](https://github.com/google/fonts/tree/main/ofl/silkscreen) foi adicionada localmente em `public/fonts/silkscreen.ttf` (31.320 bytes), com licença [SIL OFL](../licenses/Silkscreen-OFL.txt). O empacotador incorpora TTF e WOFF2 com o MIME correspondente. DM Sans e Space Grotesk permanecem locais. O tamanho atual do HTML é cerca de 10,3 MiB; o valor de 9,4 MB acima descreve o piloto da 0.2.0.

## Campo e captura — 0.10.0

A captura passou a usar fundos, Red de costas, Poké Bola, partículas, moldura e fonte de FRLG, em cena 240×160. Campo usa folhas completas e efeito de mato. O importador Python/Pillow é opcional; todas as imagens geradas são locais e copiadas pelo Vite. Origem, commit e transformações: [FRLG-ASSETS.md](../licenses/FRLG-ASSETS.md). Capas antigas continuam nas outras telas. Esta entrega distribui código-fonte e build web; não regenera o HTML histórico.
