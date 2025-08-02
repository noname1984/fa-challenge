/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    globals: true, // allow `expect` / `describe` / etc. without imports
    environment: "jsdom", // simulate a browser DOM
    setupFiles: "src/setupTests.ts",
  },
});
