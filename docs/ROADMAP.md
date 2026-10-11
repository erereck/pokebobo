# Pokébobo — sugestões e relatório de refinamentos

## 0.18.0 — A jornada tem som · 10/10/2026

**Pedido:** implementar a sugestão 1, áudio caprichado, com playlist de músicas do game baixadas do YouTube por yt-dlp. Integração direta continua autorizada; os outros itens ficam para próximas rodadas.

**Entrega:** vinte músicas e cinco fanfares reais de FireRed / LeafGreen, da gravação publicada por F4m1LyGuy10. Trilha automática por cena/bioma, ginásio/Liga/campeão, lendário, vitória e Hall; playlist livre com escolha e avanço circular. Cries reais locais para todas as entradas do catálogo. Síntese própria para passos/grama/água, transição, arremesso, absorção, chão/shakes, envio, ataque/dano/status/cura/desmaio, shiny e ataques atrasados. CaptureCanvas usa cues derivados do timeline, sem timers paralelos; pular toca apenas resultado/fanfare, sem esperar por ela.

**Controles e robustez:** Som no topo e Opções → Som e playlist. Três volumes, zero em cada canal, mute global lembrado entre slots. Playlist ao lado dos volumes no PC, uma coluna no celular; todos os seis controles do topo cabem em 320 px. Contexto no gesto, sem MP3 antes disso; crossfade de 650 ms, retorno à posição da rota, ducking para cries/fanfares, cache de 48, cancelamento por cena e suspensão em segundo plano. Sem player/ads/YouTube em gameplay. Silêncios longos do álbum removidos, música normalizada. Save, regras, RNG e standalone preservados.

**Evidências:** 152 testes, build `/pokebobo/` e 228 módulos. Todos os 506 arquivos decodificados: 29,89 MiB, zero saturação nas músicas/fanfares e silêncio inicial máximo 71,1 ms. Quinze registros e doze fluxos no dev, repetidos no preview: controles, desktop/celular/paisagem, mute/reload/zero, cries, passos, captura, turno real, teclado, retorno de posição, fim da faixa, trocas rápidas, duas bolas/pular/reload, movimento reduzido e storage indisponível. Sem erros inesperados de console/rede ou overflow. Vídeo do canvas com o mixer real. Detalhes em [VALIDACAO](../VALIDACAO.md), [AUDIO](AUDIO.md) e manifesto.

**Limites:** sem aparelho físico/iOS/Bluetooth; medições e emulação não confirmam cada hardware. Políticas do sistema podem exigir novo gesto. Música é gravação de álbum com crossfade, sem ROM; efeitos próprios não são sons oficiais específicos de cada golpe. Direitos/termos registrados separadamente do código. Sem músicas de outras gerações/offline completo nesta rodada.

**Próximas sugestões:** prioridade 1 pronta, junto das 4/8 (Pokédex e compartilhamento). Restam cinco frentes: efeitos visuais dos golpes; exploração/segredos; IA estratégica; balanceamento com campanhas humanas; aparelhos físicos/desempenho/controles. Sugestão seguinte: verificar uma campanha no seu celular com fones, depois focar nos efeitos dos golpes aproveitando os cues de apresentação.

## 0.17.0 — Histórias para compartilhar · 10/10/2026

As prioridades 4 e 8 escolhidas pelo usuário estão implementadas: uma Pokédex para completar e jornadas prontas para divulgar.

- **Coleção:** 485 espécies/formas únicas, progresso pelas oito regiões do catálogo, registros faltantes, busca por nome/número, filtros combináveis de região/tipo/variante e ordem por número/nome/últimas descobertas. Formas de Alola/Galar pertencem à região da forma; aliases não inflam contagens.
- **Normal e shiny:** variantes registradas separadamente. Comparar aparece quando ambas foram obtidas, com sprites reais lado a lado e jornadas por variante. Ter só um shiny não concede um registro normal. A família evolutiva mostra os oito ramos de Eevee, com navegação que resolve filtros incompatíveis.
- **Divulgação:** Compartilhar jornada na tela final e em cada entrada do Hall. Cartão PNG 1080×1350 com treinador, resultado, equipe/reserva, shinies, níveis, insígnias, modo, semana e seed. QR local e convite copiável; compartilhamento de arquivo quando o navegador oferece. Sprites/fontes locais existentes, nenhuma imagem externa para compor o cartão.
- **Desafios:** link guarda dez cidades, modo, seed e RNG anterior à primeira rota. Amigo escolhe seu inicial e começa uma aventura nova com a mesma configuração; suas decisões podem mudar o resultado. Seed numérica também aceita: ofertas reproduzíveis entre slots, sem depender do número de runs anteriores. Slots em andamento não podem ser sobrescritos pelo convite.
- **Saves e versões:** schema 4 preservado, sem migração destrutiva. Novos registros guardam `challengeStartRng`; os antigos compartilham as cidades/seed quando existem, informando a ausência do sorteio inicial. Históricos incompletos continuam exportando cartão com QR para a página inicial, sem inventar equipe, níveis ou capturas.

### Validação

145 testes e build para `/pokebobo/`; auditoria do orçamento de níveis preservada. Treze testes novos de coleção/convites e seed manual: combinações de filtros, aliases/regionais, variantes/slots, família evolutiva, PNG/modelo antigo, codecs/rejeições, origem de RNG, reload/Hall, três modos e um turno real restaurado. Conferência local em 1280×800, 390×844, 320×568 e 844×390: 31 registros, download real dos PNGs, clipboard/fallback, slots preservados, convite → inicial → região → carreira → reload. Fluxos nativos de compartilhar foram simulados com sucesso/cancelamento/falha; uma imagem inválida foi injetada e recuperada por Tentar novamente. Zero erros inesperados de console/rede ou overflow horizontal. Relatórios em `docs/balance/browser-sharing*-0.17.0.json`.

Os mesmos 31 registros passaram no preview do build sob `/pokebobo/`, com fontes, imagens, import dinâmico e convites resolvidos pelo caminho da hospedagem.

QR decodificado do PNG inteiro em 1080, 720, 540 e 390 px de largura, sempre com o convite correto. Reduções nearest-neighbor sem compressão JPEG; isso não substitui verificar a imagem depois de cada rede social recomprimir. Fontes/licenças do QR incluídas no build. Gerador/QR em chunk carregado apenas ao abrir um cartão.

### Limites e próximas sugestões

