# Pokébobo — sistema de interface 0.3.0

## Além da trilha — 0.24.0

Expedições conservam carcaça rubi e visor LCD. Fora da trilha é um recorte da Jornada, com ícone de montanha/ruína, custo e visita única; não cria outra tecla de navegação. Confirmação de entrada apresenta os três momentos, prêmio e risco. Salas usam canvas 192×144, pedras violetas/cristais na caverna e lajes verdes/inscrições nas ruínas; cenografia própria e Red local existente.

Um progresso curto (Achado / Escolha / Guardião) situa a decisão. No PC, campo e comandos ficam lado a lado para manter ambos visíveis; no telefone, em sequência com direcional de 44 px, interações e recibo dos achados. Baús exigem proximidade, saídas não exigem refazer o caminho. Tesouro usa duas escolhas com efeito e uma confirmação de conclusão; avisar se ela disparar o próximo ginásio. Modal nativo conserva foco/Escape e evita confirmar risco ao caminhar.


## Companheiros de jornada — 0.23.0

Mantém rubi/LCD/âmbar e navegação de cinco teclas. Reencontro usa sprite de 56 px (44 no telefone), chamada curta com marca OPCIONAL e botão de 44 px; confirmação mostra equipe em quatro colunas, recompensa e consequência antes de iniciar. A escolha de rival fica em um recorte LCD dentro do cartão de partida, com três botões e seleção explícita.

Equipamentos reutilizam os destinatários e o rodapé sticky do Mercado. Uma transação escolhe alvo antes de cobrar. Equipe/Mochila compartilham um Modal de transferência; alvo, estoque, efeito e destino do item anterior ficam explícitos. Comandos mantêm a aba atual. Disparadores novos recebem foco sem rolagem antes de abrir o Modal para devolver foco corretamente também no WebKit por ponteiro.

Ficha: Equipamento/Apelido em duas colunas, 44 px; feitos ocupam as duas colunas do grid em telefone, com valores de 24 px e rótulos de 10 px. Nome da espécie permanece abaixo do apelido. Destaque do Hall usa sprite 72 px (48 no telefone), epíteto âmbar e explicação da métrica. Memorial é um details nativo. Sem mais botões no cabeçalho ou uma nova skin.

## Na palma da mão — 0.20.1

Intenção: jogador no telefone toca comandos, escolhe evolução e escreve sem perder a ação para teclado/recortes. Conserva rubi/LCD/âmbar, DM Sans/Space Grotesk e espaçamento existente. Em ponteiro coarse sem hover, comandos principais têm 44 px; cabeçalho de 320 px omite a lente para acomodar seis ícones com nomes acessíveis. Paisagem curta compacta instrumentação para conservar cena e comandos.

Áreas seguras entram por tokens; VisualViewport publica altura/deslocamento visíveis, deixa zoom nativo livre e aproxima campo focado quando o teclado reduz a área. Dialog nativo conserva foco/Escape, apenas gesto completo no fundo fecha. Evoluções usam lista rolável e rodapé de confirmação sticky, sem mudar decisões. Volume recebe área de toque de 44 px. Conferência emulada não substitui teste físico de teclado/Safari.

## Novos caminhos — 0.20.0

Campo mantém a carcaça/rubi/LCD e todos os controles: quatro composições de tiles, canvas 192×144 com faixa superior de uma casa, grade clicável 12×8 alinhada. Preparação da vara usa offsets originais, feedback de mordida em pixels e bloqueio breve dos controles; movimento reduzido conclui imediatamente. Nenhuma contagem de encontros/passos visível.

Aprendizado conserva dialog obrigatório e ações diretas. Cabeçalho mostra parceiro/nível sem repetir nome do golpe novo; comparação atual em quatro botões com resumo 12 px, descrição do novo no cartão âmbar. Caderno agrupa clima/terreno no topo e condições de cada lado junto dos estágios; detalhes podem rolar, Fechar conserva 44 px sem encolher. WOFF2 recebe formato correto na declaração da fonte.

Instalação/conexão ficam em Opções, dentro de um painel LCD rebaixado com texto curto e estado com ícone/rótulo. Botão nativo de instalar somente quando o prompt existe; alternativa por menu nos demais casos. Pronto para reabrir offline é uma confirmação do worker ativo; conteúdos não usados podem exigir internet. Atualização informa fechar todas as janelas e reabrir, sem recarga no meio da jornada. Não adicionar controles ao cabeçalho já ocupado.

