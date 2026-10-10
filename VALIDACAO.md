# Validação — Pokébobo 0.16.0

## 0.16.0 — Batalha na medida · 10/10/2026

- `npm run verify`: 203 módulos de código sem ciclos/UI no motor, 132/132 testes e build Vite de 2.086 módulos com `VITE_BASE=/pokebobo/`. Sem standalone. Mudança só de apresentação; nenhum RNG, decisão, regra ou schema alterado.
- Cinco novos testes: Pidgey menor que metade da altura visível de Charizard nos dois estilos/lados/cores; 11.664 combinações de espécie/forma, estilo, lado, cor e caixas curta/média/larga com corpo dentro do espaço e proporção preservada; normal/shiny consistente; fallback/prefixo Pages e dimensões externas novas; integridade da geometria e cobertura dos quadros. Altura visível refere-se ao limite do ciclo, não à pose de um quadro.
- Pillow mediu a união dos pixels não transparentes de todos os 227.842 quadros de 4.848 fontes: 1.940 BW locais, 1.940 3D existentes e 968 PNGs locais de fallback. Nenhuma imagem foi editada ou adicionada ao build. Manifesto com origem/hash/primeiro/último quadro em `docs/balance/sprite-geometry-0.16.0.json`; cache 3D congelado em `sprite-geometry-sources.json`. Importador conferiu os hashes das 1.940 fontes 3D no cache externo.
- Edge/Playwright: 46 registros em 1280×720, 390×844, 320×568 e 844×390. Pidgey/Charizard 2D/3D, normal/shiny, ciclo de GIF com caixa constante, turno real/reload, troca para Charizard; Onix/Wailord, Steelix/Exeggutor-Alola, Pichu/Blastoise, Raichu-Alola/Gyarados, Gastly/Butterfree e Joltik/Dragonite; resize e tela cheia. Sem erros de console/rede, sprites quebrados ou overflow horizontal. `docs/balance/browser-scale-0.16.0.json`.
- Mais 11 registros com quatro golpes nos quatro visores/estilos, troca de estilo durante turno animado sem repetir decisão, derrota real e fallback 3D→costas 2D→frente 2D. Dois 404 deliberados tratados, geometria/fonte/alt corretos; fluxos normais sem erros. `docs/balance/browser-scale-extra-0.16.0.json`. Total local: 57 registros, mais quatro imagens de comparação com a versão anterior.
- Preview do build em `/pokebobo/`: oito registros de PC/celular com quatro golpes, 2D/3D, Pidgey menor que Charizard, apoio e turno real. Sem erros de console/rede, imagens quebradas ou overflow; `docs/balance/browser-scale-preview-0.16.0.json`.
- Limites: sem teste em aparelho físico/iOS. A medição é de um retângulo que contém o ciclo inteiro; asas/caudas podem deixar folga em algumas poses, sem variar escala por frame. A tabela é uma calibração visual estilizada, sem converter literalmente metros da Pokédex em pixels. Fontes 3D continuam externas como antes; mudanças posteriores exigem nova medição. Se dimensões externas mudarem, usa a proporção efetiva enquanto mantém limites e escala da espécie.

## 0.15.0 — Uma estrela no mato · 10/10/2026

