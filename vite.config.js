import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { browserSimulatorPlugin } from "./scripts/browserSimulatorPlugin.mjs";
import { offlinePlugin } from "./scripts/offlinePlugin.mjs";

export default defineConfig({
  base: process.env.VITE_BASE || "./",
  plugins: [react(), browserSimulatorPlugin(), offlinePlugin()],
  server: { port: 4173, strictPort: true },
  build: { chunkSizeWarningLimit: 15000 },
});
