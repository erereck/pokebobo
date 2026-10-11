import { Volume2, VolumeX } from "lucide-react";
import { useAudio } from "./AudioContext.js";
export function AudioButton() {
  const audio = useAudio();
  const muted = audio.preferences.muted;
  const waiting = !audio.status.ready && !muted;
  const Icon = muted ? VolumeX : Volume2;
  const label = muted ? "Ativar som" : waiting ? "Ativar som" : "Silenciar som";
  return (
    <button
      className={`hardware-button audio-button${waiting ? " is-waiting" : ""}`}
      data-audio-silent
      aria-label={label}
      aria-pressed={!muted && audio.status.ready}
      title={`${label} · volumes e playlist em Opções`}
      onClick={audio.toggle}
    >
      <Icon size={20} />
      <span>Som</span>
    </button>
  );
}
