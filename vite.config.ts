/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { readFileSync } from "fs";

const host = process.env.TAURI_DEV_HOST;

// Single source of truth for the app version: src-tauri/tauri.conf.json (CI-bumped on release)
const appVersion = (() => {
  try {
    const conf = JSON.parse(
      readFileSync(path.resolve(__dirname, "./src-tauri/tauri.conf.json"), "utf-8"),
    );
    return typeof conf.version === "string" ? conf.version : "0.0.0";
  } catch {
    return "0.0.0";
  }
})();

export default defineConfig(async () => ({
  base: './',
  define: {
    __APP_VERSION__: JSON.stringify(appVersion),
  },
  plugins: [react(), tailwindcss()],
  test: {
    globals: true,
    environment: "jsdom",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  clearScreen: false,
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
          protocol: "ws",
          host,
          port: 1421,
        }
      : undefined,
    watch: {
      ignored: ["**/src-tauri/**"],
    },
  },
}));
