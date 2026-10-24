import { useState } from "react";
import { Package } from "lucide-react";
import { Modal } from "../../components/ui/Modal.jsx";
import { PokemonRecipients } from "../equipment/PokemonRecipients.jsx";
import {
  equipmentOffer,
  heldItem,
  itemName,
} from "../../game/equipment/equipment.js";
import { pokemonName } from "../../game/heroes/heroes.js";
import { formatMoney } from "./formatMoney.js";

export function BuyHeldItemDialog({ run, item, act, onClose }) {
  const [monId, setMonId] = useState(null);
  const mon = [...run.party, ...(run.box || [])].find((m) => m.id === monId);
  const canBuy =
    mon &&
    heldItem(mon.item)?.id !== item.id &&
    equipmentOffer(run, item.id) &&
    (run.money || 0) >= item.price;
  return (
    <Modal
      title={`Comprar ${item.name}`}
      className="market-dialog"
      onClose={onClose}
    >
      <div className="new-move-card">
        <strong>
          <Package size={18} /> {item.name}
        </strong>
        <p>{item.description}</p>
      </div>
      <h3 className="market-step">Quem vai equipar?</h3>
      <PokemonRecipients
        run={run}
        selected={monId}
        onSelect={setMonId}
        excludedItem={item.id}
      />
      <footer className="market-confirm">
        <p>
          {mon
            ? `${pokemonName(mon)} equipará ${item.name}. Item atual: ${itemName(mon.item)}. `
            : "Escolha um Pokémon para concluir. "}
          Equipamentos substituídos voltam à mochila; berries são descartadas.
        </p>
        <p>
          Saldo após a compra:{" "}
          <b>{formatMoney((run.money || 0) - item.price)}</b>.
        </p>
        <button
          className="button primary full"
          disabled={!canBuy}
          onClick={() => {
            if (act({ type: "MARKET_BUY_ITEM", itemId: item.id, monId }))
              onClose();
          }}
        >
          Comprar e equipar · {formatMoney(item.price)}
        </button>
        <button className="text-button" onClick={onClose}>
          Cancelar compra
        </button>
      </footer>
    </Modal>
  );
}
