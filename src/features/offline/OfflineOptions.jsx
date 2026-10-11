import { useSyncExternalStore } from "react";
import { Smartphone, Wifi, WifiOff, Check } from "lucide-react";
import {
  subscribeOffline,
  offlineSnapshot,
  promptInstall,
} from "./offlineClient.js";

export function OfflineOptions() {
  const state = useSyncExternalStore(subscribeOffline, offlineSnapshot);
  return (
    <section className="offline-options" aria-label="Instalação e conexão">
      <div className="offline-heading">
        <Smartphone size={20} aria-hidden="true" />
        <div>
          <h3>
            {state.installed ? "Jogo instalado" : "Leve o Pokébobo com você"}
          </h3>
          <span>
            {state.online ? <Wifi size={13} /> : <WifiOff size={13} />}
            {state.online ? "Com conexão" : "Sem conexão"}
          </span>
        </div>
      </div>
      <p>
        {state.ready
          ? "Pronto para reabrir sem conexão. Artes e sons ficam disponíveis conforme você os usa; conteúdos novos ainda podem precisar de internet."
          : state.preparing
            ? "Preparando o jogo para reabrir sem conexão…"
            : "Abra o jogo com internet para preparar o acesso sem conexão."}
      </p>
      {state.installed ? (
        <p className="offline-installed">
          <Check size={15} /> Abra pelo ícone na sua tela inicial.
        </p>
      ) : state.installing ? (
        <button className="button secondary full" onClick={promptInstall}>
          <Smartphone size={17} /> Instalar Pokébobo
        </button>
      ) : (
        <p className="offline-manual">
          No menu do navegador, escolha Instalar aplicativo ou Adicionar à tela
          inicial. No iPhone, use Compartilhar → Adicionar à Tela de Início.
        </p>
      )}
      {state.update && (
        <p className="offline-update" role="status">
          Uma versão nova está pronta. Feche todas as abas e janelas do
          Pokébobo, aguarde alguns segundos e abra novamente para atualizar. Sua
          jornada fica salva.
        </p>
      )}
      {state.error && <p role="status">{state.error}</p>}
    </section>
  );
}
