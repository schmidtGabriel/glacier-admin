import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 4200,
  },
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      external: ["firebase-admin"],
    },
  },
});
