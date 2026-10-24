# Revisão do projeto e ideias para o Pokébobo · 24/10/2026

Base: `4b66531`, versão 0.22.1. Pedido: revisar o projeto em busca de novas ideias para melhorar o jogo. As propostas abaixo são hipóteses de design, ainda sem implementação ou balanceamento validado.

Minha recomendação é dar mais identidade às jornadas: alguém para reencontrar, Pokémon com papéis distintos e lugares que recompensem uma decisão arriscada. O jogo já tem uma apresentação própria; essas mudanças aproveitam essa base e criam histórias diferentes entre partidas.

## O que foi revisado

Leitura de README, arquitetura, guia de edição, regras e relatórios anteriores; inventário dos 275 módulos JS/JSX; inspeção dos fluxos principais de draft, semanas, exploração, eventos, captura, evolução, equipe/reserva, combate/IA/replay, Mercado, Liga, encerramento, coleção, convites, saves e offline. Também foram consultados componentes, estilos, testes e capturas existentes do Mercado em PC/celular. Isso é uma revisão transversal dos sistemas, não uma auditoria linha a linha de todos os arquivos.

O inventário encontrou 486 entradas de catálogo para 485 espécies/formas únicas, 37 ginásios, sete origens, quatro composições de campo e 69 eventos, dos quais 12 são os eventos de aventura. Os 12 fazem parte dos 69, não são conteúdo adicional à contagem. [Diagnóstico e método](reviews/2026-10-24/diagnostico.json).

Algumas sugestões antigas já estão prontas: música/cries, efeitos de golpes, celebrações, descrição de golpes, quatro desenhos de campo, pesca/Surf, pistas de Mew/Suicune, shinies, Pokédex persistente, cartão compartilhável, convite de região, slots/backups, instalação/offline e Mercado com TMs/Rare Candy. A próxima rodada pode aprofundar esses sistemas.

## Prioridades

Esforço é relativo ao projeto atual, não uma estimativa de prazo. A ordem mede o interesse da ideia; a sequência de entrega sugerida aparece ao final.

| Ordem | Ideia | O que muda para quem joga | Esforço relativo |
| --- | --- | --- | --- |
| 1 | Rival persistente | Os reencontros dão uma história e uma revanche à jornada | Médio |
| 2 | Cavernas e ruínas opcionais | Explorar passa a incluir a decisão de continuar ou sair | Alto |
| 3 | Itens equipáveis de verdade | O mesmo time ganha estratégias novas sem ganhar níveis | Médio |
| 4 | Relíquias da jornada | Cada partida ganha uma combinação própria de vantagens | Médio/alto |
| 5 | Missões que terminam no campo | Pistas viram destinos e NPCs voltam para reconhecer escolhas | Médio |
| 6 | Seu antigo campeão como adversário | Uma equipe querida vira um desafio de outra jornada | Médio/alto |
| 7 | Personalidades de captura | Dois Pokémon da mesma espécie podem ter papéis diferentes | Médio/alto |
| 8 | Cidades com especialidades | O draft decide oportunidades além de bioma e encontros | Médio |
| 9 | Desafio da semana e medalhas | Amigos têm uma configuração comum para comparar histórias | Médio |
| 10 | Heróis da equipe e epítetos | O Hall lembra quem salvou a partida e como isso aconteceu | Médio |

## 1. Um rival que cresce com você

Escolher um rival no começo, com nome, inicial e uma pequena personalidade. Ele reaparece com o mesmo núcleo de equipe evoluído e reage aos encontros anteriores. A graça seria reconhecer aquele Pokémon que já deu trabalho e preparar a revanche.

**Primeira versão:** um rival, três aparições espaçadas e uma revanche opcional antes da Liga. Parte das aparições pode substituir encontros genéricos existentes, evitando acrescentar uma sequência obrigatória de batalhas a toda campanha. Seu elenco e evolução ficam definidos pela seed e pelos marcos da jornada; ele pode reagir ao que já viu em confrontos anteriores, sem consultar golpes ainda ocultos ou a escolha atual do jogador.