- Sem teste em aparelho físico/iOS ou envio real a WhatsApp/Instagram; a exportação/download é real, os testes de Web Share usam mocks. PNG + link continuam disponíveis quando a API nativa não existe. Catálogo mostra o recorte jogável, não uma Pokédex nacional completa.
- Convites não são multiplayer, ranking ou replay de decisões. Um modo recebido pode ser jogado nessa jornada mesmo sem título local; não desbloqueia os modos para aventuras comuns. Saves continuam locais e editáveis pelo dono do aparelho.
- O formato atual é PB1. Se regras/dados iniciais mudarem de forma incompatível no futuro, incrementar o formato e rejeitar com aviso; não prometer que a mesma seed atravessa versões arbitrárias.
- Depois destas prioridades, ficam os outros seis itens combinados: áudio; efeitos próprios dos golpes; exploração/segredos mais ricos; IA estratégica; balanceamento com campanhas humanas; celular físico/desempenho/controles. Minha primeira sugestão para a rodada seguinte é áudio e efeitos dos golpes.

Guia completo: [POKEDEX-E-COMPARTILHAMENTO.md](POKEDEX-E-COMPARTILHAMENTO.md).

## Entrega de 10/10/2026 — 0.16.0: Batalha na medida

**Pedido:** melhorar o tamanho dos Pokémon em batalha, especialmente Pidgey gigante, aplicando a proposta de escala visual por espécie, geometria visível, estabilidade e apoio. Integração direta permanece autorizada; último update da noite.

**Causa:** `52 + sqrt(altura) * 30` aproximava pequenos/grandes: Pidgey preenchia 68% da caixa, Charizard 91%. Width/height percentuais com object-fit aumentavam imagens pequenas para caber em caixas semelhantes; limites responsive também alteravam o resultado.

**Implementação:** tabela para 485 espécies/formas com frente/costas separadas em 2D/3D, derivada dos desenhos originais e ajustes de pequenos, evoluções e gigantes. União dos limites não transparentes de todos os frames gera um posicionamento fixo por arquivo. `BattlePokemonSprite` observa a caixa da cena, lê o limite CSS e posiciona o sprite pela imagem efetivamente carregada; margens transparentes não afastam o corpo da plataforma. Calibração, proporção e âncora ficam constantes no ciclo, com 12% de perspectiva nas costas e limites de largura/altura. Algumas espécies flutuantes ficam um pouco acima do apoio. Fonte que cai para fallback usa sua própria geometria; normal agora também prefere a forma 2D local antes dos fallbacks anteriores. Fonte externa com dimensões novas mantém sua proporção efetiva. Animações de ataques continuam controlando transform/opacity e não competem com os offsets de layout.

**Medição e validação:** 4.848 fontes / 227.842 quadros, índices leves na apresentação e manifestos separados do bundle. 132 testes, 203 módulos e build Pages. 57 registros locais de navegador em quatro visores, corpo/proporção/escala estáveis, turnos/reload/trocas, shinies, quatro golpes, resize/tela cheia e falhas controladas; quatro imagens anteriores para comparar. Sem novos assets de imagem, sem tocar regras/RNG/save. Detalhes e limites em VALIDACAO.md; relatórios anteriores preservados abaixo.

**Limites/próxima sugestão:** não foi testado em celular físico/iOS. A escala é visual e estilizada; metros literais tornariam gigantes inviáveis e pequenos ilegíveis. União do ciclo preserva asas/caudas, então algumas poses ficam menores dentro do limite. A tabela pode receber ajustes pontuais se o usuário identificar outra espécie desproporcional. Próxima sessão pode focar exclusivamente na experiência jogando em aparelho físico, com prioridade para leitura em telas pequenas.

## Entrega de 10/10/2026 — 0.15.0: Uma estrela no mato

**Pedido:** conferir se já havia shiny e, se não, adicionar chance de 1/1024. Não havia implementação, apenas fontes externas com variantes. Continuação e integração direta permanecem autorizadas.

**Regra:** cada inicial escolhido e novo encontro recebe um sorteio único em fluxo independente, derivado da seed. Rotas, pesca/surf e eventos especiais usam a mesma chance, sem bônus. Repetir a captura/recarregar não muda a marca. Dados anteriores não ganham raridade retroativamente; futuras rotas de saves antigos usam a nova regra. Pokémon de adversários continuam normais.

**Persistência e visual:** captura carrega a marca no resultado animado e no Pokémon; evolução, reserva, coleção, snapshots de batalha, Hall e Pokédex preservam o campo. Showdown recebe a marca no set e o snapshot a lê de `pokemon.set.shiny`. Cores reais dos sprites, sem filtros de tonalidade. Frente/costas 2D locais para todas as formas; animações 3D usam a variante correspondente, com fallback shiny local. Captura de espécies originais usa paletas FRLG; posteriores usam primeiro frame BW em quadrado transparente, sem distorcer proporção. Estrela pequena identifica raridade e a Pokédex filtra as espécies shiny registradas; hover selecionado corrigido para conservar contraste.

**Evidência:** 127 testes, 201 módulos de código e build web de Pages; casos de limite 1/1024, independência do RNG, falha/retry/reload, evolução ramificada na reserva, Hall/Pokédex e batalha real/replay. 41 registros de navegador em quatro visores, incluindo 2D/3D e turnos reais; todos os 1.746 novos arquivos decodificados. 60.871 quadros dos 970 sprites de batalha conferidos com Pillow; manifestos verificam origem e SHA-256. Detalhes e relatórios em VALIDACAO.md.

**Limites e próxima sugestão:** não validado em telefone físico/iOS. Raridade é por Pokémon gerado, não por passo ou bola; criar outra run usa outra seed. Os adversários não sorteiam shinies. Um PNG de Mr. Mime-Galar tem CRC inválido somente no perfil ICC publicado; o navegador ignora o metadado e os pixels são íntegros. Importador remove apenas esse metadado ao gerar o primeiro frame. Assets locais acrescentam aproximadamente 37 MiB, carregados sob demanda. Uma futura melhoria possível é permitir comparar normal/shiny na ficha da Pokédex quando ambas as variantes forem registradas. Relatórios anteriores preservados abaixo.

## Entrega de 10/10/2026 — 0.14.0: Batalhas em pixels

**Pedido:** conferir o botão do Hall após perder, verificar Future Sight e oferecer sprites 2D em vez de 3D na batalha. Integração direta continua autorizada.

**Hall:** `Ending` já tinha o botão/onHall, mas `App` não passava o callback. A ligação foi restaurada; derrota real, recarga, Escape/foco, título e encerramento foram conferidos. A janela usa os registros existentes e não finaliza a run novamente.

**Future Sight:** o motor Gen 8 já preparava e resolvia o ataque corretamente, mas a apresentação descartava as mensagens -start/-end e falhas, fazendo o dano posterior parecer sem origem. O parser mostra preparação, chegada e tentativa de empilhar; o snapshot lê a condição pública do lado e a UI mostra o ataque pendente e a espera. A sequência remove o marcador na chegada e aplica HP somente no evento de dano. Testes reais verificam terceiro turno, PP, troca do alvo/lançador, Dark, Protect, repetição, lado adversário e reload. Nenhuma fórmula, política de IA ou RNG foi modificada.

