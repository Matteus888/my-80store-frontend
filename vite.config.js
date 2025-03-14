import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://my-80store-backend.vercel.app",
        changeOrigin: true,
        secure: true,
        cookieDomainRewrite: "localhost",
      },
    },
    // Ajoutez cette option pour le routage historique
    historyApiFallback: true,
  },
  resolve: {
    alias: {
      "@styles": path.resolve("src/styles"),
    },
  },
  envPrefix: "VITE_",
  build: {
    sourcemap: true,
    minify: "terser",
    // Ajoutez cette configuration pour générer un fichier _redirects pour les SPA
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  base: "/", // Correct pour un déploiement à la racine
});
