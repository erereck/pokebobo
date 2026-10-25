import { useState } from "react";
import { Package } from "lucide-react";
import { HELD_ITEMS } from "../../game/config/equipment.js";
import {
  canManageEquipment,
  equipmentCount,
  heldItem,
} from "../../game/equipment/equipment.js";
import { EquipmentDialog } from "./EquipmentDialog.jsx";

export function EquipmentInventory({ run, act }) {
  const [open, setOpen] = useState(false);
  const roster = [...run.party, ...(run.box || [])];
  return (
    <section
      className="equipment-inventory"
      aria-label="Equipamentos de batalha"
    >
      <div className="section-head">
        <h2>
          <Package size={18} /> Equipamentos
        </h2>
        <span className="mono">1 POR POKÉMON</span>
      </div>
      <div className="equipment-stock">
        {HELD_ITEMS.map((item) => (
          <div key={item.id}>
            <b>{item.name}</b>
            <span>
              {equipmentCount(run, item.id)} na mochila ·{" "}
              {roster.filter((m) => heldItem(m.item)?.id === item.id).length} em
              uso
            </span>
          </div>
        ))}
      </div>
      <button
        className="button secondary full"
        disabled={!canManageEquipment(run)}
        onClick={(event) => {
          event.currentTarget.focus({ preventScroll: true });
          setOpen(true);
        }}
      >
        Gerenciar equipamentos
      </button>
      <p className="muted small">
        Ganhe nas revanches e expedições ou compre no Mercado da Liga. Trocar
        não gasta semana. Focus Sash é consumido ao ativar. Itens removidos ou
        trocados por golpes seguem o resultado da batalha.
      </p>
      {open && (
        <EquipmentDialog run={run} act={act} onClose={() => setOpen(false)} />
      )}
    </section>
  );
}