- `npm run verify`: 201 módulos sem ciclos/UI no motor, 127/127 testes e build Vite de 2.082 módulos para `/pokebobo/`. Sem standalone. Shiny é cosmético, sem alterações em níveis, IA, economia, chance de captura ou stats; teste real compara HP/dano/turno entre variantes com a mesma seed. Nenhuma nova simulação de dificuldade necessária.
- Nove novos testes: fronteira exclusiva em 1/1024 e um intervalo entre 1024; stream separado e determinístico; inicial/rotas/eventos reais; captura falha/retry e reload durante animação sem duplicação; evolução ramificada em reserva e Hall/Dex; save antigo normal; batalha real/replay; todas as formas shiny e hashes dos novos assets.
- Edge/Playwright: 41 registros em 1280×720, 390×844, 320×568 e 844×390. Captura de Eevee shiny com falha, reload e nova bola/sucesso; equipe após captura/reload; filtro da Pokédex e hover selecionado; final/Hall com reserva; 2D/3D e turno real/reload; escolha de Umbreon shiny. Sem erros de console/rede, imagens quebradas, overflow horizontal ou pixel-error. `docs/balance/browser-shiny-0.15.0.json`.
- Navegador decodificou todos os 1.746 novos assets (970 de batalha + 776 estáticos), inclusive formas regionais. `node scripts/import-battle-sprites.mjs --check`: 1.940 imagens totais, hashes preservados. Pillow decodificou os 60.871 quadros shiny e os 776 PNGs gerados; `docs/balance/shiny-assets-0.15.0.json`. Paletas FRLG conferem exatamente a transparência/posição dos sprites normais.
- Preview do build em `/pokebobo/`: oito registros em desktop/celular, captura, filtro shiny da Pokédex e batalha 2D/3D. Caminhos de publicação conferidos, sem erro de console/rede ou imagens quebradas; `docs/balance/browser-shiny-preview-0.15.0.json`.
- Origem/termos em `public/battle-sprites/README.md` e `public/sprites/SHINY-ASSETS.md`; importador de paletas/frames reproduzível. Um perfil ICC auxiliar tem CRC inválido no original de Mr. Mime-Galar, ignorado somente para gerar seu frame PNG; pixels e original preservados, navegador conferido. Algumas espécies posteriores só têm PNG no conjunto BW, como na versão normal.
- Limites: testes em navegador automatizado, sem dispositivo físico/iOS. Animações BW e 3D conservam seus ciclos originais; shiny não sincroniza GIF com ataques. Saves anteriores continuam compatíveis e não recebem marca retroativa. Batalhas de adversários permanecem normais.

## 0.14.0 — Batalhas em pixels · 10/10/2026

- `npm run verify` após o polimento final: 198 módulos JS/JSX sem ciclos/import de UI no motor, 118/118 testes e build Vite com 2.079 módulos, `VITE_BASE=/pokebobo/`. Sem standalone.
- Sete casos reais de Future Sight: PP pago ao preparar, nenhum dano nos dois primeiros turnos e impacto ao fim do terceiro; novo ocupante após troca do alvo, lançador fora, imunidade Dark, Protect, tentativa de empilhar sem adiar, save/reload e ataque adversário. Eventos de chegada precedem dano, e o parser elimina duplicação das leituras de HP do protocolo split. Motor, IA e fórmula de dano preservados.
- Quatro testes de sprites/preferência: todas as 486 entradas (485 espécies/formas) têm frente/costas próprias; aliases e formas regionais corretos; caminhos em Pages; 970 arquivos/hash/procedência; preferência global separada do save e storage indisponível tratado.
- `node scripts/import-battle-sprites.mjs --check`: 970 arquivos e 38.072.884 bytes conferidos. Pillow abriu os 970 originais, percorreu suas animações e decodificou o último quadro: 60.925 quadros, 945 imagens animadas/25 estáticas. Contact sheet de 12 espécies, incluindo formas regionais, inspecionada. `docs/balance/battle-sprite-images-0.14.0.json`. Não foram redesenhados ou convertidos.
- Edge/Playwright: 40 registros em 1280×720, 390×844, 320×568 e 844×390. Derrota real → registrar → botão da tela final → Hall; Escape/foco, reload sem duplicação e botão do cabeçalho; título/encerramento; troca 3D/2D, seleção/hover legíveis com alvo de 44 px, preferência após reload/slots e battle spec intacto. Future Sight em três turnos com reload pendente, HP real, espera/chegada, imunidade e quatro pares de espécies/formas 2D. Caixas de HP conferidas dentro da arena e sem sobreposição. `docs/balance/browser-battle-update-0.14.0.json`.
- Sete registros adicionais: escolher 2D durante animação 1× sem duplicar decisão; storage da preferência negado com batalha salva; 404 controlado no sprite de costas mantendo frente 2D; alternância posterior restaura índice da fonte; tentativa de repetir Future Sight e lançador trocado por Blastoise antes do impacto. Um 404 esperado registrado separadamente; fluxos normais sem erros de console/rede. `docs/balance/browser-battle-recovery-0.14.0.json`.
- Preview em `/pokebobo/`: oito registros no PC/celular, sprites locais 2D de frente/costas, preferência após reload, Future Sight até o impacto e Hall após derrota real. Sem erros ou overflow horizontal. `docs/balance/browser-battle-preview-0.14.0.json`. Total: 55 registros locais.
- Limites: Edge automatizado, sem aparelho físico/iOS. Testes de título/encerramento verificam a interface por estado preparado, não estimam dificuldade. GIFs animam conforme o original, e 25 PNGs permanecem estáticos. O pacote local completo tem 36,31 MiB, mas a arena busca só os sprites visíveis; padrão 3D usa as fontes anteriores. Saves e decisões preservados, sem novo schema. Sem alteração de progressão/IA; campanhas anteriores mantidas abaixo, sem novo Monte Carlo para esta mudança de apresentação.

