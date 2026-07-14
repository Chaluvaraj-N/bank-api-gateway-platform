import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001
  },
  css: {
    // Avoid external PostCSS config resolution (prevents encoding-related JSON parse failures)
    postcss: null
  }
});