**Base existente:** há “Rival de ocasião” nos eventos e “Rival Nico” entre nomes de emboscada. Eles ainda não formam um personagem com elenco e memória persistentes. Pontos de entrada: [eventos](../src/game/data/weekEvents.js), [início de batalha](../src/game/battle/beginBattle.js), estado e Diário.

**Critério de sucesso:** reencontrar o mesmo rival após recarregar; reconhecer seu inicial evoluído; ter uma recompensa e um custo explícitos; preservar progressão e regras de derrota de cada modo. Comparar campanhas reais com/sem os encontros antes de torná-los obrigatórios.

## 2. Cavernas e ruínas com a escolha de voltar

Uma entrada opcional no campo abre uma pequena expedição: duas ou três salas, uma descoberta e um guardião no final. Em cada etapa, escolher entre sair com o que encontrou ou continuar atrás da recompensa principal. Isso cria o momento “já consegui algo bom, será que arrisco mais?”.

**Primeira versão:** uma ruína em um trecho intermediário, uma visita por jornada, duas salas e um combate opcional. A entrada ocupa uma ação semanal de exploração; deve ficar explícito se algum passo adicional custa outro recurso. Sair conserva a recompensa parcial, mas não permite repetir a primeira sala para farmar. Antes do guardião, informar a consequência da derrota no modo atual.

**Base existente:** campo, layouts, cenas de evento e combates de aventura já existem. Ainda faltam estado da expedição, entrada/saída, orçamento, recompensa e composição das salas. O [campo atual](../src/game/world/exploration.js) tem um orçamento próprio de passos; não se deve reutilizá-lo implicitamente para cobrar duas vezes pela mesma visita.

**Critério de sucesso:** caminho curto no celular, recompensa interessante sem ser obrigatória para vencer, saída/recarga sem duplicação e ausência de farm infinito. Novas artes precisam ser locais e ter origem/termos registrados.

## 3. Leftovers, Focus Sash e Choice Scarf

Um tanque com Leftovers, um atacante frágil com Focus Sash ou alguém que ganha velocidade com Choice Scarf. Cada item muda decisões reais e dá mais valor a montar uma equipe complementar. É a melhor combinação de novidade estratégica com reaproveitamento do motor.

**Primeira versão:** três itens, um espaço por Pokémon e estoque limitado. Ofertas no Mercado da Liga e, depois, uma fonte rara em eventos anteriores. Preços precisam competir com cobertura por TM e nível por Rare Candy, preservando as referências atuais: Pokémon intermediário ≈ 1,3 TMs; doce = 0,7 TM média. Não há preço novo proposto como validado nesta revisão.

**Base existente:** o Dex Gen 8 instalado reconhece os três itens e [battleSet](../src/game/pokemon/battleSet.js) já envia `mon.item` ao simulador. A preparação atual equipa Sitrus Berry em todos; [box](../src/game/actions/box.js) apaga o item ao guardar/trocar integrantes; a [ficha](../src/features/team/PokemonDetails.jsx) chama qualquer item presente de Sitrus Berry. Portanto, a mudança inclui inventário/equipamento, textos e regras de devolução/consumo, além do catálogo.

**Critério de sucesso:** guardar/trocar/vender Pokémon não destrói nem duplica equipamento; preparar não sobrescreve silenciosamente um item valioso; itens consumíveis e permanentes seguem uma regra visível. Verificar os efeitos em combates reais e a escolha completa de compra/equipamento no celular.

## 4. Relíquias para dar uma identidade a cada partida

Em dois marcos da campanha, escolher uma entre três vantagens de viagem. Limite de duas relíquias, válidas só naquela jornada. A combinação deve mudar como explorar e administrar recursos.

**Exemplos de direção:** uma bolsa que garante bolas na primeira busca de cada cidade, trocando a possibilidade de receber berries nessa busca; ou um mapa que substitui uma oportunidade terrestre por uma aquática depois de a pesca estar liberada. Quantidades e condições ainda precisam de protótipo. Priorizar alternativas com custo de oportunidade e sem bônus cumulativos de dano.

