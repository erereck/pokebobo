# Histórico

## 0.13.0 — Mapas da jornada · 10/10/2026

- Imagens próprias para todas as 48 cidades selecionáveis no draft: sete origens, quatro passagens e 37 ginásios. Indigo Plateau completa as 49 imagens locais.
- Seleção por id do lugar; cidade de partida, jornada e arena usam a imagem correspondente. A Liga usa Indigo Plateau. Removidos os seis mapas genéricos de Emerald e a paisagem SVG fictícia; falha de carregamento não mostra um lugar diferente.
- Originais dos jogos preservados em WebP sem perdas, com dimensões e hashes conferidos. Mapas pixelados mantêm pixels; arte de Alola/Galar usa interpolação. Carregamento sob demanda e caminho compatível com GitHub Pages.
- Galeria de créditos com filtro de região, nome do lugar, edição, fonte e responsável pelo upload. Manifesto e importador reproduzível documentam todos os arquivos.
- 107 testes, build web e conferência das 48 cidades em três visores; escolhas reais até a jornada, créditos, Liga, turnos de batalha e recuperação de imagem ausente. Sem alteração de regras ou saves.

## 0.12.0 — Mais uma Poké Bola · 10/10/2026

- Oportunidades ocultas; retorno automático ao completar 50 passos válidos. Movimento bloqueado, parado ou fora do mapa não conta; recarga termina o mesmo passo.
- Captura com 67% de chance base por bola e novas tentativas contra o mesmo Pokémon após falhar. Nível, semana, destino escolhido e evento preservados; o bônus vale apenas no primeiro lançamento. Sucesso, fuga ou última bola encerram o encontro.
- Entrada acelerada, nível menor na caixa de HP e remoção de nome/textos duplicados fora da cena. Retorno automático após o resultado, sem botão de continuar; estrelas e desaparecimento em cerca de um segundo após a última sacudida.
- Voltar não pisca entre passos: permanece desabilitado enquanto teclado ou ponteiro estiverem pressionados, inclusive ao atingir a borda.
- Trilhas usam contornos originais de FRLG por quadrante, com cantos internos nos cruzamentos. Margens do lago combinam esses contornos de grama com a água original; atlas local reproduzível e créditos atualizados.
- Saves existentes preservados, incluindo resultados de captura já sorteados. Verificação de arquitetura, testes, build, auditoria, campanhas reais e fluxos completos no navegador documentados em VALIDACAO.md.

## 0.11.0 — Ritmo de Kanto · 09/10/2026

- Tela cheia ao lado da Pokédex, com estado de entrada/saída, suporte do navegador e mensagem em caso de recusa.
- Campo e captura dimensionados pelo espaço livre do visor, incluindo telefone estreito e orientação horizontal. Controles mantêm suas áreas de toque.
- Direcional, setas e WASD podem ser segurados. Soltar, perder foco, abrir janela ou sair da tela interrompe a repetição; movimento reduzido mantém a cadência.
- Mato cobre somente a região dos pés nas casas realmente atravessadas, eliminando a sobreposição antecipada de uma casa inteira.
- Correção do teleporte da bola: cada quadro guarda sua própria posição. Arremesso termina no ponto de abertura; absorção e fechamento permanecem nele até começar a queda.
- Entrada no encontro com dois pulsos de paleta e cortes por linha na grama ou ondulação no lago, reconstruídos a partir da referência FRLG.
- Menu de captura com Poké Bola/quantidade e Fugir lado a lado; fonte, cursor e estoque desenhados junto da cena. Quebra de palavras e limites de texto; ã/õ/Ã/Õ derivados dos glifos originais.
- Ficha/golpes e reserva alternam dentro da Equipe. Mochila, mapa e jornada horizontal mais compactos; ações de troca, líder e evolução preservadas.
- 97 testes, arquitetura/build/auditoria e 125 registros de navegador. Os fluxos normais não tiveram erros; um 404 foi injetado para validar mensagem e botões de recuperação. Regras e probabilidades preservadas.

## 0.10.0 — Passos de Kanto · 09/10/2026

- Ajuste final: Poké Bola pousa sobre a plataforma, independentemente da altura do Pokémon; regressão coberta e 94 testes aprovados.

