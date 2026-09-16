# Relatório de refinamento — 0.2.1

Atualizado em 14/09/2026. Decisões desta rodada também constam diretamente no [ROADMAP](../ROADMAP.md).

## Entregas

- Treinar com toda a equipe no nível 100 fica desabilitado, sem consumir semana ou sorteio.
- Equipes mistas recebem somente o ganho possível. O aviso resume quantos receberam níveis e o diário detalha cada integrante; evolução permanece registrada.
- Recompensa de batalha informa a fração da equipe que ainda pode crescer. Em Nuzlocke, só os sobreviventes entram nessa conta.
- Corrigido o fim da run Nuzlocke quando o último Pokémon vence por dano de recuo e também cai. O resultado do motor pode ser vitória, mas a carreira termina sem sobreviventes.
- Monte Carlo agora detalha cada inicial e adversário, com denominadores explícitos, tamanho da equipe, intervalos de confiança e derrotas de emboscada separadas.
- Auditoria dos sets automáticos: 122 posições de ginásio e 21 iniciais; registra a origem dos aprendizados no Dex instalado.

## Amostra das campanhas

Seed-base 20260913. 200 runs por política no Clássico, 100 em cada outro modo: **1.600 campanhas executadas**, sem truncamentos na rodada concluída. Quatro políticas em cada modo, com seeds pareadas. As primeiras 100 seeds do Clássico repetem a amostra anterior para permitir comparação; não são 1.600 novas seeds independentes.

| Política                           |       Clássico | Correria | Nuzlocke |
| ---------------------------------- | -------------: | -------: | -------: |
| Só treinar o inicial               |          0/200 |    0/100 |    0/100 |
| Capturar até 4, treinar e preparar | 23/200 (11,5%) |    0/100 |    0/100 |
| Capturar até 6 e renovar cobertura |   36/200 (18%) |    0/100 |    0/100 |
| Preparação aleatória legal         |          0/200 |    0/100 |    0/100 |

No Clássico, os ICs de Wilson a 95% são 7,79–16,66% e 13,29–23,91% para as duas políticas com vitórias. As taxas são de agentes automáticos, não de jogadores humanos. Os intervalos se sobrepõem; não se afirma superioridade conclusiva entre as políticas.

Correria reutiliza políticas que podem gastar suas duas semanas capturando e preparando, deixando pouco treino. A IA de combate procura vencer a luta atual e não possui um objetivo específico de preservar a equipe durante toda a Nuzlocke. Por isso, zero vitórias não prova que esses modos sejam impossíveis ou que precisem de um nerf imediato.

## Onde as derrotas se concentram

Clássico, contando somente as vezes em que aquele adversário foi enfrentado:

| Adversário | Time de até 4: derrotas/encontros | Cobertura: derrotas/encontros |
| ---------- | --------------------------------: | ----------------------------: |
| Lance      |                    24/26 (92,31%) |                29/31 (93,55%) |
| Cynthia    |                    13/18 (72,22%) |                25/37 (67,57%) |
| Misty      |                       11/44 (25%) |                18/44 (40,91%) |
| Nessa      |                     8/33 (24,24%) |                10/33 (30,30%) |

Os times que chegam a cada adversário são diferentes e já passaram por seleção de sobrevivência. São sinais para investigar composição, golpes e recursos, não um ranking causal definitivo. Cada inicial tem só 4 a 15 runs por política na amostra Clássico: não há base para declarar o melhor inicial.

## Golpes: achados concretos

Os sets abaixo são **os gerados pelo Pokébobo**, não uma transcrição dos golpes do cartucho:

- Starmie da Misty, nível 21: Psychic, Surf, Power Gem e Recover.
- Roserade da Gardenia, nível 22: Petal Dance, Poison Sting, Leech Seed e Giga Drain.
- Cranidos do Roark, nível 14: Headbutt, Pursuit e Leer, sem golpe de dano do seu próprio tipo.

Starmie e Roserade recebem golpes fortes por aprendizados de nível 1 de evolução. Isso merece revisão porque o protótipo escolhe o set automaticamente. Não alterei a curva, o catálogo nem esses golpes nesta rodada: primeiro fica registrada a referência, para comparar mudanças futuras em condições iguais. A auditoria registra geração e ancestral que forneceram cada golpe.

## Bug encontrado pela simulação

Na seed 2435346282, política training, Nuzlocke, Incineroar derrotava o último Pokémon de Sidney com Flare Blitz e caía pelo recuo. O motor declarava vitória; o jogo removia o único integrante e tentava continuar com equipe vazia.

A correção aplica a regra de sobrevivência antes de conceder insígnia/progresso. O mesmo caso sem sobreviventes ocorreu duas vezes na rodada Nuzlocke concluída. Foi acrescentado um teste de batalha real com KO e recuo, seguido pelo reducer. No Clássico, a vitória do motor continua válida.

## Recomendações para a próxima rodada

1. **Políticas por modo:** em Correria, comparar uma preparação que reserve treino antes das berries; em Nuzlocke, valorizar sobrevivência e reposição. Isso melhora o instrumento antes de mexer nas regras.
2. **Sets dos líderes iniciais:** piloto com golpes escolhidos especificamente para primeiro/segundo ginásio, mantendo níveis e elencos já aprovados. Registrar origem e adaptações.
3. **Lance e cobertura tardia:** medir disponibilidade de respostas ao time dele e efetividade dos recém-capturados. Não diminuir todos os campeões por causa de um caso concentrado.
4. **Escolha simples de golpe:** oferecer uma substituição opcional na tela da equipe, sem nova moeda e sem interromper cada subida de nível. Ainda é proposta.
5. **Mais amostras por inicial:** amostragem estratificada com número fixo por inicial, para evitar conclusões apoiadas em apenas quatro runs.

## Reproduzir

```sh
node scripts/audit-moves.mjs
npm run balance:audit
npm run balance:monte-carlo -- --runs 200 --seed 20260913 --mode normal
npm run balance:monte-carlo -- --runs 100 --seed 20260913 --mode rush
npm run balance:monte-carlo -- --runs 100 --seed 20260913 --mode nuzlocke
```

Arquivos: [Clássico](monte-carlo-0.2.1-normal.json), [Correria](monte-carlo-0.2.1-rush.json), [Nuzlocke](monte-carlo-0.2.1-nuzlocke.json), [golpes](moves-0.2.1.json). Os resumos por inicial/adversário ficam dentro de cada estratégia. A simulação mantém limite de 180 turnos por combate, com truncamentos separados de derrotas.