**2D/3D:** preferência global ao navegador, independente dos slots e do save da carreira. Os dois lados da arena mudam imediatamente; alterar durante um turno não cancela/reexecuta decisões. Opções reutiliza botões nativos, seleção por aria-pressed e área de 44 px. O estado selecionado/hover conserva contraste. 970 arquivos locais cobrem 485 espécies/formas distintas, com frente/costas, 945 animações e 25 imagens estáticas; formas regionais e alias de Oricorio preservados. Manifesto registra fonte exata/hash e o importador verifica os bytes. Termos/créditos distinguem código de gráficos e adaptações da comunidade.

**Evidência:** 118 testes, 198 módulos, build de Pages, 970 imagens/60.925 quadros decodificados e 55 registros locais de navegador. Fluxos normais sem erros; um 404 deliberado e recusa de storage tratados. Saves mantidos, fontes de 3D/captura existentes preservadas. Detalhes/limites em VALIDACAO.md; relatórios anteriores abaixo.

**Limites e próxima melhoria possível:** sem teste em telefone físico; GIFs seguem suas animações originais. O 2D completo acrescenta 36,31 MiB de assets estáticos, carregados por Pokémon visível, e não entra como dados de imagem no JS. A IA mantém a política anterior; uma análise estratégica de ataques atrasados seria uma alteração separada, para não modificar retroativamente decisões de batalhas salvas.

## Entrega de 10/10/2026 — 0.13.0: Mapas da jornada

**Pedido:** completar as imagens faltantes durante a criação da região e tirar placeholders que mostram lugares errados. Continuação com integração direta já autorizada.

**Causa e solução:** a seleção anterior tinha uma capa específica de Littleroot e reaproveitava outras cinco folhas de Emerald por bioma; Pallet podia aparecer como Safari Zone e cidades costeiras como Abandoned Ship. O manifesto agora contém uma imagem por id para todas as 48 cidades disponíveis, mais Indigo Plateau. Não há fallback por bioma nem paisagem SVG fictícia. Se uma imagem falhar ou um save trouxer um id desconhecido, nome e escolhas continuam disponíveis sem mostrar uma cidade substituta.

**Arte e interface:** 49 imagens originais dos Bulbagarden Archives, locais e convertidas sem perdas, preservando resolução/pixels. Kanto FRLG, Johto HGSS, Hoenn Emerald, Sinnoh Platinum/mapa compartilhado DPPt, Unova Black/White, Hau'oli USUM e Galar Sword/Shield, com edição registrada. Enquadramento por CSS; arte de Alola/Galar não recebe pixelização artificial. Partida, jornada e arena seguem o lugar escolhido; a Liga tem sua imagem própria. Créditos mostram lugar, edição e responsável pelo upload, com filtro por região. Originais, revisões, dimensões e hashes constam no manifesto/importador; conjunto de 6,03 MiB carregado sob demanda.

**Evidência:** 107 testes, arquitetura e build de publicação. 80 registros locais: todas as cidades em três tamanhos, três drafts completos, galeria, Liga, batalha real e 404 controlado sem placeholder. Preview de Pages conferido no PC/celular com os 49 arquivos decodificados. Importador reproduziu bytes e pixels de todas as imagens. Relatórios e limites em VALIDACAO.md; relatórios anteriores preservados abaixo.

**Limites:** os mapas de Galar mantêm inscrições japonesas, e Hau'oli usa arte oficial do lugar, identificada como USUM. O enquadramento das capas recorta a folha visualmente; arquivos completos permanecem preservados. Uma revisão em aparelho físico continua útil. Sem alterações em progressão, captura, seed ou formato do save.

## Entrega de 10/10/2026 — 0.12.0: Mais uma Poké Bola

**Pedido:** ocultar oportunidades e limitar a rota a 50 passos; acelerar entrada/finalização; retirar nome, anúncio e probabilidade duplicados; reduzir o nível na caixa de HP; permitir novos lançamentos com 67% de chance base; estabilizar Voltar enquanto os controles ficam pressionados; suavizar as margens de terra/água. Continuação do refinamento com merge direto já autorizado.

**Regras:** movimentos válidos contam até 50, sem contador. O último passo termina visualmente antes de sair e não sorteia outro encontro. A saída resolve a semana uma vez, com avanço/evento/batalha normal quando aplicável. Rota antiga já acima do limite sai ao abrir o campo. CAPTURE continua debitando uma bola e salvando o resultado antes da animação; só marca a oportunidade como usada ao capturar, fugir ou gastar a última bola. A falha conserva o mesmo Pokémon, nível, índice/evento e semana; não entrega Pokémon nem modifica reserva. O bônus de evento vale para o lançamento seguinte, uma vez. Chance comum 67%; lendários e recompensa do roubo preservam suas regras específicas.

**Apresentação:** entrada terrestre em cerca de 1,12 s e aquática em 1,46–1,49 s no Edge testado. Pulsos e cortes/ondulação continuam, com passagem mais rápida e deslocamento de seis pixels por tick. O final passou de 348 para 65 ticks após a última sacudida, preservando 24 ticks de estrelas. A conclusão retorna automaticamente ao campo ou ao menu do mesmo selvagem na falha, sem novo efeito de entrada. Nome/nível permanecem na caixa de HP; nível a 75% da fonte. Textos externos removidos, status acessível preservado. Rodapé guarda espaço estável para o destino com time cheio; retry conserva o substituto e devolve foco ao lançamento quando o controle anterior desaparece.

**Campo e arte:** o estado de controles pressionados fica separado da direção em repetição; Voltar não se libera a cada término de passo, nem ao atingir uma borda. O atlas passou de seis para 32 quadros, com treze bordas originais de trilha e treze margens derivadas de grama/água. Quadrantes consideram vizinhos e diagonais, cobrindo corredor de uma casa, cruzamentos e cantos internos. Colisão, RNG, quantidade de oportunidades e marcos de pesca/Surf não dependem desses gráficos. Importador aceita checkout local; origem e transformação documentadas.

**Validação:** 104 testes, 195 módulos, build e auditoria. 99 registros locais de navegador, oito tamanhos, incluindo retry/sucesso, última bola, fuga, evento, reserva lotada, reload a 1×, duplo clique, controles segurados/soltos, 50º passo e saves antigos. Nenhum erro nos fluxos normais; um 404 intencional valida fallback. 60 campanhas de política equilibrada com batalhas reais, 20 por modo: 3 títulos no Clássico, um na Correria e zero no Nuzlocke, sem truncamentos. Medições e limites completos em VALIDACAO.md; relatórios anteriores preservados abaixo.