- Áreas contínuas de mato alto substituem os marcadores numerados. Cada passo no mato pode abrir encontro; chão livre e posição parada não sorteiam.
- Caminhada do Red em quatro direções, alternância de pernas, deslocamento de um pixel por tick e efeito de mato cobrindo os pés. Cada passo leva 16 ticks; teclado e toque usam a mesma regra.
- Cena de captura 240×160: treinador de costas, cinco quadros de arremesso, Poké Bola normal, arco, abertura, absorção, quatro quicados, até três sacudidas, estrelas, fuga e desaparecimento da bola.
- Sprites, fundos, paletas, molduras, partículas e fonte bitmap de FRLG locais. 291 espécies do catálogo têm seu sprite original 64×64 com posição vertical da referência.
- Resultado e custo ficam salvos antes da apresentação. Recarregar ou pular a animação não rerrola, não cobra outra bola e não duplica Pokémon. Equipe/reserva/Pokédex recebem a captura ao concluir.
- Nível selvagem definido e salvo ao revelar o encontro, mantendo a faixa anterior e o mesmo nível após captura.
- 93 testes, build web, auditoria de progressão, 140 campanhas reais e 18 registros de navegador sem erros. Movimento reduzido apresenta diretamente o resultado.

## 0.9.0 — Rotas Vivas · 09/10/2026

- Escolha explícita para evoluções ramificadas, com adiamento, reabertura e retomada de batalha após reload.
- Exploração procedural com assets FRLG locais, 2–3 encontros, múltiplas capturas e uma semana por caminhada.
- Fishing Rod na terceira insígnia; Surf na quinta; métodos compartilham o encontro do lago.
- Pokédex global dos três slots registra capturas e evoluções com as runs de origem, inclusive Pokémon removidos.
- 12 eventos novos: pistas de Mew/Suicune e um roubo de Eevee após uma vitória, limitado a uma vez por run.
- Escala de sprites de batalha por altura da espécie e controles ajustados para 320 px.
- Correria ganha +1 nível por treino: +2 a +4, compensando a semana a menos.
- 87 testes, build/auditoria, inspeção no navegador e 280 campanhas reais finais; referência de 120 campanhas antigas.
- Correção de source-map-js sem troca de major. Código-fonte e build web; sem standalone.

## 0.8.1 — Ordem do desmaio · 20/09/2026

- Dano fatal pode zerar o HP, mas não esconde mais o sprite antes do evento de desmaio.
- O estado visual de nocaute agora só é aplicado quando o protocolo envia `faint`.
- A sequência fica: dano → animação de desmaio → desaparecimento → próxima entrada.
- Adicionado teste de regressão para impedir o bug “sumir antes e depois animar”.

## 0.8.0 — Ataques do Seu Jeito · 19/09/2026

- Cada save escolhe entre aprendizado Manual e Automático ao iniciar a aventura.
- Manual mantém a regra atual: aprende direto em slots livres e só pede decisão com quatro golpes.
- Automático restaura o estilo antigo: a cada nível/evolução, o jogo recalcula sozinho até quatro golpes pelo catálogo e nunca abre a tela de aprendizado.
- A preferência fica salva no slot e volta pré-selecionada nas próximas runs.
- Saves antigos migram para Manual para não mudar comportamento sem autorização.

## 0.7.1 — Aprendizado direto · 19/09/2026

- Golpes aprendidos por nível entram automaticamente quando o Pokémon tem menos de quatro golpes.
- A tela de decisão só aparece quando os quatro slots já estão ocupados.
- Saves antigos parados numa decisão com vaga livre aprendem o golpe automaticamente sem exibir a janela.

## 0.7.0 — Conexão Direta · 19/09/2026

- Equipe Conectada mostra HP atual de todos os Pokémon durante a batalha.
- Trocas podem ser feitas arrastando um Pokémon apto para o card que está em campo.
- Pokémon nocauteado fica visível apenas durante a animação de queda e não reaparece antes da próxima entrada.
- Três slots independentes de carreira no mesmo navegador.
- Hall da Fama global do aparelho, compartilhado entre os três slots.
- Save antigo continua automaticamente como Slot 1.

## 0.6.0 — Equipe Viva · 18/09/2026

- Escolha de golpes por nível, reserva de três Pokémon e reordenação da Equipe Conectada por arrastar.
- Reserva acompanha ganhos de nível e capturas usam vagas livres antes de exigir liberação.
- 66/66 testes, build e auditoria aprovados.

## 0.5.0 — Legado · 18/09/2026

