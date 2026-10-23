# Mercado da Liga — 0.22.0

Depois de confirmar a vitória no oitavo ginásio e resolver as escolhas de evolução/golpes, a Jornada abre o Mercado da Liga. Negociar não gasta semanas ou RNG. Você pode consultar a equipe, trocar o líder e organizar a reserva. **Seguir para a Elite 4** encerra o mercado; ele não reabre entre as cinco batalhas.

## Vender

Equipe e reserva mostram espécie, nível, tipos e valor antes da confirmação. A venda remove definitivamente aquele indivíduo, credita o saldo uma vez e mantém sua espécie na coleção permanente. O último Pokémon ativo não pode ser vendido; para trocá-lo por alguém da reserva, use a tela Equipe. Pokémon removidos pelo Nuzlocke não chegam ao mercado.

O preço usa somente nível e soma dos atributos base da espécie (BST):

`valor = arredondar_em_50(1300 × (BST / 480)^1,35 × (nível / 45)^0,65)`

Há um mínimo de ₽ 200. Os expoentes valorizam espécies fortes e progresso de nível; shiny, HP, item e TMs compradas não aumentam o preço. Isso evita que ensinar uma TM para revender o Pokémon gere dinheiro.

## Comprar e aprender

São 12 ofertas com uma unidade por TM a cada jornada. O preço médio é ₽ 1.000; Protect custa ₽ 600, enquanto Earthquake custa ₽ 1.400. Os preços individuais estão em `src/game/config/market.js`.

A compra exige selecionar um Pokémon compatível da equipe ou reserva. Se ele já conhece o golpe, não é um alvo elegível. Com quatro golpes, é obrigatório escolher qual será substituído; com vaga livre, a TM ocupa essa vaga. O botão final **Comprar e ensinar** faz tudo numa transação: aplica o golpe, desconta o valor e consome a unidade. Cancelar, fechar ou recarregar antes dessa confirmação não cobra nem guarda um disco na mochila.

Compatibilidade vem das fontes de máquina (`M`) de geração 8, com fallback para 7 conforme a referência já adotada pelo catálogo, incluindo a linhagem. `npm run market:catalog` compila a tabela; `npm run check` detecta dados desatualizados. O navegador continua sem carregar os learnsets completos. Os golpes e seus efeitos em combate seguem o motor Gen 8 existente.

Golpes ensinados ficam marcados em `mon.tmMoves`. O modo automático conserva os que ainda estão equipados ao subir de nível/evoluir, preenchendo os outros espaços com sua seleção normal. No modo manual, o treinador pode substituí-los explicitamente num aprendizado posterior.

## Medições e limites

`npm run market:audit` mede 12 espécies intermediárias evoluídas: Pidgeot, Arbok, Raichu, Sandslash, Golduck, Machamp, Golem, Rapidash, Muk, Hypno, Seaking e Victreebel.

| Nível | Venda média | TMs médias por venda |
| --- | ---: | ---: |
| 35 | ₽ 1.104,17 | 1,104 |
| 45 | ₽ 1.304,17 | 1,304 |
| 55 | ₽ 1.487,50 | 1,488 |

O alvo de aproximadamente 1,3 é uma média de referência, não uma taxa fixa para toda espécie/nível ou uma garantia de comprar qualquer TM. Cada trajetória chega com níveis e reservas diferentes.

A auditoria também resolve **44 combates reais**, em 22 pares contra os 11 membros possíveis da Elite na primeira posição, com equipe fixa nos níveis 45/50. Cada par conserva adversário e seed; uma política mantém a equipe e outra vende duas reservas para ensinar Earthquake e Shadow Ball. Foram 11 vitórias de 22 antes e 13 depois. Essa amostra identifica problemas de integração e dá uma comparação limitada; não estima dificuldade humana nem a probabilidade de completar toda a Liga. [Dados reproduzíveis](balance/market-0.22.0/economy-and-combat.json).

O navegador foi conferido em Edge/Chromium com 1280×800, 390×844, 320×568 e 844×375: cancelamento de venda, venda da reserva, alvo/substituição obrigatórios, cancelamento sem cobrança, compra/aprendizado, reload e entrada na Elite 4 com o golpe equipado. Sem erro de console/requisição, imagem quebrada ou overflow horizontal. São visores emulados, não testes em aparelhos físicos. [Relatório](balance/market-0.22.0/browser.json).

Schema 4 preservado: os novos campos são aditivos. Jornadas antes do oitavo ginásio passam pela nova parada; jornadas que já estavam na Liga continuam de onde estavam. Nenhum replay já salvo é alterado. Saldo, estoque e TMs equipadas sobrevivem à exportação/restauração. O simulador de campanhas base conserva a equipe e segue pelo mercado sem negociar; a política de compras é medida na auditoria específica acima.
