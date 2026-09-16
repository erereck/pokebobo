# Validação — Pokébobo 0.2.2

14/09/2026. Escopo: D02. A validação anterior está em [archive/VALIDACAO-0.2.1.md](docs/archive/VALIDACAO-0.2.1.md).

## Código, catálogo e fontes

`npm run verify`: **43 testes passaram, zero falhas**; arquitetura com **148 módulos**, imports válidos, sem ciclos e sem UI no motor. Build Vite e HTML portátil concluídos.

- Starmie: Surf no 44 e Psychic no 40; Roserade: Petal Dance no 60. Não aparecem antes por L1 evoluído.
- Kadabra e Venusaur respeitam os estágios de evolução; L0 e L1 têm tratamento distinto. Bullet Punch de Scizor conserva sua fonte de evolução.
- Magikarp/Abra recebem Splash/Teleport no nível 10, sem Tackle fabricado. Oricorio-Pa'u usa a fonte compartilhada de Oricorio.
- Todas as 484 entradas são consultadas do nível 1 ao 100: 48.400 seleções com 1–4 golpes únicos, disponíveis naquele nível.
- Cada golpe do catálogo aponta para um código que existe nos dados instalados, na mesma geração de referência do set. O teste consulta a tabela de origem independentemente do gerador.
- Casos de regeneração determinística e ausência das formas sem referência; o gerador verifica que nenhuma espécie dos elencos/encontros fica de fora.
- Saves com schema 1 e 2 reiniciam; schema 3 preserva a run. Sem motores antigos ou migração paralela.
- Os testes anteriores de IA justa, progressão, draft, captura, determinismo, Liga e sobrevivência Nuzlocke continuam passando.

`node scripts/catalog.mjs`: 484 entradas, 483 nomes canônicos, 479/479 sprites referenciados presentes. Cinco formas não utilizadas foram excluídas por ausência de geração 8/7 comum; lista e justificativas no manifesto. Arquivos extras de sprites de versões anteriores podem continuar no pacote.

`node scripts/audit-moves.mjs`: **495 sets** — 122 ginásios originais, 122 com +6, 21 iniciais, 230 posições da Liga. Mudaram 41 sets originais de ginásio e nenhum inicial de nível 10. Manifesto guarda hash do catálogo e do lockfile. Veja [regras e fontes](docs/REGRAS-DE-GOLPES.md).

## Simulação

800 campanhas completas no Clássico, 200 por política, seed base 20260913, **zero truncamentos**. Mesmas seeds iniciais da 0.2.1. Vitórias: treino 2/200; quatro integrantes 21/200; cobertura 31/200; aleatória 0/200. Resultados individuais, comparação pareada, denominadores e intervalos em [RELATORIO-0.2.2.md](docs/balance/RELATORIO-0.2.2.md).

As mudanças de aprendizado afetam os dois lados. Comparação de bots não estima a taxa humana. Não foi executada nova rodada de Monte Carlo em Correria/Nuzlocke nem nova auditoria de orçamento de níveis: seus parâmetros não mudaram. Os dados anteriores desses modos são históricos.

## Navegador e distribuição

Chrome via agent-browser, em perfis de teste e com fixture sintética: Starmie 21 do jogador enfrenta Misty. Os sets são criados pelo motor atual; a fixture não mede a viabilidade de obter essa equipe naquela etapa.

- Save schema 2 inserido no perfil de teste retorna à abertura, sem continuar com os golpes antigos.
- Quatro golpes novos de Starmie visíveis juntos: Swift, Water Gun, Rapid Spin, Tackle.
- **320 × 568:** sem overflow; última linha dos golpes termina em y=504, antes da navegação inferior.
- **1365 × 768:** sem overflow; todos os quatro golpes visíveis, última linha em y=748.
- Water Gun consome um PP e o turno resolve. Recarregar conserva exatamente o texto da batalha, incluindo HP/PP e turno; save permanece schema 3.
- **HTML local, 390 × 844, rede desativada:** sem overflow; quatro golpes até y=780. Ataque executa e PP cai de 40 para 39.
- Nenhuma requisição HTTP na inspeção offline. Sprites renderizados; as seis capas embutidas decodificadas com dimensões válidas.
- Sem erros JavaScript nos fluxos inspecionados. Capturas de tela revisadas; imagem da batalha desktop entregue junto do HTML.
- HTML portátil de aproximadamente 10,2 MiB, com fontes, sprites e capas incorporados. Fonte empacotada sem node_modules/dist; versão e arquivos novos conferidos no ZIP.

## Limites

Sem celular físico ou sessão humana extensa. Fontes de golpes não equivalem a sets históricos por edição. A regra de L1 evoluído é uma adaptação explícita do Pokébobo. Cranidos 14 continua sem STAB de dano; reaprendizagem manual e evoluções especiais continuam fora do D02. O aumento do catálogo com procedência amplia o HTML; não houve estudo de desempenho em aparelhos físicos nesta rodada.