**Limites e próximas sugestões:** a amostra de IA não mede a experiência humana nem isola o efeito da chance de captura. Não ajustar níveis/estoque a partir desses títulos isoladamente; uma próxima rodada pode registrar bolas gastas por captura e comparar políticas nas mesmas seeds. Campo e margens são adaptações com gráficos de FRLG, sem promessa de cartucho idêntico. Uma sessão em telefone físico/iOS continua útil para avaliar toque, foco e tela cheia.

## Entrega de 09/10/2026 — 0.11.0: Ritmo de Kanto

**Pedido:** polimento geral de fontes, botões, enquadramento e animações; corrigir o salto da bola na absorção e a sobreposição do mato; controles segurados, tela cheia junto da Pokédex, entrada no encontro e menu de captura melhores. Merge direto autorizado pelo usuário após revisão.

**Captura:** o salto tinha uma causa diferente do pouso corrigido antes: vários quadros de absorção compartilhavam o objeto da bola que depois era movido para o chão. Cada quadro agora recebe uma cópia. O arco chega exatamente ao primeiro quadro de abertura, e a bola mantém a posição durante absorção/fechamento antes de cair em y=70. Fonte, cursor, estoque e menu são desenhados no mesmo canvas para evitar escalas distintas; os dois botões nativos transparentes preservam foco e acessibilidade. Na falta de asset, passam a mostrar texto e permitem sair. Texto quebra entre palavras e respeita a moldura; quatro glifos com til foram recompostos com letras e acento originais.

**Campo e entrada:** a máscara de mato acompanha somente os pés, intersectando as casas sob eles em vez de repintar todo o tile de destino antecipadamente. Setas/WASD e ponteiro podem ficar pressionados, um passo após o outro. Repetição nativa não acelera o movimento reduzido. Release, blur, janela aberta, aba oculta e desmontagem encerram o comando. A entrada reconstrói os dois pulsos cinza da referência, Slice por linhas alternadas na grama e Ripple no lago; depois Red e Pokémon deslizam para a cena. Nenhum efeito visual consome RNG.

**Visor:** ResizeObserver ajusta a cena ao espaço que sobra, mantendo proporção, pixels e áreas de toque. O rodapé reserva espaço estável para que a tentativa não redimensione a cena ao esconder as opções de destino. Campo/captura e controles passam a caber nos oito tamanhos inspecionados. Ficha/golpes e reserva alternam dentro da Equipe; seis seletores permanecem juntos, e o modo horizontal usa duas colunas. Mochila tem estoque/ações/equipamentos mais compactos; mapa usa a altura livre; jornada horizontal mantém preparação e avanço visíveis. O botão de tela cheia fica imediatamente após a Pokédex e acompanha o estado real do navegador.

**Evidência:** 97 testes, arquitetura (194 módulos), build e auditoria de progressão; 125 registros no Edge/Playwright, incluindo seis Pokémon, reserva cheia, batalha real, reload e movimento reduzido. Os fluxos normais ficaram sem erros de console/rede; um 404 controlado validou recuperação. Hit-tests conferem que um botão não fica coberto por outro painel. Relatórios `docs/balance/browser-*-0.11.0.json` e detalhes em `VALIDACAO.md`. Regras, sorteios e economia não mudaram. Relatórios anteriores preservados abaixo.

**Limitações e próximos passos:** validar em telefone físico e Safari/iOS, particularmente tela cheia e barras do navegador; listas extensas continuam rolando dentro do visor. A referência FRLG orienta quadros/timings, sem emular integralmente uma ROM. Áudio e novas regras não fazem parte desta entrega. Próximo refinamento útil: navegação por controle externo e avaliação de leitura física das inscrições pequenas, sem reduzir áreas de toque.

## Ajuste final de 09/10/2026 — pouso da Poké Bola

**Pedido:** corrigir a bola abaixo da grama e integrar o PR após a correção.

**Causa e mudança:** o pouso seguia o centro vertical do sprite selvagem; espécies pequenas, como Eevee, usam um deslocamento maior e levavam a bola para baixo da plataforma. O chão agora é fixo em y=70. A queda parte do ponto atual de absorção, e a amplitude dos quatro quicados diminui proporcionalmente até o repouso. Sacudidas, estrelas e fuga usam a mesma posição final.

**Validação:** 94 testes, arquitetura e build; teste de altura para cinco posições de Pokémon e ambos os resultados. Inspeção no Edge em desktop e telas 390×844/320×568, incluindo grama e água; nenhum erro de console/rede/overflow. GIF atualizado. Sem mudança de regra de captura ou progressão. Relatório anterior preservado abaixo.

## Entrega de 09/10/2026 — 0.10.0: Passos de Kanto

**Pedido:** ampliar o mato e aproximar a caminhada e a captura de FireRed/LeafGreen, incluindo o treinador de costas jogando suas Poké Bolas normais numa cena ao estilo Safari Zone.

**Campo:** a grade 12×8 mantém o lago e contém pelo menos vinte casas contínuas de mato (22 na configuração atual). Os centros já definidos pela seed variam a borda da área. Não existem marcadores numerados nem gatilhos em uma casa exata: cada passo no mato elegível tem 22% de chance, com garantia ao décimo passo sem encontro. Após resolver um encontro, dois passos de intervalo evitam reentrada imediata. Isso limita espera, sem criar oportunidades extras ou gasto de semanas. As duas ou três oportunidades continuam persistentes; as do lago continuam compartilhadas entre Fishing Rod e Surf.

**Movimento:** sprite 16×32 original em nove quadros; sul/norte/oeste usam suas sequências e leste espelha oeste. Passo de 16 ticks a 60 Hz, quadro de perna por oito ticks e repouso por oito. Red desloca-se um pixel por tick; o efeito original do mato segue a ordem 1/2/3/4/0, dez ticks por quadro, cobrindo os pés. Passos em andamento bloqueiam outro movimento, pesca e saída; reload termina o mesmo passo e abre o encontro já escolhido.

**Captura:** a cena usa resolução lógica 240×160, nearest-neighbor, fundos de grama/água e caixa de texto recomposta dos tilemaps. Red de costas segue os quadros 1/2/3/4/0 em 20/6/6/24/1 ticks, com deslocamento horizontal da referência. Arremesso inicia no tick 20; arco dura 34 ticks e tem amplitude −40. Abre em dois quadros de cinco ticks, absorve o Pokémon, fecha, executa quatro quicados com alturas decrescentes e espera 31 ticks entre sacudidas. Partículas, estrelas, paletas e fades foram reconstruídos com RGB de 5 bits. O Pokémon reaparece na falha; no sucesso a bola fecha, escurece, lança estrelas e desaparece. O menu oferece Poké Bola normal/Fugir. A apresentação pode ser pulada e respeita movimento reduzido.

