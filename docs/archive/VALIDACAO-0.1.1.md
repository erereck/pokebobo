# Validação — Pokébobo 0.1.1

Concluída em 13/09/2026. Update de organização, sem alteração intencional de gameplay.

## Automatizada

`npm run check`: **134 módulos verificados**, sem imports locais ausentes, ciclos ou dependências relativas de interface no motor.

`npm test`: **18 testes passaram, 0 falhas**.

- Draft completo com dez cidades e oito ginásios diferentes.
- Avanço automático após três semanas e ginásio obrigatório.
- Custo e esgotamento de captura; resolução da exploração na última semana.
- Evolução, atualização de golpes e limite de nível.
- Replay determinístico de HP, turnos e log usando o Showdown.
- Derrota definitiva e impossibilidade de continuar a mesma run.
- Troca forçada quando o Pokémon ativo cai.
- Oito ginásios, quatro membros da Elite e campeão, com desbloqueios.
- Modos bloqueados antes do primeiro título e persistência de save.
- Golpes do catálogo existem no motor.
- Remoção de Pokémon caído no Nuzlocke depois de uma vitória.
- Falha de gravação no armazenamento e roundtrip de persistência.
- Cinco seeds de regressão com 926 transições e hashes do estado completo da versão anterior.

A campanha completa usa uma equipe nível 100 de teste para verificar as transições. Não é um teste de balanceamento.

## Compatibilidade da refatoração

O motor 0.1.0 foi preservado em uma cópia de trabalho e executado ao lado do novo motor, recebendo as mesmas decisões. As **926 transições produziram estados idênticos**, incluindo os dados usados pelo save. As fixtures congeladas estão em `tests/fixtures/v0.1-replays.json`.

Também foi comparada a cascata CSS antes e depois da separação, normalizando formatação e caminhos de assets: **2.091 declarações preservadas na mesma ordem**. O resumo da comparação está em [refactor-comparison.json](docs/validation/refactor-comparison.json).

Esses casos sustentam a compatibilidade nos cenários cobertos; não constituem prova de todos os estados possíveis do jogo.

## Navegador

Verificado com Chrome via agent-browser em **390 × 844** e **1365 × 950**.

- Abertura, nome do treinador, escolha de origem e inicial.
- Draft de todas as cidades e confirmação da região.
- Exploração e captura de Shinx, consumindo uma Poké Bola e uma semana.
- Tela de equipe com o inicial e o Pokémon capturado.
- Mapa completo e diário da run.
- Abertura e fechamento da ajuda e das opções.
- Versão 0.1.1 visível no desktop.
- Sem erros de JavaScript reportados nos fluxos inspecionados.
- Sem sprites quebrados ou rolagem horizontal na medição mobile.

## Arquivo único offline

`Pokebobo.html` aberto diretamente por `file://` no navegador.

- Fontes embutidas carregadas.
- **Zero requisições HTTP externas** na abertura e na batalha.
- Batalha real executada com fixture de teste e restaurada no turno 2.
- Uma decisão salva e preservada após recarregamento.
- Troca voluntária de Bulbasaur para Rookidee e avanço ao turno 3.
- Zero imagens sem carregamento e nenhuma rolagem horizontal em 390 px.

`npm run standalone`: build e geração do HTML concluídos. Arquivo final com cerca de 8,1 MB.

## Diagnóstico de progressão

`npm run balance:audit` avaliou 10.000 sequências determinísticas por estratégia, em quatro estratégias de treino. Só viagens e recompensas de ginásio já levam o inicial de nível 10 a 52 antes da Liga. Com três treinos por cidade, 99,88% das sequências entram na Liga em nível pelo menos 99.

A auditoria assume vitórias e não inclui emboscadas. Mede orçamento de níveis, não taxa de vitória. Os resultados e a proposta de rebalanceamento estão em [ROADMAP.md](docs/ROADMAP.md) e [current-progression.json](docs/balance/current-progression.json).

## Limites

Não houve teste em aparelho Android/iOS físico, nem sessão longa de balanceamento. Os testes de navegador usaram perfis separados e uma fixture sintética para o combate offline. As regras continuam iguais às da 0.1.0; nenhuma capa externa foi instalada. O recorte de dados, as evoluções especiais ausentes e as adaptações dos times estão descritos no README e na ajuda do jogo.
