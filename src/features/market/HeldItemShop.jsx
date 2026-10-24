import { Package, Check } from "lucide-react";
import { HELD_ITEMS } from "../../game/config/equipment.js";
import { equipmentOffer } from "../../game/equipment/equipment.js";
import { formatMoney } from "./formatMoney.js";

export function HeldItemShop({ run, onChoose }) {
  return (
    <section className="held-item-shop" aria-label="Comprar equipamentos">
      <div className="section-head">
        <h2>
          <Package size={20} /> Um item. Outra estratégia.
        </h2>
      </div>
      <p className="muted small">
        Uma unidade de cada por jornada. Escolha quem equipa ao comprar; depois
        pode transferir pela Equipe ou Mochila. Golpes podem remover ou trocar
        itens durante a batalha.
      </p>
      <div className="held-item-offers">
        {HELD_ITEMS.map((item) => {
          const sold = !equipmentOffer(run, item.id),
            poor = (run.money || 0) < item.price;
          return (
            <article key={item.id}>
              <span className="section-label">{item.tag}</span>
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <button
                className="button secondary full"
                disabled={sold || poor}
                aria-label={`Comprar ${item.name} por ${formatMoney(item.price)}`}
                onClick={(event) => {
                  event.currentTarget.focus({ preventScroll: true });
                  onChoose(item);
                }}
              >
                {sold ? (
                  <>
                    <Check size={16} /> Comprado
                  </>
                ) : (
                  <>
                    {formatMoney(item.price)} ·{" "}
                    {poor ? "Saldo insuficiente" : "Comprar e equipar"}
                  </>
                )}
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}
