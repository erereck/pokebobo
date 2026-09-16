# Interface — Pokédex de campo

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

Tokens em `styles/foundations/tokens.css`. Materiais em `styles/components/dex-shell.css`. Cada tela tem seu CSS; adaptações ficam em `styles/responsive/pokedex/`. A ordem de `styles/index.css` faz parte do sistema. São 29 folhas ativas incluindo o índice. Não adicionar um tema paralelo sobre regras antigas.

A intenção de cada componente e as decisões persistentes estão em [.interface-design/system.md](../.interface-design/system.md). Casos inspecionados em [VALIDACAO.md](../VALIDACAO.md). Próximos passos no [ROADMAP](ROADMAP.md).
