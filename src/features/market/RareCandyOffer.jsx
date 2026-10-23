import { Candy } from "lucide-react";
import { MARKET_RARE_CANDY } from "../../game/config/market.js";
import { PROGRESSION } from "../../game/config/progression.js";
import { formatMoney } from "./formatMoney.js";

export function RareCandyOffer({ run, onChoose }) {
  const eligible = [...run.party, ...(run.box || [])].some(
    (mon) => mon.level < PROGRESSION.maxLevel,
  );
  const shortfall = MARKET_RARE_CANDY.price - (run.money || 0);
  return (
    <article
      className="market-tm market-candy"
      aria-label="Oferta de Rare Candy"
    >
      <div className="market-tm-title">
        <Candy size={24} aria-hidden="true" />
        <h2>Rare Candy</h2>
        <span className="tag">+{MARKET_RARE_CANDY.levels} NÍVEL</span>
      </div>
      <p>
        Aumente o nível de um Pokémon da equipe ou reserva. Escolha quem recebe
        e use na hora. Você pode comprar mais enquanto houver saldo.
      </p>
      <div className="market-tm-bottom">
        <small>
          {!eligible
            ? "Todos no nível máximo"
            : shortfall > 0
              ? `Faltam ${formatMoney(shortfall)}`
              : "Um doce, um Pokémon"}
        </small>
        <button
          className="button secondary"
          disabled={!eligible || shortfall > 0}
          onClick={onChoose}
          aria-label={`Comprar Rare Candy por ${formatMoney(MARKET_RARE_CANDY.price)}`}
        >
          {formatMoney(MARKET_RARE_CANDY.price)}
        </button>
      </div>
    </article>
  );
}
