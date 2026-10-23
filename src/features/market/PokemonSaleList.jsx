import catalog from "../../game/catalog.json" with { type: "json" };
import { Sprite } from "../../components/pokemon/Sprite.jsx";
import { ShinyMark } from "../../components/pokemon/ShinyMark.jsx";
import { TypeTag } from "../../components/pokemon/TypeTag.jsx";
import { canSellPokemon, pokemonSalePrice } from "../../game/market/market.js";
import { formatMoney } from "./formatMoney.js";

export function PokemonSaleList({ run, onSell }) {
  return (
    <div className="market-inventory">
      <div className="market-intro">
        <h2>Quem segue com você?</h2>
        <p>
          Nível e atributos da espécie definem o valor. A venda é definitiva; o
          registro na Pokédex permanece.
        </p>
      </div>
      {[
        ["Equipe", run.party],
        ["Reserva", run.box || []],
      ].map(([label, mons]) => (
        <section
          className="market-roster"
          key={label}
          aria-label={label + " à venda"}
        >
          <div className="section-head">
            <h3>{label}</h3>
            <span className="section-label">{mons.length} POKÉMON</span>
          </div>
          {!mons.length && (
            <p className="market-empty">Nenhum Pokémon na reserva.</p>
          )}
          {mons.map((mon) => {
            const canSell = canSellPokemon(run, mon.id);
            return (
              <article className="market-mon" key={mon.id}>
                <Sprite name={mon.name} shiny={mon.shiny} />
                <div className="market-mon-info">
                  <strong>
                    {mon.name} <ShinyMark shiny={mon.shiny} />
                  </strong>
                  <small>
                    Nv. {mon.level}
                    {run.party[0]?.id === mon.id ? " · Líder" : ""}
                  </small>
                  <div className="types">
                    {catalog[mon.name].types.map((type) => (
                      <TypeTag key={type} type={type} />
                    ))}
                  </div>
                  {!canSell && (
                    <small className="market-locked">
                      Seu último Pokémon ativo precisa ficar.
                    </small>
                  )}
                </div>
                <button
                  className="button secondary market-sell-button"
                  disabled={!canSell}
                  onClick={() => onSell(mon.id)}
                  aria-label={`Vender ${mon.name} por ${formatMoney(pokemonSalePrice(mon))}`}
                >
                  <small>VENDER POR</small>
                  <strong>{formatMoney(pokemonSalePrice(mon))}</strong>
                </button>
              </article>
            );
          })}
        </section>
      ))}
    </div>
  );
}
