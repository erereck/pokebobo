# Capas de rotas: pesquisa e proposta

Pesquisa realizada em 13/09/2026. Este documento avalia fontes; não registra imagens já incorporadas ao jogo.

## O que encontrei

**The Spriters Resource é uma opção útil para a pesquisa visual.** O catálogo de FireRed/LeafGreen lista mapas das rotas 01–25, cidades e locais como Viridian Forest, Mt. Moon e Victory Road. São candidatos para recortes reconhecíveis das regiões. [Catálogo FireRed/LeafGreen](https://www.spriters-resource.com/game_boy_advance/pokemonfireredleafgreen/?source=genre)

O catálogo de Emerald lista `Route Icons`, `Exterior Tileset`, `Hoenn Map` e `Map Objects`. Os ícones/banners de rota podem ser um começo mais adequado ao formato estreito da capa que a imagem de uma rota inteira. Tilesets exigiriam montar uma composição própria. [Catálogo Emerald](https://www.spriters-resource.com/game_boy_advance/pokemonemerald/)

Red/Blue também tem entradas para rotas individuais. Pode servir como referência ou modo monocromático, mas misturar esses mapas diretamente com os sprites e cores atuais tende a produzir uma identidade inconsistente. Essa avaliação estética é uma recomendação para o Pokébobo. [Catálogo Red/Blue](https://sprites.spriters-resource.com/game_boy_gbc/pokemonredblue/)

As listagens acima foram verificadas pelos resultados indexados. A abertura direta de páginas do Spriters Resource devolveu HTTP 403 nesta sessão. Portanto, **a ficha, a imagem e os termos de cada arquivo específico ainda precisam ser conferidos no momento da seleção**. Não foi feito download em massa, e não há um suposto conjunto de capas pronto.

## Usar um print, um mapa ou um tileset?

| Opção | Vantagem | Trabalho necessário |
|---|---|---|
| Banner/ícone oficial de entrada | Composição já pensada para uma faixa pequena | Conferir resolução, texto incorporado e local representado |
| Recorte de mapa extraído | Locais reconhecíveis e boa fidelidade | Escolher enquadramento; não reduzir o mapa inteiro até ficar ilegível |
| Screenshot do jogo | Iluminação e contexto já prontos | Evitar personagem/menu no recorte; escolher origem consistente |
| Composição com tiles | Controle de cor e da área livre para texto | Montagem manual e revisão para não parecer um mapa aleatório |
| Arte original com tiles licenciados | Identidade própria e procedência mais clara | Não reproduz automaticamente uma cidade Pokémon específica |

Para a primeira experiência, eu escolheria **seis recortes de uma mesma família visual GBA**, um por tipo de ambiente. Depois, capas por cidade e por rota, quando esses locais tiverem IDs estáveis no save.

## Créditos e condições da fonte

Uma folha extraída de um jogo e uma arte original feita por um usuário são categorias diferentes. Os termos do Spriters Resource descrevem condições próprias para trabalhos customizados, incluindo crédito, restrições indicadas na submissão e autorização em determinados usos comerciais. Isso não equivale a licenciar os personagens ou gráficos originais de Pokémon. Registrar a ficha de cada material evita tratar o site inteiro como uma licença única. [Termos do Spriters Resource](https://www.spriters-resource.com/page/tou/)

Como alternativa para ambientes originais, o pacote **16x16 Overworld Tiles**, de ARoachIFoundOnMyPillow, aparece no OpenGameArt sob CC0 e inclui temas de árvores, praia, água e grama. É uma opção para montar cenários próprios, não uma coleção de prints oficiais de Pokémon. [Ficha do pacote](https://opengameart.org/content/16x16-overworld-tiles-0)

## Fluxo de implementação proposto

1. Criar IDs estáveis para as conexões entre cidades, separados do rótulo exibido na tela.
2. Selecionar manualmente seis candidatas e guardar a página individual da fonte, o jogo/versão e os créditos.
3. Fazer recortes sem menus, diálogos ou texto que revele o tipo de um ginásio. Não baixar uma imagem e pressupor que seja a cidade certa.
4. Guardar originais fora do pacote de distribuição e somente as capas finais em `public/covers/`.
5. Criar `game/data/routeCovers.js` com metadados; usar o exemplo de [ficha de capa](templates/route-cover.example.json). Os campos vazios são intencionais: a seleção ainda não foi feita.
6. Implementar `components/scenery/RouteCover.jsx`, lendo metadados e usando `Landscape.jsx` quando não houver imagem. Integrar em `CityHero.jsx`, `CityChoice.jsx` e `Encounter.jsx`.
7. Dar a cada contexto seu ponto focal: cidade, cartão do draft e encontro não têm a mesma proporção. Validar 390 px e desktop.
8. Incluir as capas no empacotamento de `scripts/standalone.mjs` e medir o tamanho do HTML. Preferir arquivos locais, sem hotlink ou conexão obrigatória com a fonte.
9. Conferir arte, legenda, crédito e fallback em uma pequena galeria de revisão antes de expandir para todas as cidades.

## Critérios para aprovar o piloto

- Nome, região e imagem representam o mesmo lugar ou deixam explícito que é uma ambientação genérica.
- A capa continua reconhecível em 390 px, com texto legível e sem distorcer os pixels.
- Ausência de capa mantém o cenário SVG funcional.
- Nenhuma requisição externa é necessária para jogar o HTML offline.
- A ficha possui procedência completa e termos consultados.
- O conjunto parece um único jogo, sem misturar arbitrariamente GBA, DS, arte 3D e desenhos promocionais.
