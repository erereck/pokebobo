# Validação — Pokébobo 0.3.0

## Entrega no GitHub · 15/09/2026

- `npm run verify` executado no novo fluxo: arquitetura com 148 módulos válida, **43 testes passaram, zero falhas**, build Vite concluído.
- O comando termina em `npm run build`; não chama mais `npm run standalone`.
- SHA-256 do `Pokebobo.html` local comparado antes/depois: idêntico. Arquivo não regenerado e excluído do envio.
- O repositório recebe código, fontes, sprites, capas, licenças, testes, documentação, relatórios históricos e três imagens da UI. `index.html` é a entrada do Vite, não o standalone.
- `.gitignore` exclui dependências instaladas, `dist/`, variáveis locais, logs, ZIP de distribuição e `Pokebobo.html`.
- Nenhuma alteração de gameplay ou UI nesta entrega; versão e saves continuam na 0.3.0/schema 3. As verificações de navegador abaixo são da entrega anterior, não foram repetidas para essa mudança de distribuição.
- Não foi configurada hospedagem pública; o README documenta clone, instalação, execução e preview locais.

## Validação anterior da interface · 14/09/2026

14/09/2026. Escopo: redesign completo de UI/UX. Validação anterior em [archive/VALIDACAO-0.2.2.md](docs/archive/VALIDACAO-0.2.2.md).

## Código e regras

`npm run verify`: **43 testes passaram, zero falhas**; arquitetura com **148 módulos**, imports válidos, sem ciclos e sem dependências de UI no motor. Build Vite e HTML portátil concluídos. Ajustes posteriores de layout foram inspecionados no navegador e o HTML regenerado. São **29 arquivos CSS ativos** incluindo o índice.

Comparação SHA-256 dos **88 arquivos de src/game** com o ZIP entregue na 0.2.2: **zero alterações**. Inclui catálogo, regras, dados, IA e persistência. SAVE_VERSION continua 3. Saves da 0.2.2 são aceitos sem migração; schemas anteriores continuam reiniciando conforme a regra anterior.

Os testes cobrem aprendizado por nível e procedência, progressão, draft, IA justa, captura, teto de treino, replay, Liga, desbloqueios, Nuzlocke e saves. Não houve novo Monte Carlo: os relatórios de dificuldade da 0.2.2 continuam históricos.

## Navegador: interface e decisões

Chrome via agent-browser em perfis de teste separados. Fixtures criadas com o motor atual para inspecionar estados específicos; equipes e etapas sintéticas não medem a viabilidade de uma campanha normal.

| Cenário | Evidência |
| --- | --- |
| Abertura e início | Registro de Erick, escolha de origem e de Bulbasaur, chegada ao draft. Abertura, três origens e três iniciais revisados em 320 × 568. |
| Draft pronto | Botão de começar visível em 320 × 568; revisão extensa da rota pode rolar abaixo. Trocar etapa volta ao topo. |
| Jornada | Quatro ações e desafio visíveis em 320 × 568. Custo e aviso da última semana mantidos. |
| Equipe | Seis seletores, ficha e quatro golpes juntos em 320 × 568. Painel do PC abre a ficha de Pikachu diretamente. |
| Líder | Clique em Colocar na frente muda o líder para Pikachu e mantém spent=1. A ação fica bloqueada durante batalha. |
| Mochila | Estoque e três ações visíveis em 320 × 568. Preparar consome um kit (2→1), uma semana (1→2), equipa os seis com Sitrus Berry e retorna à jornada. |
| Captura com seis | Antes da seleção, capturas desabilitadas. Selecionado Growlithe; captura bem-sucedida de Rattata mantém seis integrantes, troca somente Growlithe e consome uma bola (6→5). Seleção, duas espécies, custo e saída cabem em 320 × 568. |
| Mapa | Dez cidades e Liga, percurso contínuo, posição atual e paradas concluídas visíveis em 320 × 568. |
| Resultado | Vitória real do motor contra Misty em três turnos; recompensa, sobreviventes e continuar visíveis em 320 × 568. |
| Encerramento | Derrota e fixture de campeão revisadas em 320 × 568; resumo, insígnias e nova aventura visíveis. |
| Liga | Cinco adversários e botão Enfrentar visíveis em 320 × 568: main 396/396 px, botão termina em y=489, navegação começa em y=500. |
| Janela e teclado | Ajuda aberta + tecla 1 mantém choices=[]; Escape fecha e devolve foco a Como jogar e créditos. |

A seleção e o foco são estados de apresentação. Os comandos da mochila e da equipe continuam enviando as ações existentes ao reducer.

## Batalha e dimensões

- **1365 × 768:** quatro golpes, arena, painel com seis integrantes, insígnias e treinador visíveis. Captura revisada e entregue como Pokebobo-batalha.png.
- **320 × 568:** página sem overflow; visor de batalha 426/426 px. Linhas de golpes terminam em y=415 e y=479; navegação começa em y=500. Tela revisada após correção da altura dos sprites.
- **390 × 844:** visor de batalha 684/684 px. Golpes terminam em y=678 e y=748; navegação em y=770. Imagem entregue como Pokebobo-celular.png.
- **844 × 390:** composição horizontal com arena e comandos lado a lado; visor 276/276 px. Linhas dos golpes terminam em y=223 e y=319; navegação em y=336.
- Troca mostra os seis slots na grade. Tecla 2 executa Take Down, consome PP de 32 para 31 e avança o turno. O listener existe apenas na batalha elegível; janelas e campos são ignorados.

## HTML offline

Arquivo local aberto em outro perfil do navegador, com rede desativada. Cenário de batalha carregado, ataque executado e página recarregada:

- Zero requisições HTTP na lista de recursos inspecionada.
- Sprites carregados; seis capas embutidas decodificadas com dimensões válidas: 946×752, 2100×1280, 1477×809, 912×616, 768×909, 600×1210.
- Silkscreen carregada de forma explícita pelo FontFaceSet com rede desligada; document.fonts.check retorna true. A fonte é requisitada sob demanda, por isso pode ainda não estar carregada numa tela que não a usa.
- Recarregar preserva exatamente o texto da batalha, incluindo HP, PP e turno; decisions/choices contém move 2, save versão 3.
- Sem erros JavaScript nos fluxos finais inspecionados. O HTML final foi reconstruído após os ajustes de layout.
- Aproximadamente 10,3 MiB com motor, fontes, sprites e capas. Código-fonte distribuído separadamente, sem node_modules/dist.

## Limites

Sem aparelho físico, campanha humana extensa, auditoria formal de acessibilidade ou benchmark de desempenho. Emulação de viewport não reproduz teclado virtual, navegador móvel e toque reais. A altura dinâmica e as safe areas têm suporte CSS, mas precisam de conferência física. Ajuda, diário e listas longas podem rolar dentro do visor. As capas são referências de Emerald, não cenários exclusivos de cada líder. A animação completa de resolução do turno continua no ROADMAP.