## 0.13.0 — Mapas da jornada · 10/10/2026

- `npm run verify`: 194 módulos JS/JSX sem ciclos/import de UI no motor, 107/107 testes, build Vite com 2.074 módulos. Build repetido com `VITE_BASE=/pokebobo/`; nenhum HTML standalone gerado.
- Três regressões novas conferem cobertura única das 48 cidades do draft e da Liga, ausência de fallback por bioma/id desconhecido, arquivos locais e SHA-256/procedência. Os testes anteriores de captura, movimento e saves seguem aprovados.
- 49 originais inspecionados visualmente e convertidos em WebP sem perdas, sem redimensionar. Importador offline reproduziu todos os hashes e comparou os pixels RGBA antes de escrever. Total: 6.322.390 bytes (6,03 MiB), carregados sob demanda. Pillow 12.3.0 / libwebp 1.6.0.
- Edge/Playwright: 76 registros em 1280×720, 390×844 e 320×568. Todas as 48 cidades foram oferecidas e carregadas em cada visor; três drafts reais passaram por origem, inicial, passagem, oito ginásios, partida e jornada. Conferidos créditos/filtros, Indigo Plateau e cidade desconhecida de save anterior. Todos os 49 arquivos decodificaram com as dimensões originais. Sem erros de console/rede, imagens quebradas ou overflow horizontal. `docs/balance/browser-city-covers-0.13.0.json`.
- Quatro registros adicionais: 404 deliberado na capa de Pallet, seleção ainda funcional e ausência de mapa substituto; batalhas reais de ginásio e Liga, incluindo turno com o motor. Fluxos normais sem erros; falha intencional registrada separadamente. `docs/balance/browser-city-recovery-0.13.0.json`. Total local: 80 registros.
- Preview do build em `/pokebobo/`: quatro registros em desktop/celular, drafts completos até a jornada e decodificação das 49 imagens em cada contexto. Caminhos, versão e ausência de erros conferidos. `docs/balance/browser-city-preview-0.13.0.json`.
- Limites: validação em Edge automatizado, sem dispositivo físico/iOS. Drafts longos e listas mantêm rolagem interna/vertical existente. Hau'oli usa a arte oficial de Ultra Sun/Ultra Moon e Galar conserva os rótulos japoneses do original; as edições aparecem nos créditos. Regras/RNG/economia não mudaram; campanhas de balanceamento anteriores permanecem abaixo e não foram repetidas para uma alteração de imagens.

## 0.12.0 — Mais uma Poké Bola · 10/10/2026

- `npm run verify`: 195 módulos sem ciclos/import de UI no motor, 104/104 testes, build Vite com 2.074 módulos. Sem geração de HTML standalone.
- Regressões novas: 50º passo animado/instantâneo, movimentos inválidos, reload do último passo e avanço de semana/cidade uma vez; novas tentativas, última bola, nível/espécie fixos, cobrança e conclusão por id, saves anteriores pendentes, sucesso sem duplicação, alvo de evento/legado e bônus consumido uma vez. Continuidade da bola e mato da 0.11.0 seguem cobertas.
- Edge/Playwright: 68 registros gerais em oito tamanhos, de 320×568 a 1440×900, incluindo horizontal 667×375/844×390. Campo, captura, destino lotado, painéis, janelas, turno real e tela cheia. Sem overflow, controles encobertos, sprites quebrados ou erros. `docs/balance/browser-polish-0.12.0.json`.
- Captura/controles: 26 registros adicionais. Falha → nova tentativa → sucesso em cinco layouts, incluindo estoque lotado e substituto preservado; última bola, fuga após falha, evento, save antigo com captura pendente, duplo clique, reload durante arremesso a 1×, retorno automático e cena com dimensões estáveis. Voltar permanece desabilitado durante teclas/ponteiro, entre passos, ao atingir a borda e com duas teclas; soltar fora do botão libera. O 50º passo retorna automaticamente. `docs/balance/browser-capture-0.12.0.json`.
- Medidas no navegador a 1×: entrada terrestre aproximadamente 1,12 s; pesca/Surf aproximadamente 1,46–1,49 s. Conclusão bem-sucedida tem 65 ticks após a última sacudida, mantendo os 24 ticks de estrelas; a pausa anterior tinha 348 ticks. Falha retorna ao menu sem repetir entrada. Timings do navegador dependem da máquina.
- Saves/recuperação: dois registros de rota antiga acima de 50 passos e retry legado com alvo fixo, sem apagar a carreira; mais três de repetição nativa e recurso ausente. Um 404 da fonte foi injetado deliberadamente e validou ações legíveis/fuga sem gastar bola. Fluxos normais sem erros. `docs/balance/browser-save-0.12.0.json` e `browser-recovery-0.12.0.json`. Total: 99 registros locais.
- `npm run balance:audit`: orçamento-base preservado. 60 campanhas completas com combates reais, política equilibrada, 20 por modo, seed-base 20260913. Clássico: 3/20 títulos, 7,8 insígnias médias; Correria: 1/20, 6,2; Nuzlocke: 0/20, 7,2. Zero truncamentos. JSONs `docs/balance/monte-carlo-0.12.0-*.json`. Amostra exploratória pequena de IA, sem estimar dificuldade para humanos ou atribuir diferenças entre versões à chance de captura isoladamente.
- Atlas local regenerado do checkout FRLG congelado: 32 quadros; bordas e cruzamentos inspecionados no campo e na transição. Créditos distinguem tiles originais de margens derivadas. GIF: 117 quadros coletados; 116 úteis codificados, cerca de 10,53 s com entrada, captura e retorno ao campo.
- Limites: Edge automatizado; sem dispositivo físico/iOS. Fórmula de captura, margens e timings são adaptações web. Chance comum de 67% por bola; lendários preservam 48%, roubo recompensado 100%, bônus de evento continuam respeitando o teto. Fonte de nível menor usa pixels sem interpolação.

