import { Check } from "lucide-react";
import { Sprite } from "../../components/pokemon/Sprite.jsx";
import { itemName, heldItem } from "../../game/equipment/equipment.js";
import { pokemonName } from "../../game/heroes/heroes.js";

export function PokemonRecipients({ run, selected, onSelect, excludedItem }) {
  return (
    <div
      className="market-recipients equipment-recipients"
      aria-label="Escolher Pokémon"
    >
      {[...run.party, ...(run.box || [])].map((mon) => (
        <button
          className="market-recipient"
          key={mon.id}
          disabled={Boolean(
            excludedItem && heldItem(mon.item)?.id === excludedItem,
          )}
          aria-pressed={selected === mon.id}
          onClick={() => onSelect(mon.id)}
        >
          <Sprite name={mon.name} shiny={mon.shiny} />
          <span>
            <strong>{pokemonName(mon)}</strong>
            <small>
              {mon.nickname ? `${mon.name} · ` : ""}
              {run.box?.some((m) => m.id === mon.id) ? "Reserva" : "Equipe"} ·
              Nv. {mon.level}
            </small>
            <small>Item: {itemName(mon.item)}</small>
          </span>
          {selected === mon.id && <Check size={18} aria-hidden="true" />}
        </button>
      ))}
    </div>
  );
}
