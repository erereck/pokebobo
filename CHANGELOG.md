# Histórico

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