## 0.11.0 — Ritmo de Kanto · 09/10/2026

- `npm run verify`: 194 módulos sem ciclos/dependências de UI no motor, 97/97 testes e build web Vite. Nenhum HTML standalone foi gerado.
- Regressões novas: posições independentes da bola em cinco alturas e ambos os resultados; continuidade arremesso → abertura → absorção → fechamento → queda; cobertura do mato somente sob os pés nas quatro direções; texto limitado à caixa e glifos portugueses.
- Edge/Playwright: 68 registros gerais em 1440×900, 1280×720, 1024×768, 390×844, 360×640, 320×568, 844×390 e 667×375. Campo/captura/estoque lotado, jornada, equipe, mochila, mapa, diário, janelas e turnos reais de batalha. Sem overflow horizontal, sprites quebrados ou erros de console/rede. Botões da captura têm ao menos 44 px de altura. Relatório: `docs/balance/browser-polish-0.11.0.json`.
- Gestão: 36 registros com seis Pokémon, quatro golpes, Eevee apto a evoluir e três reservas. Botões testados também por posição e hit-test para detectar sobreposição. Troca com reserva cheia, líder, reload e preparação cobrando uma semana. Relatório: `docs/balance/browser-panels-0.11.0.json`.
- Captura: 18 registros de encontros naturais, pesca/Surf, espécie posterior ao FRLG, sucesso/falha, substituição, apresentação completa a 1×, reload durante arremesso, movimento reduzido e pular animação. Posição/dimensões da cena conferidas antes/depois da tentativa para evitar salto de enquadramento. Bola/RNG/payload preservados; conclusão não duplica Pokémon. Relatório: `docs/balance/browser-capture-0.11.0.json`.
- Controles: teclado e ponteiro segurados, liberação fora do botão, janela bloqueando movimento e tela cheia real com Pokédex aberta. Entrada/saída, API indisponível e recusa do navegador verificadas.
- Recuperação: três registros adicionais. Repetição nativa de teclado não inicia passos extras; 404 proposital da fonte mostra erro e ações legíveis, permitindo fugir sem gastar bola. Esse erro foi esperado e separado dos fluxos normais. Relatório: `docs/balance/browser-recovery-0.11.0.json`.
- GIF gerado de 194 quadros capturados da aplicação: entrada e captura completa, sem erro de execução. Fontes FRLG regeneradas pelo importador; somente as duas folhas de fonte e suas métricas mudaram entre os assets.
- `npm run balance:audit`: orçamento de progressão preservado. Nenhuma regra do motor mudou; não foi repetido o Monte Carlo da 0.10.0. Os resultados exploratórios anteriores permanecem abaixo.
- Limites: inspeção em Edge automatizado; telefone físico/iOS não foi testado. Fontes, enquadramento e timings são adaptações web da referência FRLG. Ajuda, diário e painéis com conteúdo excepcionalmente longo mantêm rolagem interna; não há promessa de equivalência integral ao cartucho.

