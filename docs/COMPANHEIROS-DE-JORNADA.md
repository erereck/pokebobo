# Companheiros de jornada — 0.23.0

Três novidades ligadas à mesma equipe: um rival que acompanha a viagem, itens que mudam a estratégia e um registro de quem fez a diferença. Regras e textos em português; espécies, golpes e itens conservam os nomes oficiais usados no jogo.

## Seu rival

Na região pronta, escolha Nico, Lia ou Caio antes de partir. Há uma escolha inicial determinística pela seed; trocar o personagem não sorteia de novo a região ou o shiny. O rival leva outro inicial da mesma origem e conserva essa linhagem até o fim. Seus companheiros também evoluem. Personalidade aparece nas falas e na composição da equipe; a política observadora de IA permanece a mesma.

| Janela | Equipe do rival | Níveis | Recompensa por vitória |
| --- | --- | --- | --- |
| 2 a 4 insígnias | 2 Pokémon | 18, ás 20 | Leftovers |
| 5 a 7 insígnias | 3 Pokémon | 32, ás 34 | Focus Sash |
| 8 insígnias, antes de entrar na Liga | 4 Pokémon | 44, ás 46 | Choice Scarf |

As revanches são opcionais e não gastam semanas nem dão níveis extras. O aviso antes de entrar mostra equipe, níveis, prêmio e a consequência: uma derrota encerra a jornada. No Nuzlocke, quem cair deixa a equipe também nessa luta.

Cada etapa oferece uma vitória/recompensa. A próxima janela substitui a anterior; não existe acúmulo de batalhas para buscar prêmios antigos. Depois de ganhar, a chamada desaparece até o próximo marco. A terceira revanche volta ao Mercado, com dinheiro e compras preservados. Entrar na Liga encerra a oportunidade.

O rival guarda as vitórias e uma lembrança de cada duelo: o parceiro que mais conseguiu nocautes diretos entre os que entraram em campo, seu apelido naquela ocasião e a duração. A fala do próximo encontro reconhece essa lembrança. Ele não consulta golpes ocultos ou o comando atual para usar essa memória. Abertura da batalha consome sua seed como os outros confrontos; com as mesmas decisões, a jornada continua determinística.

## Equipamentos

| Item | Preço no Mercado | Efeito normal |
| --- | ---: | --- |
| Leftovers | ₽ 1.200 | Recupera 1/16 do HP máximo no fim do turno |
| Focus Sash | ₽ 700 | Com HP cheio, resiste a um golpe fatal com 1 HP; consumido ao ativar |
| Choice Scarf | ₽ 1.000 | Velocidade +50%; fica preso no primeiro golpe até sair de campo |

O simulador Gen 8 aplica os efeitos, incluindo PP, trocas, bloqueios, dano residual e golpes múltiplos. Focus Sash não impede uma queda por dano posterior no mesmo turno. A descrição do seu item também aparece em Caderno de batalha → Seus golpes, sem revelar equipamentos ocultos do adversário.

Cada oferta do Mercado tem uma unidade por jornada, além das cópias que possam vir das revanches. Comprar exige escolher um Pokémon da equipe ou reserva; débito, estoque e equipamento são aplicados em uma transação. Cancelar/fechar não cobra. A nova compra devolve um equipamento substituído à mochila; uma berry preparada é descartada. Não é possível comprar uma cópia para um alvo que já usa o mesmo item.

Equipe → Equipamento e Mochila → Gerenciar equipamentos permitem transferir cópias disponíveis gratuitamente entre batalhas, inclusive na Liga. Cada Pokémon usa um item; uma cópia não pode estar simultaneamente na mochila e com alguém. Não há equipamento durante batalha, captura, evento ou escolha pendente.

Regras de conservação:

- Guardar/trocar para a reserva conserva os três novos equipamentos; a regra anterior de descartar a berry preparada na reserva permanece.
- Vender ou liberar um Pokémon devolve seu equipamento à mochila, sem aumentar o preço de venda. Apelidos e feitos não dão bônus de preço.
- Em uma vitória no Nuzlocke, equipamentos que ainda restarem com quem caiu voltam à mochila antes de remover o integrante.
- Itens consumidos, removidos ou trocados **durante o combate seguem o resultado real do motor**. Assim, Knock Off pode remover Leftovers, Trick pode transferir um item e Fling pode gastá-lo. Não há reembolso automático ao fim da batalha. O registro distingue perda por Knock Off de uso normal.
- Preparar usa um kit/uma ação para preencher apenas os espaços vazios da equipe com Sitrus Berry. Preserva os outros itens e fica bloqueado quando ninguém precisa de berry. Eventos de preparação usam a mesma regra; seus textos foram atualizados.

As 12 TMs conservam seus preços/estoques e o aprendizado obrigatório na compra. Rare Candy continua custando ₽ 700 e usando imediatamente no alvo escolhido. A referência de venda permanece aproximadamente 1,3 TMs médias por Pokémon intermediário. Equipamentos acrescentam uma alternativa de gasto, sem outra moeda.

## Apelidos e feitos

Equipe → Apelido permite nomear um integrante com até 18 caracteres Unicode, ou deixar vazio para usar a espécie. O nome oficial continua visível na ficha. O apelido acompanha evolução, reserva, batalha, Hall e cartão. Identificador, espécie, atributos, RNG e shiny não são alterados.

