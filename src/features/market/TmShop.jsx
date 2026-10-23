import { Check, Disc3 } from "lucide-react";
import { MARKET_TMS } from "../../game/config/market.js";
import { tmEligibility } from "../../game/market/market.js";
import { TypeTag } from "../../components/pokemon/TypeTag.jsx";
import { MoveSummary } from "../team/MoveSummary.jsx";
import { formatMoney } from "./formatMoney.js";

export function TmShop({ run, onChoose }) {
  const roster = [...run.party, ...(run.box || [])];
  return (
    <div className="market-inventory">
      <div className="market-intro">
        <h2>Um disco. Um novo golpe.</h2>
        <p>
          Uma unidade de cada TM. Escolha quem aprende na compra; o disco é
          consumido na hora.
        </p>
      </div>
      <div className="market-tms">
        {MARKET_TMS.map((tm) => {
          const sold = run.marketPurchases?.includes(tm.id);
          const eligible = roster.filter(
            (mon) => tmEligibility(mon, tm.id) === "Pode aprender",
          );
          const shortfall = tm.price - (run.money || 0);
          const status = sold
            ? "TM utilizada"
            : !eligible.length
              ? "Sem Pokémon compatível"
              : shortfall > 0
                ? `Faltam ${formatMoney(shortfall)}`
                : `${eligible.length} ${eligible.length === 1 ? "Pokémon pode" : "Pokémon podem"} aprender`;
          return (
            <article
              className={"market-tm" + (sold ? " is-sold" : "")}
              key={tm.id}
            >
              <div className="market-tm-title">
                <Disc3 size={24} aria-hidden="true" />
                <h3>{tm.name}</h3>
                <TypeTag type={tm.type} />
              </div>
              <MoveSummary id={tm.id} explain />
              <div className="market-tm-bottom">
                <small>
                  {sold && <Check size={14} />} {status}
                </small>
                <button
                  className="button secondary"
                  disabled={sold || !eligible.length || shortfall > 0}
                  onClick={() => onChoose(tm)}
                  aria-label={`Comprar TM ${tm.name} por ${formatMoney(tm.price)}`}
                >
                  {sold ? "Utilizada" : formatMoney(tm.price)}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
