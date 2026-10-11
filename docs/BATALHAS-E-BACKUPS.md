# Batalhas e backups — 0.19.0

## Durante a batalha

O caderno fica junto de Trocar e da velocidade. Registro mostra os últimos 60 textos; Seus golpes consulta os quatro golpes atuais, PP, tipo, categoria, poder/precisão básicos, prioridade e efeitos conhecidos. Em campo mostra HP, tipos, status e os sete estágios dos dois Pokémon ativos. Informações secretas do adversário não são mostradas. Habilidades, itens e condições podem alterar o resultado; não há calculadora de dano.

Os fatos vêm do mesmo Dex Gen 8 do motor. Precisão **Sem teste** quer dizer que não há o teste normal de acerto, não que o golpe atravessa proteção, imunidade ou outras restrições. Poder variável e dano fixo são identificados. Future Sight/Doom Desire explicam a chegada atrasada; não causam dano na preparação. Roost, Rest, Wish e golpes com recarga têm observações próprias.

O turno apresenta eventos reais em sequência: movimento, HP, status, desmaio/troca e mensagens. Cada tipo tem partículas/sons; proteção, cura e mudanças de atributos têm movimentos próprios. Os efeitos usam os corpos visíveis de frente/costas, não a margem transparente das imagens. A camada limpa os retângulos do HUD e não captura cliques. Arte original disponível antes do turno é usada durante todo ele; falha/atraso de rede usa formas próprias sem interromper o jogo.

**Pular** conclui o comando já escolhido uma única vez. Abrir outra tela/janela, ocultar a aba ou recarregar também conclui esse turno, sem desfazê-lo. A gravação da ação é imediata e o replay guarda o comando, não um frame intermediário. A velocidade 1×/2× é preferência do navegador; storage negado mantém a opção só na sessão. Movimento reduzido encurta as etapas e dispensa partículas/translação; GIFs intrínsecos dos sprites podem continuar animados.

## Restaurar uma jornada

1. Em Opções, exporte o progresso para obter o JSON do slot atual.
2. Em Restaurar backup, escolha esse arquivo (máximo 8 MB).
3. Confira treinador, etapa, insígnias, semana e equipe; escolha um dos três slots.
4. Se ele estiver ocupado, use Exportar Slot antes de substituir se quiser outra cópia. O botão final informa qual slot será substituído.

A restauração aceita somente o schema atual (4). A versão de release 0.19.0 não mudou esse schema: exports compatíveis de 0.18 continuam aceitos. JSON inválido, espécie/golpe desconhecidos, posições impossíveis ou replay de batalha inválido impedem a escrita. A validação é estrutural e de replay, não uma proteção antitrapaça; saves locais continuam editáveis.

O slot escolhido recebe o backup, fica ativo e mantém uma cópia válida anterior na chave de recuperação. Os outros slots e preferências visuais/áudio continuam. Hall/Pokédex compartilhados incorporam os registros recebidos sem apagar os locais. A restauração captura as chaves afetadas e tenta revertê-las se houver falha; quota/negação persistente também pode bloquear a reversão. Nesse caso a mensagem orienta exportar a jornada ainda aberta em memória.

Navegadores que negam o próprio getter de localStorage podem jogar em memória e exportar JSON. O aviso indica que não existe persistência confirmada. Restaurar requer acesso ao storage; não promete guardar arquivos quando ele está indisponível. Nenhum arquivo é enviado a servidor.

## Carregamento e verificação

O catálogo já contém o aprendizado dos Pokémon jogáveis. O navegador não usa TeamValidator nem consulta learnsets completos do Showdown; removê-los somente no build reduz o JavaScript principal de 9.145,58 para 5.419,27 kB, gzip de 1.465,97 para 1.010,02 kB. Movimentos, espécies, habilidades, itens, regras, scripts e gerações ficam intactos. O gerador Node conserva as tabelas completas.

`npm run verify` roda arquitetura, todos os 171 testes, 166 novamente com o motor empacotado pela mesma transformação e o build web. Os cinco testes restantes são do gerador de aprendizado Node, onde as tabelas são necessárias. Um check falha se src passar a usar APIs removidas; nesse caso restaurar as tabelas ou usar o catálogo pré-compilado. Não ampliar a remoção para dados de combate.

Na comparação em Edge emulado, viewport 390×844, CPU 4×, download 200 KB/s, latência 80 ms, gzip e cache desligado, três pares alternados deram mediana de formulário/fontes prontos de 10,97→9,03 segundos. Heap observado na etapa caiu de 33,34→17,03 MB. É um cenário de laboratório, não uma promessa para todo aparelho/rede. Amostras completas em [performance-0.19.0.json](balance/performance-0.19.0.json).

Partículas são as artes reais de FRLG, mas trajetórias/tempos/famílias são adaptações próprias. Efeitos sonoros são síntese própria, não gravações de cada ataque do cartucho. Sem confirmação em telefone físico/iOS nesta rodada. Evidências, falhas deliberadas e campanhas de auditoria estão em [VALIDACAO](../VALIDACAO.md); próximos passos em [ROADMAP](ROADMAP.md).