## Ajuste final antes do merge · 09/10/2026

- npm run verify: 188 módulos, 94/94 testes e build Vite (2.067 módulos).
- Nova regressão: a bola pousa em y=70 para cinco alturas de sprite, em sucesso e fuga; sua parte inferior permanece dentro da plataforma, que termina em y=79. O início da queda segue ligado ao ponto de absorção, sem salto de posição.
- Edge/Playwright: Eevee em desktop, Bulbasaur/Lapras em 390×844 e Charizard em 320×568; captura, sacudidas, pular apresentação e retorno ao campo. Zero erros de console/rede ou overflow. Relatório em docs/balance/browser-ball-ground-0.10.0.json; GIF atualizado a partir da cena real.
- Correção de apresentação: probabilidades, resultado persistido, RNG e economia seguem as regras já validadas.

## 0.10.0 — Passos de Kanto · 09/10/2026

- `npm run verify`: 188 módulos JS/JSX sem ciclos ou import de UI no motor; 93/93 testes; build Vite com 2.067 módulos.
- `npm run balance:audit`: orçamento-base preservado. Não mede vitórias.
- 140 campanhas completas com batalhas reais: 60 Clássico, 40 Correria, 40 Nuzlocke, quatro políticas e seed 20261009. Zero truncamentos. A política equilibrada ganhou 5/15 no Clássico; Correria teve 0/40 títulos e Nuzlocke 1/40. Amostras pequenas e exploratórias; não estimam vitórias humanas. JSONs em docs/balance/monte-carlo-0.10.0-\*.json.
- Edge / Playwright: 18 registros em 1280×900, 390×844 e 320×568; sem erros de console/página, requests com erro, imagens quebradas ou overflow horizontal. Caminhada real por teclado/botões → encontro → fuga; captura → resultado → reload → conclusão; sucesso/falha, reserva lotada com escolha de substituto, pesca/Surf, espécie posterior ao FRLG, animação completa 1×, recarga durante arremesso, movimento reduzido e pular apresentação. Relatório: docs/balance/browser-0.10.0.json.
- Testes novos verificam mato contínuo, sorteio apenas ao pisar, garantia após dez passos de mato sem encontro, passo bloqueado durante apresentação, conclusão por id, persistência de sucesso/falha, economia sem duplicação, resultado instantâneo/animado equivalente e marcos de animação extraídos da referência.
- Importador recompõe assets a partir do commit congelado do pret/pokefirered, sem ROM, e traz origem/termos em licenses/FRLG-ASSETS.md. Assets novos presentes no build web; HTML standalone não foi gerado.

Limites: Fidelidade visual baseada nos gráficos e nas sequências de FRLG; não é um emulador do cartucho. O mapa, os textos em português, as regras de captura e os comandos por navegador são adaptados. Espécies/formas posteriores ao FRLG usam os sprites locais existentes. Não foram adicionados áudio, ROM, isca ou pedra. Uma oportunidade permite uma tentativa; falhar encerra esse encontro. A cena representa sacudidas a partir do resultado persistido, não executa a fórmula de captura do cartucho. Sem teste físico em celular nem campanha humana completa.

## 0.9.0 — Rotas Vivas · 09/10/2026

- npm run verify: arquitetura (179 módulos), 87/87 testes e build Vite (2.056 módulos).
- npm run balance:audit: orçamento-base de níveis preservado, nenhuma trajetória de treino-base chega à Liga em nível 99. Não é medição de taxa de vitória.
- 280 campanhas com batalhas reais: quatro políticas, 30 seeds por política no Clássico e 20 na Correria/Nuzlocke; zero truncamentos. 120 campanhas da 0.8.1 servem de referência exploratória. Relatórios completos em docs/balance/adventure-\*.json.
- Playwright com Edge headless: 15 screenshots em 1280×900, 390×844, 320×568 e batalha 844×390; escolha de evolução e reload, caminhada por teclado/toque, captura, pesca, retorno, Pokédex, filtros, famílias e sprites de batalha. Console e imagens sem erro, sem overflow horizontal ou botões do cabeçalho cortados.
- Testes de regras: oito destinos de Eevee, ramos bloqueados, adiamento no teto e reabertura, reserva, decisões antes de ginásio, margem e marcos de pesca/Surf, oportunidade aquática compartilhada, limites de lendário/roubo, coleção global e compensação da Correria.
- Catálogo/sprites regenerados: 486 entradas e 481 sprites locais; nova altura oficial da espécie e conteúdo dos encontros secretos.
- npm audit: zero vulnerabilidades após atualizar source-map-js.
- Assets FRLG reconstruídos pelo importador Python/Pillow a partir do commit congelado, com créditos e descrição da transformação. Nenhum standalone foi gerado.

