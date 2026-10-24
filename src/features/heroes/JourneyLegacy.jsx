import { HeroSummary } from "./HeroSummary.jsx";
import { Sprite } from "../../components/pokemon/Sprite.jsx";
import { pokemonName } from "../../game/heroes/heroes.js";
import { RIVALS } from "../../game/data/rivals.js";
import { countLabel } from "../../shared/countLabel.js";

export function JourneyLegacy({ record }) {
  if (!record) return null;
  const memorial = (record.heroes || []).filter(
    (mon) => mon.status === "fallen",
  );
  const rival = RIVALS.find((p) => p.id === record.rival?.profile);
  return (
    <div className="journey-legacy">
      <HeroSummary hero={record.hero} />
      {memorial.length > 0 && (
        <details className="journey-memorial">
          <summary>
            Em memória de {countLabel(memorial.length, "parceiro", "parceiros")}
          </summary>
          <div>
            {memorial.map((mon) => (
              <div key={mon.id}>
                <Sprite name={mon.name} shiny={mon.shiny} />
                <span>
                  <b>{pokemonName(mon)}</b>
                  <small>
                    {mon.nickname ? `${mon.name} · ` : ""}Nv. {mon.level} ·{" "}
                    {countLabel(
                      mon.knockouts,
                      "nocaute direto",
                      "nocautes diretos",
                    )}
                  </small>
                </span>
              </div>
            ))}
          </div>
        </details>
      )}
      {rival && (
        <p className="rival-record">
          Você e {rival.name} ·{" "}
          {countLabel(
            record.rival.victories.length,
            "revanche vencida",
            "revanches vencidas",
          )}
          .
        </p>
      )}
      {record.hero && (
        <small className="hero-explanation">
          Destaque por nocautes diretos; empates consideram vitórias após
          resistir com 1 HP e vitórias em campo.
        </small>
      )}
    </div>
  );
}
