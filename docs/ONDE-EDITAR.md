# Onde editar

## Expedições — 0.24.0

- Lugares, níveis e recompensas: `game/config/expeditions.js`; textos/mapas em `game/data/expeditions.js`.
- Visita, colisão e transações: `game/expeditions/expeditions.js`, `actions/expedition.js`; integração de combate em `beginBattle`/`result`.
- Backups: `persistence/checkExpeditions.js`. Não inferir visitas nem recompensas em saves anteriores.
- Tela/cenografia: `features/expeditions/`, CSS próprio após adventure na cascata. A passagem do campo é desenhada antes do treinador.
- Testes: `tests/expeditions.test.js`; auditoria `npm run expeditions:audit`; QA com Playwright externo em `scripts/qa-expeditions.mjs`. [Funcionamento e limites](EXPEDICOES.md).


## Companheiros de jornada — 0.23.0

- Rival: parâmetros em `game/config/rival.js`, conteúdo em `data/rivals.js`, montagem/memória em `rival/rival.js`, comandos em `actions/rival.js`. Apresentação em `features/rival/`; aparece na região pronta, carreira e Mercado.
- Equipamentos: ofertas em `config/equipment.js`, estoque/preparo/devolução em `equipment/equipment.js`, transações em `actions/equipment.js`. Integrações em preparo/eventos, box, captura, venda e resultado. UI em `features/equipment` e `market/HeldItemShop`/`BuyHeldItemDialog`.
- Feitos/apelidos: `heroes/battleFeats.js` lê protocolo completo, `heroes/heroes.js` agrega/classifica; `actions/nickname.js` altera só apresentação. Resultado agrega uma vez; `finishRun` persiste legado. UI em `features/heroes`, Hall/Ending e `history/renderJourneyCard`.
- Persistência: campos aditivos no schema 4; `checkJourneyAdditions.js` valida novos campos no backup. `useGameSession` mantém a aba após apelidar/equipar. Não alterar a IA sem resolver compatibilidade de replay.
- Estilos: `features/rival.css`, `equipment.css`, `heroes.css` e ajustes de enquadramento em `responsive/pokedex/journey-additions.css`. Seguir tokens/Modal existentes.
- Verificação: `tests/rival.test.js`, `equipment.test.js`, `heroes.test.js`; `npm run companions:audit` e `scripts/qa-journey.mjs` com Playwright externo. [Regras e limites](COMPANHEIROS-DE-JORNADA.md).

## Rare Candy — 0.22.1

- Preço/ganho: `MARKET_RARE_CANDY` em `game/config/market.js`; transação `MARKET_BUY_CANDY` em `game/actions/market-candy.js`, registrada no reducer.
- Oferta/escolha: `features/market/RareCandyOffer.jsx`, `RareCandyDialog.jsx` e `MarketScreen.jsx`. Compra usa imediatamente em um alvo; sem inventário novo.
- Crescimento: `pokemon/moveLearning.js` já trata evolução/golpes e preservação de TMs; celebração observa a nova ação em `features/moments/actionMoments.js`.
- Regressões em `tests/market-candy.test.js`; auditoria com `npm run market:candy-audit`, evidências em `docs/balance/rare-candy-0.22.1/`.

## Mercado da Liga — 0.22.0

- Abertura/saída: `game/actions/result.js`, `actions/market.js` e `state/reducer.js`; fase `market` precede `inLeague`.
- Fórmula/ofertas: `game/config/market.js`, seletores em `game/market/market.js`. `npm run market:audit` mede valores e 44 combates reais pareados.
- Compatibilidade: `scripts/market-catalog.mjs` → `game/data/marketCompatibility.json`; regenerar com `npm run market:catalog`. `check` detecta arquivo desatualizado.
- Tela/janelas: `features/market/`, `app/RunContent.jsx`, `styles/features/market.css`; reutilizar primitivas/fontes/tokens existentes.
- Golpes comprados: `mon.tmMoves` em `actions/market.js` e `pokemon/moveLearning.js`; esquecimento manual em `actions/move-choice.js`. Schema aditivo 4, incluindo fase do backup em `persistence/importSave.js`.
- Regressões: `tests/market.test.js`, `tests/league.test.js`; regras/medição em [MERCADO-DA-LIGA.md](MERCADO-DA-LIGA.md).

## Na palma da mão — 0.20.1