Limites: o navegador foi emulado; não substitui teste físico ou campanha humana. Políticas automáticas usam escolhas simples de evolução, golpe e evento. A Nuzlocke continua difícil na amostra e não foi afrouxada com cura de mortos ou revives.

## 0.5.0 — Legado · 18/09/2026

- Pull request validado pelo workflow `Verify`.
- `npm run check`: **158 módulos**, imports válidos, sem ciclos e sem dependências de UI no motor.
- `npm test`: **59 testes passaram, zero falhas**.
- `npm run build`: Vite concluiu com **2.036 módulos transformados** em 8,14 s na execução registrada.
- `npm run balance:audit`: concluído sem regressão do orçamento-base de níveis. Esse audit não mede o ganho de força causado pela espécie evoluída.
- Evoluções especiais agora têm nível substituto; testes localizam evoluções especiais reais no catálogo em vez de depender de uma espécie hardcoded.
- Linhas ramificadas usam seleção determinística pelo id do Pokémon, preservando o mesmo caminho após reload.
- O Hall registra tanto campeão quanto run não-campeã. Snapshots novos incluem equipe com níveis, rota, modo, seed, progresso da Liga, motivo de encerramento, acontecimentos e destaques do diário.
- Histórico legado com nomes simples de Pokémon continua aceito pelo Hall.
- SAVE_VERSION é **4**. Testes cobrem migração v3→v4, schemas antigos reconhecíveis, preenchimento das estruturas de evento e preservação de run/seed/equipe/histórico.
- Antes de migrar, o JSON anterior é copiado para `pokebobo.save.backup.v1`. JSON inválido também é preservado nessa chave antes do fallback para estado inicial.
- O antigo teste que exigia reset de saves 1/2 foi substituído por um teste que exige preservação, alinhado ao novo contrato de produto.

**Limitações:** esta entrega não incluiu uma run humana completa, teste físico em celular nem inspeção visual automatizada do Hall. O CI confirma lógica, estrutura, build e CSS compilável. O novo sistema de evolução pode alterar dificuldade real por mudar espécies mais cedo; uma futura rodada de Monte Carlo deve medir essa diferença, e não apenas o orçamento de níveis.

## 0.4.0 — Semanas Vivas · 18/09/2026

- Pull request validado pelo workflow `Verify` com Node.js 22.13.0.
- `npm run check`: **156 módulos**, imports válidos, sem ciclos e sem dependências de UI no motor.
- `npm test`: **54 testes passaram, zero falhas**. Sete casos novos cobrem tamanho/unicidade do catálogo, determinismo por seed, aplicação de escolha, batalha iniciada por evento, consumo único de bônus de treino, teto de captura em 98% e devolução de orçamento de ação.
- O teste do simulador também exige que uma campanha real atravesse ao menos um `EVENT_CHOICE`, além de continuar reproduzível para a mesma seed.
- `npm run build`: Vite concluiu o build da 0.4.0 com **2.034 módulos transformados**.
- O workflow passou a executar também `npm run balance:audit`. O orçamento-base, que deliberadamente **não inclui ganhos dos novos acontecimentos**, permanece: entrada mediana na Liga em nível **18 / 38 / 58 / 78** para 0 / 1 / 2 / 3 treinos por cidade; 0% das amostras desse orçamento chegam à Liga em 99+.
- O catálogo contém **57 acontecimentos**. O sorteio usa o RNG persistido da run, chance de 72% (82% na Correria), filtro de contexto e exclusão preferencial dos dez eventos recentes.
- Bônus de captura são exibidos na tela e consumidos somente em tentativa real; bônus de treino e busca são zerados somente quando suas respectivas ações acontecem. Proteções de emboscada são gastas apenas quando uma emboscada teria sido sorteada.
- Eventos podem abrir uma captura extra ou batalha imediata. Batalhas de evento guardam recompensa pendente e só entregam o prêmio após vitória.
- SAVE_VERSION continua 3. Saves anteriores aceitos pela 0.3.0 continuam carregando; estruturas de evento ausentes são completadas sob demanda.

