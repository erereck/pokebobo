export function holdDirection(pressed, token, direction) {
  pressed.delete(token);
  pressed.set(token, direction);
  return { token, direction };
}
export function releaseDirection(pressed, token) {
  pressed.delete(token);
  const latest = [...pressed.entries()].at(-1);
  return latest ? { token: latest[0], direction: latest[1] } : null;
}
