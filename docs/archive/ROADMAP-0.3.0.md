# Pokébobo — sugestões e relatório de refinamentos

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
