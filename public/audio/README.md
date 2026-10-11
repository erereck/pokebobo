# Som do Pokébobo

Arquivos locais, carregados sob demanda. O jogo não incorpora YouTube, anúncios, cookies do player nem URLs temporárias de streaming.

## Músicas e fanfares

Seleção de Pokémon FireRed / LeafGreen (2004), Game Freak / Nintendo / The Pokémon Company. Composição de Go Ichinose, Junichi Masuda e Morikazu Aoki, conforme os créditos da publicação fonte. Fonte: [Full Pokémon FireRed & LeafGreen OST](https://www.youtube.com/watch?v=xaznXXCHnoo), publicada por F4m1LyGuy10. Obtida em 11/10/2026 UTC usando yt-dlp 2026.8.19, formato de áudio 251 (Opus/WebM), sem vídeo.

Vinte faixas e cinco fanfares foram recortadas da primeira parte do álbum. FFmpeg 7.1: silêncio inicial/final removido, loudnorm com alvo -20 LUFS / pico -2 dBTP / LRA 7, MP3 estéreo 44,1 kHz a 112 kbit/s, fades curtos para suavizar bordas. Sem pitch shift, remix ou alteração de velocidade. Os cortes evitam a maior parte do fade do álbum; a reprodução usa crossfade de 650 ms, não os loop points de uma ROM.

Especificação dos cortes: `scripts/audio-sources.json`. Importador: `scripts/import-audio.mjs <fonte.webm> <ffmpeg>`. O [manifesto](./manifest.json) registra URL, SHA-256 da fonte, pontos de corte, duração, tamanho e SHA-256 de cada saída. A gravação fonte e as ferramentas não são redistribuídas no repositório.

## Cries

[Pokémon Showdown](https://play.pokemonshowdown.com/audio/cries/): 481 MP3 originais preservados, sem reconversão, cobrindo as 486 entradas do catálogo (485 nomes únicos). Formas usam sua própria gravação quando publicada; formas que compartilham cry usam a espécie base. Shiny usa o mesmo cry. O índice de nomes fica em `src/features/audio/cryIndex.json`; cada URL e hash estão no manifesto. Crédito dos sons: Game Freak / Nintendo / The Pokémon Company; distribuição de referência: Smogon / Pokémon Showdown.

## Efeitos do Pokébobo

UI, passos, grama, água, transição, lançamento, abertura, absorção, fechamento, quique, shakes, escape, envio, ataque, dano, status, cura, desmaio, brilho shiny e preparação/impacto psíquico são síntese Web Audio original para este projeto, com timbres de pulso, triângulo e ruído. Não são extrações dos efeitos oficiais. Receitas em `src/features/audio/chipEffects.js`. Fanfares de captura, insígnia, item, evolução e recuperação são as gravações oficiais acima.

## Titularidade e termos

Projeto de fã, sem vínculo oficial. Gravações, composições e sons Pokémon continuam pertencendo aos respectivos titulares; a publicação no YouTube ou no Showdown e os créditos de extração não concedem uma licença geral de redistribuição. Não se aplica a licença de código MIT do simulador às músicas ou cries. Consulte os [termos do YouTube](https://www.youtube.com/static?template=terms) e a [informação de copyright da Nintendo](https://www.nintendo.com/us/legal/copyrights/). Os efeitos sintetizados do Pokébobo são separados desses arquivos.
