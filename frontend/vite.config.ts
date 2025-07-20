import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import legacy from "@vitejs/plugin-legacy";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    preact(),
    tailwindcss(),
    legacy({
      modernPolyfills: true,
    }),
  ],
  publicDir: "estatico",
  server: { host: true },
  css: {
    postcss: ".postcss.config.js",
  },
  build: {
    cssTarget: "chrome66",
  },
  esbuild: {
    target: "chrome66",
  },
  optimizeDeps: {
    esbuildOptions: {
      target: "chrome66",
    },
  },
});