- Área visível: `app/hooks/useVisualViewport.js`, chamado por `App`; altura/deslocamento em variáveis CSS, limpeza de eventos e zoom nativo. Tokens de áreas seguras em `styles/foundations/tokens.css`; geometria das janelas em `styles/components/dialogs.css`.
- Toque/paisagem: `styles/responsive/pokedex/mobile-ergonomics.css`, importado no fim da cascata. Rodapé das evoluções em `EvolutionDialog`/`equipe-viva.css`. Conferir todas as opções, rolagem e confirmação, não apenas a primeira.
- Gestos de janela: `components/ui/Modal.jsx`; fechamento requer início e fim fora, preservando padding/arrasto, Escape e foco. Offline: leituras estáticas com `ignoreVary` em `scripts/serviceWorker.js`; não ampliar a whitelist para APIs/dados pessoais. [Guia e limites](MOBILE.md).

## Novos caminhos — 0.20.0

- Campo: matrizes em `game/data/fieldLayouts.js`, hash/leitura em `world/fieldLayout.js`, colisão/margem em `world/exploration.js`. Preservar concordância entre terreno visível e movimentos; `layoutId` ausente conserva a caminhada aberta. Testes: `field-layouts.test.js` e suítes anteriores de exploração.
- Vara/Surf: `features/encounters/lakePresentation.js`, `FieldCanvas` e `ExplorationScreen`. Preparação não altera gameplay até emitir a ação existente. `drawField`/CSS `adventure.css` usam faixa superior de 16 px e grade 12×8. Assets: `public/field/red_fish_sheet.png`, manifesto, `scripts/import-fishing.py` e termos FRLG.
- Condições: `game/battle/publicConditions.js`, rótulos em `game/data/battleConditions.js`, `FieldConditions` e `BattleNotebook`. Não mostrar durações/fontes/itens ocultos. `MoveSummary`/`MoveLearnDialog` reutilizam o guia factual Gen 8.
- Instalação/cache: `scripts/offlinePlugin.mjs`/`serviceWorker.js`, `features/offline`, manifesto/ícones em public. Testar o build com caminho de Pages e sem rede; não registrar worker no dev. Após editar política de cache, a identidade do shell também deve mudar. Cache nunca toca os saves. Referências, limites e fontes no [guia](CAMPO-E-OFFLINE.md).

## Jornada mais viva — 0.19.0

- Golpes/partículas: `features/battle/visuals/`, `BattleEffects.jsx` e `useBattleMotion.js`. Protocolo em `game/battle/presentationEvents.js`; não consumir RNG ou antecipar HP na animação. Fonte local/importador em `public/battle-effects` e `scripts/import-battle-effects.py`.
- Caderno: `BattleNotebook.jsx`, `moveGuide.js`, `styles/features/battle-notebook.css`; fatos Gen 8, estado público e textos em português. Não importar UI em game.
- Cancelamento/Pular/navegação/reload: `useBattlePresentation.js`, `turnPresentation.js`, `app/App.jsx` e `useAutosave.js`. Preservar comando único e gravar antes de pagehide.
- Backups: `game/persistence/importSave.js`, `features/settings/ImportSaveDialog.jsx`, `app/hooks/useGameSession.js`, `styles/features/backups.css`. Testar arquivo inválido, troca de slot, quota e replay; guia em [BATALHAS-E-BACKUPS](BATALHAS-E-BACKUPS.md).
- Preferências/storage negado: `shared/browserStorage.js` e `app/preferences/battleSpeed.js`. Acesso ao getter fica dentro das operações já protegidas; não retornar sucesso de gravação em memória.
- Direções simultâneas: `features/encounters/heldDirections.js`/`useFieldControls.js`; soltar a última retoma a anterior, blur/janela/hidden limpa tudo.
- Bundle: `scripts/browserSimulatorPlugin.mjs`, `checkCompiledLearnsets.mjs` e `verifyBrowserSimulator.mjs`. Execute `npm run verify`, que também testa o motor empacotado; Node conserva dados completos para gerar catálogo.

## Presença na arena — 0.18.1

Referência da caixa, piso do 3D e limite comum normal/shiny em `components/pokemon/battleSpriteLayout.js`; medição em `features/battle/BattlePokemonSprite.jsx`. Não há mais --battle-sprite-limit nos breakpoints. Tabelas/imagens são as mesmas, sem mudanças em gameplay. [Guia atual](ESCALA-DOS-SPRITES.md); testes em battle-sprite-scale.test.js.

## Áudio — 0.18.0

