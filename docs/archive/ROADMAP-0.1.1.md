# Pokébobo — lista de refinamentos

Preparada em 13/09/2026, a partir da conversa original, do protótipo e do feedback de que o nível 99 chega fácil demais.

**O update 0.1.1 reorganiza o projeto e preserva as regras e saves. Os itens abaixo são trabalho futuro, não recursos já implementados.** A prioridade é tornar preparação, composição e conhecimento das cidades mais importantes que acumular níveis.

## 1. Urgente: corrigir a progressão

### O problema medido

Hoje o inicial começa no nível 10. As nove viagens dão +18 e os oito ginásios dão +24. Portanto, **só os bônus gratuitos levam ao nível 52 na entrada da Liga**, mesmo sem um único treino. Antes de cada ginásio, essa progressão gratuita já iguala o nível do Pokémon mais forte do líder: 14, 19, 24, 29, 34, 39, 44 e 49.

Treinar não preenche uma falta de preparo: adiciona vantagem a uma curva que já acompanha os adversários. Como o bônus vale para todos os integrantes, não existe divisão do investimento entre seis Pokémon.

Auditoria de orçamento de níveis com 10.000 sequências por estratégia:

| Treinos em cada cidade | Nível mediano no 1º ginásio | Nível mediano no 8º ginásio | Nível mediano na Liga | Entradas na Liga em nível ≥99 |
|---|---:|---:|---:|---:|
| 0 | 14 | 49 | 52 | 0% |
| 1 | 20 | 69 | 72 | 0% |
| 2 | 26 | 89 | 92 | 3,38% |
| 3 | 32 | 100 | 100 | 99,88% |

**Limite da medição:** isso é uma conta de crescimento, assumindo vitória em todas as batalhas, inicial mantido no time e nenhuma emboscada. Não simula taxa de vitória. Três treinos por cidade também deixam de gastar semanas com captura e itens. As emboscadas, quando vencidas, dão ainda mais níveis. Resultado reproduzível em `npm run balance:audit`; dados em [current-progression.json](balance/current-progression.json).

### Proposta para o próximo update de gameplay

- [ ] **B01 — Adicionar um limite de nível por etapa.** Ponto de partida: limite do jogador até dois níveis acima do ás do próximo desafio. Exemplo mantendo os líderes atuais: 16 / 21 / 26 / 31 / 36 / 41 / 46 / 51 nos ginásios e 54 / 57 / 60 / 63 / 66 na Liga. São valores para playtest, não uma curva já aprovada. O limite precisa aparecer antes de gastar a semana; se ninguém puder ganhar nível, desabilitar treino e explicar por quê. **Aceite:** numa run normal, nenhuma estratégia de ações chega ao nível 99.
- [ ] **B02 — Retirar o +2 automático de cada viagem.** A viagem pode recuperar o time ou apresentar a rota; ela não precisa dar força junto. **Aceite:** partir sem treinar deixa uma diferença real diante do próximo líder, sem inviabilizar iniciais específicos.
- [ ] **B03 — Reduzir os bônus de vitória e tratá-los junto do limite.** Testar +1 por ginásio e por membro da Liga, e experiência pequena nas emboscadas. Preservar a ideia original de treino de +1 a +3 para todos, sujeito ao limite, antes de trocar o sistema inteiro por XP individual. **Aceite:** treinar, capturar e preparar o time competem pelo mesmo recurso.
- [ ] **B04 — Evitar que ficar perto do limite desperdice a semana em silêncio.** Mostrar quanto cada membro pode realmente ganhar; indicar evoluções e ganhos truncados. **Aceite:** a mensagem de recompensa corresponde ao ganho aplicado, inclusive com níveis diferentes no time.
- [ ] **B05 — Separar a versão das regras da versão do save.** Novas runs recebem a curva nova; runs antigas mantêm o perfil antigo, inclusive os níveis altos. Não reduzir o time de um save existente sem uma decisão explícita do jogador. **Aceite:** uma batalha antiga reabre com o mesmo resultado, e uma run nova usa a curva nova.
- [ ] **B06 — Criar uma simulação de dificuldade com batalhas reais.** Comparar pelo menos quatro estratégias: só treino; captura e treino; berries e cobertura; decisões aleatórias. Medir derrota por etapa, duração, níveis, composição, frequência de emboscadas e uso das ações. Separar resultados por inicial e modo. **Aceite:** relatório com seeds reproduzíveis e partidas reais, sem confundir orçamento de XP com taxa de vitória.

