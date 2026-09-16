# Pokébobo — sistema de interface 0.3.0

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