- Evoluções por troca, pedra/item, amizade, golpe conhecido e outras condições especiais passam a acontecer diretamente por nível; níveis originais existentes continuam valendo.
- Linhas ramificadas escolhem um caminho determinístico por Pokémon, sem inventário de pedras, troca externa ou menu extra.
- Hall da Fama visual acessível pelo cabeçalho, Opções e tela de encerramento; ele registra campeões e jornadas que terminaram sem o título.
- Novos registros guardam time com níveis, modo, seed, rota, progresso da Liga, motivo do fim, acontecimentos e destaques do diário. Histórico antigo continua legível.
- Arquivo de carreiras ampliado de 20 para 100 jornadas.
- SAVE_VERSION 4 introduz migração: diferença de versão não reinicia mais automaticamente um save reconhecível.
- Antes de migrar, o JSON antigo é preservado em uma chave de recuperação; JSON corrompido também recebe essa cópia antes do fallback.
- Migração completa estruturas ausentes das Semanas Vivas sem apagar run, histórico, seed ou equipe.
- Verificação: 158 módulos válidos, 59/59 testes, build Vite com 2.036 módulos e auditoria de progressão concluída.

## 0.4.0 — Semanas Vivas · 18/09/2026

- 57 acontecimentos semanais com 2–3 decisões, raridades, condições de contexto e anti-repetição dos 10 eventos recentes.
- Chance base de 72% após uma semana resolvida; Correria usa 82% para compensar a campanha mais curta.
- Consequências afetam Poké Bolas, berries, níveis, preparação, orçamento de ações e próximos treino/captura/busca/emboscada.
- Alguns acontecimentos abrem encontros extras ou batalhas imediatas com recompensa; decisões específicas deixam flags que destravam follow-ups futuros.
- Tela própria de acontecimento, responsiva para celular, com recursos e bônus ativos visíveis.
- Sorteio e resolução usam o RNG da run, preservando determinismo por seed e save/reload.
- Monte Carlo entende a nova fase e resolve a primeira decisão disponível de cada acontecimento.
- Schema do save permanece 3; saves atuais são aceitos e completam o estado de eventos sob demanda.
- Nova suíte de testes cobre catálogo, determinismo, escolhas, batalha, bônus e ações extras.

## C03 — sequência visual do turno · 18/09/2026

- A escolha de batalha é pré-simulada com o mesmo replay determinístico e só é confirmada depois da apresentação visual.
- Ataque, perda/recuperação de HP, status, nocaute e troca aparecem em ordem; o último KO não pula mais direto para o resultado.
- Comandos ficam bloqueados durante a resolução e voltam ao fim da animação.
- Velocidade 1×/2× persistida como preferência local; redução de movimento respeitada.
- Registro e animação compartilham o mesmo parser de eventos do protocolo Showdown.
- npm run verify: 151 módulos válidos, 47 testes passando e build Vite concluído. Regras e schema do save permanecem iguais.

## Repositório GitHub e fluxo web · 15/09/2026

- Projeto preparado para `erereck/pokebobo`: código-fonte, assets locais, licenças, testes, documentação, relatórios e imagens da interface.
- `npm run verify` passa a executar arquitetura, testes e build Vite, sem gerar o standalone.
- HTML standalone fora da manutenção e do Git por solicitação do usuário; gerador antigo mantido apenas como referência.
- README com instruções de clone, instalação, desenvolvimento e preview; orientação persistida em AGENTS.md.
- Versão 0.3.0, regras e saves preservados.

## 0.3.0 — Pokédex de campo · 14/09/2026

- Redesign completo: carcaça rubi, lente azul, visor LCD, teclas fixas e painel da equipe no PC.
- Abertura, draft, jornada, combate, captura, resultados, encerramento e janelas refeitos.
- Ficha de Pokémon com quatro golpes; mapa conectado da run; mochila com estoque e custos existentes.
- Quatro golpes visíveis em 320 × 568 e batalha adaptada a 844 × 390. Atalhos 1–4 respeitam janelas, campos e estado do turno.
- Captura com equipe cheia e nova aventura cabem em tela curta; foco retorna ao fechar janelas.
- Estilos reorganizados em 29 arquivos ativos, componentes antigos removidos e sistema de design documentado.
- Silkscreen local com OFL. HTML offline atualizado; 43 testes passaram. Regras e saves da 0.2.2 preservados.

## 0.2.2 — D02: golpes com referência · 14/09/2026

