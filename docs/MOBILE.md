# Pokébobo no celular — 0.20.1

Jogue na vertical para ter mais espaço de leitura; a horizontal também acomoda os comandos. Cabeçalho, navegação, ferramentas de batalha e volumes têm área de toque de pelo menos 44 px em aparelhos com ponteiro de toque. Em 320 px, a lente do cabeçalho fica oculta para conservar os seis controles.

As janelas acompanham a área visível quando o teclado abre. O nome do treinador e a busca da Pokédex continuam acessíveis; o gesto de zoom conserva o comportamento nativo. Recortes e barra inferior do aparelho são reservados pelo layout. Dentro de uma janela, tocar seu espaçamento ou arrastar não fecha; toque completo no fundo, Fechar ou Escape encerram janelas dispensáveis.

Na evolução do Eevee, role as oito opções, escolha uma e confirme no rodapé. A opção escolhida só altera o Pokémon após confirmar. Na horizontal curta, captura e exploração ganham composição compacta; regras de movimento, 50 passos invisíveis e captura de 67% permanecem.

Para reabrir sem conexão, espere a confirmação em **Opções → Leve o Pokébobo com você**. Código/fontes/campo ficam disponíveis após preparo; sprites/músicas usados são guardados em cache limitado. Conteúdo novo ou removido pelo navegador pode precisar de rede. A leitura dos arquivos locais também aceita servidores com `Vary: Origin`; atualizações aguardam o fim da sessão, sem recarga no meio da partida.

Implementação: `src/app/hooks/useVisualViewport.js`, `src/components/ui/Modal.jsx` e `src/styles/responsive/pokedex/mobile-ergonomics.css`. O hook limpa seus eventos/variáveis ao desmontar; sem VisualViewport, permanece o layout por `dvh`. Regras e schema 4 não mudaram.

[Validação](../VALIDACAO.md) cobre Edge e WebKit Windows com toques/visores emulados, teclado/recortes sintéticos e offline real em Edge. Ainda falta conferir Android/iPhone físicos, teclado do sistema e instalação no aparelho. Essas simulações não certificam Safari/iOS.
