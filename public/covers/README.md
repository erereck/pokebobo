# Imagens das cidades — Pokébobo 0.13.0

48 cidades do draft e Indigo Plateau: 49 arquivos WebP locais, vinculados ao id do lugar. Nenhum mapa é escolhido por bioma. As antigas folhas usadas como paisagens genéricas foram removidas; os registros históricos continuam em docs/ARTES-E-ROTAS.md.

Fonte: Bulbagarden Archives, conferida em 10/10/2026. Gráficos de Game Freak / Nintendo / The Pokémon Company. O nome de upload abaixo identifica quem publicou a revisão consultada; não atribui a essa pessoa a autoria dos gráficos do jogo. Os mapas/cenas de jogo e a arte oficial de Hau'oli conservam sua origem. Os rótulos japoneses presentes nos mapas de Galar pertencem ao arquivo de origem.

O manifesto src/game/data/cityCovers.json registra arquivo original, página da fonte, edição, dimensões, upload, revisão, data e SHA-256 do original e da cópia local. WebP sem perdas conserva todos os pixels RGBA, sem redimensionar ou editar os mapas. Os enquadramentos são feitos apenas por CSS. O conjunto ocupa 6.322.390 bytes (6,03 MiB); imagens de cada tela carregam sob demanda.

Os gráficos não são cobertos automaticamente pela licença do texto da wiki. As fichas da fonte classificam imagens de jogo/arte protegida e alegam fair use; isso registra a atribuição, não uma licença aberta sobre Pokémon. [Informações da fonte](https://archives.bulbagarden.net/wiki/Archives:Copyrights).

Reprodução: Python/Pillow, scripts/import-city-covers.py; opcional `--source-dir <originais>`. Conferido com Pillow 12.3.0/libwebp 1.6.0. O importador verifica o hash do original e compara os pixels decodificados antes de escrever. Pillow/libwebp diferentes podem gerar outros bytes; divergência exige conferir o encoder, sem substituir os arquivos silenciosamente. Não participa do build e não depende de ROM ou hotlink no jogo.

| Arquivo local      | Lugar            | Jogo                               | Upload da revisão | Fonte                                                                            |
| ------------------ | ---------------- | ---------------------------------- | ----------------- | -------------------------------------------------------------------------------- |
| `pallet.webp`      | Pallet Town      | Pokémon FireRed / LeafGreen        | Amiosi            | [Ficha](https://archives.bulbagarden.net/wiki/File:Pallet_Town_FRLG.png)         |
| `newbark.webp`     | New Bark Town    | Pokémon HeartGold / SoulSilver     | CoolPikachu!      | [Ficha](https://archives.bulbagarden.net/wiki/File:New_Bark_Town_HGSS.png)       |
| `littleroot.webp`  | Littleroot Town  | Pokémon Emerald                    | TTEchidna         | [Ficha](https://archives.bulbagarden.net/wiki/File:Littleroot_Town_E.png)        |
| `twinleaf.webp`    | Twinleaf Town    | Pokémon Platinum                   | Dannyboy601       | [Ficha](https://archives.bulbagarden.net/wiki/File:Twinleaf_Town_Pt.png)         |
| `nuvema.webp`      | Nuvema Town      | Pokémon Black / White              | Minibug           | [Ficha](https://archives.bulbagarden.net/wiki/File:Nuvema_Town_Summer_BW.png)    |
| `hauoli.webp`      | Hau'oli City     | Pokémon Ultra Sun / Ultra Moon     | Rjd1922           | [Ficha](https://archives.bulbagarden.net/wiki/File:Hau%27oli_City_USUM.png)      |
| `postwick.webp`    | Postwick         | Pokémon Sword / Shield             | Magikarp(en)      | [Ficha](https://archives.bulbagarden.net/wiki/File:Postwick_SwSh.png)            |
| `sandgem.webp`     | Sandgem Town     | Pokémon Platinum                   | Dannyboy601       | [Ficha](https://archives.bulbagarden.net/wiki/File:Sandgem_Town_Pt.png)          |
| `cherrygrove.webp` | Cherrygrove City | Pokémon HeartGold / SoulSilver     | CoolPikachu!      | [Ficha](https://archives.bulbagarden.net/wiki/File:Cherrygrove_City_HGSS.png)    |
| `oldale.webp`      | Oldale Town      | Pokémon Emerald                    | Pokeant           | [Ficha](https://archives.bulbagarden.net/wiki/File:Oldale_Town_E.png)            |
| `accumula.webp`    | Accumula Town    | Pokémon Black / White              | GuyPerfect        | [Ficha](https://archives.bulbagarden.net/wiki/File:Accumula_Town_Summer_BW.png)  |
| `pewter.webp`      | Pewter City      | Pokémon FireRed / LeafGreen        | Pokeant           | [Ficha](https://archives.bulbagarden.net/wiki/File:Pewter_City_FRLG.png)         |
| `cerulean.webp`    | Cerulean City    | Pokémon FireRed / LeafGreen        | Rjd1922           | [Ficha](https://archives.bulbagarden.net/wiki/File:Cerulean_City_FRLG.png)       |
| `vermilion.webp`   | Vermilion City   | Pokémon FireRed / LeafGreen        | Pokeant           | [Ficha](https://archives.bulbagarden.net/wiki/File:Vermilion_City_FRLG.png)      |
| `celadon.webp`     | Celadon City     | Pokémon FireRed / LeafGreen        | Pokeant           | [Ficha](https://archives.bulbagarden.net/wiki/File:Celadon_City_FRLG.png)        |
| `fuchsia.webp`     | Fuchsia City     | Pokémon FireRed / LeafGreen        | Rjd1922           | [Ficha](https://archives.bulbagarden.net/wiki/File:Fuchsia_City_FRLG.png)        |
| `saffron.webp`     | Saffron City     | Pokémon FireRed / LeafGreen        | SatoMew2          | [Ficha](https://archives.bulbagarden.net/wiki/File:Saffron_City_FRLG.png)        |
| `cinnabar.webp`    | Cinnabar Island  | Pokémon FireRed / LeafGreen        | Amiosi            | [Ficha](https://archives.bulbagarden.net/wiki/File:Cinnabar_Island_FRLG.png)     |
| `viridian.webp`    | Viridian City    | Pokémon FireRed / LeafGreen        | Pokeant           | [Ficha](https://archives.bulbagarden.net/wiki/File:Viridian_City_FRLG.png)       |
| `violet.webp`      | Violet City      | Pokémon HeartGold / SoulSilver     | Gabo 2oo          | [Ficha](https://archives.bulbagarden.net/wiki/File:Violet_City_HGSS.png)         |
| `azalea.webp`      | Azalea Town      | Pokémon HeartGold / SoulSilver     | CoolPikachu!      | [Ficha](https://archives.bulbagarden.net/wiki/File:Azalea_Town_HGSS.png)         |
| `goldenrod.webp`   | Goldenrod City   | Pokémon HeartGold / SoulSilver     | Gabo 2oo          | [Ficha](https://archives.bulbagarden.net/wiki/File:Goldenrod_City_HGSS.png)      |
| `ecruteak.webp`    | Ecruteak City    | Pokémon HeartGold / SoulSilver     | CoolPikachu!      | [Ficha](https://archives.bulbagarden.net/wiki/File:Ecruteak_City_HGSS.png)       |
| `cianwood.webp`    | Cianwood City    | Pokémon HeartGold / SoulSilver     | CoolPikachu!      | [Ficha](https://archives.bulbagarden.net/wiki/File:Cianwood_City_HGSS.png)       |
| `olivine.webp`     | Olivine City     | Pokémon HeartGold / SoulSilver     | CoolPikachu!      | [Ficha](https://archives.bulbagarden.net/wiki/File:Olivine_City_HGSS.png)        |
| `mahogany.webp`    | Mahogany Town    | Pokémon HeartGold / SoulSilver     | CoolPikachu!      | [Ficha](https://archives.bulbagarden.net/wiki/File:Mahogany_Town_HGSS.png)       |
| `blackthorn.webp`  | Blackthorn City  | Pokémon HeartGold / SoulSilver     | Sol               | [Ficha](https://archives.bulbagarden.net/wiki/File:Blackthorn_City_HGSS.png)     |
| `rustboro.webp`    | Rustboro City    | Pokémon Emerald                    | Amiosi            | [Ficha](https://archives.bulbagarden.net/wiki/File:Rustboro_City_E.png)          |
| `dewford.webp`     | Dewford Town     | Pokémon Emerald                    | Pokeant           | [Ficha](https://archives.bulbagarden.net/wiki/File:Dewford_Town_E.png)           |
| `mauville.webp`    | Mauville City    | Pokémon Emerald                    | Pokeant           | [Ficha](https://archives.bulbagarden.net/wiki/File:Mauville_City_E.png)          |
| `lavaridge.webp`   | Lavaridge Town   | Pokémon Emerald                    | Tempest370        | [Ficha](https://archives.bulbagarden.net/wiki/File:Lavaridge_Town_E.png)         |
| `petalburg.webp`   | Petalburg City   | Pokémon Emerald                    | Pokeant           | [Ficha](https://archives.bulbagarden.net/wiki/File:Petalburg_City_E.png)         |
| `fortree.webp`     | Fortree City     | Pokémon Emerald                    | Pokeant           | [Ficha](https://archives.bulbagarden.net/wiki/File:Fortree_City_E.png)           |
| `mossdeep.webp`    | Mossdeep City    | Pokémon Emerald                    | Pokeant           | [Ficha](https://archives.bulbagarden.net/wiki/File:Mossdeep_City_E.png)          |
| `sootopolis.webp`  | Sootopolis City  | Pokémon Emerald                    | Pokeant           | [Ficha](https://archives.bulbagarden.net/wiki/File:Sootopolis_City_E.png)        |
| `oreburgh.webp`    | Oreburgh City    | Pokémon Diamond / Pearl / Platinum | Abcboy            | [Ficha](https://archives.bulbagarden.net/wiki/File:Oreburgh_City_DPPt.png)       |
| `eterna.webp`      | Eterna City      | Pokémon Platinum                   | Jdthebud          | [Ficha](https://archives.bulbagarden.net/wiki/File:Eterna_City_Pt.png)           |
| `hearthome.webp`   | Hearthome City   | Pokémon Platinum                   | Master Emerald    | [Ficha](https://archives.bulbagarden.net/wiki/File:Hearthome_City_Pt.png)        |
| `veilstone.webp`   | Veilstone City   | Pokémon Platinum                   | Jdthebud          | [Ficha](https://archives.bulbagarden.net/wiki/File:Veilstone_City_Pt.png)        |
| `pastoria.webp`    | Pastoria City    | Pokémon Platinum                   | Jdthebud          | [Ficha](https://archives.bulbagarden.net/wiki/File:Pastoria_City_Pt.png)         |
| `canalave.webp`    | Canalave City    | Pokémon Platinum                   | Haxorus           | [Ficha](https://archives.bulbagarden.net/wiki/File:Canalave_City_Pt.png)         |
| `snowpoint.webp`   | Snowpoint City   | Pokémon Platinum                   | Jdthebud          | [Ficha](https://archives.bulbagarden.net/wiki/File:Snowpoint_City_Pt.png)        |
| `sunyshore.webp`   | Sunyshore City   | Pokémon Platinum                   | Jdthebud          | [Ficha](https://archives.bulbagarden.net/wiki/File:Sunyshore_City_Pt.png)        |
| `nimbasa.webp`     | Nimbasa City     | Pokémon Black / White              | RadisNoir         | [Ficha](https://archives.bulbagarden.net/wiki/File:Nimbasa_City_Spring_BW.png)   |
| `driftveil.webp`   | Driftveil City   | Pokémon Black / White              | RadisNoir         | [Ficha](https://archives.bulbagarden.net/wiki/File:Driftveil_City_Spring_BW.png) |
| `mistralton.webp`  | Mistralton City  | Pokémon Black                      | RadisNoir         | [Ficha](https://archives.bulbagarden.net/wiki/File:Mistralton_City_Spring_B.png) |
| `turffield.webp`   | Turffield        | Pokémon Sword / Shield             | Magikarp(en)      | [Ficha](https://archives.bulbagarden.net/wiki/File:Turffield_SwSh.png)           |
| `hulbury.webp`     | Hulbury          | Pokémon Sword / Shield             | Magikarp(en)      | [Ficha](https://archives.bulbagarden.net/wiki/File:Hulbury_SwSh.png)             |
| `indigo.webp`      | Indigo Plateau   | Pokémon FireRed / LeafGreen        | Amiosi            | [Ficha](https://archives.bulbagarden.net/wiki/File:Indigo_Plateau_FRLG.png)      |