- Mixer, autoplay, crossfade, mute, cache e visibilidade: `features/audio/AudioEngine.js`; integração, cenas e preferências: AudioProvider/audioScene/audioPreferences. Nunca importar isso em `game/`.
- Receita dos efeitos: `chipEffects.js`; sincronização: `audioCues.js`, `useAnimationAudio.js`, `features/encounters/usePixelCanvas.js` e `features/battle/useBattlePresentation.js`. Os ticks/resultado existentes continuam sendo a fonte da verdade.
- Controles: AudioButton/AudioOptions/AudioDialog, AppHeader e SettingsDialog; `styles/features/audio.css` mantém desktop em duas colunas e celular em uma. Cries de consulta em DexDetails/StarterCard.
- Assets e fontes: `public/audio`, `scripts/audio-sources.json`, import-audio.mjs e audit-audio.mjs. Índices em features/audio/*.json. Guia/limites em [AUDIO.md](AUDIO.md), hashes/fontes no manifesto e testes em `tests/audio.test.js`.

## Pokédex e compartilhamento — 0.17.0

- Coleção, variantes, regiões, aliases e filtros: `features/pokedex/dexModel.js`; composição em PokedexDialog/DexProgress/DexDetails/DexVariants. CSS próprio em `styles/features/pokedex.css`, junto da cascata existente.
- Cartão/modelo antigo: `features/history/journeyCardModel.js`, `renderJourneyCard.js` e `cardDrawing.js`. Exportação em ShareJourneyDialog, gatilhos em Ending/HallOfFameDialog; layout em `styles/features/sharing.css`. Sprite/fontes são existentes; licenças do QR em public/licenses.
- Convites e seeds: `shared/regionInvitation.js`, `game/world/regionChallenge.js` e `app/hooks/useRegionInvitation.js`. Recepção em RegistrationForm/InvitationInput/ChallengeDialog. Preservar a validação e o bloqueio de slots em andamento.
- RNG inicial e seeds manuais: `game/actions/new.js`, `starter.js`, `begin.js` e `career/finishRun.js`. Não usar o RNG atual de uma run avançada como sorteio inicial. Detalhes/limites em [POKEDEX-E-COMPARTILHAMENTO.md](POKEDEX-E-COMPARTILHAMENTO.md).
- Testes: `tests/pokedex-collection.test.js`, `region-invitations.test.js`; evidência de navegador/QR em docs/balance/*sharing*0.17.0.json.

## Escala dos sprites — 0.16.0

Escala/apoio em `components/pokemon/battleSpriteLayout.js`, geometria por arquivo em `spriteGeometry.json` e calibração por espécie/estilo/lado em `battleSpeciesScale.json`. `features/battle/BattlePokemonSprite.jsx` mede a caixa e recebe a fonte carregada por `Sprite`; `BattleArena` compõe os lados. Limites responsive ficam nas variáveis --battle-sprite-limit do CSS. Dados estão na apresentação, não no motor/save. Geradores, decisões, reprodução e limites em [ESCALA-DOS-SPRITES.md](ESCALA-DOS-SPRITES.md); testes em `tests/battle-sprite-scale.test.js`.

## Hall, Future Sight e sprites — 0.14.0

- Botão final do Hall: `src/app/App.jsx` passa `onHall` a `features/ending/Ending.jsx`; janela em `features/history/HallOfFameDialog.jsx`.
- Preferência 2D/3D: `app/preferences/battleSprites.js`, `app/hooks/useBattleSpriteStyle.js` e `features/settings/BattleSpriteOptions.jsx`; CSS em `styles/components/dialogs.css`.
- Imagens de frente/costas e formas: `components/pokemon/battleSpriteSources.js`, `Sprite.jsx`, `game/data/battleSprites.json`, `public/battle-sprites/manifest.json` e README. Importador em `scripts/import-battle-sprites.mjs`; testes em `tests/battle-sprites.test.js`.
- Ataques atrasados: `game/battle/presentationEvents.js`, `snapshot.js`, `features/battle/turnPresentation.js`, `Health.jsx` e `BattleArena.jsx`; casos reais em `tests/future-sight.test.js`. Não calcular dano ou consumir RNG na apresentação.

## Imagens de cidades — 0.13.0

- Lugar/edição/procedência: `src/game/data/cityCovers.json`; confirmar fonte, revisão, dimensões e hashes antes de adicionar.
- Seleção estrita por id: `src/game/data/routeCovers.js`; não usar imagem de outro lugar como fallback.
- Renderização/enquadramento: `src/components/scenery/RouteCover.jsx`, `styles/foundations/base.css` e campo `position` do manifesto. Preservar `BASE_URL` para Pages e `loading="lazy"` para a galeria.
- Arquivos/importação: `public/covers/`, `scripts/import-city-covers.py` e `public/covers/README.md`; testes em `tests/city-covers.test.js`.
- Galeria/créditos: `src/features/settings/CoverCredits.jsx` e `styles/components/dialogs.css`.

## Ajustes de exploração/captura — 0.12.0

- Limite de passos: `src/game/config/exploration.js` (`maxRouteSteps`) e `game/world/exploration.js`; regressões em `tests/exploration-retries.test.js`.
- Chance por lançamento: `game/config/encounters.js`; retry, estoque e oportunidade em `actions/capture.js`/`world/completeCapture.js`.
- Ritmo e retorno automático: `features/encounters/CaptureCanvas.jsx`, `captureTimeline.js` e `Encounter.jsx`. Não mudar o RNG na apresentação.
- Bordas e margens: `features/encounters/terrainPresentation.js`, `drawField.js`, `scripts/import-field-assets.py` e `public/field/terrain.png`.
- Estado dos controles pressionados: `features/encounters/useFieldControls.js`; Voltar em `ExplorationScreen.jsx`.

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
| Layout da batalha                | `src/features/battle/`                      | `styles/features/battle.css` e `styles/responsive/pokedex/`                   |
| Tela principal da cidade         | `src/features/career/`                      | `styles/features/career.css`                                                  |
| Paisagem/capa atual              | `src/components/scenery/RouteCover.jsx`     | `game/data/cityCovers.json`, `routeCovers.js` e `public/covers/`              |
| Sprites                          | `src/components/pokemon/Sprite.jsx`         | `public/sprites/`, catálogo e build web                                       |
| Equipe, mapa e diário            | `src/features/team/`, `region/`, `journal/` | Seus arquivos em `src/styles/features/`                                       |
| Carcaça, HUD e navegação         | `src/components/layout/`                    | `styles/components/dex-shell.css`                                             |
| Mochila                          | `src/features/inventory/BagScreen.jsx`      | `styles/features/secondary.css`, regras de itens                              |
| Ficha de Pokémon                 | `src/features/team/PokemonDetails.jsx`      | `TeamScreen.jsx`, `styles/features/team.css`                                  |
| Percurso do mapa                 | `src/features/region/RegionMap.jsx`         | `RegionScreen.jsx`, `mobile-map.css`                                          |
| Atalhos de batalha               | `src/features/battle/useBattleKeys.js`      | Botões de golpes e janelas abertas                                            |
| Ajuda e opções                   | `src/features/settings/`                    | Textos das regras e exportação do save                                        |
| Save atual e reset               | `src/game/persistence/`                     | `state/initialState.js`, `app/hooks/useAutosave.js` e testes de persistência  |
| Cores, tipografia e espaços base | `src/styles/foundations/`                   | Contraste e telas estreitas                                                   |
| Um problema só no celular        | `src/styles/responsive/pokedex/`            | `mobile-height.css`, `mobile-narrow.css` e o arquivo da tela                  |
| Build web e verificação          | `vite.config.js`, `package.json`            | `public/`, `npm run verify` e `npm run preview`                               |

Desde 15/09/2026, não atualizar nem enviar o HTML standalone. O gerador legado em `scripts/standalone.mjs` está fora do fluxo oficial. Código, assets, licenças, testes e documentos ficam em https://github.com/erereck/pokebobo; dependências instaladas e build gerado ficam ignorados.

Para adicionar uma ação: crie o handler em `game/actions/`, registre-o em `state/reducer.js`, envie a ação pela UI e cubra seu efeito sobre semana, seed, save e fase. Para adicionar uma tela: crie a feature, conecte-a em `RunContent` ou `App` e importe seu CSS no índice na ordem apropriada.

O [ROADMAP.md](ROADMAP.md) descreve as próximas mudanças, com prioridade e critério de aceite. Os estados dos itens distinguem o que entrou na 0.2, adaptações e trabalho futuro.

Para simular dificuldade: `scripts/monte-carlo.mjs`, políticas em `scripts/simulation/policies.mjs` e execução em `runCampaign.mjs`. Resultados em `docs/balance/`.

Ganhos no teto: `game/selectors/levelGain.js`. Vitória sem sobreviventes em Nuzlocke: `game/selectors/battleVictory.js`. Estatística da simulação: `scripts/simulation/summarize.mjs`. Auditoria dos golpes: `scripts/audit-moves.mjs`.

D02: fonte e calendário em `scripts/catalog/learnsetPolicy.mjs`; política em `game/config/moves.js`; seleção dos quatro golpes em `game/pokemon/moves.js`. Depois de editar, regenere com `node scripts/catalog.mjs`, audite com `node scripts/audit-moves.mjs` e confira `tests/move-policy.test.js`. Critérios e limites em [REGRAS-DE-GOLPES.md](REGRAS-DE-GOLPES.md).

## Rotas Vivas — 0.9.0

- Caminhada/lago: game/world/exploration.js, config/exploration.js e actions/exploration.js; tela em features/encounters/ExplorationScreen.jsx.
- Escolha de evolução: pokemon/evolution.js, moveLearning.js, actions/evolution-choice.js e features/team/EvolutionDialog.jsx.
- Coleção: pokemon/collection.js, persistence/dexStorage.js e features/pokedex/PokedexDialog.jsx.
- Missões: data/adventureEvents.js; efeitos e condições em career/weekEvents.js.
- Sprite da batalha: altura gerada por scripts/catalog.mjs e escala comprimida em BattleArena.jsx.
- Assets FRLG: scripts/import-field-assets.py, public/field/ e licenses/FRLG-ASSETS.md.
- Medições: docs/balance/adventure-\*.json; simulador caminha por explorePolicy.mjs e resolve escolhas antes dos combates.

## Passos de Kanto — 0.10.0

- Terreno/sorteio/intervalo: game/world/exploration.js e config/exploration.js; nível em world/revealWild.js.
- Resultado persistido e conclusão de captura: actions/capture.js e world/completeCapture.js.
- Quadros, trajetória e timings: features/encounters/captureTimeline.js; render: CaptureCanvas.jsx e FieldCanvas.jsx; RAF/assets/fonte nos helpers vizinhos.
- Layout e menu: styles/features/capture.css e adventure.css.
- Assets: scripts/import-capture-assets.py, public/field/, public/sprites/frlg/ e licenses/FRLG-ASSETS.md.
- Regressões: tests/field-capture.test.js; browser e campanhas em docs/balance/_0.10.0_.json.

## Ritmo de Kanto — 0.11.0

- Tela cheia: app/hooks/useFullscreen.js, components/layout/AppHeader.jsx.
- Segurar controles: features/encounters/useFieldControls.js; cancelamento e cadência são apresentação.
- Máscara dos pés: fieldPresentation.js e drawField.js. FieldCanvas e entrada no encontro reutilizam o mesmo render.
- Entrada: encounterTransition.js, CaptureCanvas.jsx. Fonte/layout: pixelText.js, font-metrics.json e import-capture-assets.py.
- Enquadramento: PixelViewport.jsx e styles/responsive/pokedex/pixel-screens.css.
- Ficha/reserva: TeamScreen.jsx, PokemonDetails.jsx e ReservePanel.jsx; altura de equipe/mochila/mapa/jornada horizontal em panel-fit.css.
- Regressões visuais puras: tests/pixel-presentation.test.js; navegador em docs/balance/browser-\*-0.11.0.json.

## Cada conquista conta — 0.21.0

- Momentos: features/moments/actionMoments.js, useJourneyMoments.js e EvolutionMoment.jsx; observação após gravação em app/hooks/useGameSession.js, fila de janelas em App.jsx.
- Motion/resultado: styles/components/interface-motion.css, features/moments.css e components/progress/VictoryEmblem.jsx. Preferência reduzida não depende de timers de gameplay.
- Teclado: shared/keyboardActivation.js, useFieldControls.js e atributos do direcional em ExplorationScreen.jsx.
- Retratos/fontes: components/pokemon/spriteSources.js, SpriteImage.jsx, staticFormSprites.json/staticFormSpriteGeometry.json; extração em scripts/import-form-portraits.py, créditos em public/sprites/FORMS-ASSETS.md. Não regenerar as tabelas históricas de escala para adicionar uma fonte.
- Captura: features/encounters/captureSpriteSource.js; timelines/offsets permanecem em seus módulos anteriores.
- Golpes da ficha: features/team/EquippedMove.jsx reutiliza battle/moveGuide.js. Sem fórmula de dano duplicada na UI.
- Abertura: index.html e styles/components/boot.css; não editar dist nem standalone.
- Evidências/limites: VALIDACAO.md, MOMENTOS-E-POLIMENTO.md e balance/turbo-0.21.0/.
