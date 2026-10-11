import { createContext, useContext } from "react";
export const GameAudioContext = createContext(null);
export const useAudio = () => useContext(GameAudioContext);
