import { useState } from "react";
import { Check, Package } from "lucide-react";
import { Modal } from "../../components/ui/Modal.jsx";
import { HELD_ITEMS } from "../../game/config/equipment.js";
import {
  equipmentCount,
  heldItem,
  itemName,
} from "../../game/equipment/equipment.js";
import { pokemonName } from "../../game/heroes/heroes.js";
import { PokemonRecipients } from "./PokemonRecipients.jsx";

export function EquipmentDialog({ run, act, monId: initialMonId, onClose }) {
  const [monId, setMonId] = useState(initialMonId || null);
  const [itemId, setItemId] = useState(null);
  const mon = [...run.party, ...(run.box || [])].find((m) => m.id === monId);
  const chosen = heldItem(itemId);
  const canEquip =
    mon &&
    chosen &&
    equipmentCount(run, chosen.id) > 0 &&
    heldItem(mon.item)?.id !== chosen.id;
  return (
    <Modal
      title="Equipar um parceiro"
      className="equipment-dialog"
      onClose={onClose}
    >
      <p className="muted small">
        Um item por Pokémon. Trocar equipamentos é grátis entre batalhas,
        inclusive na Liga.
      </p>
      <h3 className="market-step">1. Quem vai usar?</h3>
      <PokemonRecipients run={run} selected={monId} onSelect={setMonId} />
      <h3 className="market-step">2. O que levar da mochila?</h3>
      <div className="equipment-choices">
        {HELD_ITEMS.map((item) => (
          <button
            key={item.id}
            aria-pressed={itemId === item.id}
            disabled={
              !equipmentCount(run, item.id) ||
              heldItem(mon?.item)?.id === item.id
            }
            onClick={() => setItemId(item.id)}
          >
            <span>
              <strong>{item.name}</strong>
              <small>
                {equipmentCount(run, item.id)} na mochila ·{" "}
                {item.consumable ? "consumível" : "reutilizável"}
              </small>
              <span>{item.description}</span>
            </span>
            {itemId === item.id && <Check size={18} aria-hidden="true" />}
          </button>
        ))}
      </div>
      <footer className="market-confirm">
        <p>
          {mon
            ? `${pokemonName(mon)} · atual: ${itemName(mon.item)}.`
            : "Escolha o Pokémon e um item disponível."}{" "}
          Equipamentos trocados voltam à mochila; berries preparadas são
          descartadas.
        </p>
        <button
          className="button primary full"
          disabled={!canEquip}
          onClick={() => {
            if (act({ type: "EQUIP_ITEM", monId, itemId })) onClose();
          }}
        >
          <Package size={18} />{" "}
          {chosen ? `Equipar ${chosen.name}` : "Escolha um item"}
        </button>
        {mon?.item && (
          <button
            className="button secondary full"
            onClick={() => {
              if (act({ type: "UNEQUIP_ITEM", monId })) onClose();
            }}
          >
            Retirar {itemName(mon.item)}
          </button>
        )}
      </footer>
    </Modal>
  );
}
