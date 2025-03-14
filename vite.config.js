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
  resolve: {
    alias: {
      "@": "/src", // Exemple d'alias
    },
  },
  envPrefix: "VITE_", // Exposer des variables d'environnement spécifiques
  build: {
    sourcemap: true, // Ajout des sourcemaps pour le debug
    minify: "terser", // Utilisation de Terser pour minifier
  },
  base: "/", // Change cette valeur si ton projet est dans un sous-dossier
});
