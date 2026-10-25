import { Modal } from "../../components/ui/Modal.jsx";
import { CoverCredits } from "./CoverCredits.jsx";
import { GYMS } from "../../game/data/gyms/index.js";
import { PROGRESSION } from "../../game/config/progression.js";

export function HelpDialog({ setModal }) {
  return (
    <Modal title="Seu guia de bolso" onClose={() => setModal(null)}>
      <div className="help-content">
        <h3>Controles da Pokédex</h3>
        <p>Fora da trilha oferece a Caverna dos Ecos após duas insígnias e as Ruínas da Aurora após cinco, até a sétima. Cada lugar tem três salas e custa uma semana pela visita inteira. Sair conserva os achados e encerra a visita; o guardião é opcional e derrota encerra a jornada. A passagem no começo das rotas aproveita a semana já gasta, antes de resolver um encontro naquela caminhada.</p>
        <p>
          O botão Som no topo ativa ou silencia tudo. Em Opções → Som e
          playlist, ajuste música, efeitos e cries separadamente. Seguir o jogo
          escolhe a trilha de cada cena; Playlist livre toca as 20 músicas de
          FireRed / LeafGreen em sequência. A escolha fica lembrada entre os
          três slots.
        </p>
        <p>
          A Pokédex reúne os registros dos três slots. Consulte o progresso por
          região e combine filtros de tipo e variante; quando registrar normal e
          shiny da mesma espécie, use Comparar na ficha.
        </p>
        <p>
          Ao terminar uma jornada, use Compartilhar jornada para baixar o cartão
          ou copiar o convite. O QR e o link levam às mesmas cidades e modo; seu
          amigo escolhe o inicial. Você também pode colar o convite ou uma seed
          em Nova aventura ou Opções → Jogar desafio de um amigo.
        </p>
        <p>
          Use as cinco teclas inferiores para abrir Jornada, Equipe, Mapa,
          Mochila e Diário. Durante uma luta, Jornada vira Batalha para você
          voltar aos comandos.
        </p>
        <p>
          O botão ao lado da Pokédex abre o jogo em tela cheia quando o
          navegador oferece esse recurso. Use o mesmo botão ou Esc para sair. Na
          exploração, segure setas, WASD ou os botões de direção para continuar
          caminhando; abrir uma janela interrompe o movimento.
        </p>
        <p>
          Na Equipe, selecione um Pokémon para ver seus golpes, mudar o líder e
          alternar entre Ficha e golpes e Reserva. Fora de combate, arraste o{" "}
          <b>⋮⋮</b> da Equipe Conectada para mudar a ordem. Durante uma batalha,
          ela mostra o HP ao vivo dos seis e permite arrastar um Pokémon apto
          para o que está em campo para realizar a troca.
        </p>
        <p>
          Quando um Pokémon alcançar o nível de um golpe novo, a Pokédex abre
          uma decisão rápida. Você pode aprender em uma vaga livre, escolher
          qual dos quatro golpes esquecer ou ignorar o golpe novo.
        </p>
        <p>
          No PC, as teclas 1 a 4 escolhem os golpes. Os atalhos ficam
          desativados enquanto uma janela estiver aberta. Trocar e o caderno
          ficam junto dos golpes. O caderno reúne o registro, precisão,
          prioridade, efeitos dos seus golpes e os estágios dos Pokémon em
          campo. Pular resolve a animação do turno inteiro; abrir outra tela
          também aplica o comando que você já escolheu.
        </p>
        <p>
          <b>Monte a região. Sobreviva às consequências.</b> Escolha uma origem,
          um parceiro, uma cidade de passagem e oito ginásios.
        </p>
        <ol>
          <li>
            Cada ação de preparação gasta uma semana. Você tem até três por
            cidade.
          </li>
          <li>
            Ao esgotar o tempo, a viagem ou o desafio ao ginásio começa
            automaticamente.
          </li>
          <li>
            Explorar gasta uma semana para a caminhada inteira. Use as setas,
            WASD ou as casas vizinhas; entre e saia do mato alto. Cada passo
            pode revelar um Pokémon. Cada encontro permite novas tentativas
            enquanto houver Poké Bolas (67% de chance base por lançamento). Sair
            da rota resolve o fim da semana.
          </li>
          <li>
            Treinar dá de {PROGRESSION.trainingMin} a {PROGRESSION.trainingMax}{" "}
            níveis aos seis ativos e aos Pokémon da reserva. Viagens não dão
            níveis. Vencer um ginásio ou membro da Liga dá +
            {PROGRESSION.gymVictoryLevels} nível; a reserva acompanha esse
            ganho. Emboscadas não dão níveis.
          </li>
          <li>
            O 1º ginásio do draft sempre é um 1º ginásio dos jogos; a mesma
            regra vale até o 8º. Os níveis vêm da edição indicada. Se seu mais
            forte estiver 10 níveis acima do ás do líder, toda a equipe do líder
            recebe +6, uma única vez.
          </li>
          <li>
            A equipe comporta seis e a reserva mais três. Com seis ativos e vaga
            na reserva, uma captura pode ir direto para a box. Só com as nove
            vagas ocupadas alguém precisa sair definitivamente.
          </li>
          <li>
            Vencer o terceiro ginásio concede a Fishing Rod. Surf libera na
            quinta insígnia. Aproxime-se do lago e escolha um dos métodos: eles
            compartilham uma oportunidade por rota, sem outra semana ou
            consumível.
          </li>
          <li>
            Qualquer derrota encerra a run. Não é possível tentar a mesma luta
            novamente.
          </li>
          <li>
            Escolha um rival antes de partir. Após 2, 5 e 8 insígnias, uma
            revanche opcional oferece equipamento. O inicial dele evolui ao
            longo da jornada. Não gasta semana nem dá níveis extras; uma derrota
            encerra a run. Cada marco tem uma recompensa e não acumula revanches
            anteriores.
          </li>
          <li>
            Depois da oitava insígnia, o Mercado da Liga permite vender Pokémon
            da equipe ou reserva e comprar TMs de uso único. Nível e atributos
            da espécie definem o valor. Escolha um Pokémon compatível e o golpe
            substituído para concluir a compra; cancelar não cobra nada. Há uma
            unidade de cada TM. Mantenha pelo menos um Pokémon ativo. Seguir
            para a Elite 4 encerra as compras. Então vêm quatro membros da Elite
            e um campeão sorteados. Vencer libera Correria e Nuzlocke.
          </li>
          <li>
            O Mercado também vende Rare Candy por ₽ 700: escolha um Pokémon da
            equipe ou reserva para ganhar +1 nível na hora. Você pode comprar
            mais enquanto houver saldo. No nível 100, o uso fica bloqueado.
            Evoluções e novos golpes seguem as escolhas normais do jogo.
          </li>
        </ol>
        <p>
          Seu time se recupera após vitórias. Em Nuzlocke, os Pokémon que caíram
          são removidos. Sem sobreviventes, a run termina mesmo que o adversário
          também tenha caído. Preparar dá uma Sitrus Berry a cada integrante
          ativo sem item, sem substituir equipamentos. Entrar na reserva remove
          berries preparadas, mas conserva Leftovers, Focus Sash e Choice Scarf.
          Ao vender ou liberar um Pokémon, o equipamento volta à mochila. No
          Nuzlocke, equipamentos que ainda restarem com quem caiu também voltam
          após uma vitória.
        </p>
        <p>
          Equipamentos podem ser comprados no Mercado e transferidos sem semana
          pela Equipe ou Mochila entre batalhas, inclusive durante a Liga.
          Leftovers custa ₽ 1.200, Focus Sash ₽ 700 e Choice Scarf ₽ 1.000, uma
          unidade de cada por jornada. Focus Sash é consumido ao ativar; os
          outros não. Berries retiradas são descartadas.
        </p>
        <p>
          Na ficha da Equipe você pode dar apelidos e acompanhar nocautes por
          golpes diretos, vitórias em campo e vitórias após resistir a um golpe
          com 1 HP. O Hall destaca um parceiro e preserva um memorial no
          Nuzlocke. Feitos são cosméticos; dano residual não conta como nocaute
          direto e bancos que não entraram não ganham participação.
        </p>
        <p>
          Na Correria, cada treino rende +2 a +4 níveis para compensar as duas
          semanas por cidade. Evoluções ramificadas, como Eevee e Pikachu, abrem
          uma escolha com tipos e especialidades. Você pode adiar e reabrir a
          decisão na ficha da equipe.
        </p>
        <h3>Pokédex e encontros secretos</h3>
        <p>
          O botão Pokédex registra capturas, iniciais e evoluções com as
          jornadas de origem nos três slots. Registros novos permanecem mesmo
          quando o Pokémon sai da equipe. Saves antigos só podem recuperar as
          espécies que ainda constavam nas equipes conhecidas.
        </p>
        <p>
          Missões de exploração podem revelar Mew ou Suicune depois de seis
          insígnias. Há uma única oportunidade de lendário por run, com 48% de
          chance base e nível abaixo do desafio. O evento do contrabandista
          permite roubar um Eevee uma vez por run, após vencer uma batalha real.
          A tentativa de captura usa uma bola e é garantida.
        </p>
        <h3>Saves e Hall da Fama</h3>
        <p>
          O aparelho oferece três slots independentes para pessoas diferentes
          jogarem sem sobrescrever a carreira umas das outras. O Hall da Fama é
          único do navegador: jornadas encerradas em qualquer slot aparecem
          juntas no mesmo arquivo.
        </p>
        <p>
          Em Opções, use Exportar Slot para guardar um backup JSON. Restaurar
          backup mostra a jornada e deixa escolher o slot de destino. Os outros
          slots ficam intactos; o conteúdo anterior do destino fica como cópia
          de recuperação quando era válido. Se o navegador bloquear o save,
          exporte antes de fechar.
        </p>
        <h3>Sobre este protótipo</h3>
        <p>
          {GYMS.length} ginásios, 7 conjuntos de iniciais, 11 membros de Elite e
          3 campeões. Kalos fica de fora. As espécies dos times da Liga vêm dos
          jogos indicados; níveis e golpes são adaptados à run. Batalhas singles
          com regras da geração 8, sem Dynamax. Mossdeep, originalmente uma
          batalha em dupla, usa o mesmo elenco em combate singles aqui.
        </p>
        <p>
          O adversário recebe golpes automaticamente pelo nível. Em cada save,
          você escolhe como o seu time aprende ataques: no modo Manual, vagas
          livres são preenchidas sem interromper a run e, com quatro golpes,
          você escolhe qual esquecer; no Automático, o jogo preenche os espaços
          livres com golpes disponíveis sempre que o Pokémon sobe de nível ou
          evolui, preservando as TMs ensinadas que continuam equipadas.
          Evoluções normais e especiais acontecem por nível: troca, pedra,
          amizade e outras condições foram comprimidas em níveis diretos para
          manter a run rápida.
        </p>
        <h3>Feito com projetos abertos</h3>
        <p>
          Shinies: cada inicial escolhido e novo encontro, incluindo pesca e
          eventos, tem chance de 1/1024. A marca permanece na captura, reserva e
          evolução. Novas tentativas contra o mesmo Pokémon não sorteiam de
          novo; shiny muda as cores, sem bônus de atributos ou captura.
        </p>
        <p>
          Fontes locais: Silkscreen, DM Sans e Space Grotesk (SIL Open Font
          License).
        </p>
        <CoverCredits />
        <p>
          Partículas dos golpes: gráficos de FireRed / LeafGreen via
          pret/pokefirered, com tempos e trajetórias adaptados para o Pokébobo.{" "}
          <a
            href={`${import.meta.env.BASE_URL}battle-effects/README.md`}
            target="_blank"
            rel="noreferrer"
          >
            Fontes e créditos dos efeitos
          </a>
          .
        </p>
        <p>
          Música e fanfares: Pokémon FireRed / LeafGreen, Go Ichinose, Junichi
          Masuda e Morikazu Aoki; gravação publicada por F4m1LyGuy10, obtida com
          yt-dlp. Cries reais via Pokémon Showdown. Efeitos de ações
          sintetizados para o Pokébobo. Tudo local, com volume padronizado na
          trilha e pausa ao sair da aba.{" "}
          <a
            href={`${import.meta.env.BASE_URL}audio/README.md`}
            target="_blank"
            rel="noreferrer"
          >
            Fontes, processamento e termos do áudio
          </a>
          .
        </p>
        <p>
          Sprites 2D de batalha: gráficos de Game Freak / Nintendo / The Pokémon
          Company e adaptações em pixel art dos artistas da comunidade, via{" "}
          <a
            href="https://github.com/smogon/sprites"
            target="_blank"
            rel="noreferrer"
          >
            Smogon / Pokémon Showdown
          </a>
          . Frente e costas locais, incluindo shinies; escolha 2D ou 3D em
          Opções.
        </p>
        <p>
          Tiles e treinador da exploração: Pokémon FireRed / LeafGreen, Game
          Freak / Nintendo / The Pokémon Company, via{" "}
          <a
            href="https://github.com/pret/pokefirered"
            target="_blank"
            rel="noreferrer"
          >
            pret/pokefirered
          </a>
          . A grade de rotas é gerada pelo Pokébobo; não representa mapas
          oficiais.
        </p>
        <p>
          <a
            href="https://github.com/pkmn/ps/tree/main/sim"
            target="_blank"
            rel="noreferrer"
          >
            Pokémon Showdown / @pkmn/sim (MIT)
          </a>{" "}
          ·{" "}
          <a
            href="https://github.com/PokeAPI/sprites"
            target="_blank"
            rel="noreferrer"
          >
            Sprites via PokéAPI
          </a>{" "}
          ·{" "}
          <a href="https://lucide.dev" target="_blank" rel="noreferrer">
            Lucide (ISC)
          </a>
          .
        </p>
        <p>
          <a
            href={`${import.meta.env.BASE_URL}licenses/qrcode-MIT.txt`}
            target="_blank"
            rel="noreferrer"
          >
            QR code: node-qrcode (MIT)
          </a>{" "}
          ·{" "}
          <a
            href={`${import.meta.env.BASE_URL}licenses/dijkstrajs-MIT.txt`}
            target="_blank"
            rel="noreferrer"
          >
            dijkstrajs (MIT)
          </a>
          .
        </p>
        <p>
          Inspirado em{" "}
          <a
            href="https://github.com/erereck/futbobo"
            target="_blank"
            rel="noreferrer"
          >
            Futbobo
          </a>{" "}
          e{" "}
          <a
            href="https://github.com/erereck/gamebobo"
            target="_blank"
            rel="noreferrer"
          >
            Gamebobo
          </a>
          . Projeto de fã; Pokémon e seus personagens pertencem aos respectivos
          titulares.
        </p>
      </div>
    </Modal>
  );
}
