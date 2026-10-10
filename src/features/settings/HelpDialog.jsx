import { Modal } from "../../components/ui/Modal.jsx";
import { CoverCredits } from "./CoverCredits.jsx";
import { GYMS } from "../../game/data/gyms/index.js";
import { PROGRESSION } from "../../game/config/progression.js";

export function HelpDialog({ setModal }) {
  return (
    <Modal title="Seu guia de bolso" onClose={() => setModal(null)}>
      <div className="help-content">
        <h3>Controles da Pokédex</h3>
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
          desativados enquanto uma janela estiver aberta. Trocar e o registro
          completo ficam junto dos golpes.
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
          <li>Qualquer derrota encerra a run. Não existe revanche.</li>
          <li>
            Depois de oito insígnias: quatro membros da Elite e um campeão
            sorteados. Vencer libera Correria e Nuzlocke.
          </li>
        </ol>
        <p>
          Seu time se recupera após vitórias. Em Nuzlocke, os Pokémon que caíram
          são removidos. Sem sobreviventes, a run termina mesmo que o adversário
          também tenha caído. Preparar equipa uma berry de cura em cada
          integrante ativo; entrar na reserva remove o item preparado.
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
          você escolhe qual esquecer; no Automático, o jogo recalcula sozinho os
          até quatro melhores golpes disponíveis sempre que o Pokémon sobe de
          nível ou evolui. Evoluções normais e especiais acontecem por nível:
          troca, pedra, amizade e outras condições foram comprimidas em níveis
          diretos para manter a run rápida.
        </p>
        <h3>Feito com projetos abertos</h3>
        <p>
          Fontes locais: Silkscreen, DM Sans e Space Grotesk (SIL Open Font
          License).
        </p>
        <CoverCredits />
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
