import { useEffect, useMemo, useRef, useState } from "react";
import { Copy, Download, Share2, RefreshCw } from "lucide-react";
import { Modal } from "../../components/ui/Modal.jsx";
import { journeyCardModel, cardFilename } from "./journeyCardModel.js";
import { invitationLink, GAME_URL } from "../../shared/regionInvitation.js";
import { downloadBlob } from "../../shared/downloadBlob.js";

export function ShareJourneyDialog({ run, onClose }) {
  const model = useMemo(() => journeyCardModel(run), [run]);
  const link = model.challenge ? invitationLink(model.challenge) : GAME_URL;
  const canvasRef = useRef(null);
  const linkRef = useRef(null);
  const [attempt, setAttempt] = useState(0);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");
  const [sharing, setSharing] = useState(false);
  useEffect(() => {
    let alive = true;
    const canvas = canvasRef.current;
    setLoading(true);
    setError("");
    setFile(null);
    // O gerador/QR só é baixado quando alguém abre um cartão.
    import("./renderJourneyCard.js")
      .then(async ({ renderJourneyCard, cardBlob }) => {
        const staging = document.createElement("canvas");
        await renderJourneyCard(staging, model, model.challenge ? link : null);
        const blob = await cardBlob(staging);
        if (!alive) return;
        canvas.width = staging.width;
        canvas.height = staging.height;
        canvas.getContext("2d").drawImage(staging, 0, 0);
        setFile(new File([blob], cardFilename(model), { type: "image/png" }));
        setLoading(false);
      })
      .catch((e) => {
        if (alive) {
          setError(e.message);
          setLoading(false);
        }
      });
    return () => {
      alive = false;
    };
  }, [model, link, attempt]);
  const copy = async () => {
    try {
      if (!navigator.clipboard?.writeText) throw Error("clipboard unavailable");
      await navigator.clipboard.writeText(link);
      setFeedback(
        model.challenge
          ? "Convite copiado. É só mandar para seu amigo!"
          : "Link do jogo copiado.",
      );
    } catch {
      linkRef.current?.focus();
      linkRef.current?.select();
      setFeedback(
        "Selecionei o link abaixo. Copie pelo menu do navegador ou com Ctrl+C.",
      );
    }
  };
  let canShareFile = false;
  try {
    canShareFile = Boolean(
      file && navigator.share && navigator.canShare?.({ files: [file] }),
    );
  } catch {}
  const share = async () => {
    if (!file || !canShareFile || sharing) return;
    setSharing(true);
    setFeedback("");
    try {
      await navigator.share({
        files: [file],
        title: "Minha jornada no Pokébobo",
        text:
          model.name +
          " · " +
          model.badges +
          "/8 insígnias · " +
          model.mode +
          "\n" +
          link,
      });
      setFeedback("Cartão compartilhado!");
    } catch (e) {
      if (e.name !== "AbortError")
        setFeedback(
          "O compartilhamento não foi concluído. Você pode baixar o PNG e enviar pelo seu app.",
        );
    } finally {
      setSharing(false);
    }
  };
  return (
    <Modal
      title="Compartilhar jornada"
      className="share-journey-dialog"
      onClose={onClose}
    >
      <div className="share-journey-layout">
        <div className="journey-card-preview" aria-busy={loading}>
          <canvas
            ref={canvasRef}
            role="img"
            aria-label={
              "Cartão da run " +
              model.id +
              " de " +
              model.name +
              ": " +
              model.badges +
              " insígnias, " +
              model.mode +
              ", seed " +
              model.seed +
              ". Equipe: " +
              model.team
                .map((mon) => mon.name + (mon.shiny ? " shiny" : ""))
                .join(", ")
            }
            hidden={loading || Boolean(error)}
          />
          {loading && (
            <p role="status">Preparando equipe, insígnias e QR code…</p>
          )}
          {error && (
            <div role="alert">
              <p>{error}</p>
              <button
                className="button secondary"
                onClick={() => setAttempt((value) => value + 1)}
              >
                <RefreshCw size={17} /> Tentar novamente
              </button>
            </div>
          )}
        </div>
        <div className="share-journey-actions">
          <span className="section-label">SUA HISTÓRIA EM UM CARTÃO</span>
          <h3>
            Uma região.
            <br />
            {" "}
            Novas histórias.
          </h3>
          <p>
            Equipe final, shinies, insígnias e seed em uma imagem pronta para
            postar. O QR leva ao jogo
            {model.challenge ? " com a mesma região e modo" : ""}.
          </p>
          <button
            className="button primary full"
            disabled={!file}
            onClick={() => {
              downloadBlob(file, file.name);
              setFeedback(
                "PNG pronto para salvar. Envie a imagem ou publique com o convite.",
              );
            }}
          >
            <Download size={18} /> Baixar cartão PNG
          </button>
          {canShareFile && (
            <button
              className="button secondary full"
              disabled={sharing}
              onClick={share}
            >
              <Share2 size={18} />{" "}
              {sharing ? "Compartilhando…" : "Compartilhar imagem"}
            </button>
          )}
          <button className="button secondary full" onClick={copy}>
            <Copy size={18} />{" "}
            {model.challenge
              ? "Copiar convite da região"
              : "Copiar link do jogo"}
          </button>
          <label className="share-link-label">
            LINK PARA O AMIGO
            <input
              ref={linkRef}
              aria-label="Link da jornada"
              value={link}
              readOnly
              onFocus={(e) => e.target.select()}
            />
          </label>
          <p className="share-feedback" role="status">
            {feedback}
          </p>
          {model.challenge && (
            <p className="fine-print">
              O amigo escolhe o próprio inicial. As decisões da aventura podem
              levar a resultados diferentes.
              {model.legacyChallenge
                ? " Esta run antiga compartilha cidades e seed; não tem o sorteio inicial da rota registrado."
                : ""}
            </p>
          )}
          {!model.challenge && (
            <p className="fine-print">
              Este registro antigo não tem uma região completa. O cartão leva à
              página inicial do jogo.
            </p>
          )}
          <small className="fine-print">
            PNG 1080 × 1350 · gerado neste aparelho.
          </small>
        </div>
      </div>
    </Modal>
  );
}
