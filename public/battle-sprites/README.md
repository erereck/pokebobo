# Sprites 2D de batalha — Pokébobo 0.14.0

485 espécies/formas distintas cobrem as 486 entradas do catálogo (Oricorio-Pau e Oricorio-Pa'u são aliases). Frente e costas: 970 arquivos locais, sendo 945 GIFs animados e 25 PNGs estáticos. Total de 38.072.884 bytes (36,31 MiB), carregados somente para os Pokémon que aparecem na arena em modo 2D.

Originais publicados pelo [Pokémon Showdown](https://play.pokemonshowdown.com/sprites/), consultados em 10/10/2026: diretórios [gen5ani](https://play.pokemonshowdown.com/sprites/gen5ani/), [gen5ani-back](https://play.pokemonshowdown.com/sprites/gen5ani-back/), [gen5](https://play.pokemonshowdown.com/sprites/gen5/) e [gen5-back](https://play.pokemonshowdown.com/sprites/gen5-back/). GIFs têm prioridade; somente os arquivos sem animação usam PNG. Os bytes originais, transparência e animações foram preservados, sem converter, redimensionar ou redesenhar.

`manifest.json` registra cada espécie/forma e lado com URL exata, data, quantidade de bytes e SHA-256. O índice leve em `src/game/data/battleSprites.json` guarda apenas caminhos usados pelo jogo. `node scripts/import-battle-sprites.mjs --check` confere o conjunto local; sem `--check`, o importador também recupera arquivos ausentes e rejeita fontes que mudaram de hash. Não participa do build nem requer ROM.

Créditos: Game Freak / Nintendo / The Pokémon Company para gráficos dos jogos; artistas da comunidade Smogon / Pokémon Showdown para adaptações em estilo Black/White de Pokémon posteriores. A atribuição do projeto e seus termos estão em [smogon/sprites](https://github.com/smogon/sprites#license). A licença MIT citada ali refere-se ao código, não concede automaticamente direitos sobre os sprites. O projeto informa que a licença dos sprites comunitários ainda está sendo definida e pede contato antes do uso. Esta documentação registra origem/termos; não declara licença aberta ou autoria do Pokébobo sobre os gráficos.

O modo 3D mantém as fontes existentes. A preferência visual pertence ao navegador e não altera golpes, dano, RNG, decisões, saves ou a captura em canvas de FRLG.
