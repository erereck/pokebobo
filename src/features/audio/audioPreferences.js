export const AUDIO_KEY = "pokebobo:audio";
export const DEFAULT_AUDIO = Object.freeze({
  muted: false,
  music: 0.42,
  effects: 0.65,
  cries: 0.6,
  mode: "auto",
  track: "opening",
});
const volume = (value, fallback) =>
  typeof value === "number" && Number.isFinite(value)
    ? Math.max(0, Math.min(1, value))
    : fallback;
export function normalizeAudioPreferences(value, tracks = []) {
  const source = value && typeof value === "object" ? value : {};
  return {
    muted:
      typeof source.muted === "boolean" ? source.muted : DEFAULT_AUDIO.muted,
    music: volume(source.music, DEFAULT_AUDIO.music),
    effects: volume(source.effects, DEFAULT_AUDIO.effects),
    cries: volume(source.cries, DEFAULT_AUDIO.cries),
    mode: source.mode === "playlist" ? "playlist" : "auto",
    track: tracks.some((track) => track.id === source.track)
      ? source.track
      : "opening",
  };
}
export function readAudioPreferences(storage, tracks) {
  try {
    return normalizeAudioPreferences(
      JSON.parse(storage.getItem(AUDIO_KEY)),
      tracks,
    );
  } catch {
    return normalizeAudioPreferences(null, tracks);
  }
}
export function writeAudioPreferences(storage, value) {
  try {
    storage.setItem(AUDIO_KEY, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}
