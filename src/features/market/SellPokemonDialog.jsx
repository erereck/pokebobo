import { Modal } from "../../components/ui/Modal.jsx";
import { Sprite } from "../../components/pokemon/Sprite.jsx";
import { canSellPokemon, pokemonSalePrice } from "../../game/market/market.js";
import { formatMoney } from "./formatMoney.js";

export function SellPokemonDialog({ mon, run, act, onClose }) {
  const price = pokemonSalePrice(mon);
  const reserve = run.box?.some((candidate) => candidate.id === mon.id);
  return (
    <Modal title="Confirmar venda" className="market-dialog" onClose={onClose}>
      <div className="market-partner">
        <Sprite name={mon.name} shiny={mon.shiny} />
        <div>
          <span className="section-label">
            {reserve ? "RESERVA" : "EQUIPE"} · NV. {mon.level}
          </span>
          <h3>{mon.name}</h3>
        </div>
      </div>
      <p>
        {mon.name} sairá da sua {reserve ? "reserva" : "equipe"}{" "}
        definitivamente. O registro na Pokédex continua com você.
      </p>
      <dl className="market-receipt">
        <div>
          <dt>Você recebe</dt>
          <dd>{formatMoney(price)}</dd>
        </div>
        <div>
          <dt>Saldo após a venda</dt>
          <dd>{formatMoney((run.money || 0) + price)}</dd>
        </div>
      </dl>
      <div className="market-dialog-actions">
        <button className="button secondary full" onClick={onClose}>
          Manter Pokémon
        </button>
        <button
          className="button danger full"
          disabled={!canSellPokemon(run, mon.id)}
          onClick={() => {
            if (act({ type: "MARKET_SELL", monId: mon.id })) onClose();
          }}
        >
          Vender por {formatMoney(price)}
        </button>
      </div>
    </Modal>
  );
}
