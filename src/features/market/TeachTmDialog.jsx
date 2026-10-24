import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Check, Disc3 } from "lucide-react";
import { Modal } from "../../components/ui/Modal.jsx";
import { Sprite } from "../../components/pokemon/Sprite.jsx";
import { TypeTag } from "../../components/pokemon/TypeTag.jsx";
import { tmEligibility } from "../../game/market/market.js";
import { MoveSummary } from "../team/MoveSummary.jsx";
import { moveGuide } from "../battle/moveGuide.js";
import { formatMoney } from "./formatMoney.js";
import { pokemonName } from "../../game/heroes/heroes.js";

export function TeachTmDialog({ tm, run, act, onClose }) {
  const [monId, setMonId] = useState(null);
  const [forgetMoveId, setForgetMoveId] = useState(null);
  const heading = useRef(null);
  const roster = [...run.party, ...(run.box || [])];
  const mon = roster.find((candidate) => candidate.id === monId);
  const freeSlot = mon && mon.moves.length < 4;
  useEffect(() => {
    if (monId) heading.current?.focus();
  }, [monId]);
  return (
    <Modal
      title="Comprar e ensinar TM"
      className="market-dialog teach-tm-dialog"
      onClose={onClose}
    >
      <div className="new-move-card">
        <div>
          <Disc3 size={20} />
          <strong>{tm.name}</strong>
          <TypeTag type={tm.type} />
        </div>
        <MoveSummary id={tm.id} explain />
      </div>
      <div className="market-purchase-meta">
        <span>Uso único · 1 unidade</span>
        <strong>{formatMoney(tm.price)}</strong>
      </div>
      <h3 className="market-step" tabIndex={-1} ref={heading}>
        {mon
          ? freeSlot
            ? "2 · Confirmar aprendizado"
            : "2 · Escolha o golpe que sai"
          : "1 · Quem vai aprender?"}
      </h3>
      {!mon ? (
        <div className="market-recipients">
          {roster.map((candidate) => {
            const eligibility = tmEligibility(candidate, tm.id);
            return (
              <button
                className="market-recipient"
                key={candidate.id}
                disabled={eligibility !== "Pode aprender"}
                onClick={() => setMonId(candidate.id)}
              >
                <Sprite name={candidate.name} shiny={candidate.shiny} />
                <span>
                  <strong>{pokemonName(candidate)}</strong>
                  <small>
                    {candidate.nickname ? `${candidate.name} · ` : ""}Nv.{" "}
                    {candidate.level} ·{" "}
                    {run.box?.some((m) => m.id === candidate.id)
                      ? "Reserva"
                      : "Equipe"}
                  </small>
                  <small>{eligibility}</small>
                </span>
                {eligibility === "Pode aprender" && (
                  <Check size={18} aria-hidden="true" />
                )}
              </button>
            );
          })}
        </div>
      ) : (
        <>
          <div className="market-partner">
            <Sprite name={mon.name} shiny={mon.shiny} />
            <div>
              <h3>{pokemonName(mon)}</h3>
              <small>
                Nv. {mon.level} · Recebe {tm.name}
              </small>
            </div>
          </div>
          <button
            className="text-button"
            onClick={() => {
              setMonId(null);
              setForgetMoveId(null);
            }}
          >
            <ArrowLeft size={16} /> Escolher outro Pokémon
          </button>
          {freeSlot ? (
            <p>
              Há uma vaga livre. {tm.name} será adicionado sem esquecer outro
              golpe.
            </p>
          ) : (
            <div className="forget-move-list">
              {mon.moves.map((id) => {
                const info = moveGuide(id);
                return (
                  <button
                    className="forget-move-button"
                    key={id}
                    aria-pressed={forgetMoveId === id}
                    onClick={() => setForgetMoveId(id)}
                  >
                    <span className="forget-move-content">
                      <span className="forget-move-name">
                        <strong>{info?.name || id}</strong>
                        {info && <TypeTag type={info.type} />}
                      </span>
                      <MoveSummary id={id} />
                    </span>
                    <small>
                      {forgetMoveId === id
                        ? "Será substituído"
                        : "Escolher este golpe"}
                    </small>
                  </button>
                );
              })}
            </div>
          )}
        </>
      )}
      <footer className="market-confirm">
        <p>
          Saldo após a compra:{" "}
          <strong>{formatMoney((run.money || 0) - tm.price)}</strong>. Cobrança
          e aprendizado juntos.
        </p>
        <button
          className="button primary full"
          disabled={!mon || (!freeSlot && !forgetMoveId)}
          onClick={() => {
            if (
              act({
                type: "MARKET_BUY_TM",
                tmId: tm.id,
                monId: mon.id,
                forgetMoveId,
              })
            )
              onClose();
          }}
        >
          Comprar e ensinar · {formatMoney(tm.price)}
        </button>
        <button className="text-button" onClick={onClose}>
          Cancelar compra
        </button>
      </footer>
    </Modal>
  );
}
