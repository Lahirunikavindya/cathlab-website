import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const localBackend = process.env.VITE_API_BASE_URL || "http://localhost:5000";
const productionBackend =
  process.env.VITE_API_BASE_URL || "https://cathlab-backend.vercel.app";

export default defineConfig({
  plugins: [react()],
  css: {
    transformer: "postcss",
  },
  server: {
    proxy: {
      "/api": localBackend,
    },
  },
  preview: {
    proxy: {
      "/api": productionBackend,
    },
  },
});
