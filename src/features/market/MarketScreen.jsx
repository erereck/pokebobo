import { useState } from "react";
import { ArrowRight, ArrowLeftRight, Disc3, Store, Wallet } from "lucide-react";
import { RouteCover } from "../../components/scenery/RouteCover.jsx";
import { PokemonSaleList } from "./PokemonSaleList.jsx";
import { TmShop } from "./TmShop.jsx";
import { SellPokemonDialog } from "./SellPokemonDialog.jsx";
import { TeachTmDialog } from "./TeachTmDialog.jsx";
import { formatMoney } from "./formatMoney.js";
import { RareCandyOffer } from "./RareCandyOffer.jsx";
import { RareCandyDialog } from "./RareCandyDialog.jsx";

export function MarketScreen({ run, act }) {
  const [section, setSection] = useState("sell");
  const [saleId, setSaleId] = useState(null);
  const [tm, setTm] = useState(null);
  const [candyOpen, setCandyOpen] = useState(false);
  const saleMon = [...run.party, ...(run.box || [])].find(
    (mon) => mon.id === saleId,
  );
  return (
    <section className="market-screen" aria-label="Mercado da Liga">
      <div className="page-meta">
        <span>
          <Store size={14} /> ÚLTIMA PARADA · 8 INSÍGNIAS
        </span>
      </div>
      <div className="city-hero market-hero">
        <RouteCover place={{ id: "indigo" }} />
        <div className="city-hero-copy">
          <span className="tag">PREPARAÇÃO PARA A ELITE 4</span>
          <h1>
            Mercado da Liga<span>.</span>
          </h1>
          <p>
            Transforme despedidas em golpes e níveis. A próxima batalha merece o
            seu melhor time.
          </p>
        </div>
      </div>
      <div className="market-wallet">
        <Wallet size={24} aria-hidden="true" />
        <div>
          <span className="section-label">SEU SALDO</span>
          <strong>{formatMoney(run.money || 0)}</strong>
        </div>
        <p>
          Venda Pokémon para comprar TMs e Rare Candy.
          <br />
          Sem gastar semanas.
        </p>
      </div>
      <div className="market-switch" aria-label="Balcões do mercado">
        <button
          aria-pressed={section === "sell"}
          onClick={() => setSection("sell")}
        >
          <ArrowLeftRight size={17} /> Vender Pokémon
        </button>
        <button
          aria-pressed={section === "tms"}
          onClick={() => setSection("tms")}
        >
          <Disc3 size={17} /> Comprar itens
        </button>
      </div>
      {run.notice && (
        <div className="notice" role="status">
          <p>{run.notice}</p>
        </div>
      )}
      {section === "sell" ? (
        <PokemonSaleList run={run} onSell={setSaleId} />
      ) : (
        <div className="market-inventory">
          <RareCandyOffer run={run} onChoose={() => setCandyOpen(true)} />
          <TmShop run={run} onChoose={setTm} />
        </div>
      )}
      <footer className="market-exit">
        <button
          className="button primary full"
          onClick={() => act({ type: "MARKET_LEAVE" })}
        >
          Seguir para a Elite 4 <ArrowRight size={18} />
        </button>
        <p>
          Encerra as compras desta jornada. Confira sua equipe antes de seguir.
        </p>
      </footer>
      {saleMon && (
        <SellPokemonDialog
          mon={saleMon}
          run={run}
          act={act}
          onClose={() => setSaleId(null)}
        />
      )}
      {tm && (
        <TeachTmDialog
          key={tm.id}
          tm={tm}
          run={run}
          act={act}
          onClose={() => setTm(null)}
        />
      )}
      {candyOpen && (
        <RareCandyDialog
          run={run}
          act={act}
          onClose={() => setCandyOpen(false)}
        />
      )}
    </section>
  );
}
