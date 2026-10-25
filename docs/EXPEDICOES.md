# Além da trilha — 0.24.0

**Fora da trilha**, na Jornada, oferece duas expedições opcionais antes da oitava insígnia. Também há uma passagem à esquerda do começo das rotas: entrar por ela aproveita a semana de exploração já gasta e encerra a caminhada anterior. O desvio só pode ser escolhido antes de resolver um encontro naquela caminhada; depois disso, fica para outra ação. Assim não acumula capturas e uma expedição completa na mesma semana. Não cobra uma segunda ação nem permite voltar àquela caminhada.

| Lugar | Liberação | Primeiro baú | Segundo achado | Guardião | Tesouro da vitória |
| --- | --- | --- | --- | --- | --- |
| Caverna dos Ecos | 2 insígnias | ₽ 200 + 2 Poké Bolas | 3 Poké Bolas **ou** 2 kits | Sandshrew 22, Golbat 23, Graveler 24 | ₽ 200 + Focus Sash **ou** Leftovers |
| Ruínas da Aurora | 5 insígnias | ₽ 300 + 2 Poké Bolas | 3 Poké Bolas **ou** 2 kits | Sigilyph 34, Bronzong 35, Claydol 36 | ₽ 300 + Choice Scarf **ou** Leftovers |

Cada lugar custa **uma semana pela visita inteira**, tem três salas caminháveis e só permite uma visita por jornada. O desbloqueio permanece disponível até sete insígnias; os lugares fecham ao conquistar a oitava, antes do Mercado da Liga. Não dependem de bioma, de encontro aleatório ou de ter Poké Bolas. Jornadas schema 4 em andamento também recebem as oportunidades, se ainda estiverem nessa janela.

Use setas, WASD, direcional segurado ou casas adjacentes para caminhar. Aproxime-se do baú para examinar. Guarde o primeiro achado e escolha uma bolsa na segunda sala para liberar a passagem ao norte. As salas não reutilizam o limite de 50 passos das rotas e não cobram recursos adicionais.

**Sair com os achados** fica disponível em todas as salas, sem caminhar de volta à entrada. A confirmação explica que a visita será encerrada e os achados restantes ficarão para trás. Tudo que já foi recolhido fica imediatamente na mochila; moedas aguardam o Mercado da Liga. Recarregar conserva posição, passo escolhido, baús, bolsa e visita: não sorteia novos prêmios e não permite farmar a primeira sala.

Na última sala, **Ver desafio** revela elenco, níveis, prêmio e consequências. Você pode cancelar e sair sem lutar. Equipe, reserva, líder, apelidos e equipamentos continuam administráveis pelas teclas existentes enquanto está nas salas; treinar, procurar itens e preparar kits continuam sendo ações de cidade. Entrar no combate bloqueia essas mudanças normalmente.

O guardião usa o motor real Gen 8 e a mesma IA observadora dos outros combates. A equipe começa recuperada, com seus itens atuais. **Derrota encerra a jornada; no Nuzlocke quem cair sai da equipe mesmo na vitória. Sem sobreviventes, a jornada termina.** Itens consumidos, removidos ou trocados seguem o resultado real. Feitos e memorial registram essa luta.

Vencer recupera os sobreviventes, não dá níveis e não gasta outra semana. Depois do resultado, escolha um dos equipamentos; dinheiro e item são concedidos juntos, uma única vez. O outro equipamento fica para trás. Você pode equipar o prêmio na Mochila antes de concluir. Não é possível sair da tela de tesouro sem escolher. Concluir encerra a visita e resolve o orçamento da cidade.

**Última semana:** sair ou concluir começa automaticamente o ginásio/viagem, como nas demais ações. Entrada, saída e conclusão avisam isso. A expedição substitui o acontecimento/emboscada daquela ação; não acrescenta uma batalha surpresa depois de recuar.

## Economia e dificuldade medidas

Concluir os dois lugares rende, somando os dois baús e vitórias, **₽ 1.000**: uma TM média. Além disso, são quatro Poké Bolas, duas escolhas entre bolsas e dois equipamentos. Recuar depois dos dois primeiros baús rende ₽ 500, sem os tesouros. O custo de oportunidade são duas ações que poderiam virar treino, captura ou preparo. Equipamentos obedecem às regras existentes, inclusive consumo e perda por golpes.

`npm run expeditions:audit` resolve 252 combates reais: dois lugares × sete origens × duas composições × três níveis × três seeds. Sem itens, com a mesma política observadora nos dois lados, equipes de quatro na caverna/cinco nas ruínas, limite de 240 turnos. Linhagens são evoluídas nos níveis testados. Não ajusta a regra automaticamente e não produz fixtures de expectativa com o motor sob teste.

| Lugar | Níveis do jogador | Vitórias na amostra |
| --- | --- | --- |
| Caverna | 20 / 23 / 26 | 23/42 · 41/42 · 42/42 |
| Ruínas | 32 / 35 / 38 | 19/42 · 31/42 · 42/42 |

Nenhuma luta atingiu o limite. A composição importa: o grupo de referência rocha/psíquico sofreu mais nas ruínas que o grupo com água/sombrio. A prévia e a possibilidade de recuar fazem parte do equilíbrio; a amostra não representa pessoas nem uma campanha completa. A auditoria base de progressão mantém seu percurso sem expedições, porque são desvios opcionais.

## Apresentação e limites

Salas de 12×8, visor 192×144, três mapas autorais fixos e paletas próprias. Caverna usa pedras/cristais; ruínas usam lajes/inscrições. No PC, cena e comandos ficam lado a lado; no telefone, em sequência. Comandos de 44 px, confirmação nativa, foco/Escape, movimento reduzido e saves antes da animação reutilizam os padrões existentes. Trilha local de caverna.

Cenários, baús, bolsas, sentinela e arco são desenhos próprios em canvas, incluídos no bundle local. Red reutiliza o bitmap FRLG já creditado. Não há downloads novos, mapas canônicos atribuídos a lugares fictícios ou assets de rede necessários para desenhar as salas. [Origem e termos](ARTES-E-ROTAS.md).

Os lugares não têm encontros selvagens, novo sistema de HP persistente, relíquias passivas ou salas procedurais. O guardião tem níveis fixos: voltar mais tarde dentro da janela pode facilitar o combate. A conferência de UI usa emulação; não substitui toque/teclado virtual em um telefone físico. A matriz WebKit no Windows bloqueia o service worker e não mede offline.

Navegador: [Edge](balance/expeditions-0.24.0/browser-edge.json), [WebKit](balance/expeditions-0.24.0/browser-webkit.json), [regressões do Edge](balance/expeditions-0.24.0/regression-edge.json).

Dados: [combates/economia](balance/expeditions-0.24.0/combat-and-economy.json). Verificação de código e navegador registrada na [validação](../VALIDACAO.md).
