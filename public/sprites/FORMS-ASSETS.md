# Retratos das formas — 0.21.0

Cinco PNGs normais cobrem Raichu-Alola, Weezing-Galar, Exeggutor-Alola, Mr. Mime-Galar e Oricorio-Pa'u (incluindo seu alias Oricorio-Pau). O número nacional compartilhado não identifica a arte da forma. Retratos de equipe, reserva, Hall, escolhas e evolução agora usam a forma correta; espécies comuns conservam os retratos existentes.

Derivados exclusivamente do primeiro quadro dos [originais BW locais](../battle-sprites/README.md), com hashes congelados em `battle-sprites/manifest.json`. Não houve redesenho, recoloração, recorte de pixels ou redimensionamento: canvas quadrado transparente centraliza o quadro, como nos retratos shiny. Frente/costas animadas de batalha permanecem intactas. `forms-manifest.json` registra fonte exata, hash original/saída, quadro, tamanho, transparência e bytes; `staticFormSprites.json` é o índice da UI. As cinco geometrias novas ficam em `staticFormSpriteGeometry.json`; tabela antiga e perfis de escala permanecem intactos.

Reprodução local: Python + Pillow, `python scripts/import-form-portraits.py`; `--check` confere bytes/índice/geometria sem escrever. Não depende da internet ou de ROM e não participa do build.

Créditos e termos: Game Freak / Nintendo / The Pokémon Company para gráficos dos jogos; artistas Smogon / Pokémon Showdown para adaptações posteriores em estilo BW. As fontes/termos estão no [manifesto e créditos de batalha](../battle-sprites/README.md). Não atribuímos licença MIT ou autoria do Pokébobo aos gráficos; a licença dos sprites comunitários não foi apresentada como aberta.
