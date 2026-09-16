# Pokébobo — lista de refinamentos
Atualizada em 13/09/2026 para a versão 0.2.0. A proposta original foi preservada em [archive/ROADMAP-0.1.1.md](archive/ROADMAP-0.1.1.md). Este documento distingue entregas de trabalho futuro.

## Aplicado nesta versão
| Item | Resultado |
|---|---|
| B02 | Viagem não concede níveis nem provoca evolução. |
| B03 | Ginásio e Liga dão +1; emboscadas dão zero. Treino segue +1 a +3. |
| B06 | Monte Carlo com batalhas reais, quatro políticas, seeds reproduzíveis, relatório por campanha e truncamentos separados. Amostra inicial: 400 campanhas no Clássico. |
| D01 | Proposta substituída pela decisão do usuário: 1º ginásio entre primeiros, 2º entre segundos etc. São 37 líderes, com espécies e níveis da edição registrada. |
| D03 / D04 | Rotas persistentes entre cidades, encontros influenciados pelas duas pontas, duas famílias distintas e preferência por famílias ainda não vistas. Curadoria do Pokébobo, não tabela oficial de cartucho. |
| D08 | Captura com seis integrantes exige escolher quem sai; a troca só acontece em caso de sucesso. |
| C01 / C02 | IA considera dano estimado, precisão, prioridade, PP, status, cura e troca; recebe uma visão filtrada da luta. Testes cobrem dados ocultos e aprisionamento. |
| C04 | Registro identifica espécie e lado, traduz mudanças de atributos e consumo de berries. |
| C07 | Última semana anuncia a viagem ou o ginásio automático antes da ação. |
| A01–A05 | Piloto com seis folhas de Emerald, metadados, créditos, recortes SVG, fallback e inclusão no HTML offline. Neve conserva SVG. |
| Q05, parte principal | Arena ajustável, quatro golpes juntos, trocas em grade, últimas mensagens visíveis e histórico em janela. Conferência em celular e PC descrita em VALIDACAO. |

## Decisões de escopo
- **B01:** sem limite de nível por etapa nesta versão. A correção adotada reduz bônus gratuitos e aumenta o líder em +6 uma vez quando o maior nível do jogador supera seu ás original em pelo menos 10. Nível 99 continua possível; não foi tornado impossível por uma trava.
- **B05 / Q09:** não manter perfis antigos de regras nem migrações, por decisão expressa do usuário. Save incompatível reinicia. Há botão de reset de teste com confirmação. Fixtures da 0.1 permanecem arquivadas como evidência histórica.
- **D05:** ofertas são filtradas pela posição original; ainda não há proteção contra combinações difíceis nem garantia de counter.
- **D07:** captura segue 86%, uma tentativa por espécie e uma bola. A simplicidade foi preservada.
- **C08:** emboscadas perderam a recompensa de níveis; chance e intervalo permanecem.
- **Q06:** textos alterados foram alinhados às regras. Uma camada completa de localização não foi criada.

## Parcialmente resolvido
| Item | O que entrou | O que falta |
|---|---|---|
| B04 | Bônus menores reduzem a frequência do teto 100. | Mensagem precisa de ganhos truncados no teto, por integrante. |
| D02 | Learnset usa a geração mais recente disponível até a 8 por espécie/ancestral. | Rever golpes de nível 1 das evoluções e documentar uma referência estrita por set. |
| D09 | Nível selvagem acompanha o desafio original; evoluções simples aparecem após três insígnias. | Medir utilidade das substituições tardias e ajustar o atraso diante de times muito treinados. |
| C03 | Mensagens recentes compactas e registro completo separado. | Sequência animada de dano, status, queda e troca. |
| C05 | Inicialização compartilhada e simulação incremental para Monte Carlo. | Medir replay longo em aparelhos físicos; UI ainda reconstrói combate a cada decisão. |
| R04 | Últimas 20 viagens consultáveis em Opções. | Hall da Fama com mapa e decisões da carreira. |
| R06 | Seed da run visível em Opções e presente nos dados de simulação. | Compartilhar resumo visual e iniciar run a partir de seed na UI. |
| Q08 | Capas locais entram no bundler; inspeção offline e catálogo de sprites. | Automatizar também o teste de rede e dos recortes visuais. |

## Próximas melhorias, em ordem
1. **Balanceamento:** ampliar B06 por inicial, ginásio e modos. O segundo ginásio e o campeão concentram derrotas das políticas de composição. Rever C06 (cura e berries), R02 (sorteio da Liga) e D09 antes de aumentar a lista de recursos.
2. **Golpes e evoluções:** terminar D02; piloto de C09 para escolher um golpe e permitir algumas evoluções especiais com uma regra simples.
3. **Experiência mobile:** terminar Q05 em aparelhos reais, foco/zoom 200% e batalhas longas; medir C05 e Q03 (carregamento do motor).
4. **Draft:** D06, revisão das escolhas antes de partir sem reroll infinito. Avaliar D05 com dados, conservando a surpresa e o conhecimento do jogador.
5. **Liga e modos:** R01, registrar origem exata de todos os sets e adaptações; R03, balancear Correria/Nuzlocke separadamente.
6. **Persistência:** Q01, importar backup validado; Q02, recuperar JSON inválido sem sobrescrever silenciosamente. A decisão de descartar versões antigas não substitui tratamento de corrupção.
7. **Distribuição:** Q04, instalação PWA e modo avião no Android/iOS; Q07, integração contínua com testes e pacotes. Sem publicação externa nesta entrega.
8. **Identidade e memória:** expandir A02 para capas específicas verificadas por cidade/rota; terminar R04/R06; R05, registro opcional de conhecimento sem bônus de poder.

O [relatório de balanceamento](balance/RELATORIO-0.2.md) explica o que os números permitem concluir. A prioridade segue sendo decisões simples, variedade de times e informação acessível durante a ação.