## Presença dos Pokémon — 0.18.1

Arena usa referência proporcional à caixa, sem tetos por dispositivo: min(altura×0,90, largura×0,95). Piso de ratio 2D para o 3D da mesma espécie/lado evita corpos nativos compactos virarem miniaturas. Mantém limites de corpo 90%/81%, apoio/perspectiva/union dos quadros e pequenos/grandes. Aspecto mais largo de normal/shiny impede altura variar pela paleta. Não ampliar por transform CSS; o renderer aplica offsets sobre a fonte real, preservando as animações dos golpes.

## Som e playlist — 0.18.0

Mute no cabeçalho como botão físico de 44 px (40 px no visor de 320), com estado acessível; logo vira Poké Bola no cabeçalho até 500 px para conservar seis controles. Opções abre Som e playlist. Modal de 840 px, cabeçalho sticky: faixa/transportes no topo, volumes/modos à esquerda, biblioteca à direita; até 640 px vira uma coluna. Ranges nativos com rótulo/percentual, três canais, seleção verde LCD e transportes de 48 px. Playlist com índice, título oficial, contexto e duração; lista rola separadamente. Mantém tipos/cores existentes e foco visível. Sem detalhes técnicos de codecs/cortes nas ações do jogador; fontes/termos em link próprio.

## Intenção e assinatura

Treinador em uma run curta, no celular ou PC: localizar a próxima decisão, preparar a equipe, lutar e continuar. Sensação de dispositivo de aventura. Domínio: Pokédex, lente de leitura, cartucho, insígnias, scanner, mapa de rotas, turno e Poké Bolas.