**Dados e economia:** CAPTURE sorteia e salva o resultado uma vez; CAPTURE_FINISH, validado pelo id da tentativa, aplica o Pokémon à equipe/reserva e à coleção. A apresentação não sorteia nada. Durante captura pendente, outras ações de gameplay são bloqueadas. Simulação instantânea e apresentação animada usam o mesmo resultado e a mesma conclusão. O nível é definido ao revelar o Pokémon; a faixa, chances, bolas por tentativa, semanas e marcos de pesca/Surf foram preservados.

**Assets e método:** gráficos e sequências consultados no pret/pokefirered, commit 037335f4c725d7c9aecdac87066f2002b4bd7e14. O importador Python/Pillow gera folhas completas do treinador, Red de costas, Poké Bola, partículas, mato, fundos, molduras, fonte e 291 sprites de espécies existentes no catálogo original. Assets e métricas ficam locais; build e gameplay não dependem do importador nem de requests externos para essa cena. Direitos e origem registrados em licenses/FRLG-ASSETS.md.

**Validação e medidas:** 188 módulos, 93 testes, build e auditoria. 18 registros do navegador em desktop, 390×844 e 320×568; fluxo completo, recarga durante animação, falha/sucesso, substituição com reserva cheia, lago, espécie recente e movimento reduzido. Zero erros de console/rede/overflow. 140 campanhas reais, quatro políticas, sem truncamentos; equilibrada 5/15 títulos no Clássico, Correria 0/40 e Nuzlocke 1/40. A movimentação passou a consumir RNG em passos elegíveis e o nível ao revelar o encontro; diferenças por seed em relação a versões anteriores não isolam causa nem justificam ajuste de dificuldade nesta entrega.

**Limites:** Fidelidade visual baseada nos gráficos e nas sequências de FRLG; não é um emulador do cartucho. O mapa, os textos em português, as regras de captura e os comandos por navegador são adaptados. Espécies/formas posteriores ao FRLG usam os sprites locais existentes. Não foram adicionados áudio, ROM, isca ou pedra. Uma oportunidade permite uma tentativa; falhar encerra esse encontro. A cena representa sacudidas a partir do resultado persistido, não executa a fórmula de captura do cartucho. Sem teste físico em celular nem campanha humana completa.

**Próximas sugestões:** jogar em celular físico para avaliar alvos do menu e leitura; medir a dificuldade da Correria com uma amostra maior e jogadores; considerar áudio e transições de entrada como uma entrega separada, com fontes e medições próprias. Relatório anterior preservado abaixo.

## Entrega de 09/10/2026 — 0.9.0: Rotas Vivas

**Pedido:** integrar todos os itens da imagem: exploração com matinhos e lago, eventos com objetivo e lendários, um roubo por run, tamanho dos Pokémon em batalha, Pokédex com jornadas e escolha de evoluções ramificadas; Fishing Rod a partir do terceiro ginásio.

**Exploração:** grade procedural 12×8 com tiles e treinador de FRLG locais. Cada cidade tem 2–3 oportunidades persistentes. A caminhada inteira gasta uma semana; cada tentativa gasta uma bola. Você pode capturar vários encontros, sair sem capturar e continuar andando após uma tentativa. O fim da última semana só se resolve ao encerrar a exploração. Teclado (setas/WASD), casas vizinhas e controles por toque usam as mesmas ações do reducer.

**Lagos e progressão:** a terceira insígnia libera Fishing Rod e a quinta libera Surf; mochila, recibo de vitória e diário informam os marcos. Dois encontros terrestres e um aquático após a terceira insígnia. Pesca e Surf usam seleções diferentes, mas compartilham uma única oportunidade por rota. Não há pesca infinita, gasto adicional de semana nem farming de níveis na caminhada.

**Evoluções:** ramificações aguardam escolha explícita com sprite, tipo, especialidade e nível mínimo. Eevee oferece oito destinos; Pikachu também respeita seus ramos. Você pode adiar, reabrir pela ficha ou esperar outro nível, incluindo a reserva. Evoluções simples continuam automáticas. Escolhas e novos golpes são resolvidos antes de iniciar uma batalha pendente; reload preserva a decisão e retoma o mesmo ginásio.

**Eventos:** catálogo cresce de 57 para 69. As novas missões envolvem nascente, pegadas, pesquisa de evolução, pesca, Surf, ponte, censo, estoque e preparação. Mew e Suicune exigem pista, seis insígnias e uma oportunidade máxima de lendário na run: 48% base, até 60% com o bônus normal de evento, e cinco níveis abaixo da faixa selvagem normal. O roubo de Eevee acontece somente após vencer um contrabandista, usa uma bola e é garantido; há um único roubo por run, e perder a batalha continua encerrando a jornada.

**Pokédex:** registro de inicial, captura, roubo e evolução com slot, seed, treinador, número da run, semana e nível. Persistência global com cópia de recuperação e registro da coleção no Hall. Espécies removidas da equipe continuam no arquivo. Saves anteriores recuperam as equipes conhecidas, identificadas como registro antigo; não se inventam capturas que já tinham sido perdidas. A tela tem busca, filtro de registrados/catálogo, linha evolutiva e runs de origem.

**Batalha e celular:** escala visual comprimida pela altura da espécie; pequenos permanecem legíveis e gigantes cabem na arena. A altura vem do Showdown no catálogo gerado. Janela de evolução com lista rolável e decisões visíveis em 320×568; mapa, controles e saída cabem no visor pequeno. Cabeçalho com quatro ferramentas sem cortar botões. Os novos assets têm importador, origem congelada e créditos em licenses/FRLG-ASSETS.md.

**Balanceamento medido:** 280 campanhas reais na versão final (120 Clássico, 80 Correria, 80 Nuzlocke), quatro políticas e seed 20261009; zero campanhas truncadas. Mais 120 campanhas da 0.8.1 para referência. A política equilibrada teve 9/30 títulos no Clássico e 2/20 na Correria. Nuzlocke permanece exigente: 2/20 títulos na política de treino; as demais não ganharam nesta amostra. São políticas automáticas, não probabilidades de pessoas. Métodos e JSONs estão em docs/balance/adventure-\*.json. Ordem de RNG mudou com conteúdo novo, portanto a comparação é exploratória, sem atribuição causal por seed.

**Ajuste adotado:** a primeira medição da Correria teve zero títulos em 80 campanhas. Treinos nesse modo recebem +1 nível: média de +3 por treino em duas semanas, alinhando o orçamento de treino puro aos +2 médios em três semanas do Clássico. Regras de líder/+6 e punição Nuzlocke foram preservadas. O simulador passou a caminhar, resolver ramificações, respeitar falta de bolas e usar vagas disponíveis da reserva; ações sem progresso geram diagnóstico em vez de loops silenciosos.

