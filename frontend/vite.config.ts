import { defineConfig } from "vitest/config";
import preact from "@preact/preset-vite";
import legacy from "@vitejs/plugin-legacy";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";

export default defineConfig({
  test: {
    environment: "jsdom", // or 'happy-dom'
  },
  plugins: [
    preact(),
    tailwindcss(),
    legacy({
      modernPolyfills: true,
    }),
  ],
  resolve: {
    alias: {
      "~": resolve(__dirname, "src"),
    },
  },
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
