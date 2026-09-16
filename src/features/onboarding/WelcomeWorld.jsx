import { RouteCover } from "../../components/scenery/RouteCover.jsx";
import { Sprite } from "../../components/pokemon/Sprite.jsx";
import { Ball } from "../../components/icons/Ball.jsx";
export function WelcomeWorld() {
  return (
    <section className="title-screen">
      <div className="title-screen-status">
        <span>
          <i /> SISTEMA ONLINE
        </span>
        <span>AVENTURA / 001</span>
      </div>
      <div className="title-scene">
        <RouteCover place={{ biome: "meadow" }} />
        <div className="title-overlay" />
        <div className="title-copy">
          <span className="title-kicker">SUA PRÓXIMA AVENTURA</span>
          <h1>
            poké
            <br />
            <span>bobo</span>
            <i>.</i>
          </h1>
          <p>
            Crie sua região.
            <br />
            Conquiste a Liga.
          </p>
        </div>
        <div className="title-starters">
          <Sprite name="Bulbasaur" />
          <Sprite name="Charmander" />
          <Sprite name="Squirtle" />
        </div>
        <span className="title-cartridge">
          <Ball size={16} /> UMA RUN. OITO INSÍGNIAS.
        </span>
      </div>
      <div className="title-instructions">
        <span>
          <b>01</b> ESCOLHA O CAMINHO
        </span>
        <span>
          <b>02</b> MONTE O TIME
        </span>
        <span>
          <b>03</b> ENFRENTE A LIGA
        </span>
      </div>
    </section>
  );
}
