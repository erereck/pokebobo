import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { browserSimulatorPlugin } from "./scripts/browserSimulatorPlugin.mjs";

export default defineConfig({
  base: process.env.VITE_BASE || "./",
  plugins: [react(), browserSimulatorPlugin()],
  server: { port: 4173, strictPort: true },
  build: { chunkSizeWarningLimit: 15000 },
});
