# Validação — Pokébobo 0.2.0
Concluída em 13/09/2026. Esta versão muda gameplay intencionalmente; não mantém saves/regras da 0.1.

## Automação
`npm run verify` concluído: arquitetura, 31 testes, build e HTML portátil.

- 145 módulos JavaScript/JSX: imports locais válidos, sem ciclos e sem dependências de UI no motor.
- 31 testes passaram, zero falhas. Incluem as oito etapas originais do draft em 80 seeds, viagem sem ganho/evolução, limiar de 10 níveis e bônus único de +6, duas famílias por rota, substituição em time cheio, reset de save incompatível, IA observável, prioridade, cura, PP, aprisionamento, replay, captura e campanha completa.
- O teste de campanha com equipe nível 100 verifica transições e desbloqueios; não mede dificuldade.
- Catálogo: 489 entradas/chaves, 481 IDs de sprites locais.
- Resultados históricos da 0.1 preservados em docs/archive, sem regenerar fixtures antigas.

## Balanceamento
`npm run balance:audit`: 10.000 sequências por estratégia, quatro estratégias, assumindo vitórias.
`npm run balance:monte-carlo -- --runs 100 --seed 20260913`: 400 campanhas com combate real, 100 por política; zero truncamentos. Vitórias: 0, 11, 15 e 0. Ver [relatório e limitações](docs/balance/RELATORIO-0.2.md).

## Navegador
Chrome via agent-browser, perfis separados do navegador pessoal. Fixtures sintéticas usadas para exercitar combate, equipe de seis e última semana; testes do reducer cobrem o draft e as transições.

| Tela | Verificação |
|---|---|
| Batalha 320 × 568 | Quatro golpes: última borda em y=504; navegação começa em y=512. Documento com altura 568, sem rolagem. |
| Batalha 375 × 667 | Últimos golpes em y=603, navegação em y=611. Sem rolagem. |
| Batalha 390 × 844 | Últimos golpes em y=780, navegação em y=788. Sem rolagem. |
| Batalha 1365 × 768 | Últimos golpes em y=748. Equipe e HP visíveis; altura do documento 768. |
| Batalha 1365 × 950 | Últimos golpes em y=930, documento com altura 950. |
| Troca, 320 × 568 | Seis opções em três linhas; última borda y=504. Verificada troca obrigatória após Magikarp cair e entrada de Wooper. |
| Jornada 390 × 844 | Quatro ações, equipe, semanas e desafio visíveis juntos. |
| Jornada 320 × 568 | Última semana e líder +6: botão de desafio termina em y=500, acima da navegação y=512. Arte decorativa recolhida nessa altura. |

Também conferidos:
- Golpe executado, PP consumido e decisão preservada após recarregar.
- Registro completo da batalha em janela separada.
- Captura com seis: botão exige seleção; Riolu substituiu apenas Numel, mantendo seis integrantes e sem cobrar outra semana além da exploração.
- Reset: cancelar conserva o save; confirmar retorna a run nula e recordes zerados.
- Ajuda e galeria das seis capas com procedência.
- Sem erros JavaScript reportados nos fluxos normais inspecionados.
- Falha de imagem induzida: cenário SVG substitui a capa e os quatro golpes continuam disponíveis.

## Offline
HTML aberto diretamente por file://. Fontes e sprites incorporados; seis imagens carregadas e decodificadas. Zero requisições HTTP/HTTPS externas na abertura, batalha e galeria. O HTML final ocupa aproximadamente 9,4 MB. O ZIP contém fonte, assets, testes, scripts, documentos e relatórios; exclui node_modules e dist.

## Limitações
Não houve teste em Android/iOS físico ou sessão humana extensa. Zoom elevado pode exigir rolagem para conservar a leitura. O motor da UI ainda reconstrói batalhas por replay; a simulação incremental não é otimização de renderização. IA é heurística e não resolve perfeitamente todas as combinações de efeitos. Evoluções especiais, importação de saves, recuperação de JSON corrompido e PWA continuam no roadmap.
