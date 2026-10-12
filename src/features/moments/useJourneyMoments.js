import { useCallback, useRef, useState } from "react";
import { actionMoments } from "./actionMoments.js";

export function useJourneyMoments() {
  const [queue, setQueue] = useState([]);
  const sequence = useRef(0);
  const recordAction = useCallback((before, after, action) => {
    if (
      before.run?.number !== after.run?.number ||
      before.run?.seed !== after.run?.seed
    ) {
      setQueue([]);
      return;
    }
    const moments = actionMoments(before.run, after.run, action).map(
      (moment, index, all) => ({
        ...moment,
        id: ++sequence.current,
        index: index + 1,
        total: all.length,
      }),
    );
    if (moments.length) setQueue((current) => [...current, ...moments]);
  }, []);
  const dismiss = useCallback(() => setQueue((current) => current.slice(1)), []);
  const clear = useCallback(() => setQueue([]), []);
  return { moment: queue[0], remaining: queue.length, recordAction, dismiss, clear };
}
