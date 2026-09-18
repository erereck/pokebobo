import { presentationEvents } from "./presentationEvents.js";

export function translateLog(log) {
  return presentationEvents(log)
    .map((event) => event.text)
    .filter(Boolean);
}