**Onde editar:** `src/game/config/progression.js`, `config/campaign.js`, `career/training.js`, `pokemon/evolution.js`, `world/arrival.js`, `actions/result.js`, `actions/train.js` e `features/career/WeekBudget.jsx`. Textos de ajuda e recompensas também precisam acompanhar os parâmetros. O teste de campanha atual usa nível 100 para testar transições, por isso não detectava a facilidade da progressão.

## 2. Alta prioridade: ginásios, draft e encontros

- [ ] **D01 — Escalar elencos por posição do ginásio.** Hoje a mesma cidade mantém uma lista fixa: há líderes com dois Pokémon e outros com cinco, mesmo no primeiro slot. Criar versões iniciante/intermediária/final de cada líder, conservando sua identidade e seu Pokémon principal. **Aceite:** duas escolhas de mesmo estágio têm dificuldade comparável, com diferenças estratégicas reais.
- [ ] **D02 — Corrigir Pokémon evoluídos e golpes fortes demais em níveis baixos.** O catálogo combina aprendizados de várias gerações e ancestrais; golpes aprendidos no nível 1 por uma evolução podem distorcer o começo. Escolher uma geração de referência e validar os conjuntos de cada etapa. **Aceite:** todo set possui origem documentada e passa pelas regras escolhidas para a run.
- [ ] **D03 — Dar consequência às escolhas além do nome da cidade.** Hoje os encontros dependem sobretudo de seis biomas, e não das rotas oficiais ou da ligação entre cidades. Dar identidade às conexões, pools próprios e oportunidades de itens. **Aceite:** dois drafts diferentes mudam as chances de formar o time, não apenas os líderes enfrentados.
- [ ] **D04 — Identificar a rota como uma entidade do save.** Guardar `routeId`, origem, destino, bioma e encontros; hoje o nome da rota é principalmente um rótulo sorteado. Isso também sustenta capas específicas. **Aceite:** salvar, recarregar e abrir o mapa mostram exatamente a mesma rota.
- [ ] **D05 — Rever o filtro das opções do draft.** Evitar combinações excessivamente punitivas ou triviais no começo, sem garantir automaticamente um counter perfeito. Avaliar diversidade por região e por desafios, sem revelar o tipo do líder na interface padrão. **Aceite:** toda oferta é utilizável e o jogador ainda precisa conhecer as cidades.
- [ ] **D06 — Decidir se o draft aceita voltar atrás.** Recomendação: permitir revisar antes da confirmação final, sem gerar opções novas infinitamente; depois de partir, o mapa fica fixo. **Aceite:** retorno no draft não vira um reroll grátis de toda a região.
- [ ] **D07 — Rever a captura fixa de 86%.** Testar chance contextual por espécie/raridade, item e oportunidade da rota, mantendo decisões rápidas. Evitar que uma única falha inevitável decida uma run antes de qualquer batalha. **Aceite:** chance e custo aparecem antes da escolha e ficam salvos.
- [ ] **D08 — Permitir renovar um time com seis integrantes.** Oferecer substituição ou uma reserva pequena, em vez de bloquear todas as capturas. A saída de alguém deve ser uma decisão consciente. **Aceite:** há como corrigir composição sem transformar a coleta em um PC infinito sem custo.
- [ ] **D09 — Rever níveis dos encontros tardios.** Pokémon recém-capturados ficam muito atrás de um time que treinou demais; o limite novo ajuda, mas o encontro ainda deve ter utilidade imediata. **Aceite:** trocar um integrante no sexto ginásio pode valer a pena sem semanas extras de grind.

**Onde editar:** `game/data/gyms/`, `game/data/encounters/`, `game/world/`, `game/actions/draft.js`, `game/actions/capture.js`, `game/pokemon/moves.js` e `scripts/catalog.mjs`.

## 3. Alta prioridade: batalha e recursos

