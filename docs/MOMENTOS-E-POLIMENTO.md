# Cada conquista conta — 0.21.1

Evoluir ganha uma apresentação de aproximadamente um segundo: a espécie anterior clareia, a nova forma aparece e a ficha identifica nível e tipos. Continuar funciona desde o início. Quando uma ação evolui vários Pokémon, inclusive da reserva, as cenas aparecem na ordem da equipe e depois da reserva. Pular demais encerra somente essas cenas. Na 0.21.1, uma barra discreta preenche durante quatro segundos e executa o mesmo avanço de Continuar. Cada cena reinicia a contagem; clicar antes ou pular a fila cancela a anterior.

[Demonstração com áudio real](images/evolucoes-0.21-celular.mp4) · [Evolução](images/evolucao-0.21-celular.jpg) · [Vitória](images/vitoria-0.21-celular.png) · [Forma regional](images/raichu-alola-0.21-celular.png) · [Abertura](images/abertura-0.21-celular.png).

## Progresso e decisões

A cena observa diferenças entre a run anterior e a ação já confirmada. Não sorteia, evolui, aprende golpes nem concede níveis. O resultado é salvo antes de aparecer; reabrir o jogo conserva o Pokémon evoluído sem repetir a celebração. Escolhas manuais de golpes e outras evoluções ramificadas seguem depois das cenas. Troca de slot, importação e nova aventura limpam a apresentação temporária.

Movimento reduzido mostra a nova espécie diretamente, sem transformação ou partículas, e a barra avança em quatro etapas. A contagem pausa com a aba oculta e retoma o tempo restante ao voltar; escolhas de golpes nunca avançam sozinhas. Uma falha de imagem não desabilita Continuar. A UI indica imagem indisponível e tenta novamente ao receber o evento de conexão do navegador; fechar ou navegar não altera o save.

## Controles e espaço

Segurar Enter ou Espaço sobre uma ação não gasta semanas repetidas. Soltar e pressionar novamente confirma outra ação. O direcional do campo conserva a repetição própria para toque e agora também para Enter/Espaço; Voltar aguarda soltar e terminar o passo. Setas e WASD continuam disponíveis.

Na vitória/derrota, o recibo pode rolar dentro do visor e o botão de continuar permanece separado. Durante batalha/Liga, a mochila mostra estoque, equipamentos e aviso de onde usar suprimentos. Na ficha, cada golpe tem uma descrição expansível com prioridade, contato e efeitos; trocar de Pokémon volta ao começo do conteúdo.

## Imagens e abertura

Raichu-Alola, Weezing-Galar, Exeggutor-Alola, Mr. Mime-Galar e Oricorio-Pa'u usam cinco PNGs locais, incluindo o alias Oricorio-Pau. São primeiros quadros dos sprites existentes, sem recoloração ou mudança de pixels. Captura também usa a forma correta. Normal/shiny permanecem distintos; frente/costas de batalha e perfis de escala ficam preservados. [Fontes e reprodução](../public/sprites/FORMS-ASSETS.md).

A tela de abertura existe antes do módulo principal. Depois de 15 segundos oferece tentar novamente; erro de carga informa falha. O botão recarrega somente por decisão do jogador. Não lê, escreve ou apaga progresso. Animação de espera cessa quando o jogo abre; preferência de movimento reduzido mantém os pontos estáticos. Não há percentual fictício de carregamento.

## Limites

Os efeitos novos são apresentação própria do Pokébobo, sem afirmar reprodução integral das evoluções de um cartucho. A animação não espera sua conclusão para liberar uma decisão. Imagens novas sem cache ainda precisam de conexão. As verificações móveis em Edge/WebKit Windows são emulações; Android/iPhone físico, instalação e campanha humana continuam pendentes. Motor, IA, probabilidades e schema 4 permanecem iguais.
