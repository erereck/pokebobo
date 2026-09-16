# D02 — Referência dos golpes automáticos

Versão 0.2.2 · 14/09/2026 · política `lineage-levels-v1`.

O Pokébobo usa a mesma seleção automática para jogador, selvagens, líderes e Liga. Cada golpe disponível tem uma fonte verificável. Esta é uma adaptação de progressão para o jogo: não reproduz os quatro golpes históricos de cada líder nem todas as formas de aprender golpes nos cartuchos.

## Fonte e reprodução

Dados da dependência **@pkmn/sim 0.10.11**, fixada em `package.json` e `package-lock.json`. O gerador consulta `Dex.mod("gen8")`; usa códigos de aprendizado por nível das gerações **8 ou 7**, nesta ordem. Escolhe uma única geração que tenha aprendizado por nível em todos os estágios da linhagem. Não combina a geração 8 de uma evolução com a geração 7 de sua pré-evolução.

As fontes do projeto estão no [motor distribuído por pkmn/ps](https://github.com/pkmn/ps/tree/main/sim), na [tabela de learnsets do Showdown](https://github.com/smogon/pokemon-showdown/blob/master/data/learnsets.ts) e na [consulta de espécies e learnsets](https://github.com/smogon/pokemon-showdown/blob/master/sim/dex-species.ts). Os links explicam a origem; a referência exata desta entrega é o pacote instalado e travado, não o estado futuro desses branches.

O [manifesto do catálogo](balance/catalog-0.2.2.json) registra geração, linhagem, exclusões, versão do motor e SHA-256 do catálogo e do lockfile. O [relatório dos sets](balance/moves-0.2.2.json) registra **495 sets**: 122 de ginásios nos níveis originais, 122 com +6, 21 iniciais e 230 posições possíveis da Liga. Cada golpe indica a espécie que forneceu a fonte, geração, código original e nível efetivo. O catálogo cobre os demais níveis e encontros.

```sh
npm ci
node scripts/catalog.mjs
node scripts/audit-moves.mjs
node --test tests/move-policy.test.js
```

O gerador também verifica sprites locais; baixa apenas arquivos ausentes. Não edite o JSON manualmente. Regras de procedência ficam em `scripts/catalog/learnsetPolicy.mjs`; preferências e identificador em `src/game/config/moves.js`; escolha dos quatro golpes em `src/game/pokemon/moves.js`.

## Disponibilidade por nível

1. **Herança:** mantém os golpes aprendidos pela pré-evolução e seus níveis. O nível mínimo conhecido de evolução também limita os golpes aprendidos no novo estágio. Por exemplo, Kadabra não antecipa Confusion para antes do estágio de nível 16.
2. **Código L0:** indica um golpe recebido ao evoluir. É permitido a partir do nível mínimo conhecido do estágio. Para uma evolução especial sem nível fixo, o catálogo não inventa um requisito: um exemplar já evoluído pode ter seu golpe de evolução. Isso não adiciona evolução por pedra/troca ao jogo.
3. **Código L1 em uma evolução:** não reduz o nível de um golpe da pré-evolução. Se só existir como L1 da evolução, fica fora da seleção automática. Essa é uma regra conservadora do Pokébobo para reaprendizagem; não afirma que todo L1 evoluído seja impossível ou ilegal no cartucho.
4. **Outros códigos L:** entram no nível informado, respeitando o estágio. TMs, tutor, ovo e eventos não entram na seleção automática.
5. **Escolha dos golpes:** preserva a pontuação por dano, STAB, precisão e cobertura e a preferência por um golpe de status. Seleciona no máximo quatro opções disponíveis. Se o Pokémon só conhecer golpes de status fora da lista preferida, recebe um deles; nunca recebe um Tackle inventado.

## Casos conferidos

| Espécie / nível    | Antes                                        | Agora / referência                                                                                              |
| ------------------ | -------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Starmie 21         | Psychic, Surf, Power Gem, Recover            | Swift, Water Gun, Rapid Spin, Tackle. Psychic vem de Staryu 8L40; Surf de Staryu 8L44.                          |
| Roserade 22        | Petal Dance disponível cedo por L1           | Magical Leaf, Poison Sting, Leech Seed, Mega Drain. Petal Dance conserva Roselia 8L60.                          |
| Venusaur 32        | L1 exclusivo podia antecipar Petal Dance     | Petal Blizzard vem de 8L0 no estágio 32; Petal Dance exclusivo de lembrete fica fora.                           |
| Scizor             | Golpes de evolução misturados aos lembretes  | Bullet Punch 8L0 continua disponível. Estar disponível não garante entrar entre os quatro escolhidos.           |
| Magikarp / Abra 10 | Fallback Tackle sem origem no catálogo       | Splash / Teleport, respectivamente. Podem precisar de outro integrante para combater.                           |
| Oricorio-Pa'u      | Forma sem tabela própria acabava no fallback | Usa explicitamente a tabela compartilhada de Oricorio, geração 7; Revelation Dance fica disponível no nível 40. |

Os 21 sets de iniciais no nível 10 permaneceram iguais. Mudaram 41 dos 122 sets de ginásio nos níveis originais. A correção também afeta Pokémon do jogador, encontros e a Liga; não é uma vantagem exclusiva para um lado.

## Limites assumidos

- O catálogo tem 484 entradas, incluindo o alias de Oricorio-Pa'u: 483 nomes canônicos e 479 números de sprite. São 338 entradas com referência 8 e 146 com referência 7.
- Cinco evoluções que eram descobertas automaticamente, mas não aparecem nos elencos/encontros atuais, foram excluídas por falta de uma referência 8/7 comum: Kleavor, Wyrdeer, Typhlosion-Hisui, Samurott-Hisui e Decidueye-Hisui. O gerador falha se uma espécie usada pelo jogo ficar sem referência; não remove conteúdo jogável silenciosamente.
- Cranidos 14 continua sem golpe de dano do próprio tipo na referência 7. Não foi acrescentada uma TM para encobrir essa limitação. Raichu conserva Thunder Punch de evolução: poder alto, sozinho, não torna um golpe indevido.
- O jogo não guarda o histórico individual de aprendizado; recalcula o set ao criar ou aumentar o nível. É uma progressão automática uniforme. Um sistema de escolha/reaprendizado continua sendo outro item, C09.
- Evoluções especiais e sets históricos por edição não foram implementados. Os elencos, níveis, +6, IA, encontros, recompensas e layout não tiveram suas regras alteradas neste update.
- **Saves anteriores reiniciam (SAVE_VERSION=3)** para não carregar sets e replays feitos com o catálogo antigo. Há somente uma regra ativa, como autorizado para o período de balanceamento.
