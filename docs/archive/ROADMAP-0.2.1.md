# Pokébobo — sugestões e relatório de refinamentos

Atualizado em 14/09/2026 · versão 0.2.1. Este arquivo acompanha cada entrega com minhas decisões, evidências, limitações e próximos passos. A autorização do usuário para seguir refinando está registrada em AGENTS.md; feedback novo pode mudar as prioridades.

## Meu relatório desta rodada

A atualização corrige treino/recompensas no teto e um encerramento quebrado de Nuzlocke. Também amplia o instrumento de balanceamento. A prioridade foi melhorar a precisão do jogo e descobrir causas concretas de dificuldade.

**Aplicado:** treino fica indisponível quando todos estão no nível 100; avisos e recompensas mostram o ganho real e quantos integrantes crescem. Em Nuzlocke, se o último Pokémon também cai ao vencer por recuo, a run termina sem sobreviventes, em vez de tentar começar a próxima luta com equipe vazia. O caso veio de uma campanha simulada e agora tem teste.

**Medição:** 1.600 campanhas (800 Clássico, 400 Correria, 400 Nuzlocke), com quatro políticas por modo, sem truncamentos na rodada concluída. O relatório passa a separar cada inicial e adversário e a contar emboscadas à parte.

| Política automática                |       Clássico | Correria | Nuzlocke |
| ---------------------------------- | -------------: | -------: | -------: |
| Só treinar o inicial               |          0/200 |    0/100 |    0/100 |
| Capturar até 4 e preparar          | 23/200 · 11,5% |    0/100 |    0/100 |
| Capturar até 6 e renovar cobertura |   36/200 · 18% |    0/100 |    0/100 |
| Preparação aleatória               |          0/200 |    0/100 |    0/100 |

Minha leitura: composição continua relevante, mas a dificuldade não está distribuída igualmente. Lance derrotou 24/26 times da política de quatro integrantes e 29/31 da política de cobertura que o enfrentaram. Misty derrotou 11/44 e 18/44. Esses denominadores são encontros reais, não todas as runs.

A auditoria de **122 sets de ginásio e 21 iniciais** identificou Starmie da Misty com Psychic/Surf/Power Gem/Recover no nível 21 e Roserade da Gardenia com Petal Dance no nível 22. São sets automáticos do protótipo, favorecidos por golpes de nível 1 de evolução. Cranidos do Roark, no nível 14, não recebe golpe de dano do próprio tipo. Esses casos dão alvos específicos para a próxima revisão.

**Limites da leitura:** as taxas são de bots, não de pessoas. As políticas de Correria podem gastar as duas semanas capturando e preparando, sem treinar; a IA de combate não otimiza a sobrevivência da campanha Nuzlocke. Zero vitórias não demonstra impossibilidade. Cada inicial teve só 4–15 runs por política no Clássico. As primeiras 100 seeds repetem a amostra 0.2.0 para comparação; não se trata de 1.600 seeds novas independentes.

**Minha decisão:** manter nesta rodada os níveis dos líderes, o +6 aprovado, a curva de treino e os sets. Corrigir o funcionamento e preservar a referência permite comparar a próxima mudança com evidência. Não aumentar a lista de menus enquanto os gargalos atuais não estiverem mais claros.

Validação: **38 testes passaram**, arquitetura com 147 módulos, build portátil concluído. Detalhes, intervalos de confiança e reprodução: [relatório completo 0.2.1](balance/RELATORIO-0.2.1.md), [validação](../VALIDACAO.md).

## Minhas próximas sugestões, em ordem

1. **B06 / R03 — Políticas próprias por modo:** testar Correria reservando treino antes das berries e Nuzlocke valorizando sobrevivência/reposição. Aceite: comparar nas mesmas seeds e separar mudança do bot de mudança do jogo.
2. **D02 — Piloto de sets para líderes iniciais:** escolher golpes específicos do primeiro/segundo estágio, com origem/adaptações registradas, preservando elencos, níveis e a ordem aprovada. Aceite: auditar os sets e comparar a dificuldade por líder.
3. **R02 / D09 — Lance e cobertura tardia:** medir se as rotas oferecem respostas úteis e se capturar tarde deixa o novo integrante competitivo. Aceite: melhorar opções estratégicas antes de reduzir todos os campeões.
4. **C09 — Escolha simples de um golpe:** substituição opcional na tela da equipe, sem nova moeda, sem pop-up a cada nível e sem comprometer os quatro comandos na batalha. Ainda não aplicada.
5. **B06 — Amostra fixa por inicial:** não produzir um ranking a partir de poucos casos. Aceite: mesmo número de campanhas por inicial e intervalos apresentados.
6. Continuar **Q01/Q02** (importação e recuperação de save), **Q03/Q05** (desempenho e acessibilidade mobile), **D06** (revisar draft sem reroll), **R01/R04/R06** (Liga, histórico e compartilhamento), **Q04/Q07/Q08** (PWA, CI e assets) conforme o uso trouxer evidência.

## Entregas da 0.2.1

| Item           | Resultado                                                                                                                 |
| -------------- | ------------------------------------------------------------------------------------------------------------------------- |
| B04            | Ganhos reais no teto, detalhe por integrante, recompensa correta e treino sem desperdício quando todos estão no máximo.   |
| B06            | Resumos por inicial/adversário, denominadores, intervalos, tamanho do time, separação de emboscadas e três modos medidos. |
| D02, auditoria | 122 sets de ginásio e 21 iniciais com fontes por geração/ancestral. Revisão dos sets continua proposta.                   |
| R03, correção  | Sem sobreviventes encerra a Nuzlocke antes de recompensas/progressão, inclusive em vitória do motor por recuo.            |
| Q09            | ROADMAP passa a conter relatório próprio em cada entrega; sugestões e resultados anteriores ficam arquivados.             |

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
| D02  | Learnset usa a geração mais recente disponível até a 8 por espécie/ancestral.                | Rever golpes de nível 1 das evoluções e documentar uma referência estrita por set.            |
| D09  | Nível selvagem acompanha o desafio original; evoluções simples aparecem após três insígnias. | Medir utilidade das substituições tardias e ajustar o atraso diante de times muito treinados. |
| C03  | Mensagens recentes compactas e registro completo separado.                                   | Sequência animada de dano, status, queda e troca.                                             |
| C05  | Inicialização compartilhada e simulação incremental para Monte Carlo.                        | Medir replay longo em aparelhos físicos; UI ainda reconstrói combate a cada decisão.          |
| R04  | Últimas 20 viagens consultáveis em Opções.                                                   | Hall da Fama com mapa e decisões da carreira.                                                 |
| R06  | Seed da run visível em Opções e presente nos dados de simulação.                             | Compartilhar resumo visual e iniciar run a partir de seed na UI.                              |
| Q08  | Capas locais entram no bundler; inspeção offline e catálogo de sprites.                      | Automatizar também o teste de rede e dos recortes visuais.                                    |

O relatório e as prioridades atuais estão no início deste arquivo. O estado da versão anterior foi preservado em [ROADMAP-0.2.0](archive/ROADMAP-0.2.0.md).
