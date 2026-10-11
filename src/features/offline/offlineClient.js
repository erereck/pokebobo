const listeners = new Set();
let state = {
  online: navigator.onLine,
  ready: false,
  preparing: false,
  update: false,
  installing: false,
  installed:
    window.matchMedia("(display-mode: standalone)").matches ||
    navigator.standalone === true,
  error: "",
};
let registration,
  installEvent,
  started = false;
const publish = (change) => {
  state = { ...state, ...change };
  for (const notify of listeners) notify();
};
export const subscribeOffline = (notify) => {
  listeners.add(notify);
  return () => listeners.delete(notify);
};
export const offlineSnapshot = () => state;

export function startOffline() {
  if (started) return;
  started = true;
  window.addEventListener("online", () => {
    publish({ online: true });
    registration?.update().catch(() => {});
  });
  window.addEventListener("offline", () => publish({ online: false }));
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    installEvent = event;
    publish({ installing: true });
  });
  window.addEventListener("appinstalled", () => {
    installEvent = null;
    publish({ installed: true, installing: false });
  });
  if (
    !import.meta.env.PROD ||
    !window.isSecureContext ||
    !("serviceWorker" in navigator)
  )
    return;
  const register = async () => {
    publish({ preparing: true });
    try {
      const url = `${import.meta.env.BASE_URL}sw.js`;
      registration = await navigator.serviceWorker.getRegistration(url);
      if (!registration)
        registration = await navigator.serviceWorker.register(url, {
          updateViaCache: "none",
        });
      else if (navigator.onLine) {
        try {
          registration = await navigator.serviceWorker.register(url, {
            updateViaCache: "none",
          });
        } catch {
          // Uma cópia ativa continua útil se Wi-Fi existe mas a rede falhou.
        }
      }
      const changed = () =>
        publish({
          ready: Boolean(registration.active),
          preparing: !registration.active && !registration.waiting,
          update: Boolean(registration.waiting),
          ...(registration.active ? { error: "" } : {}),
        });
      changed();
      const observeInstalling = () => {
        const worker = registration.installing;
        worker?.addEventListener("statechange", () => {
          changed();
          if (worker.state === "redundant")
            publish({
              preparing: false,
              error:
                "Não foi possível preparar o acesso sem conexão. Você pode continuar jogando online.",
            });
        });
      };
      registration.addEventListener("updatefound", observeInstalling);
      observeInstalling();
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        changed();
      });
      if (!registration.active) await navigator.serviceWorker.ready;
      changed();
      if (!navigator.serviceWorker.controller)
        await new Promise((resolve) =>
          navigator.serviceWorker.addEventListener(
            "controllerchange",
            resolve,
            { once: true },
          ),
        );
      // A primeira página pode ter carregado estas imagens antes do controle.
      const visible = [
        ...new Set(
          [...document.images]
            .map((image) => image.currentSrc)
            .filter((url) => url.startsWith(location.origin)),
        ),
      ];
      await Promise.allSettled(visible.map((url) => fetch(url)));
    } catch {
      publish({
        preparing: false,
        error:
          "Não foi possível preparar o acesso sem conexão. Você pode continuar jogando online.",
      });
    }
  };
  // O primeiro quadro e os controles têm prioridade sobre a cópia offline.
  if (document.readyState === "complete") setTimeout(register, 3000);
  else
    window.addEventListener("load", () => setTimeout(register, 3000), {
      once: true,
    });
}

export async function promptInstall() {
  if (!installEvent) return;
  const event = installEvent;
  installEvent = null;
  publish({ installing: false, error: "" });
  try {
    await event.prompt();
    await event.userChoice;
  } catch {
    publish({ error: "Use a opção de instalar no menu do navegador." });
  }
}
