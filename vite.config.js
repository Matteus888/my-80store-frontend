import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://my-80store-backend.vercel.app",
        changeOrigin: true,
        secure: true, // Assure-toi que c'est en HTTPS
        cookieDomainRewrite: "localhost", // Permet au cookie du backend d'être accepté en local
      },
    },
  },
});
