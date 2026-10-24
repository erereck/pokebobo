import { Award } from "lucide-react";
import { Sprite } from "../../components/pokemon/Sprite.jsx";
import { pokemonName } from "../../game/heroes/heroes.js";
import { countLabel } from "../../shared/countLabel.js";

export function HeroSummary({ hero }) {
  if (!hero) return null;
  return (
    <section className="journey-hero" aria-label="Destaque da jornada">
      <Sprite name={hero.name} shiny={hero.shiny} />
      <div>
        <span className="section-label">
          <Award size={13} /> DESTAQUE DA JORNADA
        </span>
        <h3>
          {pokemonName(hero)}
          <small>{hero.nickname ? hero.name : ""}</small>
        </h3>
        <span className="hero-epithet">{hero.epithet}</span>
        <p>
          {countLabel(hero.knockouts, "nocaute direto", "nocautes diretos")} ·{" "}
          {countLabel(hero.wins, "vitória em campo", "vitórias em campo")}
          {hero.clutches
            ? ` · ${countLabel(hero.clutches, "vitória", "vitórias")} após resistir com 1 HP`
            : ""}
        </p>
        {hero.status === "fallen" && (
          <small>Seu nome também fica no memorial.</small>
        )}
        {["sold", "released"].includes(hero.status) && (
          <small>Seguiu outro caminho. O que fez continua aqui.</small>
        )}
      </div>
    </section>
  );
}