**Base existente:** [bônus de eventos](../src/game/career/weekEvents.js) já alteram ações futuras. Relíquias duradouras exigem seleção, cargas, limites e apresentação próprios; não basta renomear um bônus temporário. Separar seu papel dos itens equipáveis: relíquias afetam decisões da viagem; itens usam as regras de batalha do motor.

**Critério de sucesso:** pelo menos duas escolhas razoáveis para equipes diferentes, sem uma opção dominante, sem recompensa permanente de poder entre runs e sem alterar às escondidas a captura base. Executar auditoria de progressão e comparar campanhas reais antes de calibrar.

## 5. Uma missão que dê vontade de procurar a próxima pista

O jogo já tem cadeias de pistas de Mew e Suicune. O avanço seria ligar uma delas a um ponto visitável do campo, permitir acompanhar o objetivo no Diário e trazer o NPC de volta em uma cena de conclusão.

**Primeira versão:** uma cadeia de três etapas — ajudar alguém, encontrar uma marca na próxima área elegível e escolher entre enfrentar um guardião ou preservar o lugar. A recompensa pode ser um item raro ou um encontro especial. Depois de aceitar a missão, a etapa seguinte deve ter uma condição clara de aparecimento, evitando depender de uma segunda loteria sem informação.

**Base existente:** [adventureEvents](../src/game/data/adventureEvents.js) usa flags, requisitos, encontros especiais e recompensas. Falta ligar o objetivo a uma interação de mapa e mostrar seu estado de forma curta.

**Critério de sucesso:** objetivo compreensível em uma frase, final possível antes da Liga, escolha com consequência e pista que não fique sem resolução só por falta de sorte. Usar Diário/Mapa existentes, sem acrescentar mais um botão ao cabeçalho.

## 6. Enfrentar a lenda que você mesmo criou

Depois de se tornar campeão, desbloquear um duelo opcional contra o time campeão de uma jornada anterior. O antigo inicial vira o adversário que fecha a nova história. Uma etapa posterior poderia permitir receber o campeão de um amigo por um código próprio.

**Primeira versão:** um adversário local, opcional e separado do título já conquistado. Derrota nesse duelo não apaga a conquista. Deve ser apresentado como duelo contra a equipe registrada, não como reprodução das decisões da partida antiga.

**Limite concreto:** [finishRun](../src/game/career/finishRun.js) guarda espécie, nível e shiny, mas não o conjunto completo de golpes/itens. Para reproduzir o time fielmente, registrar conjuntos completos a partir das futuras vitórias. Históricos antigos não contêm informação suficiente para inventar esses conjuntos. O [convite PB1](../src/game/world/regionChallenge.js) aceita apenas a configuração inicial da região; equipes compartilhadas precisam de um formato separado e validado.

**Critério de sucesso:** time preservado ao longo do tempo, regras claras de nível/normalização, convite sem acesso a recursos/save alheio e nenhuma promessa de ranking global a partir de saves locais editáveis.

## 7. Pokémon da mesma espécie com papéis diferentes

Hoje, [battleSet](../src/game/pokemon/battleSet.js) fixa natureza Hardy, IVs 20 e EVs zero; a habilidade vem do catálogo. Dois exemplares da mesma espécie e nível ficam muito próximos mecanicamente. Uma captura poderia trazer um perfil de natureza/habilidade com vantagem e contrapartida reais.

**Primeira versão:** poucas espécies com dois ou três perfis legais e fáceis de entender. Mostrar natureza oficial e seu efeito concreto, por exemplo “mais Velocidade, menos Ataque”. Manter IVs/EVs fixos nesse primeiro passo. Isso dá motivo para comparar duas capturas sem criar uma obrigação de reproduzir ou treinar atributos.

**Critério de sucesso:** perfis úteis para papéis distintos, sorteio determinístico e só uma vez por captura; evolução mantém uma habilidade legal e não sorteia novamente. A avaliação do Mercado deve ser reconsiderada com esses perfis, sem presumir que toda habilidade rara merece preço maior. Shiny continua sendo uma característica visual.

## 8. Cidades com algo que só elas oferecem

