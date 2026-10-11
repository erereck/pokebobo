import { useEffect, useRef, useState } from "react";
import { holdDirection, releaseDirection } from "./heldDirections.js";

const keys = {
  ArrowUp: [0, -1],
  w: [0, -1],
  ArrowDown: [0, 1],
  s: [0, 1],
  ArrowLeft: [-1, 0],
  a: [-1, 0],
  ArrowRight: [1, 0],
  d: [1, 0],
};
export function useFieldControls(exploration, act, enabled = true) {
  const latest = useRef({ exploration, act, enabled });
  const held = useRef(null);
  const lastSent = useRef(-1);
  const nextRepeat = useRef(0);
  const pressed = useRef(new Map());
  const [isHolding, setIsHolding] = useState(false);
  useEffect(() => {
    latest.current = { exploration, act, enabled };
  });
  const move = (dx, dy) => {
    const { exploration: e, act: send, enabled: allowed } = latest.current;
    if (!allowed || !e || e.walk || lastSent.current === e.steps) return;
    if (send({ type: "MOVE_ROUTE", dx, dy, animate: true })) {
      lastSent.current = e.steps;
      nextRepeat.current = performance.now() + (1000 * 16) / 60;
    } else held.current = null;
  };
  useEffect(() => {
    const blocked = () =>
      Boolean(
        !latest.current.enabled ||
          document.querySelector("dialog[open]") ||
          document.activeElement?.closest(
            'input,textarea,select,[contenteditable="true"]',
          ),
      );
    const down = (event) => {
      const direction =
        keys[event.key.length === 1 ? event.key.toLowerCase() : event.key];
      if (
        !direction ||
        event.ctrlKey ||
        event.altKey ||
        event.metaKey ||
        blocked()
      )
        return;
      event.preventDefault();
      if (event.repeat) return;
      held.current = holdDirection(
        pressed.current,
        event.key.toLowerCase(),
        direction,
      );
      setIsHolding(true);
      move(...direction);
    };
    const up = (event) => {
      if (!pressed.current.has(event.key.toLowerCase())) return;
      held.current = releaseDirection(pressed.current, event.key.toLowerCase());
      setIsHolding(pressed.current.size > 0);
    };
    const stop = () => {
      held.current = null;
      pressed.current.clear();
      setIsHolding(false);
    };
    const visibility = () => {
      if (document.hidden) stop();
    };
    let frame;
    const repeat = () => {
      if (held.current && !blocked() && performance.now() >= nextRepeat.current)
        move(...held.current.direction);
      else if (blocked()) stop();
      frame = requestAnimationFrame(repeat);
    };
    frame = requestAnimationFrame(repeat);
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("blur", stop);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      cancelAnimationFrame(frame);
      stop();
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      window.removeEventListener("blur", stop);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);
  return {
    isHolding,
    move,
    press: (event, dx, dy) => {
      if (event.button !== 0 || !latest.current.enabled) return;
      event.currentTarget.setPointerCapture(event.pointerId);
      held.current = holdDirection(
        pressed.current,
        `pointer-${event.pointerId}`,
        [dx, dy],
      );
      setIsHolding(true);
      move(dx, dy);
    },
    release: (event) => {
      if (!pressed.current.has(`pointer-${event.pointerId}`)) return;
      held.current = releaseDirection(
        pressed.current,
        `pointer-${event.pointerId}`,
      );
      setIsHolding(pressed.current.size > 0);
    },
  };
}
