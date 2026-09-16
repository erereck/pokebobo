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
          Na Equipe, selecione um Pokémon para ver seus golpes e mudar o líder
          entre batalhas. Na Mochila, confira os itens e o custo em semanas
          antes de usar uma ação.
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
            níveis a todos. Viagens não dão níveis. Vencer um ginásio ou membro
            da Liga dá +{PROGRESSION.gymVictoryLevels} nível. Emboscadas não dão
            níveis.
          </li>
          <li>
            O 1º ginásio do draft sempre é um 1º ginásio dos jogos; a mesma
            regra vale até o 8º. Os níveis vêm da edição indicada. Se seu mais
            forte estiver 10 níveis acima do ás do líder, toda a equipe do líder
            recebe +6, uma única vez.
          </li>
          <li>
            Equipe cheia? Escolha quem sai antes de tentar uma nova captura. Se
            falhar, ninguém sai.
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
          integrante.
        </p>
        <h3>Sobre este primeiro protótipo</h3>
        <p>
          {GYMS.length} ginásios, 7 conjuntos de iniciais, 11 membros de Elite e
          3 campeões. Kalos fica de fora. As espécies dos times da Liga vêm dos
          jogos indicados; níveis e golpes são adaptados à run. Batalhas singles
          com regras da geração 8, sem Dynamax. Mossdeep, originalmente uma
          batalha em dupla, usa o mesmo elenco em combate singles aqui.
        </p>
        <p>
          Golpes são selecionados automaticamente por nível, com a mesma regra
          para os dois lados. Golpes de lembrete da evolução não antecipam o que
          a pré-evolução aprende mais tarde; golpes exclusivos de reaprendizagem
          ficam fora da seleção automática. Evoluções simples por nível já
          acontecem; evoluções por troca, pedra e condições especiais ficam para
          uma próxima versão.
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
