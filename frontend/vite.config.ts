import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001
  },
  resolve: {
    alias: {
      "@app": "/src/app",
      "@features": "/src/features",
      "@shared": "/src/shared",
      "@widgets": "/src/widgets",
      "@styles": "/src/styles"
    }
  },
  css: {
    postcss: null
  }
});