- Uma geração de aprendizado por linhagem; L1 evoluído não antecipa níveis herdados, L0 respeita o estágio e lembretes exclusivos ficam fora da seleção automática.
- Fonte de cada golpe e exclusões registradas; 495 sets auditados, 41/122 sets originais de ginásio alterados e nenhum inicial no nível 10 alterado.
- Sem Tackle inventado para espécies de status; formas como Oricorio-Pa'u usam a tabela compartilhada explícita.
- 800 campanhas no Clássico nas mesmas seeds: zero truncamentos. Comparação e conclusões no ROADMAP e relatório 0.2.2.
- 43 testes, 148 módulos, HTML offline regenerado. Saves anteriores reiniciam para não manter os sets antigos.

## 0.2.1 — Refinamento e diagnóstico · 14/09/2026

- Treino no teto não consome semanas; ganhos e recompensas informam quantos integrantes realmente recebem níveis e os limites por Pokémon.
- Nuzlocke termina corretamente quando o último Pokémon também cai por recuo, mesmo se o motor declarou vitória.
- Monte Carlo separado em execução, políticas e estatística; resultados por inicial/adversário, denominadores e censurados explícitos. 1.600 campanhas nos três modos.
- Auditoria de 122 sets de ginásio e 21 iniciais com origem dos golpes. Não houve alteração dos sets ou níveis nesta rodada.
- 38 testes passando, 147 módulos e relatório próprio no ROADMAP.md.

## 0.2.0 — Cada escolha conta · 13/09/2026

- Viagem e emboscada não dão níveis; ginásio/Liga dão +1. Treino permanece +1 a +3.
- 37 ginásios organizados pela posição original, com elenco e níveis por edição. Diferença de pelo menos 10 entre o mais forte do jogador e o ás original aplica +6 ao líder, uma vez.
- Rotas salvas entre cidades, duas famílias distintas e preferência por novidades; capturas podem substituir um integrante escolhido quando o time está cheio.
- Catálogo revisto para a geração de aprendizado mais recente disponível até a 8 por ancestral; encontros tardios podem vir evoluídos por nível.
- IA com visão observável e avaliação de dano, precisão, prioridade, PP, cura, status e troca. Aprisionamento oculto é tratado após a recusa pública da troca.
- Batalha compacta em PC/celular, quatro golpes juntos, seis trocas em grade, registro separado e nomes de Pokémon nas mensagens. Jornada compacta com aviso da última semana.
- Seis paisagens de referência de Emerald via The Spriters Resource, com arquivos locais, créditos, recortes SVG e fallback. HTML offline incorpora as capas.
- Um único conjunto de regras; saves 0.1 reiniciam. Reset com confirmação, seed visível e histórico recente em Opções.
- Monte Carlo reproduzível com batalhas reais e quatro políticas; 400 campanhas na amostra inicial. Auditoria separada de orçamento de níveis.
- 31 testes e 145 módulos de código. Referências de regressão da 0.1 arquivadas; README, arquitetura, roteiro de edição e backlog atualizados.

## 0.1.1 — Casa arrumada · 13/09/2026

- Código dividido em 134 módulos JavaScript/JSX: entrada mínima, composição, hooks, componentes compartilhados, telas por feature e regras por domínio.
- CSS separado em 43 arquivos, mantendo a ordem das 2.091 declarações da cascata anterior.
- Um handler por ação, dados de ginásio por região, encontros por bioma e parâmetros de progressão/campanha/itens/encontros em configurações próprias.
- APIs anteriores mantidas por reexports; chave, estrutura do save e sequência dos sorteios preservadas.
- Testes organizados por tema: 18 casos passando, incluindo replay de 926 transições históricas em cinco seeds e falha de gravação.
- Verificação de arquitetura para imports, ciclos e fronteiras entre camadas.
- Auditoria reproduzível da progressão, guia de arquitetura, mapa de edição, instruções para manutenção e 44 melhorias priorizadas.
- Pesquisa de fontes para capas de rotas, com links, limitações da consulta e modelo de ficha de procedência.
- HTML offline e pacote de código regenerados para esta versão.

Esta entrega prepara o próximo update de gameplay. Os níveis, recompensas, adversários e probabilidades continuam iguais; nenhuma capa externa foi adicionada. A facilidade de chegar ao nível 99 foi quantificada e está no topo do roadmap.

## 0.1.0 — Primeiros passos

Primeiro protótipo jogável: draft de região, iniciais, semanas, capturas, preparação, Showdown, ginásios, Liga, save, diário, recordes e modos desbloqueáveis. Interface em português para celular vertical, com paisagens SVG, fontes e sprites locais.
