# Onde editar

Todos os caminhos abaixo são relativos à raiz do projeto. Comece pelo arquivo específico e acompanhe seus imports quando a mudança atravessar uma regra.

| Quero mudar…                     | Começar por…                                | Conferir também…                                                              |
| -------------------------------- | ------------------------------------------- | ----------------------------------------------------------------------------- |
| Nome da versão                   | `package.json`, `src/app/version.js`        | `package-lock.json`, changelog e build web                                    |
| Página de abertura               | `src/features/onboarding/`                  | `src/styles/features/welcome.css`                                             |
| Escolha de inicial e draft       | `src/features/draft/`                       | `game/actions/origin.js`, `starter.js`, `draft.js`                            |
| Iniciais disponíveis             | `src/game/data/origins.js`                  | `starterNotes.js`, catálogo e sprites                                         |
| Cidades e líderes                | `src/game/data/gyms/`                       | `order`, `levels`, `sourceUrl`, `selectors/gymChallenge.js` e testes de draft |
| Elite e campeões                 | `src/game/data/league/`                     | Regras de campanha e teste da Liga                                            |
| Níveis e recompensas             | `src/game/config/progression.js`            | `career/training.js`, `world/arrival.js`, `actions/result.js` e textos da UI  |
| Semanas por modo                 | `src/game/config/campaign.js`               | `career/spendWeek.js`, `career/afterWeek.js`                                  |
| Captura e emboscadas             | `src/game/config/encounters.js`             | `actions/explore.js`, `capture.js`, `career/afterWeek.js`                     |
| Espécies de cada cidade/conexão  | `src/game/data/encounters/`                 | `world/encounterPool.js`, `createRoute.js`, catálogo e sprites locais         |
| Itens e berries                  | `src/game/config/items.js`                  | `actions/prepare.js`, `forage.js`, `pokemon/battleSet.js`                     |
| Evolução e golpes                | `src/game/pokemon/`                         | `scripts/catalog.mjs`, testes de Pokémon                                      |
| Inteligência do adversário       | `src/game/battle/ai.js`                     | `aiObservation.js`, `aiScoring.js`, `submitAiChoice.js` e testes de IA        |
| Texto do combate                 | `src/game/battle/translateLog.js`           | `features/battle/BattleScreen.jsx`                                            |
| Layout da batalha                | `src/features/battle/`                      | `styles/features/battle.css` e `styles/responsive/pokedex/`                      |
| Tela principal da cidade         | `src/features/career/`                      | `styles/features/career.css`                              |
| Paisagem/capa atual              | `src/components/scenery/RouteCover.jsx`     | `game/data/routeCovers.js`, `public/covers/` e fallback `Landscape.jsx`       |
| Sprites                          | `src/components/pokemon/Sprite.jsx`         | `public/sprites/`, catálogo e build web                                       |
| Equipe, mapa e diário            | `src/features/team/`, `region/`, `journal/` | Seus arquivos em `src/styles/features/`                                       |
| Carcaça, HUD e navegação | `src/components/layout/` | `styles/components/dex-shell.css` |
| Mochila | `src/features/inventory/BagScreen.jsx` | `styles/features/secondary.css`, regras de itens |
| Ficha de Pokémon | `src/features/team/PokemonDetails.jsx` | `TeamScreen.jsx`, `styles/features/team.css` |
| Percurso do mapa | `src/features/region/RegionMap.jsx` | `RegionScreen.jsx`, `mobile-map.css` |
| Atalhos de batalha | `src/features/battle/useBattleKeys.js` | Botões de golpes e janelas abertas |
| Ajuda e opções                   | `src/features/settings/`                    | Textos das regras e exportação do save                                        |
| Save atual e reset               | `src/game/persistence/`                     | `state/initialState.js`, `app/hooks/useAutosave.js` e testes de persistência  |
| Cores, tipografia e espaços base | `src/styles/foundations/`                   | Contraste e telas estreitas                                                   |
| Um problema só no celular        | `src/styles/responsive/pokedex/`             | `mobile-height.css`, `mobile-narrow.css` e o arquivo da tela             |
| Build web e verificação          | `vite.config.js`, `package.json`            | `public/`, `npm run verify` e `npm run preview`                               |

Desde 15/09/2026, não atualizar nem enviar o HTML standalone. O gerador legado em `scripts/standalone.mjs` está fora do fluxo oficial. Código, assets, licenças, testes e documentos ficam em https://github.com/erereck/pokebobo; dependências instaladas e build gerado ficam ignorados.

Para adicionar uma ação: crie o handler em `game/actions/`, registre-o em `state/reducer.js`, envie a ação pela UI e cubra seu efeito sobre semana, seed, save e fase. Para adicionar uma tela: crie a feature, conecte-a em `RunContent` ou `App` e importe seu CSS no índice na ordem apropriada.

O [ROADMAP.md](ROADMAP.md) descreve as próximas mudanças, com prioridade e critério de aceite. Os estados dos itens distinguem o que entrou na 0.2, adaptações e trabalho futuro.

Para simular dificuldade: `scripts/monte-carlo.mjs`, políticas em `scripts/simulation/policies.mjs` e execução em `runCampaign.mjs`. Resultados em `docs/balance/`.

Ganhos no teto: `game/selectors/levelGain.js`. Vitória sem sobreviventes em Nuzlocke: `game/selectors/battleVictory.js`. Estatística da simulação: `scripts/simulation/summarize.mjs`. Auditoria dos golpes: `scripts/audit-moves.mjs`.

D02: fonte e calendário em `scripts/catalog/learnsetPolicy.mjs`; política em `game/config/moves.js`; seleção dos quatro golpes em `game/pokemon/moves.js`. Depois de editar, regenere com `node scripts/catalog.mjs`, audite com `node scripts/audit-moves.mjs` e confira `tests/move-policy.test.js`. Critérios e limites em [REGRAS-DE-GOLPES.md](REGRAS-DE-GOLPES.md).
