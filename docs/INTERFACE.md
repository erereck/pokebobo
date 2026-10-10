# Interface — Pokédex de campo

## Captura e campo — 0.12.0

A captura concentra nome, nível e ações no canvas; o nível usa 75% da fonte do nome. O resultado retorna automaticamente ao campo ou, na falha com bolas, ao menu do mesmo Pokémon. Não repete a entrada nem pede confirmação para continuar. O rodapé mantém o espaço do destino escolhido com equipe cheia e oferece Pular animação durante o lançamento. Mensagens externas de estado permanecem apenas para leitores de tela.

No campo, as oportunidades e o limite de passos não são expostos como contadores. Voltar permanece desabilitado enquanto há controles pressionados ou passo pendente. O atlas por quadrantes suaviza as margens de trilha e lago sem interpolação, mantendo a linguagem de pixels da cena.

A 0.3.0 transforma o jogo em um dispositivo vermelho com visor claro. O cenário, a decisão e a equipe têm lugares estáveis. Direção solicitada pelo usuário; processo apoiado pela [skill interface-design](https://github.com/Dammyjay93/interface-design).

## Encontrar o que precisa

| Controle | Função |
| --- | --- |
| Jornada / Batalha | Ação da semana ou decisão do turno atual. |
| Equipe | Selecionar um dos seis integrantes; consultar nível, tipos, habilidade, item e quatro golpes; colocar na frente entre batalhas. |
| Mapa | Dez cidades e Liga em ordem de viagem; atual e concluídas identificadas. |
| Mochila | Poké Bolas, kits de berries, custo e disponibilidade de explorar, preparar e procurar itens. |
| Diário | Eventos da aventura por semana. |
| Ajuda / Opções | Regras e créditos / seed, histórico, exportação, abandono e reset. |

Durante o combate, teclas **1–4** acionam os golpes habilitados. Troca e registro ficam acima deles. Janelas abertas e campos de texto bloqueiam os atalhos. Escape fecha a janela e devolve o foco ao botão de origem.

## Composição e material

Carcaça rubi (#c62f45), recortes vinho, borracha grafite (#1b2931), LCD marfim (#edf0dc), lente ciano e teclas de avanço âmbar. HP verde, estados também identificados por texto, seleção com contorno/marcador. Silkscreen apenas em inscrições; DM Sans e Space Grotesk sustentam leitura e comandos. Todas as fontes são locais.

PC: visor principal e painel com equipe, insígnias e treinador. Celular: visor único, HUD compacto e cinco teclas inferiores. Batalha horizontal: arena à esquerda e comandos à direita. Em telas curtas, removemos decoração e condensamos informações secundárias para manter decisões juntas. Ajuda, diário e listas de referência usam rolagem interna quando necessário.

A escala parte de 4 px; ações principais têm pelo menos 44 px. Algumas teclas de cabeçalho e seletores usam 40 px em telas estreitas. A versão curta usa legendas menores que o corpo do texto; a leitura física ainda precisa de validação. Não há declaração de conformidade WCAG.

## Manutenção

Tokens em `styles/foundations/tokens.css`. Materiais em `styles/components/dex-shell.css`. Cada tela tem seu CSS; adaptações ficam em `styles/responsive/pokedex/`. A ordem de `styles/index.css` faz parte do sistema. São 35 folhas ativas incluindo o índice na 0.11.0. Não adicionar um tema paralelo sobre regras antigas.

A intenção de cada componente e as decisões persistentes estão em [.interface-design/system.md](../.interface-design/system.md). Casos inspecionados em [VALIDACAO.md](../VALIDACAO.md). Próximos passos no [ROADMAP](ROADMAP.md).

## Cenas de campo e captura — 0.10.0

Dentro da carcaça existente, FieldCanvas usa pixels originais em 192×128, e CaptureCanvas usa 240×160. Escala nearest-neighbor; fontes bitmap na cena e tipografia do LCD nos controles externos. Captura apresenta apenas treinador e Pokémon selvagem. Destino da captura fica antes da tentativa; conclusão e pular apresentação têm botões externos grandes. Movimento reduzido mantém regras/resultados e elimina animações.

## Ritmo de Kanto — 0.11.0

PixelViewport mede o espaço livre com ResizeObserver e preserva a proporção da cena. No menu, Poké Bola/estoque e Fugir ocupam duas colunas de 48 pixels lógicos de altura; os alvos mediram pelo menos 44 px nos oito tamanhos inspecionados. Texto/cursor são desenhados no mesmo canvas, com botões nativos sobrepostos para foco e acionamento. Se o carregamento falha, os botões passam a mostrar texto HTML.

Campo e captura usam a altura livre do visor. No horizontal, controles e informações passam para a coluna vizinha. Fonte bitmap quebra entre palavras, limita linhas e usa glifos recompostos para os quatro caracteres portugueses com til. Fontes externas e a carcaça mantêm o sistema existente.

Na Equipe, seis seletores ficam juntos e dois botões alternam Ficha e golpes / Reserva. No telefone, os seletores mostram sprites e têm nomes/níveis acessíveis; a ficha mostra o nome selecionado. Ficha e reserva podem rolar internamente em conteúdo excepcional, mantendo cabeçalho/seletores no lugar. Mochila e mapa ajustam seus blocos à altura; ações de suprimentos não ficam cobertas pelos equipamentos. Em orientação horizontal, a jornada divide paisagem/tempo e preparação/avanço.

Tela cheia fica imediatamente após a Pokédex. O estado acompanha fullscreenchange; Escape atualiza o botão, recusa gera mensagem e navegador sem suporte mantém o controle desabilitado. Direcional, setas e WASD repetem somente após cada passo, com interrupção em release, blur, janela, aba oculta e saída da tela.
