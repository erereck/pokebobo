# Gráficos e animações de campo/captura — FireRed / LeafGreen

Os gráficos são de Pokémon FireRed / LeafGreen, de Game Freak / Nintendo / The Pokémon Company. A extração e organização consultadas são do projeto comunitário [pret/pokefirered](https://github.com/pret/pokefirered), commit `037335f4c725d7c9aecdac87066f2002b4bd7e14`, consultado em 09/10/2026.

Fontes congeladas, todas relativas ao mesmo commit:

- [Tiles de campo](https://github.com/pret/pokefirered/tree/037335f4c725d7c9aecdac87066f2002b4bd7e14/data/tilesets/primary/general): tiles, paletas e metatiles.
- [Treinadores de campo](https://github.com/pret/pokefirered/tree/037335f4c725d7c9aecdac87066f2002b4bd7e14/graphics/object_events/pics/people): red_normal.png, red_surf.png.
- [Red de costas](https://github.com/pret/pokefirered/blob/037335f4c725d7c9aecdac87066f2002b4bd7e14/graphics/trainers/back_pics/red_back_pic.png) e paleta graphics/trainers/palettes/red_back_pic.pal.
- [Poké Bola](https://github.com/pret/pokefirered/blob/037335f4c725d7c9aecdac87066f2002b4bd7e14/graphics/interface/ball/poke.png).
- [Efeito do mato](https://github.com/pret/pokefirered/blob/037335f4c725d7c9aecdac87066f2002b4bd7e14/graphics/field_effects/pics/tall_grass.png), paleta general_1.pal.
- [Fundos](https://github.com/pret/pokefirered/tree/037335f4c725d7c9aecdac87066f2002b4bd7e14/graphics/battle_terrain): grass e water, terrain.png/.bin/.pal.
- [Interface](https://github.com/pret/pokefirered/tree/037335f4c725d7c9aecdac87066f2002b4bd7e14/graphics/battle_interface): textbox, healthbox_singles_opponent, healthbox_elements e paletas.
- [Partículas](https://github.com/pret/pokefirered/blob/037335f4c725d7c9aecdac87066f2002b4bd7e14/graphics/battle_anims/sprites/particles.png), paleta do circle_impact.png.
- [Fonte bitmap](https://github.com/pret/pokefirered/blob/037335f4c725d7c9aecdac87066f2002b4bd7e14/graphics/fonts/latin_normal.png); métricas em src/text.c e charmap.txt. A 0.11.0 combina a/o/A/O com o til de ñ/Ñ nos slots latinos livres 247–250 para ã/õ/Ã/Õ. Outros caracteres ausentes usam a letra sem diacrítico.
- [Pokémon](https://github.com/pret/pokefirered/tree/037335f4c725d7c9aecdac87066f2002b4bd7e14/graphics/pokemon): front.png e normal.pal; coordenadas em src/data/pokemon_graphics/front_pic_coordinates.h.

Referência de movimento: src/data/object_events/object_event_anims.h e src/data/field_effects/field_effect_objects.h. Arremesso: src/data/trainer_graphics/back_pic_anims.h e src/battle_main.c. Captura: [src/battle_anim_special.c](https://github.com/pret/pokefirered/blob/037335f4c725d7c9aecdac87066f2002b4bd7e14/src/battle_anim_special.c), sequência ativa AnimTask_ThrowBallSpecial/SpriteCB_ThrowBall_ArcFlight; animações da bola em src/pokeball.c e do Pokémon em src/data.c. A sequência UNUSED em pokeball.c não foi usada como referência principal.

Entrada no encontro na 0.11.0: [src/battle_transition.c](https://github.com/pret/pokefirered/blob/037335f4c725d7c9aecdac87066f2002b4bd7e14/src/battle_transition.c), TransitionIntro_FadeToGray/FadeFromGray, Slice e Ripple. Os pulsos, aceleração e deslocamentos por linha foram adaptados para canvas; a seleção de terreno é do Pokébobo.

`scripts/import-field-assets.py` recompõe seis metatiles, usando paletas, flips e camadas originais. `scripts/import-capture-assets.py` preserva as folhas completas, recompõe tilemaps e sprites da moldura, aplica as paletas originais, torna o índice zero transparente, extrai fonte/métricas e gera 291 sprites de Pokémon existentes no catálogo FRLG. Recebe opcionalmente `--source <checkout>`. Requer Python/Pillow; não participa do build. Não depende de ROM.

Arquivos locais: public/field/*.png e public/sprites/frlg/*.png; métricas em features/encounters/font-metrics.json e frlg-species.json. A cena usa resolução lógica 240×160. Campo, textos, menu, economia e regras são adaptações do Pokébobo. Os tempos e trajetórias são reconstruídos no navegador; não há promessa de equivalência integral ao cartucho. Espécies posteriores usam os sprites locais existentes. Nenhum áudio original foi extraído.

Não foi identificada licença aberta concedendo direitos sobre os gráficos de Pokémon. O código do projeto comunitário não transfere esses direitos. Esta atribuição registra a origem para o projeto de fã, no mesmo recorte não comercial das capas e sprites existentes.
