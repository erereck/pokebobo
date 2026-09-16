# Balanceamento — 0.2.0
Medição em 13/09/2026. Esta é uma primeira calibração, com amostras reproduzíveis e combates reais.

## Crescimento de níveis
O inicial continua no nível 10. Viagens dão zero, ginásios e Liga +1, emboscadas zero. Treino dá +1 a +3 ao time. Sem treino, o orçamento até a entrada da Liga caiu de **52 para 18**.

| Treinos por cidade | 1º ginásio, mediana | 8º ginásio, mediana | Liga, mediana | Liga ≥99 |
|---|---:|---:|---:|---:|
| 0 | 10 | 17 | 18 | 0% |
| 1 | 16 | 37 | 38 | 0% |
| 2 | 22 | 57 | 58 | 0% |
| 3 | 28 | 77 | 78 | 0% |

São 10.000 sequências por estratégia, assumindo todas as vitórias, inicial mantido desde a origem, mesmo número de treinos por cidade e nenhuma emboscada. Isso é orçamento, não dificuldade. Na 0.1, três treinos por cidade produziam nível mediano 100 e 99,88% de entradas na Liga em ≥99. Agora não houve ≥99 nessa amostra; o nível continua teoricamente alcançável, sem trava por etapa. [Dados atuais](current-progression.json), [referência 0.1](../archive/progression-0.1.json).

## Campanhas com batalhas reais
400 campanhas no Clássico, 100 por política, seed inicial 20260913. Mesmas seeds entre políticas; decisões de preparação usam RNG separado. A IA observável pilota ambos os lados e o combate usa @pkmn/sim.

| Política | Vitórias | IC 95% da taxa | Entradas na Liga | Nível mediano ao entrar |
|---|---:|---:|---:|---:|
| Só treinar o inicial | 0/100 | 0–3,70% | 14 | 83 |
| Capturar até 4, treinar e preparar berries | 11/100 | 6,25–18,63% | 63 | 68 |
| Capturar até 6, renovar e priorizar cobertura | 15/100 | 9,31–23,28% | 60 | 64 |
| Preparação aleatória entre ações legais | 0/100 | 0–3,70% | 5 | 47 |

**Zero campanhas truncadas.** Limite técnico: 180 turnos por batalha; truncamentos são separados de derrotas. Os intervalos são de Wilson. Medianas de nível consideram somente quem chegou à Liga, portanto têm viés de sobrevivência. “Só treinar” mantém apenas um Pokémon; não é um experimento que isola exclusivamente a influência do nível.

As políticas com captura chegaram mais longe e venceram; nível alto sozinho não garantiu título. A diferença entre 11% e 15% não estabelece superioridade estatística. Nenhuma dessas taxas estima diretamente a experiência humana.

A simulação expôs uma tentativa de troca recusada por Magnet Pull inicialmente oculto. A IA agora reage à recusa e escolhe um golpe legal, sem consultar antecipadamente a habilidade escondida. Um teste específico conserva essa correção.

## Próximos ajustes guiados pela amostra
- Segundo ginásio: 16 derrotas na política de quatro integrantes e 25 na de cobertura.
- Campeão: 26 e 28 derrotas, respectivamente. Rever sets/cobertura e economia das berries antes de simplesmente diminuir todos os níveis.
- Separar resultados por inicial, região e líder; ampliar seeds e simular Correria/Nuzlocke.
- Testar com pessoas: entendimento do draft, valor da troca tardia e duração das sessões.

## Reproduzir
Na raiz do projeto:

```sh
npm run balance:audit
npm run balance:monte-carlo -- --runs 100 --seed 20260913 --mode normal --strategy all
```

`--runs` é a quantidade **por estratégia**. Modos aceitos: normal, rush e nuzlocke. Políticas: training, balanced, coverage e random. `--out caminho.json` grava em outro arquivo.

[JSON completo](monte-carlo-0.2.json) contém seeds, origem, inicial, caminho, ações, batalhas, níveis, vencedor e composição final por campanha. A simulação usa os handlers reais da carreira e compartilha a inicialização do motor com o replay do jogo; a equivalência é coberta por teste.
