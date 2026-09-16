# Pokébobo — sugestões e relatório de refinamentos

Atualizado em 14/09/2026 · versão 0.2.2. **Escopo desta entrega: somente D02**, conforme o pedido. Este arquivo continua reunindo minhas decisões, resultados, limitações e sugestões.

## Meu relatório desta rodada

D02 estava parcialmente resolvido porque golpes de nível 1 das evoluções antecipavam aprendizados tardios e os sets não tinham uma referência única por linhagem. Corrigi o gerador e regenerei o catálogo. A mesma regra vale para jogador, encontros e adversários.

**Aplicado:** uma geração por linhagem (8 preferida, 7 quando necessário), níveis herdados preservados, golpes recebidos ao evoluir separados dos lembretes e fonte de cada golpe registrada. Lembretes exclusivos ficam fora da seleção automática. Magikarp e Abra deixam de receber Tackle inventado; a forma de Oricorio usa explicitamente a tabela compartilhada da espécie base. Nenhum menu foi adicionado.

**Exemplos:** Starmie 21 agora tem Swift, Water Gun, Rapid Spin e Tackle; Psychic só fica disponível no nível 40 e Surf no 44. Roserade 22 não recebe Petal Dance: conserva o nível 60 da Roselia. Golpes reais de evolução, como Bullet Punch de Scizor, continuam disponíveis. Disponível não significa necessariamente escolhido entre os quatro.

**Minha decisão:** resolver o problema na regra comum em vez de inserir exceções para dois líderes. Não alterei elencos, níveis, +6, IA, rotas, recompensas ou layout. Saves anteriores reiniciam para impedir que sets e replays antigos contornem a correção; há somente uma regra ativa, como autorizado.

**Verificação:** 495 sets auditados (122 ginásios, 122 com +6, 21 iniciais e 230 posições da Liga). Mudaram 41 dos 122 sets originais de ginásio; os 21 iniciais no nível 10 permaneceram iguais. Os 43 testes passaram, incluindo 48.400 consultas de disponibilidade (484 entradas × 100 níveis) e verificação da fonte original de cada golpe. Arquitetura: 148 módulos, sem ciclos. HTML offline gerado.

**Medição:** 800 campanhas no Clássico, nas mesmas seeds da 0.2.1, sem truncamentos.

| Política automática                | Vitórias antes | Vitórias agora | Média de insígnias antes → agora |
| ---------------------------------- | -------------: | -------------: | -------------------------------: |
| Só treinar o inicial               |          0/200 |     2/200 · 1% |                      3,68 → 3,80 |
| Capturar até 4 e preparar          |         23/200 | 21/200 · 10,5% |                      6,10 → 6,55 |
| Capturar até 6 e renovar cobertura |         36/200 | 31/200 · 15,5% |                      5,84 → 6,53 |
| Preparação aleatória               |          0/200 |          0/200 |                      1,47 → 1,56 |

**Minha leitura:** o começo fica mais coerente, mas corrigir golpes não equivale a reduzir toda a dificuldade. Misty passou de 11/44 e 18/44 derrotas do jogador para 0/44 nas duas políticas de captura. A média de insígnias aumentou, enquanto a conclusão caiu ligeiramente nessas políticas. A regra também afeta o jogador e corrige adversários antes favorecidos por fallback, como Oricorio. Lance continua difícil: 20/23 e 39/42 derrotas dos times que o enfrentaram. Não ajustei esse outro problema nesta rodada.

**Limites:** resultados de bots, não de pessoas; mesmos seeds iniciais não garantem todas as batalhas posteriores iguais. Não houve nova simulação de Correria/Nuzlocke; seus testes funcionais passaram. Cranidos 14 segue sem golpe de dano do próprio tipo na referência escolhida. Lembretes exclusivos e evolução especial não foram adicionados. Cinco formas não usadas nos elencos/encontros ficaram fora por ausência de uma fonte 8/7 comum, com justificativa no manifesto. Detalhes em [regras dos golpes](REGRAS-DE-GOLPES.md), [relatório completo](balance/RELATORIO-0.2.2.md) e [validação](../VALIDACAO.md).

## Estado do D02

**Resolvido para a seleção automática atual.** Cada set possui referência explícita, os golpes L1 de evolução não antecipam os da pré-evolução e L0 conserva sua função. A auditoria é reproduzível; escolha/reaprendizado manual continua sendo C09, separado deste aceite. Os critérios e adaptações estão documentados, sem alegar fidelidade a cada moveset histórico de cartucho.

## Minhas próximas sugestões

1. **Acompanhar D02 em jogo:** experimentar líderes iniciais e a equipe depois de evoluir. Se surgir um pico injusto, comparar batalhas com equipes fixas antes de alterar níveis. Não implementei outra regra após esta medição.
2. **C09, futuro:** escolha simples de um golpe, com fonte e nível visíveis, sem nova moeda, pop-ups a cada nível ou prejuízo aos quatro comandos juntos. Ainda não aplicada.
3. **Backlog preservado, fora desta entrega:** B06/R03 (políticas por modo e amostras por inicial), R02/D09 (Lance e substituições tardias), Q01/Q02 (saves), Q03/Q05 (mobile), D06 (draft), R01/R04/R06 (Liga e histórico) e Q04/Q07/Q08 (PWA, CI e assets). As propostas anteriores estão no [relatório 0.2.1](archive/ROADMAP-0.2.1.md).

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

Relatórios anteriores: [0.2.1](archive/ROADMAP-0.2.1.md) e [0.2.0](archive/ROADMAP-0.2.0.md).
