# Trabalhando no Pokébobo

Leia `README.md`, `docs/ARQUITETURA.md` e `docs/ONDE-EDITAR.md` para localizar a área da mudança. `docs/ROADMAP.md` reúne sugestões e relatórios. O usuário autorizou continuar aplicando refinamentos por julgamento próprio, mantendo simplicidade e boa experiência em celular/PC; não é necessário implementar todo o backlog em uma única entrega.

- Escreva a interface e os documentos em português. Preserve nomes oficiais de Pokémon e golpes quando usados no jogo.
- O repositório principal é https://github.com/erereck/pokebobo. Faça alterações em `src/`, nunca diretamente no bundle de `dist/`.
- Decisão do usuário em 15/09/2026: não atualizar, regenerar nem enviar o `Pokebobo.html` standalone. O fluxo oficial é código-fonte + build web. `npm run verify` roda arquitetura, testes e build Vite; não execute `npm run standalone` nas entregas. O script antigo fica apenas como referência histórica.
- Mantenha um componente por arquivo e regras organizadas por domínio. `main.jsx` é só a entrada; não recoloque telas ou regras nele.
- A camada `game/` não depende de UI, DOM ou React. Conteúdo em `game/data/` não importa lógica de gameplay.
- Use os parâmetros de `game/config/` e atualize os textos afetados. Nem todos os textos já são derivados desses parâmetros.
- Preserve determinismo na versão atual. Decisão explícita do usuário para este protótipo: uma única regra ativa, sem perfis antigos ou migração; saves podem reiniciar a cada mudança incompatível. Use SAVE_VERSION para rejeitar saves incompatíveis, sem manter motores paralelos.
- Não regenere fixtures de regressão usando a implementação que está sendo testada. Os casos v0.1 em docs/archive registram resultados do motor anterior e não são testes das regras atuais.
- Preserve a cascata em `styles/index.css`. O catálogo e as fixtures são dados gerados e não precisam de divisão manual por item.
- Antes de entregar mudanças de código, execute `npm run verify` na raiz do projeto. Para progressão, execute também `npm run balance:audit` e acrescente validação de dificuldade com batalhas reais quando pertinente.
- Para mudanças de UI, confira desktop e celular, console, sprites, overflow e as ações afetadas na aplicação web.
- Documente limitações com precisão. Testar a campanha com equipe nível 100 verifica transições, não balanceamento.
- Assets novos devem ser locais, ter origem/créditos/termos registrados e entrar no build web. Consulte `docs/ARTES-E-ROTAS.md`.
- Atualize changelog e validação com o que de fato foi executado. Versione código, assets, testes, licenças e documentação; não envie `node_modules/`, `dist/`, segredos, ZIPs de distribuição ou HTML standalone.

- Em toda entrega, atualize ROADMAP.md com um relatório próprio: o que mudou, por quê, testes/medições, limitações e próximas sugestões. Preserve o relatório anterior em docs/archive quando substituir a versão. O usuário lê esse documento e avisará se discordar de alguma sugestão.