Escolher uma cidade no draft poderia escolher também uma oportunidade: observatório com uma pista, porto com expedição aquática ou oficina com uma troca limitada de suprimentos. A região montada pelo jogador ganharia mais consequência.

**Primeira versão:** quatro cidades com especialidades distintas, descritas em uma linha no draft. Usar um evento/serviço por cidade, com custo ou limite explícito. Preservar a ordem original dos ginásios e a decisão atual de não entregar antecipadamente o tipo do líder no draft.

**Base existente:** dados de cidades, encontros por assinatura e telas de escolha já distinguem a rota. A especialidade deve complementar isso, sem transformar todas as paradas em lojas ou aumentar o orçamento semanal sem uma decisão explícita.

**Critério de sucesso:** escolher entre duas cidades faz diferença compreensível; nenhuma vira escolha obrigatória; benefícios cabem nas três ações locais do Clássico e duas da Correria, ou informam claramente uma exceção.

## 9. Um desafio da semana para jogar com amigos

Uma região pronta, com seed, cidades e modo definidos, acompanhada de uma medalha local por completar. Alternar propostas como equipe pequena ou restrição de tipos quando essas regras estiverem bem definidas. A graça é comparar escolhas e histórias usando o compartilhamento existente.

**Primeira versão:** uma configuração curada e acessível por convite, sem prazo punitivo. No começo, comparar apenas conclusão/insígnias e a jornada, sem pontuação arbitrária que favoreça farm. A seed sozinha não fixa a região se cada pessoa puder escolher cidades diferentes.

**Base existente:** convites PB1 já compartilham cidades/modo/seed/RNG inicial; Hall e cartão já divulgam o resultado. Novas restrições exigem validação própria para capturas, evolução e equipe, em vez de só um texto no convite.

**Critério de sucesso:** mesma configuração e versão geram o mesmo ponto de partida, regras cabem em poucas linhas e amigos podem começar sem conta. Um ranking competitivo confiável exigiria outra infraestrutura e não está incluído na proposta.

## 10. O Hall lembrar quem foi o herói

Apelidos opcionais e pequenos feitos da equipe: quem decidiu mais batalhas, salvou uma luta com 1 HP ou derrotou o último Pokémon do campeão. O Hall e o cartão poderiam destacar um protagonista e um epíteto cosmético, como “o improvável”.

**Primeira versão:** apelido + um feito calculado a partir de eventos confirmados de batalha. Começar por uma métrica objetiva, como golpes finais, e só depois adicionar feitos mais complexos. No Nuzlocke, um memorial pode preservar o nome e o feito de quem caiu.

**Base existente:** há eventos de apresentação, Diário, Hall e cartão. Ainda não há um resumo persistente de desempenho de cada integrante. Animação pulada ou turno reconstruído não podem contar o mesmo feito novamente.

**Critério de sucesso:** registro deriva do resultado salvo, fica correto após recarregar, informa o que o epíteto significa e não concede bônus permanente de atributos. O cartão continua legível no celular.

## Melhorias menores que acompanham essas ideias

- **Leitura da equipe antes da Liga:** resumo factual de tipos, golpes de cobertura e fraquezas compartilhadas, acessível pela equipe ou seleção de TM. Deve ajudar a entender a compra, sem prometer vitória nem revelar conjuntos ocultos dos adversários.
- **Chefes com um plano reconhecível:** conjuntos curados em torno de clima, velocidade ou defesa, com sinais públicos na apresentação. Primeiro corrigir e avaliar a estimativa da IA; depois medir esses conjuntos em batalhas reais. Subir níveis por si só não cria essa identidade.
- **Dica factual após a derrota:** apontar um acontecimento verificável da luta, como o adversário que decidiu mais nocautes, e oferecer a ficha/explicação pertinente. Evitar diagnósticos genéricos ou afirmar que uma TM teria garantido vitória.

## Achado técnico antes de ampliar a IA

Há uma diferença entre o cálculo real da batalha e a estimativa usada para escolher ações. O motor executa Body Press usando a Defesa do usuário; os testes de semântica do motor já cobrem isso. Porém, [estimateDamage](../src/game/battle/aiScoring.js) escolhe Ataque para todo golpe físico.