**Limitações:** a auditoria de orçamento não mede os níveis extras concedidos por eventos e não estima dificuldade humana. O simulador automático escolhe a primeira decisão disponível, portanto serve para reprodução/regressão, não para avaliar a melhor estratégia dos 57 acontecimentos. A nova tela foi coberta por build e CSS responsivo, mas uma run completa em aparelho físico ainda é a próxima validação manual recomendada.

## C03 — sequência visual do turno · 18/09/2026

- Pull request validado pelo workflow Verify com Node.js 22.13.0.
- npm run check: **151 módulos**, imports válidos, sem ciclos e sem dependências de UI no motor.
- npm test: **47 testes passaram, zero falhas**. Quatro casos novos cobrem eventos de apresentação, HP privado em blocos split, aplicação visual de dano/status/queda/troca e recorte dos eventos novos de cada turno.
- npm run build: Vite concluiu o build de produção; 2.029 módulos transformados.
- A pré-simulação usa restoreBattle + battleSnapshot sobre uma cópia da especificação e depois envia a mesma escolha ao reducer. O motor, a seed, as decisões salvas e o schema permanecem inalterados.
- A interface bloqueia golpe/troca/registro enquanto a sequência está em andamento. 1×/2× fica em localStorage separado do save.
- prefers-reduced-motion continua desabilitando animações e transições; as pausas de apresentação são reduzidas para no máximo 120 ms por evento.

**Limitação:** esta execução não incluiu aparelho físico nem inspeção visual automatizada do PR. Q03 continua sendo o próximo teste manual prioritário; o CI confirma estrutura, lógica, testes e build, não sensação de timing em hardware real.

## Entrega no GitHub · 15/09/2026

- `npm run verify` executado no novo fluxo: arquitetura com 148 módulos válida, **43 testes passaram, zero falhas**, build Vite concluído.
- O comando termina em `npm run build`; não chama mais `npm run standalone`.
- SHA-256 do `Pokebobo.html` local comparado antes/depois: idêntico. Arquivo não regenerado e excluído do envio.
- O repositório recebe código, fontes, sprites, capas, licenças, testes, documentação, relatórios históricos e três imagens da UI. `index.html` é a entrada do Vite, não o standalone.
- `.gitignore` exclui dependências instaladas, `dist/`, variáveis locais, logs, ZIP de distribuição e `Pokebobo.html`.
- Nenhuma alteração de gameplay ou UI nesta entrega; versão e saves continuam na 0.3.0/schema 3. As verificações de navegador abaixo são da entrega anterior, não foram repetidas para essa mudança de distribuição.
- Não foi configurada hospedagem pública; o README documenta clone, instalação, execução e preview locais.
- Importação na `main` confirmada por `git ls-remote`: commit inicial `e1a20f0d6eb7fd58d00908631e12630ab6c1eee7`, 761 arquivos. Nenhum standalone, ZIP, segredo local, `node_modules/` ou `dist/` no índice enviado.

## Validação anterior da interface · 14/09/2026

14/09/2026. Escopo: redesign completo de UI/UX. Validação anterior em [archive/VALIDACAO-0.2.2.md](docs/archive/VALIDACAO-0.2.2.md).

## Código e regras

`npm run verify`: **43 testes passaram, zero falhas**; arquitetura com **148 módulos**, imports válidos, sem ciclos e sem dependências de UI no motor. Build Vite e HTML portátil concluídos. Ajustes posteriores de layout foram inspecionados no navegador e o HTML regenerado. São **29 arquivos CSS ativos** incluindo o índice.

Comparação SHA-256 dos **88 arquivos de src/game** com o ZIP entregue na 0.2.2: **zero alterações**. Inclui catálogo, regras, dados, IA e persistência. SAVE_VERSION continua 3. Saves da 0.2.2 são aceitos sem migração; schemas anteriores continuam reiniciando conforme a regra anterior.

Os testes cobrem aprendizado por nível e procedência, progressão, draft, IA justa, captura, teto de treino, replay, Liga, desbloqueios, Nuzlocke e saves. Não houve novo Monte Carlo: os relatórios de dificuldade da 0.2.2 continuam históricos.

## Navegador: interface e decisões

Chrome via agent-browser em perfis de teste separados. Fixtures criadas com o motor atual para inspecionar estados específicos; equipes e etapas sintéticas não medem a viabilidade de uma campanha normal.

