import { useEffect } from "react";
export function useBattleKeys(enabled) {
  useEffect(() => {
    if (!enabled) return;
    const handle = (event) => {
      if (
        event.repeat ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        document.querySelector("dialog[open]") ||
        event.target.closest('input,textarea,select,[contenteditable="true"]')
      )
        return;
      if (!/^[1-4]$/.test(event.key)) return;
      const button = document.querySelector(
        '[data-move-index="' + event.key + '"]',
      );
      if (button && !button.disabled) {
        event.preventDefault();
        button.click();
      }
    };
    document.addEventListener("keydown", handle);
    return () => document.removeEventListener("keydown", handle);
  }, [enabled]);
}