Sonda sintética no nível 50, Body Press, usuário Fighting com Ataque 40/Defesa 150, alvo Normal com Defesa 100 e demais fatores fixos:

| Mudança isolada | Estimativa atual |
| --- | ---: |
| Referência | 44,622 |
| Ataque do usuário 40 → 200 | 200,910 |
| Defesa do usuário 150 → 300 | 44,622 |

O Dex instalado declara `overrideOffensiveStat: "def"`, mas a estimativa reage ao atributo errado. Isso pode distorcer a escolha da IA; **não significa que o dano aplicado pelo simulador esteja errado**. Os números acima são uma heurística, não uma previsão validada de dano. Foul Play e Psyshock merecem casos equivalentes; não foram reproduzidos nessa sonda e não estão registrados como achados confirmados aqui.

Além disso, [restoreBattle](../src/game/battle/restore.js) reconstrói a luta a partir das escolhas do jogador e recalcula a IA. Mudar sua política pode reinterpretar uma luta em andamento. Antes de fazê-lo, registrar as decisões necessárias para restaurar fielmente ou assumir uma incompatibilidade explícita usando `SAVE_VERSION`, conforme AGENTS. Manter uma única regra ativa; não adicionar motores antigos em paralelo.

## Sequência de entrega recomendada

1. **Mais estratégia e um personagem:** três itens equipáveis + rival persistente. Corrigir a avaliação da IA e tratar a compatibilidade de replay na mesma frente técnica, com casos específicos e combates reais. Entregar em incrementos verificáveis.
2. **Uma aventura completa:** uma missão ligada ao campo com NPC recorrente e final próprio. Medir se as pessoas entendem a pista, encontram o destino e consideram a recompensa interessante.
3. **Expansão da exploração:** uma ruína opcional e uma seleção pequena de relíquias. Só ampliar salas/relíquias depois de validar orçamento, repetição e dificuldade.
4. **Memória e rejogabilidade:** conjuntos completos no Hall, antigo campeão como adversário, feitos/apelidos e desafio curado. Naturezas/habilidades e cidades especializadas entram conforme a necessidade de variedade observada.

Para a próxima rodada, eu escolheria o pacote **rival + três itens + uma missão**, dividido nas duas primeiras etapas acima. Ele combina vínculo, estratégia e descoberta sem exigir uma campanha inteira nova. Cavernas e relíquias são a aposta mais forte para uma expansão maior.

## Verificações e limites desta revisão

- `npm run check` e depois `npm run verify` concluídos nesta rodada. Arquitetura: 275 módulos, sem ciclos/imports inválidos ou dependência de UI no motor; compatibilidade de 12 TMs em 486 entradas. As duas execuções de testes passaram: 210 normais e 205 com motor empacotado; são suítes sobrepostas, não 415 casos diferentes. Build web aprovado. [Log completo](reviews/2026-10-24/verify.txt).
- Inventário, reconhecimento dos três itens pelo Dex instalado e sonda sintética de Body Press executados nesta rodada. [Resultados](reviews/2026-10-24/diagnostico.json).
- Esta entrega altera documentação, sem implementar as ideias ou alterar regras/arte/save. Não foi executado standalone. A auditoria de progressão, os estudos de economia e os testes de navegador das entregas anteriores continuam como evidência histórica; não foram repetidos nesta revisão.
- Não houve nova campanha humana, sessão em aparelho físico, teste de navegador ou medição de desempenho nesta rodada. As capturas consultadas são da 0.22.1. Os testes de transição com equipe nível 100 existentes na suíte não demonstram balanceamento humano.
- Permanecem úteis uma jornada humana em Android/iPhone e observação das decisões de vender Pokémon, escolher TMs e comprar doces antes de recalibrar preços ou dificuldade. O build mede tamanho, mas não prova tempo de carregamento em um telefone real.

Os relatórios anteriores do ROADMAP foram preservados. Este documento prioriza propostas; não transforma todo o conjunto em compromisso de implementação.
