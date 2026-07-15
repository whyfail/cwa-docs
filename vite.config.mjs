import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? "/cwa-docs/" : "/",
  plugins: [react()],
  optimizeDeps: {
    include: ["react", "react-dom/client", "markdown-it"],
  },
  server: {
    warmup: {
      clientFiles: ["./src/main.jsx"],
    },
  },
});
