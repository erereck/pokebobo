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
          Na Equipe, selecione um Pokémon para ver seus golpes, mudar o líder e
          gerenciar a reserva. Fora de combate, arraste o <b>⋮⋮</b> da Equipe
          Conectada para mudar a ordem. Durante uma batalha, ela mostra o HP ao
          vivo dos seis e permite arrastar um Pokémon apto para o que está em
          campo para realizar a troca.
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
            Cada rota oferece duas espécies. As cidades conectadas mudam os
            encontros. Explorar custa uma semana e permite uma tentativa de
            captura (86%).
          </li>
          <li>
            Treinar dá de {PROGRESSION.trainingMin} a {PROGRESSION.trainingMax}{" "}
            níveis aos seis ativos e aos Pokémon da reserva. Viagens não dão
            níveis. Vencer um ginásio ou membro da Liga dá +
            {PROGRESSION.gymVictoryLevels} nível; a reserva acompanha esse ganho.
            Emboscadas não dão níveis.
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
          O adversário recebe golpes automaticamente pelo nível. O seu time usa
          os golpes que você escolheu durante a carreira. Evoluções normais e
          especiais acontecem por nível: troca, pedra, amizade e outras
          condições foram comprimidas em níveis diretos para manter a run rápida.
        </p>
        <h3>Feito com projetos abertos</h3>
        <p>
          Fontes locais: Silkscreen, DM Sans e Space Grotesk (SIL Open Font
          License).
        </p>
        <CoverCredits />
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
