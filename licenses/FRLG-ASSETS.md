# Gráficos e animações de campo/captura — FireRed / LeafGreen

## Pesca — 0.20.0

Folha `graphics/object_events/pics/people/red_fish.png`, na mesma revisão congelada abaixo, com 12 poses de 32×32 e paleta embutida. `scripts/import-fishing.py` torna somente o índice zero transparente e preserva pixels/poses. Arquivo local: `public/field/red_fish_sheet.png`, 2.835 bytes; fontes/dimensões/hash em `public/field/fishing-manifest.json`. Sequências de lançamento (quatro ticks por quadro) vêm de `src/data/object_events/object_event_anims.h`; offsets por pose de `AlignFishingAnimationFrames` em `src/field_player_avatar.c`. Espera/mordida de 64 ticks totais e exclamação são adaptações para o ritmo do Pokébobo. Não há minijogo original da vara. Quatro mapas são composições autorais dos tiles anteriores, não mapas canônicos.

## Partículas de batalha — 0.19.0

18 folhas originais de `graphics/battle_anims/sprites/` na mesma revisão congelada, sem ROM. `scripts/import-battle-effects.py` conserva paletas embutidas/folhas completas e torna o índice zero transparente. Hashes, fontes, quadros e termos em [public/battle-effects/README.md](../public/battle-effects/README.md) e manifesto. Canvas usa chamas, bolhas, folhas, cristais, pedras, ondas, impactos, estrelas e outras partículas; trajetórias/tempos e famílias de golpes são adaptações do Pokébobo. Não há promessa de reproduzir cada animação do cartucho; gráficos de gerações posteriores/Fada são representados com estas partículas existentes. Áudio dos golpes é síntese própria, separada dos gráficos.

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

`scripts/import-field-assets.py` recompõe seis metatiles, usando paletas, flips e camadas originais. Na 0.12.0 acrescenta treze bordas de trilha (208/209/210/216/217/218/224/225/226/254/255/262/263) e treze margens derivadas: mantém o contorno e as cores de grama dessas bordas sobre a textura de água 639. A folha tem 32 quadros de 16×16. A montagem por quadrantes e as margens de grama/água são adaptações do Pokébobo, não novos gráficos íntegros do cartucho. `scripts/import-capture-assets.py` preserva as folhas completas, recompõe tilemaps e sprites da moldura, aplica as paletas originais, torna o índice zero transparente, extrai fonte/métricas e gera 291 sprites de Pokémon existentes no catálogo FRLG. Ambos recebem opcionalmente `--source <checkout>`. Requer Python/Pillow; não participa do build. Não depende de ROM.

Na 0.12.0, a entrada usa a mesma sequência em metade dos ticks, seguida de deslocamento de seis pixels por tick. O final bem-sucedido usa oito ticks até o anúncio, 24 ticks de estrelas, 48 ticks totais de repouso/resultado e fade de 16 ticks; os tempos são adaptados para o ritmo solicitado pelo usuário.

Arquivos locais: public/field/*.png e public/sprites/frlg/*.png; métricas em features/encounters/font-metrics.json e frlg-species.json. A cena usa resolução lógica 240×160. Campo, textos, menu, economia e regras são adaptações do Pokébobo. Os tempos e trajetórias são reconstruídos no navegador; não há promessa de equivalência integral ao cartucho. Espécies posteriores usam os sprites locais existentes. Nenhum áudio original foi extraído.

Não foi identificada licença aberta concedendo direitos sobre os gráficos de Pokémon. O código do projeto comunitário não transfere esses direitos. Esta atribuição registra a origem para o projeto de fã, no mesmo recorte não comercial das capas e sprites existentes.
