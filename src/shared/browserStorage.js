// Alguns navegadores bloqueiam o próprio getter de localStorage. Acesso
// tardio mantém as proteções dos leitores/gravadadores e permite exportar
// a jornada em memória, sem fingir que o progresso foi salvo.
export function createBrowserStorage(environment = globalThis) {
  return {
    getItem(key) {
      return environment.localStorage.getItem(key);
    },
    setItem(key, value) {
      environment.localStorage.setItem(key, value);
    },
    removeItem(key) {
      environment.localStorage.removeItem(key);
    },
  };
}
export const browserStorage = createBrowserStorage();