| Cenário           | Evidência                                                                                                                                                                                                                             |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Abertura e início | Registro de Erick, escolha de origem e de Bulbasaur, chegada ao draft. Abertura, três origens e três iniciais revisados em 320 × 568.                                                                                                 |
| Draft pronto      | Botão de começar visível em 320 × 568; revisão extensa da rota pode rolar abaixo. Trocar etapa volta ao topo.                                                                                                                         |
| Jornada           | Quatro ações e desafio visíveis em 320 × 568. Custo e aviso da última semana mantidos.                                                                                                                                                |
| Equipe            | Seis seletores, ficha e quatro golpes juntos em 320 × 568. Painel do PC abre a ficha de Pikachu diretamente.                                                                                                                          |
| Líder             | Clique em Colocar na frente muda o líder para Pikachu e mantém spent=1. A ação fica bloqueada durante batalha.                                                                                                                        |
| Mochila           | Estoque e três ações visíveis em 320 × 568. Preparar consome um kit (2→1), uma semana (1→2), equipa os seis com Sitrus Berry e retorna à jornada.                                                                                     |
| Captura com seis  | Antes da seleção, capturas desabilitadas. Selecionado Growlithe; captura bem-sucedida de Rattata mantém seis integrantes, troca somente Growlithe e consome uma bola (6→5). Seleção, duas espécies, custo e saída cabem em 320 × 568. |
| Mapa              | Dez cidades e Liga, percurso contínuo, posição atual e paradas concluídas visíveis em 320 × 568.                                                                                                                                      |
| Resultado         | Vitória real do motor contra Misty em três turnos; recompensa, sobreviventes e continuar visíveis em 320 × 568.                                                                                                                       |
| Encerramento      | Derrota e fixture de campeão revisadas em 320 × 568; resumo, insígnias e nova aventura visíveis.                                                                                                                                      |
| Liga              | Cinco adversários e botão Enfrentar visíveis em 320 × 568: main 396/396 px, botão termina em y=489, navegação começa em y=500.                                                                                                        |
| Janela e teclado  | Ajuda aberta + tecla 1 mantém choices=[]; Escape fecha e devolve foco a Como jogar e créditos.                                                                                                                                        |

A seleção e o foco são estados de apresentação. Os comandos da mochila e da equipe continuam enviando as ações existentes ao reducer.

## Batalha e dimensões

- **1365 × 768:** quatro golpes, arena, painel com seis integrantes, insígnias e treinador visíveis. Captura revisada e entregue como Pokebobo-batalha.png.
- **320 × 568:** página sem overflow; visor de batalha 426/426 px. Linhas de golpes terminam em y=415 e y=479; navegação começa em y=500. Tela revisada após correção da altura dos sprites.
- **390 × 844:** visor de batalha 684/684 px. Golpes terminam em y=678 e y=748; navegação em y=770. Imagem entregue como Pokebobo-celular.png.
- **844 × 390:** composição horizontal com arena e comandos lado a lado; visor 276/276 px. Linhas dos golpes terminam em y=223 e y=319; navegação em y=336.
- Troca mostra os seis slots na grade. Tecla 2 executa Take Down, consome PP de 32 para 31 e avança o turno. O listener existe apenas na batalha elegível; janelas e campos são ignorados.

## HTML offline

Arquivo local aberto em outro perfil do navegador, com rede desativada. Cenário de batalha carregado, ataque executado e página recarregada:

- Zero requisições HTTP na lista de recursos inspecionada.
- Sprites carregados; seis capas embutidas decodificadas com dimensões válidas: 946×752, 2100×1280, 1477×809, 912×616, 768×909, 600×1210.
- Silkscreen carregada de forma explícita pelo FontFaceSet com rede desligada; document.fonts.check retorna true. A fonte é requisitada sob demanda, por isso pode ainda não estar carregada numa tela que não a usa.
- Recarregar preserva exatamente o texto da batalha, incluindo HP, PP e turno; decisions/choices contém move 2, save versão 3.
- Sem erros JavaScript nos fluxos finais inspecionados. O HTML final foi reconstruído após os ajustes de layout.
- Aproximadamente 10,3 MiB com motor, fontes, sprites e capas. Código-fonte distribuído separadamente, sem node_modules/dist.

## Limites

Sem aparelho físico, campanha humana extensa, auditoria formal de acessibilidade ou benchmark de desempenho. Emulação de viewport não reproduz teclado virtual, navegador móvel e toque reais. A altura dinâmica e as safe areas têm suporte CSS, mas precisam de conferência física. Ajuda, diário e listas longas podem rolar dentro do visor. As capas são referências de Emerald, não cenários exclusivos de cada líder. A animação completa de resolução do turno continua no ROADMAP.
