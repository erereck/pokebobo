import { useState } from "react";
import { Candy, Check } from "lucide-react";
import { Modal } from "../../components/ui/Modal.jsx";
import { Sprite } from "../../components/pokemon/Sprite.jsx";
import { MARKET_RARE_CANDY } from "../../game/config/market.js";
import { PROGRESSION } from "../../game/config/progression.js";
import { formatMoney } from "./formatMoney.js";
import { pokemonName } from "../../game/heroes/heroes.js";

export function RareCandyDialog({ run, act, onClose }) {
  const [monId, setMonId] = useState(null);
  const roster = [...run.party, ...(run.box || [])];
  const mon = roster.find((candidate) => candidate.id === monId);
  const canBuy =
    mon &&
    mon.level < PROGRESSION.maxLevel &&
    (run.money || 0) >= MARKET_RARE_CANDY.price;
  return (
    <Modal
      title="Comprar e usar Rare Candy"
      className="market-dialog"
      onClose={onClose}
    >
      <div className="new-move-card">
        <div>
          <Candy size={20} aria-hidden="true" />
          <strong>+{MARKET_RARE_CANDY.levels} nível em um Pokémon</strong>
        </div>
        <p className="move-summary">
          Uso imediato. Evoluções e novos golpes seguem as regras do jogo.
        </p>
      </div>
      <h3 className="market-step">Quem vai receber?</h3>
      <div className="market-recipients">
        {roster.map((candidate) => {
          const atCap = candidate.level >= PROGRESSION.maxLevel;
          return (
            <button
              className="market-recipient"
              key={candidate.id}
              disabled={atCap}
              aria-pressed={monId === candidate.id}
              onClick={() => setMonId(candidate.id)}
            >
              <Sprite name={candidate.name} shiny={candidate.shiny} />
              <span>
                <strong>{pokemonName(candidate)}</strong>
                <small>
                  {candidate.nickname ? `${candidate.name} · ` : ""}
                  {run.box?.some((reserve) => reserve.id === candidate.id)
                    ? "Reserva"
                    : "Equipe"}{" "}
                  · Nv. {candidate.level}
                  {!atCap && ` → ${candidate.level + MARKET_RARE_CANDY.levels}`}
                </small>
                <small>
                  {atCap ? "Nível máximo" : "+1 nível ao confirmar"}
                </small>
              </span>
              {monId === candidate.id && <Check size={18} aria-hidden="true" />}
            </button>
          );
        })}
      </div>
      <footer className="market-confirm">
        <p>
          {mon
            ? `${pokemonName(mon)} receberá +${MARKET_RARE_CANDY.levels} nível. `
            : "Escolha um Pokémon para concluir. "}
          Saldo após a compra:{" "}
          <strong>
            {formatMoney((run.money || 0) - MARKET_RARE_CANDY.price)}
          </strong>
          .
        </p>
        <button
          className="button primary full"
          disabled={!canBuy}
          onClick={() => {
            if (act({ type: "MARKET_BUY_CANDY", monId: mon.id })) onClose();
          }}
        >
          Comprar e usar · {formatMoney(MARKET_RARE_CANDY.price)}
        </button>
        <button className="text-button" onClick={onClose}>
          Cancelar compra
        </button>
      </footer>
    </Modal>
  );
}
