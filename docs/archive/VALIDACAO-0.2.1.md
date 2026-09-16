# Validação — Pokébobo 0.2.1

Atualizada em 14/09/2026. A validação da base 0.2.0 está preservada em [archive/VALIDACAO-0.2.0.md](docs/archive/VALIDACAO-0.2.0.md).

## Código e regras

`npm run verify`: **38 testes passaram, zero falhas**; arquitetura com **147 módulos**, imports válidos, sem ciclos e sem UI dentro do motor. Build Vite e HTML portátil concluídos.

Cobertura nova:

- Treino com todos no nível 100 não altera estado, semana ou RNG.
- Time misto recebe ganhos 0/1/3 corretamente; mensagem e recompensa consideram o teto.
- Evolução continua ocorrendo e é registrada.
- Relatório usa encontros reais como denominador, exclui censurados das derrotas e separa emboscadas de ginásios.
- KO com Flare Blitz e recuo que derruba o último integrante: vitória do motor encerra a run Nuzlocke, sem insígnia/progressão. No Clássico a vitória continua válida.

Os demais testes cobrem replay determinístico, captura, troca forçada, draft em ordem, ajuste +6, encontros distintos, substituição, saves e campanha completa. A campanha funcional em nível 100 continua sendo teste de transições, não de dificuldade.

## Simulação e auditoria

- Clássico: 800 campanhas, 200 por política.
- Correria: 400 campanhas, 100 por política.
- Nuzlocke: 400 campanhas, 100 por política.
- Rodada concluída: zero truncamentos. A tentativa inicial de Nuzlocke revelou equipe vazia após KO com recuo; foi corrigida e a rodada desse modo reexecutada.
- 122 sets de ginásio e 21 iniciais auditados, com origem dos golpes na versão instalada de @pkmn/sim.
- A auditoria de orçamento de níveis permanece separada. Parâmetros de ganho/níveis dos líderes não foram alterados.
- Normal/Correria foram medidos com as mesmas regras de combate; a correção encontrada depois se aplica apenas à sobrevivência na Nuzlocke.

Ver [relatório e reprodução](docs/balance/RELATORIO-0.2.1.md). As primeiras 100 seeds do Clássico reutilizam a referência anterior. Não se trata de 1.600 seeds novas independentes. Políticas ainda precisam ser adaptadas aos modos; zero vitórias em Correria/Nuzlocke não demonstra impossibilidade.

## Navegador

Chrome via agent-browser em perfil de teste, com fixtures sintéticas:

- Jornada 320 × 568: treino desabilitado com equipe no nível 100; desafio termina em y=482, acima da navegação y=512, sem rolagem.
- Um integrante no nível 99 habilita treino. A ação aplica somente +1 a ele, mantém os demais em 100 e gasta uma semana; o diário registra os ganhos e evoluções da fixture.
- Resultado em 390 × 844: recompensa informa +1 nível em 1/6 integrantes, com botão de continuar visível.
- Nuzlocke sem sobreviventes mostra “Fim da estrada”; registrar a história encerra a run com won=false e nenhuma insígnia adicional.
- Batalha compacta continua sendo verificada em celular e desktop no HTML portátil.
- Sem erros JavaScript nos fluxos normais inspecionados.

## Distribuição e limites

HTML portátil com fontes, sprites e seis capas incorporados; fonte distribuída sem node_modules/dist. Não foi adicionada dependência externa. Saves 0.2.0 são aceitos; não há motor antigo/migração paralela.

Sem testes em celulares físicos ou sessão humana extensa. Auditoria dos sets aponta candidatos a revisão, não ilegalidade. Escolha manual de golpes, evoluções especiais, importação e recuperação de saves, PWA e políticas específicas por modo permanecem propostas no ROADMAP.
