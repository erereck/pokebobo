import { SAVE_VERSION } from "../persistence/constants.js";
export const initialState = () => ({
  version: SAVE_VERSION,
  meta: {
    runs: 0,
    wins: 0,
    best: 0,
    moveLearningMode: "manual",
    history: [],
  },
  run: null,
});