**Validação:** 179 módulos sem ciclos, 87 testes, build Vite e auditoria de progressão. Inspeção e fluxos no Edge headless em 1280×900, 390×844, 320×568 e batalha 844×390. Escolha → evolução → reload; exploração por teclado/toque → captura → reload → pesca → saída → Pokédex; sprites e layout de batalha. Console, imagens quebradas, overflow e cabeçalho conferidos. Dependência source-map-js atualizada dentro da faixa existente; npm audit sem vulnerabilidades.

**Limites:** não houve campanha humana completa nem teste em aparelho físico. Estratégias automáticas escolhem o primeiro ramo disponível e a primeira opção de eventos; ainda não exploram todas as combinações. Os gráficos novos de campo são originais de FRLG; as seis capas de referência de Emerald continuam na cidade/captura/batalha. Não há atualização do HTML standalone nem deploy de hospedagem nesta entrega.

**Próximas sugestões:** testar as escolhas de evolução em jornadas humanas; observar dificuldade Nuzlocke e diversidade de times antes de mexer em níveis de líderes; ampliar as pistas secretas somente com novas medições de economia.

---

## Entrega de 18/09/2026 — 0.5.0: Legado

**Direção:** transformar progressão e histórico em sistemas permanentes, sem criar grind de item para evolução e sem sacrificar saves a cada mudança de schema.

**Evoluções especiais por nível:** evoluções por amizade, golpe conhecido, item/pedra, troca e outras condições recebem um nível substituto. A prioridade é simplicidade: nenhum item de evolução, trade externo ou submenu novo. Se a própria espécie já possui nível mínimo no dado do Showdown, esse nível continua sendo usado. Para linhas com mais de um destino, cada Pokémon recebe um caminho determinístico baseado no próprio id; o mesmo Pokémon não troca de ramo depois de recarregar.

**Hall da Fama / arquivo de carreiras:** R04 deixa de ser pendência. O cabeçalho ganhou acesso permanente ao Hall, também disponível em Opções e no encerramento da run. Campeões recebem destaque, mas derrotas, Nuzlockes encerradas e runs abandonadas também entram no mesmo arquivo. Novas entradas guardam equipe final com níveis, modo, seed, rota, etapa da Liga, motivo do fim, número de acontecimentos e até oito momentos recentes do diário. Entradas antigas continuam visíveis com os dados que já possuíam.

**Persistência:** SAVE_VERSION passa a 4. A regra antiga de rejeitar qualquer versão diferente foi removida. Saves reconhecíveis são normalizados para o schema atual e estruturas ausentes das Semanas Vivas são preenchidas. Antes da migração, o JSON anterior é copiado para `pokebobo.save.backup.v1`; conteúdo corrompido também é preservado nessa chave antes do fallback. A regra daqui em diante é: mudança de schema exige migração, não reset automático.

**Arquivo:** o histórico cresce de 20 para 100 jornadas. Isso preserva espaço para um Hall útil sem deixar o localStorage crescer indefinidamente.

**Verificação:** workflow Verify verde com **158 módulos**, **59/59 testes**, build Vite com **2.036 módulos transformados** e auditoria de progressão concluída. Os novos testes cobrem evolução especial, caminhos com nível substituto, migração v3→v4, migração de schemas antigos reconhecíveis, cópia de recuperação, campeão com snapshot rico e run sem título no Hall.

**Limites:** a auditoria de progressão mede orçamento de níveis, não a força adicional que uma evolução especial pode trazer para uma equipe real. Não houve nova campanha humana nem inspeção visual em aparelho físico do Hall nesta entrega; o layout está coberto por build e CSS responsivo.

## Entrega de 18/09/2026 — 0.4.0: Semanas Vivas

**Direção:** aprofundar o espaço entre ginásios em vez de empilhar mais conteúdo de batalha. A jornada agora reage às semanas gastas e às decisões anteriores.

**Sistema:** depois de uma semana concluída, o jogo pode abrir um acontecimento antes de emboscada/viagem/ginásio. A chance é 72% no Clássico/Nuzlocke e 82% na Correria. O catálogo tem **57 acontecimentos**; os dez mais recentes ficam fora do sorteio quando há alternativas, reduzindo repetição. Eventos também podem exigir número de insígnias, recursos, tamanho de equipe, ação da semana ou flags de escolhas anteriores.

**Consequências:** as decisões podem alterar Poké Bolas e berries, dar níveis à equipe ou ao líder, preparar berries, devolver ou consumir orçamento de ação, melhorar a próxima captura/treino/busca, bloquear futuras emboscadas, abrir um encontro extra sem nova semana ou iniciar uma batalha com recompensa pendente. Não foi criada moeda, reputação global ou árvore de habilidade paralela.

**Memória da run:** decisões como devolver uma mochila, ajudar um Pokémon ferido, investigar um meteoro ou seguir um mapa antigo podem ativar follow-ups específicos mais adiante. O histórico completo fica determinístico porque sorteios e resultados usam o RNG persistido da própria run.

**Interface:** a fase `event` ganhou uma tela dedicada com raridade, narrativa curta, 2–3 decisões, efeito previsto, estoque e bônus ativos. O texto permanece compacto; não virou visual novel.

**Compatibilidade:** SAVE_VERSION continua 3. Runs antigas recebem estruturas de evento apenas quando o sistema precisa delas; nenhuma migração paralela ou motor antigo foi criado.

**Medição ainda necessária:** esta entrega altera bastante a economia. O Monte Carlo agora resolve eventos automaticamente, mas a política usa a primeira opção disponível e portanto serve para detectar regressão/truncamento, não para medir a qualidade estratégica humana das escolhas. Depois da validação funcional, uma nova rodada de balanceamento deve comparar 0.4.0 com 0.3.0.

**Próximos candidatos:** teste físico mobile continua importante. Depois dele, Hall da Fama visual e escolha simples de golpe permanecem fortes; antes de mexer em níveis de líderes, medir o impacto dos novos eventos sobre progressão e estoque.

## Entrega de 18/09/2026 — C03: turno em sequência

**Pedido:** concluir e mergear o C03, que estava parcialmente resolvido desde a 0.2.0/0.3.0.

**Aplicado:** a interface agora pré-simula a escolha com o mesmo replay determinístico do motor e apresenta a resolução antes de confirmar a decisão no estado real. Ataque, mudança de HP, status, cura, queda e troca aparecem em ordem; o último nocaute permanece visível antes da tela de resultado. Durante essa sequência, novos comandos ficam bloqueados e voltam imediatamente quando a apresentação termina.

**Velocidade e acessibilidade:** a batalha ganhou alternância 1×/2× persistida apenas como preferência local de interface, sem alterar save ou regras. prefers-reduced-motion remove o movimento via CSS e encurta as pausas da sequência.

**Estrutura:** o protocolo do Showdown é convertido em eventos de apresentação com índice estável. O registro textual passa a usar a mesma fonte desses eventos, evitando duas traduções divergentes. O snapshot de batalha inclui apenas eventos derivados; nenhuma informação nova entra no save e nenhuma decisão do motor muda.