Os feitos pertencem ao indivíduo, não à espécie:

- **Participação:** entrar em campo ao menos uma vez em um combate concluído. Banco não recebe participação.
- **Vitória em campo:** participar de uma vitória da equipe, mesmo que tenha caído antes do fim.
- **Nocaute direto:** golpe direto do integrante deixa o adversário sem HP. Efeitos residuais, confusão, recoil, ataques adiados e fontes sem atribuição direta não entram nessa métrica.
- **Vitória após 1 HP:** resistir a um golpe adversário com exatamente 1 HP e vencer sem cair até o encerramento; pode ter se curado depois. Conta uma vez por integrante/batalha.
- **Fecha a Liga:** dar o golpe final direto contra o último Pokémon do campeão.

O destaque prioriza nocautes diretos, depois vitórias após resistir com 1 HP e vitórias em campo; identificador desempata de forma determinística. Os epítetos são cosméticos: Fecha a Liga, Por um fio, Pilar da equipe, Abre caminho ou Companheiro de jornada. Não concedem atributos ou poder permanente.

O Hall, o encerramento e o PNG mostram o destaque. Quem foi vendido/liberado ainda pode ser lembrado pelo que fez. O memorial do Nuzlocke guarda nome, apelido, nível e feitos de quem caiu, mesmo depois de sair da equipe. Registros antigos permanecem legíveis sem inventar estatísticas ausentes.

## Estado e pontos de edição

- Parâmetros: `src/game/config/equipment.js`, `rival.js`, `heroes.js`; conteúdo de personalidade/elencos em `game/data/rivals.js`, sem importar lógica.
- Equipamentos: `game/equipment/equipment.js`, comandos em `actions/equipment.js`; box, venda, captura, preparo/eventos e resultado tratam os destinos dos itens.
- Rival: `game/rival/rival.js`, `actions/rival.js`; `beginBattle` monta o conjunto e `result` concede prêmio/guarda memória/retorna à fase anterior. Nenhum novo perfil de IA.
- Feitos: `game/heroes/battleFeats.js` lê o protocolo completo do motor; `heroes.js` agrega no RESULT, antes da remoção de quem caiu. A fila visual e seu limite de eventos não controlam as estatísticas.
- Apelido: `actions/nickname.js`; battle mantém IDs internos e acrescenta metadados de apresentação. Nada de usar o apelido como chave de replay.
- UI: `features/rival`, `equipment`, `heroes`; Mercado, ficha, mochila, encerramento e Hall reutilizam essas peças. Modal nativo conserva Escape/foco. Rubi/LCD/âmbar, fontes locais, cinco teclas e tokens atuais são mantidos.
- CSS: módulos por domínio e ajustes específicos em `responsive/pokedex/journey-additions.css`, respeitando a cascata existente. Sem nova arte ou dependência de runtime.

Schema 4 é preservado: dados opcionais e aditivos (`rival`, `heldItems`, `heroRecords`, apelido, lembranças e metadados de Hall). O rival é criado ao escolher o inicial de uma nova jornada; jornadas antigas já iniciadas continuam sem personagem inventado. Feitos são registrados nos resultados que trazem o novo resumo, sem reconstruir combates históricos que não foram guardados. Backups validam os novos campos antes de substituir um slot. Hall continua na chave global separada do save do slot.

Recarregar durante um combate usa o mesmo motor/IA/replay. Confirmar RESULT grava os feitos uma única vez; a fase seguinte impede repetições. Pular animação não concede prêmio nem incrementa contador. Uma mudança futura na política da IA ainda exigirá tratar explicitamente a compatibilidade de replay; a imprecisão de Body Press anotada na revisão de ideias não foi alterada nesta entrega.

## Como verificar

`npm run verify` cobre arquitetura, testes Node, motor empacotado e build web. `npm run balance:audit` mede o orçamento de níveis. `npm run companions:audit` executa 126 duelos e 44 combates pareados contra a Elite, além de conferir as referências de preço.

`scripts/qa-journey.mjs` usa Playwright externo de desenvolvimento: pacote resolvível como `playwright` ou caminho para `index.mjs` em `PLAYWRIGHT_PATH`. `QA_URL` seleciona dev, preview ou site público; `QA_ENGINE=webkit` seleciona o outro motor. `QA_OUTPUT`, `QA_IMAGES` e `QA_WIDTHS` permitem escolher destinos/visores. As fixtures são isoladas em contextos de navegador e não acessam o perfil/saves do usuário. O teste lê Hall da chave global e executa ações/combates reais pela UI.

No WebKit de QA para Windows, o worker é bloqueado e os turnos terminam naturalmente; isso isola a conferência de UI da limitação de service worker desse ambiente. No Edge, worker é permitido e o roteiro também aciona Pular. A matriz não é uma auditoria de offline nem de aparelhos físicos.

Resultados e limitações da entrega ficam em [VALIDACAO](../VALIDACAO.md) e [ROADMAP](ROADMAP.md). Auditorias com IA ou equipe nível 100 não representam dificuldade humana; apenas a primeira avalia confrontos com níveis próximos. Emulação não equivale a Android/iPhone físico. A avaliação humana do risco de cada revanche e da compra de itens segue como próximo passo.