Assinatura: Pokédex de duas folhas, lente azul, dobradiça, visor de campo, insígnias encaixadas e teclas inferiores. Cena e comandos ficam juntos. Direção vermelha e aparência de jogo explicitamente pedidas pelo usuário. A [skill interface-design](https://github.com/Dammyjay93/interface-design), consultada em 14/09/2026, orientou o processo; o briefing e a intenção dos componentes foram definidos antes da implementação.

Padrões substituídos: cabeçalho/rodapé de site por carcaça, barras editoriais por visor e painel da equipe, cartões promocionais por menus e slots. O vermelho ocupa a estrutura porque representa o objeto solicitado; o conteúdo fica num LCD claro com instrumentação escura.

## Sistema implementado

Tokens em src/styles/foundations/tokens.css: carcaça #c62f45, recortes #701d30, lente #70e4ed, borracha #1b2931, LCD #edf0dc, âmbar #f0cd6b, HP #428653. Sombras curtas nas teclas e carcaça, borda rebaixada no visor; não aplicar sombra a toda informação.

DM Sans para leitura; Space Grotesk para comandos e dados; Silkscreen para título pixelado e inscrições pequenas. Fontes locais, licenças OFL incluídas. Espaçamento baseado em 4 px. Corpo base 14 px, títulos 22–36 px; telas curtas têm densidade própria. Ações principais de 44 px ou mais, alguns seletores/cabeçalho com 40 px. Rótulos pequenos precisam de teste físico; não prometer acessibilidade certificada.

Navegação única no PC e celular: Jornada/Batalha, Equipe, Mapa, Mochila, Diário. Ajuda e Opções no cabeçalho. Mapear estado atual com texto, cor e marca de seleção; não depender apenas da cor.

## Intenção por componente

| Componentes | Foco | Expressão |
| --- | --- | --- |
| App, AppHeader, MissionHUD, GameNavigation | Saber onde estou e o que posso fazer | Carcaça rubi, lente, recursos compactos, cinco teclas com rótulo. |
| Welcome, WelcomeWorld, RegistrationForm | Começar | Cena pixelada, trio de iniciais, título, formulário e botão amarelo. |
| Setup, CityChoice, StarterCard, RegionReady | Escolher entre três e avançar | Paisagens ou scanner, seleção explícita, próximo passo visível; etapa volta ao topo. |
| Career, CityHero, WeekBudget, WeeklyActions | Decidir a semana | Cena, orçamento, ações 2×2 e desafio. Liga troca ações por cinco adversários. |
| BattleScreen, BattleArena, MoveOptions, Health | HP, turno e quatro golpes juntos | Arena flexível, bases de sprites, HUD, comandos em grade. Paisagem cede altura aos controles. |
| TeamScreen, PokemonDetails, TeamSidebar | Selecionar um e consultar | Seis slots, ficha única, quatro golpes e líder. Em 320 px os seis seletores ficam numa linha. |
| BagScreen | Estoque e custo antes da ação | Dois compartimentos, ações existentes, disponibilidade explícita. |
| RegionScreen, RegionMap, Journal | Localizar e recordar | Percurso em serpentina da rota real; atual/concluído; diário em linhas por semana. |
| Encounter, ResultScreen, Ending | Consequência e continuidade | Captura com escolha de substituto; recibo do combate; resumo final e CTA. |
| Modal, SettingsDialog, HelpDialog | Consultar e voltar | Dialog nativo, close/Escape, foco devolvido ao disparador. |

## Responsividade e estados

Até 900 px, visor único e navegação inferior. Até 700 px de altura, decoração e texto secundário cedem espaço; custos, consequências e comandos permanecem. Batalha deitada usa duas colunas. Layout baseado em 100dvh, com safe-area-inset no contorno. Listas extensas e ajuda podem rolar dentro do visor.

Entrada de sprite: 220 ms; pressão de botão: 110 ms. Respeitar prefers-reduced-motion. Não há sequência animada completa do turno ainda. Teclas 1–4 somente na batalha ativa, sem janela, campo, troca ou decisão bloqueada; usam o mesmo botão que o toque.

29 CSS ativos: fundamentos → componentes → features → responsive/pokedex, na ordem de index.css. Componentes antigos sem uso removidos. Não empilhar um tema novo sobre esta skin; editar o módulo responsável. Regras e estado persistido da 0.2.2 preservados; seleção de ficha é UI local.

Critérios de continuidade: quatro golpes juntos; caminho de no máximo uma tecla para equipe/mapa/mochila; ações relevantes visíveis em 320×568; suporte a PC e batalha horizontal. Conferir sempre com sprites, nomes longos, seis integrantes, última semana e Liga. Evidência em VALIDACAO.md; próximos passos em docs/ROADMAP.md.

## Passos de Kanto — 0.10.0

FieldCanvas: mapa 192×128 em tiles de 16 px; Red 16×32 e efeito original de mato por passo, sem números. CaptureCanvas: cena 240×160, Red de costas 64×64, Pokémon FRLG 64×64, Poké Bola 16×16 e fonte bitmap. A carcaça/LCD continua igual. Menu dentro da cena oferece Poké Bola/Fugir com botões nativos, foco e cursor. Decisões de reserva ficam fora da cena. Animação não altera resultado/RNG; finalização aplica o payload persistido. Movimento reduzido mostra o resultado, e Pular animação não muda regras. Avaliar alvos do menu em telefone físico.

## Ritmo de Kanto — 0.11.0

Preservar a carcaça e as fontes externas. PixelViewport usa a altura livre; informação e ações ficam fora da cena. Menu em duas colunas com áreas de 48 px lógicos; fonte/cursor/estoque têm a mesma escala do canvas. Na falha de asset, botões exibem texto HTML. Fonte quebra por palavra e respeita molduras. Escala nearest-neighbor; sem misturar labels bitmap com escalas independentes.

Equipe: seis seletores juntos, Ficha e golpes / Reserva como botões com aria-pressed. No telefone, sprite no seletor e nome/nível acessível; detalhes do selecionado ficam na ficha. No horizontal, seletores à esquerda, conteúdo à direita e quatro golpes em uma linha. Mochila e mapa usam a altura disponível, sem sobrepor controles. 35 CSS ativos incluindo índice; regras de enquadramento em pixel-screens.css e panel-fit.css, no fim da cascata existente.

Tela cheia imediatamente após Pokédex, com estado da API nativa. Movimento segurado encerra em release, blur, janela, invisibilidade e desmontagem. Critério: ações sem cobertura por outro painel, não apenas ausência de scrollbar. Hit-test e limites verificados em 320×568 e horizontal 667×375, além de seis outros tamanhos.

## Escala de batalha — 0.16.0

Corpos preservam proporção e mantêm escala fixa no ciclo. Tabela por espécie/estilo/lado; union de pixels visíveis de todos os quadros. Apoio no centro da plataforma a 17% da altura da caixa; costas com perspectiva 1,12. Máximo de largura 90% e altura 81% menos elevação, piso legível 16 px subordinado ao espaço disponível. Referência responsive 160/140/94/84 px. Não dimensionar todos os sprites por percentuais semelhantes da caixa nem usar metros como única regra. Metadados fixos + ResizeObserver/load; movimentos de ataques continuam em transform/opacity. Fallback deve usar geometria da fonte efetivamente carregada.

## Coleção e cartões — 0.17.0

Pokédex conserva rubi/LCD/fontes: três contagens, progresso regional em details, filtros de estado e quatro selects nativos de 44 px; dois selects por linha no celular. Lista com imagem sob demanda e ficha em coluna no PC, uma coluna no celular; cabeçalho sticky e Fechar visível ao rolar. Normal/shiny com marca textual de registro e Comparar só quando ambas existem. Estágio 120 px por sprite, duas metades no comparativo; brilho âmbar identifica raridade.

Cartão: canvas 1080×1350, carcaça rubi/lente, visor LCD e equipe 3×2 como foco, insígnias em oito encaixes. Fundo âmbar e estrela nas posições shiny. PNG local, QR de módulos inteiros/quiet zone, marca/endereço do jogo. Preview à esquerda e ações à direita no PC; uma coluna no celular, PNG/convite como CTAs. Modal mantém Fechar visível; botões de exportar/compartilhar com 48 px. Gerador começa com preparo, falha permite retry e canvas provisório evita publicar um resultado após fechar.

Convite é uma decisão explícita: preserva slot ativo, permite selecionar outro e mostra origem, modo e seed antes de começar; jogador escolhe o próprio inicial. Uma seed manual informa que o draft continua sendo escolhido pelo jogador. Formato técnico/contador do RNG ficam fora da UI.

## Batalha e backups — 0.19.0

Manter a carcaça/rubi/LCD e escala de corpo da 0.18.1. Efeitos pixelados acompanham o corpo e deixam nomes/HP limpos; não ampliar caixas nem cobrir comandos. Movimento usa a duração de cada evento e cancela ao Pular; preferência reduzida evita partículas/translação. Pular ocupa a posição da velocidade só durante o turno, conservando os quatro comandos no mesmo lugar.

Caderno em dialog nativo: três páginas com botões aria-pressed, descrição em details, fatos em dl e dois lados em campo. Quatro fatos por linha no PC, dois no celular; lados em uma coluna abaixo de 440 px. Valores positivos/negativos têm sinal além da cor. PP pertence à batalha atual; não misturar previsões de dano com fatos básicos.

Backup: entrada de arquivo nativa, prévia compacta e três botões de slot com nome/estado. Priorizar primeiro vazio; ação de substituição nomeia o slot e oferece exportação do conteúdo atual. Erros mantêm a janela aberta. Cabeçalho sticky conserva Fechar/Escape e retorno de foco em listas extensas. Ações de 44 px, sem modal de confirmação extra.

## Cada conquista conta — 0.21.0

Conservar rubi/LCD/âmbar e fontes da aplicação. Entrada de janelas 160 ms, cartas 220 ms com até 35 ms entre itens; sem fill final que impeça pressão. Conquista 440 ms e partículas finitas, cidade atual duas pulsações de 800 ms. Evolução de 1 s só inicia após ambas as imagens carregarem; confirmação sempre disponível, escolhas de gameplay não dependem da animação. Movimento reduzido mostra conteúdo final estático.

Evolução: nome/nível/tipos claros, duas ações de pelo menos 44 px quando há fila; em paisagem curta, estágio e anúncio lado a lado. Resultado separa recibo rolável e CTA; mochila sem ações disponíveis usa uma grade própria de consulta. Descrições na ficha usam details/summary, sem tooltips obrigatórios. Imagem indisponível evita ícone quebrado, arena usa indicador discreto de 44 px sobre a plataforma. Abertura usa carcaça/LCD e fonte do sistema antes das fontes do jogo, sem progresso numérico inventado.

## Avanço de evolução — 0.21.1

Barra de 5 px sob os comandos, abrangendo ambas as colunas, com track LCD e preenchimento âmbar escuro. Quatro segundos por cena, independente do carregamento dos sprites; contador isolado em MomentProgress para não redesenhar a ficha a cada frame. Aba oculta pausa; movimento reduzido usa quatro etapas. Nunca confirmar uma decisão manual de gameplay automaticamente.