**Verificação:** GitHub Actions executou npm run verify: arquitetura válida com **151 módulos**, **47 testes passaram**, zero falhas e build Vite concluído. Quatro testes novos cobrem ordem/lado/HP dos eventos, blocos split, dano/status/queda/troca e seleção apenas dos eventos do turno novo.

**Limites desta entrega:** a validação automatizada cobre motor, parser e build, mas não substitui uma run em aparelho físico. A animação usa o estado exato disponível no protocolo; efeitos cosméticos que não geram evento específico continuam representados pelo texto do registro. O teste físico mobile segue pendente.

**Próximas sugestões:** Q03 em celular físico passa a ser a prioridade imediata. Depois, R04 (Hall da Fama visual) e C09 (escolha simples de golpe) continuam sendo os refinamentos de maior impacto sem inflar o escopo.

## Entrega de 15/09/2026 — repositório e fluxo web

**Pedido:** centralizar o projeto em [erereck/pokebobo](https://github.com/erereck/pokebobo) e encerrar a atualização/distribuição do HTML standalone.

**Aplicado:** código, assets, testes, licenças, relatórios e documentação publicados na `main` do repositório; imagens da interface em `docs/images/`. Importação inicial no commit `e1a20f0`, com 761 arquivos e envio remoto confirmado. README atualizado para clonar e executar o jogo. `npm run verify` agora faz arquitetura, testes e build Vite. A instrução de não regenerar nem enviar o standalone está em AGENTS.md e no .gitignore; o gerador antigo permanece somente como referência.

**Escopo:** nenhuma mudança no jogo ou no schema dos saves; continua 0.3.0. `index.html` é a entrada necessária do Vite e faz parte do código. `Pokebobo.html`, ZIPs de distribuição, `node_modules/` e `dist/` ficam fora do repositório.

**Verificação e entrega:** confira [VALIDACAO.md](../VALIDACAO.md). A validação anterior do jogo está [arquivada](archive/VALIDACAO-0.3.0.md), assim como o [relatório original da UI](archive/ROADMAP-0.3.0.md).

**Próximas sugestões:** manter C03 (sequência visual dos turnos) e o teste em celular físico como prioridades do jogo. Uma futura automação no GitHub pode executar `npm run verify` a cada alteração. Hospedagem pública é uma etapa separada, ainda não configurada nesta entrega.

## Relatório anterior — UI 0.3.0

Atualizado em 14/09/2026 · **0.3.0 — Pokédex de campo**. Esta rodada refaz a interface inteira, conforme a direção pedida: vermelho de Pokédex, aparência de jogo e decisões fáceis de encontrar. O relatório anterior está [arquivado](archive/ROADMAP-0.2.2.md).

## Meu relatório desta rodada

A interface anterior organizava o jogo como uma página: cabeçalho, colunas de informação e cartões. Transformei a estrutura em uma Pokédex aberta. A lente azul, a carcaça rubi, a dobradiça, o visor rebaixado e as teclas inferiores formam um único objeto. No PC, o segundo painel mostra equipe, insígnias e treinador. No celular, as mesmas cinco teclas ficam ao alcance do polegar.

**Direção aplicada:** usei a skill [interface-design](https://github.com/Dammyjay93/interface-design) para definir intenção, hierarquia, materiais e estados antes da implementação. A direção visual veio do seu pedido. Abertura, registro, origens, iniciais, draft, jornada, batalha, equipe, mochila, mapa, diário, captura, resultados, encerramento e janelas receberam o novo sistema. Silkscreen local aparece nas inscrições e no título; os textos de leitura continuam em fontes mais legíveis.

**Navegação:** Jornada (vira Batalha durante o combate), Equipe, Mapa, Mochila e Diário. Ajuda e Opções ficam no cabeçalho. A mochila agora é uma tela de itens, com estoque, custo e ações reais já existentes. A ficha da equipe mostra um Pokémon por vez, seus quatro golpes, habilidade e item; o painel do PC abre diretamente o integrante escolhido. Colocar alguém na frente continua gratuito entre batalhas.

**Batalha:** HP, turno, últimas mensagens, troca e quatro golpes juntos. As teclas 1–4 acionam os mesmos botões; não funcionam com janela aberta, campo de texto, troca em andamento ou decisão bloqueada. O registro longo continua separado. Celular deitado ganha arena e comandos lado a lado. Corrigi também o recorte de sprites que ultrapassavam a altura da arena.

**Uso em tela pequena:** em 320 × 568, conferi os quatro ataques, ações da jornada, ficha da equipe, mochila, mapa completo, captura com seis integrantes, resultado e botão de nova aventura. Cenários decorativos e textos secundários cedem espaço quando a altura é curta. Na captura, permanecem visíveis a substituição, o custo, a chance e a consequência da falha. Ajuda, diário e listas extensas podem rolar dentro do visor; os comandos de navegação permanecem acessíveis.

**Minha decisão:** o update muda a apresentação e o acesso às decisões. A pasta do motor, o catálogo, os líderes, níveis, IA e sorteios continuam os mesmos da 0.2.2. Saves schema 3 continuam válidos. Não houve nova rodada de Monte Carlo; os resultados da 0.2.2 são históricos, não uma nova medição desta interface.

**Organização:** 148 módulos JS/JSX e 29 arquivos CSS ativos. Removi os componentes antigos sem uso e substituí as folhas do tema anterior. Estilos separados por fundamento, componente, tela e condição de viewport; sem uma segunda skin empilhada sobre a antiga. O sistema de design fica em [.interface-design/system.md](../.interface-design/system.md); o guia de edição foi atualizado.

**Verificação:** 43 testes passaram, arquitetura sem ciclos, build e HTML offline gerados. Navegador com cenários de teste do motor: seleção, navegação, líder grátis, preparação com berries, captura substituindo apenas o escolhido, combate por teclado e foco das janelas. A validação final, resoluções e limites estão em [VALIDACAO.md](../VALIDACAO.md). O HTML e o ZIP acompanham a entrega.

## Estado dos itens

| Item                          | Estado após a 0.3.0                                                                                                                      |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| UI da Pokédex                 | Implementada em todas as telas existentes.                                                                                               |
| Q05 — decisões juntas         | Ampliado para jornada, equipe, mochila, mapa, captura e resultados; quatro golpes juntos mantidos. Verificado em viewports de navegador. |
| Q03 — mobile                  | Layout vertical e batalha horizontal implementados; teste em aparelhos físicos ainda pendente.                                           |
| D02 — golpes por linhagem     | Continua resolvido para seleção automática; regra e auditoria preservadas.                                                               |
| C03 — apresentação do combate | Nova arena, entrada de sprite e registro compacto; sequência animada completa ainda pendente.                                            |
| Q08 — assets                  | Fontes, sprites e seis capas locais preservados; Silkscreen acrescentada com licença.                                                    |

## Minhas próximas sugestões

1. **C03: animar a resolução do turno.** Dar tempo visual para ataque, perda de HP, status, queda e troca, com opção de velocidade rápida. O motor já resolve a decisão; a apresentação pode contar essa sequência sem mudar o resultado. Não bloquear o próximo comando depois de terminada a animação.
2. **Q03: uma run no celular físico.** Conferir teclado virtual, barras do navegador, áreas seguras e legibilidade com o aparelho na mão. O layout respeita altura dinâmica e safe areas, mas emulação não substitui esse teste. Evitar reduzir texto novamente para ganhar espaço.
3. **D02/R02: continuar observando dificuldade.** Se algum líder parecer desproporcional, comparar equipes e decisões fixas antes de alterar níveis. Lance e a utilidade de substitutos tardios continuam candidatos à próxima medição.
4. **R04: Hall da Fama visual.** Reaproveitar mapa, insígnias e equipe para resumir a carreira encerrada; manter o histórico detalhado no Diário/Opções.
5. **C09: escolha simples de golpe, depois.** Exibir fonte e nível, sem moeda nova ou menus a cada nível. Continua proposta, não implementada.

Minha prioridade seria C03, seguida pelo teste físico mobile. Não acrescentei sons, novos recursos de combate, contas ou configuração extra nesta rodada.

## Limitações desta entrega

As imagens de cenário continuam sendo seis referências de Emerald com recortes e fallback, não artes exclusivas de cada cidade nem arenas oficiais de cada líder. A identidade de Pokédex é construída com CSS, SVG, tipografia e sprites existentes. O mapa representa a ordem sorteada da run, não geografia canônica. Não houve teste em celular físico, auditoria formal de acessibilidade ou campanha humana extensa. O HTML ainda carrega o motor completo; tamanho e tempo de abertura em aparelhos modestos precisam de medição.

## Histórico: aplicado na 0.2.2

D02: uma geração de referência por linhagem, níveis herdados preservados, evolução L0 separada de lembrete L1 e remoção de fallback de Tackle inventado. 495 sets auditados; 800 campanhas Clássico. Relatório, limites e resultados em [ROADMAP 0.2.2](archive/ROADMAP-0.2.2.md), [regras](REGRAS-DE-GOLPES.md) e [simulação](balance/RELATORIO-0.2.2.md).

## Histórico: aplicado na 0.2.1

Ganhos reais e bloqueio de treino no teto, encerramento Nuzlocke sem sobreviventes, diagnóstico por inicial/adversário e primeira auditoria dos sets. Relatório original e prioridades preservados no arquivo da versão.

## Histórico: aplicado na 0.2.0

| Item                 | Resultado                                                                                                                                                                                                |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| B02                  | Viagem não concede níveis nem provoca evolução.                                                                                                                                                          |
| B03                  | Ginásio e Liga dão +1; emboscadas dão zero. Treino segue +1 a +3.                                                                                                                                        |
| B06                  | Monte Carlo com batalhas reais, quatro políticas, seeds reproduzíveis, relatório por campanha e truncamentos separados. Amostra inicial: 400 campanhas no Clássico.                                      |
| D01                  | Proposta substituída pela decisão do usuário: 1º ginásio entre primeiros, 2º entre segundos etc. São 37 líderes, com espécies e níveis da edição registrada.                                             |
| D03 / D04            | Rotas persistentes entre cidades, encontros influenciados pelas duas pontas, duas famílias distintas e preferência por famílias ainda não vistas. Curadoria do Pokébobo, não tabela oficial de cartucho. |
| D08                  | Captura com seis integrantes exige escolher quem sai; a troca só acontece em caso de sucesso.                                                                                                            |
| C01 / C02            | IA considera dano estimado, precisão, prioridade, PP, status, cura e troca; recebe uma visão filtrada da luta. Testes cobrem dados ocultos e aprisionamento.                                             |
| C04                  | Registro identifica espécie e lado, traduz mudanças de atributos e consumo de berries.                                                                                                                   |
| C07                  | Última semana anuncia a viagem ou o ginásio automático antes da ação.                                                                                                                                    |
| A01–A05              | Piloto com seis folhas de Emerald, metadados, créditos, recortes SVG, fallback e inclusão no HTML offline. Neve conserva SVG.                                                                            |
| Q05, parte principal | Arena ajustável, quatro golpes juntos, trocas em grade, últimas mensagens visíveis e histórico em janela. Conferência em celular e PC descrita em VALIDACAO.                                             |

## Decisões de escopo

- **B01:** sem limite de nível por etapa nesta versão. A correção adotada reduz bônus gratuitos e aumenta o líder em +6 uma vez quando o maior nível do jogador supera seu ás original em pelo menos 10. Nível 99 continua possível; não foi tornado impossível por uma trava.
- **B05 / Q09:** decisão substituída na 0.5.0. Saves reconhecíveis agora migram para o schema atual e recebem cópia de recuperação antes da conversão. O reset permanece somente como ação explícita do usuário.
- **D05:** ofertas são filtradas pela posição original; ainda não há proteção contra combinações difíceis nem garantia de counter.
- **D07:** captura segue 86%, uma tentativa por espécie e uma bola. A simplicidade foi preservada.
- **C08:** emboscadas perderam a recompensa de níveis; chance e intervalo permanecem.
- **Q06:** textos alterados foram alinhados às regras. Uma camada completa de localização não foi criada.

## Parcialmente resolvido

| Item | O que entrou                                                                                 | O que falta                                                                                   |
| ---- | -------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| D09  | Nível selvagem acompanha o desafio original; evoluções simples aparecem após três insígnias. | Medir utilidade das substituições tardias e ajustar o atraso diante de times muito treinados. |
| C03  | Mensagens recentes compactas e registro completo separado.                                   | Sequência animada de dano, status, queda e troca.                                             |
| C05  | Inicialização compartilhada e simulação incremental para Monte Carlo.                        | Medir replay longo em aparelhos físicos; UI ainda reconstrói combate a cada decisão.          |
| R04  | Hall da Fama visual concluído na 0.5.0, incluindo campeões e jornadas sem título.            | Futuro: compartilhamento/exportação visual de uma entrada específica.                         |
| R06  | Seed da run visível em Opções e presente nos dados de simulação.                             | Compartilhar resumo visual e iniciar run a partir de seed na UI.                              |
| Q08  | Capas locais entram no bundler; inspeção offline e catálogo de sprites.                      | Automatizar também o teste de rede e dos recortes visuais.                                    |

Relatórios anteriores: [0.2.2](archive/ROADMAP-0.2.2.md), [0.2.1](archive/ROADMAP-0.2.1.md) e [0.2.0](archive/ROADMAP-0.2.0.md).
