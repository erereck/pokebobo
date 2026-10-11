# Novos caminhos — 0.20.0

## Exploração

Quatro campos de 12×8 casas variam mato, trilhas e formato da água: clareira, trilha sinuosa, margem e prado. São desenhos autorais feitos com os tiles FRLG existentes; não são mapas oficiais de cada cidade ou geração. Um hash da seed/identidade da rota escolhe o desenho sem gastar RNG. Ele fica no save ao explorar e permanece igual ao voltar à mesma rota. Caminhadas já abertas sem `layoutId` conservam seu desenho anterior. Todos os terrenos secos e margens são alcançáveis, com pelo menos vinte casas de mato por desenho.

Encontros, cooldown, garantias de encontro, chance de 67% por bola, estoque, oportunidades ocultas e limite invisível de 50 passos permanecem. A arte recebe uma faixa de 16 px acima da grade, para não cortar a cabeça do treinador na linha de cima. Resolução de campo: 192×144; as 96 casas clicáveis continuam alinhadas aos 12×8 tiles. A transição para captura usa recorte sem esticar os pixels.

**Pescar** continua exigindo a terceira insígnia, margem, bolas e encontro disponível. Red se vira para a água, usa os quatro quadros originais de lançamento a cada quatro ticks e os offsets do cartucho. Espera/mordida foram encurtadas para 64 ticks totais, com exclamação desenhada no canvas. Não há minijogo de reação. Surf é liberado na quinta insígnia e tem preparação de 28 ticks. As duas ações compartilham a oportunidade de água existente.

Preparação é apenas apresentação: não gasta bola, semana, passo ou RNG e pode ser cancelada ao sair da tela. Ao terminar, o mesmo comando de lago abre o encontro uma vez. Movimento fica bloqueado durante a preparação. Movimento reduzido e falha da folha concluem a ação sem esperar a animação. Fonte/transformações da nova folha: [FRLG-ASSETS](../licenses/FRLG-ASSETS.md), `public/field/fishing-manifest.json` e `scripts/import-fishing.py`.

## Decisões e caderno

Novo golpe mostra dados básicos dos quatro atuais e descrição do novo. Categoria, poder, precisão e prioridade vêm do motor Gen 8 pelo mesmo guia do caderno. Dados básicos não incluem previsões de dano. Esquecer/ignorar continuam usando as mesmas ações e regras de aprendizado.

Em campo inclui condições públicas conhecidas: confusão, Leech Seed, Taunt, Encore, substituto, recarga e outras; Reflect/Light Screen, hazards/camadas, clima, terreno e efeitos como Trick Room. Não mostra duração interna, item ou habilidade escondida. Informações são fotografias do estado real ao abrir o caderno, que fica indisponível durante a apresentação do turno. Não há mudança de IA: conservar o replay atual evita reinterpretar decisões de lutas em andamento.

## Instalação e acesso sem conexão

Opções → **Leve o Pokébobo com você** oferece a instalação quando o navegador fornece o prompt e explica a alternativa pelo menu. Manifesto/ícones locais permitem abrir como app; não exige conta ou download de executável. O prompt e a instalação dependem do navegador. Ícones derivam da geometria do favicon existente, com cores da carcaça e zona segura; script `create-install-icons.py`.

Após a página carregar, o service worker prepara uma cópia do código, fontes, ícones, cenas de campo/captura e partículas. Opções informa **Pronto para reabrir sem conexão** somente quando há worker ativo. O primeiro carregamento usa internet. Artes de cidades/Pokémon e músicas/cries entram conforme usados: até 200 arquivos, até 60 MiB, cada um de até 4 MiB. O navegador pode remover caches por espaço ou limpeza. Conteúdos que ainda não passaram pelo aparelho podem exigir internet; não é um pacote offline de todo o catálogo.

O cache guarda arquivos do jogo. **Não lê ou substitui saves**, Hall, Pokédex ou preferências. Isso continua no armazenamento do navegador. Exportar/restaurar continua disponível sem conexão. Instalar em outro navegador/aparelho não transfere sua carreira: use seu backup.

Build gera `sw.js` com identidade derivada do conteúdo do código, CSS/fontes, template e assets essenciais. Não guarda uma página de publicação com entrada diferente. Nova versão prepara seu próprio shell, espera terminar a sessão e avisa em Opções: **feche todas as abas/janelas e reabra**. Nenhuma atualização força recarga no meio do comando. Uma versão anterior do shell é conservada para seus arquivos carregados sob demanda. Assets de mídia usam rede quando possível e cache na falha; não cacheia 404, respostas parciais ou conteúdo externo. Leituras offline não regravam/apagam a entrada; `put` substitui inteiro sem intervalo de ausência. Áudio aceita pedidos `Range` a partir dos bytes completos em cache.

Referências de implementação: [ciclo de service workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers), [instalação de PWA](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/How_to/Trigger_install_prompt). Não há promessa de instalação/sincronização em qualquer sistema. Navegadores sem suporte continuam abrindo a versão web.

## Verificação

Testes em `field-layouts.test.js`, `public-conditions.test.js`, `offline-worker.test.js` e `offline-client.test.js` cobrem conectividade/seed/save, quadros/hashes, condições de batalhas reais, camadas públicas, limites de cache, leituras concorrentes, Range, publicação incompleta, conservação de caches de outros apps, aquecimento após controle e rede aparente sem acesso. Evidências reais de navegador e limites de aparelhos estão em [VALIDACAO](../VALIDACAO.md). Não equivalem a uma campanha humana ou instalação em telefone físico.