- [ ] **C01 — Melhorar a IA.** Considerar dano provável, defesa do alvo, precisão, prioridade, KO, status e utilidade de troca. Hoje ela usa uma pontuação simples e quase nunca troca voluntariamente. **Aceite:** testes de situações concretas, como imunidade, troca forçada e golpe com chance de finalizar.
- [ ] **C02 — Manter a IA justa.** Ela pode conhecer espécies e regras, mas não deve tomar decisões com base em um golpe ainda não selecionado pelo jogador ou na seed futura. **Aceite:** mesma informação observável produz uma decisão reproduzível.
- [ ] **C03 — Mostrar a sequência dos acontecimentos de um turno.** Hoje só os últimos eventos ganham destaque; causa e consequência se perdem. Usar animações curtas, log claro e opção de reduzir movimento. **Aceite:** o jogador entende dano, status, berry, queda e troca sem abrir um relatório técnico.
- [ ] **C04 — Trocar identificadores genéricos pelos nomes dos Pokémon no log.** `mon0` e `foe0` viram textos genéricos; isso reduz a clareza quando vários integrantes participam. **Aceite:** nomes e lados são inequívocos, inclusive com espécies repetidas.
- [ ] **C05 — Separar recarga da batalha de renderização da tela.** O motor é reconstituído a partir do histórico em várias atualizações. Medir antes de otimizar; se necessário, manter a instância em um controlador e mover o cálculo para Web Worker. **Aceite:** combate de 100 turnos continua responsivo no celular e o replay do save continua exato.
- [ ] **C06 — Rever cura automática e berries como um sistema só.** Toda vitória cura o grupo; preparar consome um kit e equipa berries no time inteiro. Isso precisa ser balanceado junto de níveis, tamanho do time e emboscadas. **Aceite:** preparar tem utilidade, mas não vira uma compra que escala sem custo de um para seis itens.
- [ ] **C07 — Explicar melhor a última semana.** Antes do clique, indicar que a ação seguinte leva diretamente ao ginásio ou à viagem. Evitar uma confirmação extra a cada semana. **Aceite:** ninguém entra numa batalha obrigatória sem ter recebido essa informação.
- [ ] **C08 — Definir o orçamento das emboscadas.** Revisar chance, intervalo e dificuldade por etapa. Hoje há 10% de chance após ações elegíveis, com intervalo mínimo, e a emboscada concede força extra. **Aceite:** tensão ocasional sem interromper toda sessão curta, e sem funcionar como fonte gratuita de sobrelevel.
- [ ] **C09 — Adicionar escolha de golpes e evoluções especiais com escopo curto.** Começar por substituir um golpe numa tela simples, pedras como achado de rota e evoluções por troca convertidas em requisito apropriado ao solo. **Aceite:** o jogador não fica preso a uma espécie incompleta nem precisa navegar por vários menus por semana.

**Onde editar:** `game/battle/ai.js`, `battle/restore.js`, `battle/translateLog.js`, `game/config/items.js`, `config/encounters.js`, `features/battle/` e `features/career/`.

## 4. Capas de rotas e cidades

- [ ] **A01 — Fazer um pequeno piloto com mapas de FireRed/LeafGreen e Emerald.** Selecionar uma cidade inicial, floresta, litoral, serra, cidade e rota de neve equivalente. Comparar recorte de mapa completo, banner de entrada e composição com tiles. Não misturar de saída quatro estilos de geração.
- [ ] **A02 — Criar um catálogo de capas por `routeId` e `cityId`.** Cada entrada deve informar arquivo local, jogo de origem, página da fonte, autor/extrator, crédito, termos consultados, recorte e ponto focal. **Aceite:** trocar a capa não exige editar a tela da carreira.
- [ ] **A03 — Criar um componente `RouteCover` com fallback.** Imagem local quando existir e `Landscape` atual quando faltar. O mesmo componente atende draft, cidade e encontro, com recortes adequados a cada formato. **Aceite:** nenhuma imagem ausente quebra a tela ou depende de hotlink.
- [ ] **A04 — Preservar pixel art e legibilidade.** Preferir PNG sem perdas, recorte planejado e escala inteira quando viável; manter nome e botões fora das áreas visualmente carregadas. O banner não pode revelar o tipo do líder por texto embutido ou placa de ginásio destacada.
- [ ] **A05 — Atualizar o empacotamento offline.** As futuras capas precisam entrar no HTML único, no zip e em qualquer cache de PWA. Definir um orçamento inicial, por exemplo até 100 KB por capa após recorte. Medir o tamanho final antes de incluir dezenas de mapas grandes.

A pesquisa, os links verificados e o fluxo de seleção estão em [ARTES-E-ROTAS.md](ARTES-E-ROTAS.md). As capas externas **ainda não foram baixadas nem aplicadas neste update**.

## 5. Liga, replay e memória da carreira

