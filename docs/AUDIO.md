# A jornada tem som — 0.18.0

Som no cabeçalho ativa/silencia com um toque. Opções → Som e playlist tem volumes independentes de música, efeitos e cries, teste de efeito/Pikachu, modos automáticos/livres e lista das vinte músicas. Foco, teclado, ranges e botões nativos. Preferências em `pokebobo:audio`, independentes dos slots/saves da campanha; valores inválidos voltam ao padrão. Storage negado mantém as escolhas na visita e avisa. Música 42%, efeitos 65%, cries 60% por padrão; cada canal aceita zero.

## Trilha e cenas

Playlist local de FireRed / LeafGreen: Opening; Welcome to the World of Pokémon; Pallet Town; Route 1, Route 3 e Route 12; Viridian Forest; Mt. Moon; Pewter City; Cerulean City; Pokémon Center; Surf; Battle VS Wild / Legendary / Trainer / Gym Leader; Last Battle VS Rival; Victory VS Gym Leader; Induction Into the Hall of Fame; Ending. Em Seguir o jogo, cena/bioma determinam a música sem sorteios: setup, cidades, floresta, serra/neve, lago/litoral, equipe/mochila, encontro, lendário, treinador, ginásio/Liga, campeão, resultado e encerramento. Consultar equipe durante a batalha mantém o tema da luta.

Ao retornar da captura, a faixa anterior continua na posição guardada em memória. Na playlist livre, mudar de cena mantém a escolha, Próxima/Anterior navegam circularmente e o fim da faixa avança sozinho. Ordem fixa, sem tocar no RNG. A faixa selecionada e o modo sobrevivem ao reload; posição exata de reprodução não persiste entre visitas. As músicas são gravações de álbum com crossfade, não uma emulação dos loop points/engine GBA.

## Efeitos e cries

`usePixelCanvas.onFrame` chama o áudio depois de desenhar o mesmo tick da animação. `captureCues` deriva eventos do timeline existente: lançamento, impacto/abertura, absorção, fechamento, quatro toques no chão, cada shake e captura/escape. Tick repetido não repete som; pular ou reduzir movimento toca o resultado sem despejar a sequência. A fanfare de captura pode continuar sob o retorno ao campo, sem alongar a animação. Passo no meio do tile: chão, grama ou água. Transição/intro e brilho shiny têm cues próprios.

Cries reais locais para cada entrada do catálogo, com cache decodificado limitado a 48 arquivos. Intro da captura, envio/troca de Pokémon, seleção do inicial e botão Ouvir cry na Pokédex. O turno toca efeitos com os eventos já usados para a apresentação: ataque, dano, status, cura, desmaio, envio e Future Sight/Doom Desire. O save restaurado não reexecuta o histórico de golpes. Insígnia, item adquirido, evolução e subida de nível têm fanfares/efeitos. Não mudam PP, HP, resultado ou duração do turno.

## Navegador e orçamento

AudioContext nasce somente no primeiro toque/clique/tecla elegível, respeitando autoplay e mute lembrado; nenhum áudio é baixado antes. A reprodução passa por Web Audio, inclusive músicas, para o volume valer também onde `HTMLAudioElement.volume` é limitado. Dois decks fazem crossfade de 650 ms. Cries/fanfares abaixam a música temporariamente; envelopes e compressor contêm picos. Mute interrompe fontes pendentes e música; segundo plano suspende contexto, pausa os decks e descarta cues. A volta retoma, com Ativar som como fallback caso o navegador exija novo gesto.

Arquivos MP3 carregados sob demanda, sem YouTube em runtime. Preload somente do cry visível/fanfare de captura depois de liberar o som; nada carrega as 481 vozes de uma vez. Fetch/decode tem tratamento de falha e token por cena; som que demora mais de 600 ms para chegar é descartado para não tocar depois da ação. Não há fila atrasada na volta da aba. Falhas de áudio não impedem gameplay ou autosave.

Músicas/fanfares normalizadas, silêncio de borda removido, fonte/hash/cortes/tamanhos em [manifesto](../public/audio/manifest.json). Cries preservam os bytes publicados. [Origem, créditos e titularidade](../public/audio/README.md). `scripts/import-audio.mjs` reproduz a importação com a fonte congelada e FFmpeg; `scripts/audit-audio.mjs` mede PCM decodificado. yt-dlp, FFmpeg e o WebM fonte não entram no bundle.

## Limites

Não há remix, OST de outras regiões, efeitos oficiais de cada golpe, trilha gerada nem emulador. Efeitos sintetizados são próprios, inspirados nos timbres do GBA. As cores shiny não mudam o cry. Sem Service Worker/offline integral. Verificações no Edge/Chromium com Web Audio real e celular emulado não confirmam o áudio em iOS/aparelho físico/Bluetooth; hardware, volume do sistema e políticas de áudio podem exigir novo gesto.
