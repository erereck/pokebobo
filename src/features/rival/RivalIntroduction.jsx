import { RIVALS } from "../../game/data/rivals.js";
import { rivalProfile } from "../../game/rival/rival.js";
import { Sprite } from "../../components/pokemon/Sprite.jsx";

export function RivalIntroduction({ run, act }) {
  const rival = rivalProfile(run);
  if (!rival) return null;
  return (
    <section
      className="rival-introduction"
      aria-label="Escolher rival da jornada"
    >
      <div className="section-head">
        <h3>Uma amizade. Três revanches.</h3>
      </div>
      <div className="rival-profiles" role="group" aria-label="Seu rival">
        {RIVALS.map((profile) => (
          <button
            key={profile.id}
            aria-pressed={rival.id === profile.id}
            onClick={() => act({ type: "RIVAL_CHOOSE", profile: profile.id })}
          >
            <strong>{profile.name}</strong>
            <small>{profile.style}</small>
          </button>
        ))}
      </div>
      <div className="rival-intro-copy">
        <Sprite name={run.rival.starter} />
        <p>
          <b>
            {rival.name} & {run.rival.starter}
          </b>
          <span>“{rival.intro}”</span>
        </p>
      </div>
      <small>
        Revanches opcionais após 2, 5 e 8 insígnias. Uma derrota encerra a
        jornada.
      </small>
    </section>
  );
}
