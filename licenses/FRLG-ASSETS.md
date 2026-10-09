# Gráficos de campo — Pokémon FireRed / LeafGreen

Os pixels de terreno e treinador utilizados na exploração são gráficos de Pokémon FireRed / LeafGreen, de Game Freak / Nintendo / The Pokémon Company. A extração e a organização consultadas são do projeto comunitário [pret/pokefirered](https://github.com/pret/pokefirered), commit `037335f4c725d7c9aecdac87066f2002b4bd7e14`, consultado em 09/10/2026.

Fontes congeladas:

- [Tiles de terreno](https://github.com/pret/pokefirered/blob/037335f4c725d7c9aecdac87066f2002b4bd7e14/data/tilesets/primary/general/tiles.png), metatiles e paletas no mesmo diretório.
- [Red andando](https://github.com/pret/pokefirered/blob/037335f4c725d7c9aecdac87066f2002b4bd7e14/graphics/object_events/pics/people/red_normal.png).
- [Red usando Surf](https://github.com/pret/pokefirered/blob/037335f4c725d7c9aecdac87066f2002b4bd7e14/graphics/object_events/pics/people/red_surf.png).

`scripts/import-field-assets.py` recompõe os metatiles 1, 10, 217, 639, 4 e 5 usando os índices, paletas, flips e duas camadas originais. Também recorta o primeiro quadro dos treinadores, preservando os pixels e tornando o fundo transparente. O mapa e as posições dos encontros são gerados pelo Pokébobo, não reproduzem uma rota oficial de cartucho.

Arquivos entregues: `public/field/terrain.png`, `red_normal.png` e `red_surf.png`. Todos são locais e entram no build web; nenhuma rede é necessária para a cena de exploração. O importador é ferramenta opcional de desenvolvimento, requer Pillow e não roda durante build ou gameplay.

Não foi identificada uma licença aberta concedendo os direitos sobre os gráficos de Pokémon. O código de reconstrução do projeto comunitário não transfere esses direitos. Esta atribuição registra a origem para o projeto de fã, no mesmo recorte não comercial das capas e sprites existentes.
