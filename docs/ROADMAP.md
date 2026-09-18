# Pokébobo — sugestões e relatório de refinamentos

## Entrega de 18/09/2026 — 0.5.0: Legado de Carreira

**Direção:** resolver dois sistemas que ainda pareciam provisórios — evolução especial e encerramento da carreira — e, junto deles, impedir que uma atualização futura apague progresso apenas porque o número do schema mudou.

**Evoluções especiais:** amizade, pedra, troca, golpe conhecido, item equipado e condições equivalentes foram convertidos em evolução direta por nível. A regra usa **20** para amizade, **28** para golpe/condição, **30** para item equipado e **32** para pedra/troca. Linhas ramificadas usam um nível comum e o ID persistente do Pokémon escolhe deterministicamente o caminho daquele espécime. Isso cobre Eevee, Kirlia, Snorunt, Gloom, Poliwhirl, Pikachu, Clamperl, Applin e demais ramificações presentes no catálogo sem menu nem item novo.

**Hall da Fama:** o arquivo passa a guardar até **100 carreiras** e não exclui derrotas. Campeões, derrotas normais, Nuzlocke sem sobreviventes e abandonos recebem cartões próprios. Novos registros guardam equipe final com níveis, modo, seed, origem, inicial, semanas, insígnias, quantidade de acontecimentos e último adversário. Históricos antigos continuam aparecendo como registros legados.

**Persistência:** SAVE_VERSION sobe de 3 para **4**. A diferença de versão deixa de ser motivo para reset: o loader normaliza campos conhecidos, preserva meta/histórico e mantém a run quando sua estrutura básica é reconhecível. Antes da primeira migração, o JSON antigo é copiado para `pokebobo.save.backup.v1`. Se apenas a run ativa estiver incompleta, ela pode ser descartada sem apagar o arquivo de carreiras.

**Verificação:** `npm run check` passou com **159 módulos**; `npm test` passou com **61/61 testes** e zero falhas; o build Vite transformou **2.037 módulos**. Testes novos cobrem métodos especiais, ramificações determinísticas, todas as famílias evolutivas elegíveis do catálogo, migração de schemas 1/2/3, backup do payload antigo e arquivo detalhado de derrotas/abandono.

**Progressão:** a auditoria-base permanece inalterada: entrada mediana na Liga em nível **18 / 38 / 58 / 78** para 0 / 1 / 2 / 3 treinos por cidade. Ela mede o orçamento-base e não os níveis extras das Semanas Vivas.

**Próximos candidatos:** teste físico mobile continua pendente. Depois dele, C09 (escolha simples de golpe) e uma medição específica da economia das Semanas Vivas são os próximos refinamentos de maior impacto.


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

| Item | Estado após a 0.3.0 |
| --- | --- |
| UI da Pokédex | Implementada em todas as telas existentes. |
| Q05 — decisões juntas | Ampliado para jornada, equipe, mochila, mapa, captura e resultados; quatro golpes juntos mantidos. Verificado em viewports de navegador. |
| Q03 — mobile | Layout vertical e batalha horizontal implementados; teste em aparelhos físicos ainda pendente. |
| D02 — golpes por linhagem | Continua resolvido para seleção automática; regra e auditoria preservadas. |
| C03 — apresentação do combate | Nova arena, entrada de sprite e registro compacto; sequência animada completa ainda pendente. |
| Q08 — assets | Fontes, sprites e seis capas locais preservados; Silkscreen acrescentada com licença. |

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
- **B05 / Q09:** não manter perfis antigos de regras nem migrações, por decisão expressa do usuário. Save incompatível reinicia. Há botão de reset de teste com confirmação. Fixtures da 0.1 permanecem arquivadas como evidência histórica.
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
| R04  | Últimas 20 viagens consultáveis em Opções.                                                   | Hall da Fama com mapa e decisões da carreira.                                                 |
| R06  | Seed da run visível em Opções e presente nos dados de simulação.                             | Compartilhar resumo visual e iniciar run a partir de seed na UI.                              |
| Q08  | Capas locais entram no bundler; inspeção offline e catálogo de sprites.                      | Automatizar também o teste de rede e dos recortes visuais.                                    |

Relatórios anteriores: [0.2.2](archive/ROADMAP-0.2.2.md), [0.2.1](archive/ROADMAP-0.2.1.md) e [0.2.0](archive/ROADMAP-0.2.0.md).