- [ ] **R01 — Validar todos os elencos da Liga com a versão exata do jogo.** Guardar espécie, forma, nível original, golpes e adaptações. A composição atual é uma seleção pequena com níveis e golpes normalizados.
- [ ] **R02 — Balancear o sorteio da Elite.** Quatro membros diferentes não garantem diversidade estratégica. Evitar concentrações que tornem uma seed muito mais fácil, mantendo surpresa no campeão.
- [ ] **R03 — Diferenciar os modos desbloqueados.** Testar Correria com sua própria economia e Nuzlocke com perdas, reservas e cura coerentes. Não assumir que reduzir uma semana basta para tornar o modo interessante.
- [ ] **R04 — Mostrar histórico e Hall da Fama.** Os resultados já são guardados em `meta.history`, mas falta uma tela consultável, com mapa, equipe final, adversário da derrota e decisões importantes.
- [ ] **R05 — Memória de conhecimento, não bônus de poder.** Registrar líderes encontrados e pistas descobertas, sem revelar todos os tipos na primeira run. Tornar a consulta opcional para preservar a proposta de lembrar dos jogos.
- [ ] **R06 — Compartilhar resumo e seed.** Exportar uma imagem ou resumo da run com a versão das regras; separar seed de conteúdo da seed de batalha caso isso facilite desafios comparáveis.

## 6. Qualidade, saves e entrega

- [ ] **Q01 — Importar o backup exportado.** Hoje existe exportação de JSON, mas não uma tela para restaurá-lo. Validar schema, tamanho, catálogo e versão; oferecer backup do save atual antes de substituí-lo.
- [ ] **Q02 — Não descartar save inválido silenciosamente.** `loadSave` volta ao início ao encontrar JSON inválido. Preservar o conteúdo para recuperação e explicar o problema sem sobrescrevê-lo automaticamente.
- [ ] **Q03 — Carregar o motor pesado sob demanda.** A abertura ainda inclui o Showdown inteiro. Medir download, parse e memória; separar o pacote de batalha, mantendo a alternativa de HTML único para jogar offline.
- [ ] **Q04 — PWA e instalação no celular.** Manifesto, ícone, cache versionado, detecção de atualização e modo avião. Testar em Android e iOS reais; o protótipo foi verificado em larguras mobile, não nesses aparelhos físicos.
- [ ] **Q05 — Revisar acessibilidade e legibilidade.** Metadados pequenos, contraste das tags, foco ao mudar de tela, anúncio de turnos, zoom de 200% e botões durante troca forçada. Conservar o jogo utilizável com uma mão.
- [ ] **Q06 — Extrair textos e nomes apresentados.** Recompensas ainda têm trechos literais que precisam acompanhar configurações. Criar descrições derivadas das regras e uma camada de tradução para golpes, habilidades e status, sem duplicar o motor.
- [ ] **Q07 — Adicionar integração contínua.** Rodar arquitetura, testes, build e verificação do HTML; arquivar pacote de cada versão. Uma alteração de gameplay precisa de testes do problema que resolveu, não só de uma campanha com time nível 100.
- [ ] **Q08 — Automatizar empacotamento e validação de assets.** Verificar fontes, sprites de formas alternativas, caminhos relativos, licenças e zero chamadas externas no HTML offline. Preservar o fallback quando um asset não existir.
- [ ] **Q09 — Manter o changelog e implementar uma política de migração por versão.** O changelog já existe; falta formalizar migração e perfil de regras. Separar atualização visual, refatoração e mudança das regras. Os replays de regressão da 0.1.0 devem permanecer como referência, não ser regenerados para esconder uma mudança de comportamento.

## Ordem de execução recomendada

1. **0.2 — Progressão:** B01–B06, D01–D02 e C07. Corrigir a vantagem de níveis e medir dificuldade real.
2. **0.3 — Escolhas de equipe:** D03–D09, C01–C02, C06 e C08–C09. Fazer o mapa influenciar preparação e composição.
3. **0.4 — Identidade visual e batalha:** piloto A01–A05, C03–C05 e Q05. Capas coerentes e turnos claros.
4. **0.5 — Carreira e distribuição:** R01–R06, Q01–Q04 e Q07–Q09. Histórico, saves robustos, instalação e evolução sustentável.

Q06 deve acompanhar cada etapa que mudar números ou mensagens. Melhorar o balanceamento vem antes de ampliar o catálogo: acrescentar mais líderes à curva atual multiplicaria o conteúdo sem corrigir a facilidade.
