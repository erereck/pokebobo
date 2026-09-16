# D02 — Relatório 0.2.2

14/09/2026. Esta rodada trata exclusivamente da referência e disponibilidade dos golpes automáticos.

## Mudança e hipótese

O gerador antigo reduzia o nível de golpes herdados quando encontrava L1 na evolução. Starmie recebia Surf/Psychic cedo; Roserade recebia Petal Dance cedo. A correção conserva o calendário da pré-evolução, trata L0 separadamente e aplica uma geração comum à linhagem. A escolha usa apenas golpes com fonte registrada. Isso corrige a regra de aprendizado, sem prometer que toda campanha ficará mais fácil.

A regra vale para os dois lados. Níveis, elencos, ordem dos ginásios, +6, economia, encontros, IA e políticas de simulação não foram ajustados. A ajuda explica a mudança; saves antigos reiniciam para não preservar os sets anteriores.

Referência completa: [REGRAS-DE-GOLPES](../REGRAS-DE-GOLPES.md). Foram auditados 495 sets; 41/122 sets originais de ginásio mudaram e os 21 iniciais no nível 10 permaneceram iguais. O catálogo traz 484 entradas incluindo alias, com origem de cada golpe e exclusões justificadas.

## Campanhas nas mesmas seeds

800 campanhas no Clássico, 200 por política, seed base 20260913. Zero truncamentos. Os resultados são de bots, não taxas esperadas para pessoas.

| Política                           | Vitórias 0.2.1 | Vitórias 0.2.2 | Taxa atual e IC 95% de Wilson | Média de insígnias antes → depois |
| ---------------------------------- | -------------: | -------------: | ----------------------------: | --------------------------------: |
| Só treinar o inicial               |          0/200 |          2/200 |               1% · 0.27–3.57% |                       3.67 → 3.80 |
| Capturar até 4 e preparar          |         23/200 |         21/200 |           10.5% · 6.97–15.52% |                       6.10 → 6.55 |
| Capturar até 6 e renovar cobertura |         36/200 |         31/200 |          15.5% · 11.14–21.16% |                       5.84 → 6.53 |
| Preparação aleatória               |          0/200 |          0/200 |                  0% · 0–1.88% |                       1.47 → 1.56 |

A média de insígnias aumentou nas quatro políticas, mas a taxa de conclusão não subiu nas duas políticas de captura. As distribuições se sobrepõem e esta amostra não estabelece uma mudança estatisticamente significativa da taxa global. O objetivo desta rodada foi corrigir aprendizado, não calibrar uma meta de vitória.

### Comparação pareada

Cada par usa a mesma seed inicial e política nas duas versões. Alterações no combate podem mudar ações e consumo posterior de RNG; a campanha completa não mantém necessariamente todos os encontros seguintes iguais. As quatro políticas também reutilizam as mesmas 200 seeds: não são 800 seeds independentes.

| Política                           | Derrota → vitória | Vitória → derrota |
| ---------------------------------- | ----------------: | ----------------: |
| Só treinar o inicial               |                 2 |                 0 |
| Capturar até 4 e preparar          |                 5 |                 7 |
| Capturar até 6 e renovar cobertura |                 5 |                10 |
| Preparação aleatória               |                 0 |                 0 |

### Adversários observados

Denominador = vezes em que o bot realmente enfrentou esse adversário. Numerador = derrotas do jogador. Não é uma comparação controlada de batalhas idênticas: composição, caminho e sobrevivência até ali podem mudar.

| Política                           | Adversário | Derrotas / encontros 0.2.1 | Derrotas / encontros 0.2.2 |
| ---------------------------------- | ---------- | -------------------------: | -------------------------: |
| Capturar até 4 e preparar          | Misty      |                      11/44 |                       0/44 |
| Capturar até 4 e preparar          | Gardenia   |                       5/39 |                       4/39 |
| Capturar até 4 e preparar          | Kahili     |                       5/41 |                      11/46 |
| Capturar até 4 e preparar          | Lance      |                      24/26 |                      20/23 |
| Capturar até 6 e renovar cobertura | Misty      |                      18/44 |                       0/44 |
| Capturar até 6 e renovar cobertura | Gardenia   |                       5/39 |                       4/39 |
| Capturar até 6 e renovar cobertura | Kahili     |                       6/42 |                      10/51 |
| Capturar até 6 e renovar cobertura | Lance      |                      29/31 |                      39/42 |

Misty passa a zero derrotas nas duas políticas de captura nesta amostra, consistente com a retirada de golpes antecipados. Não concluo que ficou fácil para toda equipe: a política aleatória ainda perdeu 8/29 encontros e a de treino perdeu 4/37. Lance continua um obstáculo tardio (20/23 e 39/42 derrotas), sem ajuste de nível nesta entrega. A forma de Oricorio de Kahili agora usa seu learnset compartilhado em vez de Tackle fabricado; a correção pode fortalecer adversários em outros pontos.

## Reprodução e evidências

```sh
node scripts/catalog.mjs
node scripts/audit-moves.mjs
node scripts/monte-carlo.mjs --runs 200 --seed 20260913 --mode normal
npm run verify
```

[Resultados 0.2.2](monte-carlo-0.2.2-normal.json), [referência 0.2.1](monte-carlo-0.2.1-normal.json), [comparação pareada](comparison-0.2.2.json), [sets e fontes](moves-0.2.2.json), [manifesto do catálogo](catalog-0.2.2.json).

43 testes passaram. A verificação percorre as 484 entradas em todos os níveis de 1 a 100 (48.400 consultas), verifica existência da fonte original de cada golpe e cobre lembretes, evolução, formas e fallback. Isso valida disponibilidade e procedência, não balanceamento perfeito.

## Limites e minha recomendação

D02 está resolvido para o modelo automático documentado. Cranidos 14 sem STAB e a indisponibilidade automática de lembretes exclusivos são decisões explícitas, não lacunas ocultas. Reaprendizado ou escolha manual pertencem a C09. Correria e Nuzlocke não receberam nova rodada de Monte Carlo; os testes funcionais desses modos passaram. As medições antigas desses modos permanecem históricas e não estimam a dificuldade 0.2.2.

Recomendo jogar primeiro os líderes iniciais com o catálogo corrigido. Se ainda houver picos injustos, comparar batalhas com equipes fixas antes de mexer nos níveis. Não apliquei novas mudanças fora de D02. O [ROADMAP](../ROADMAP.md) preserva as demais propostas.
