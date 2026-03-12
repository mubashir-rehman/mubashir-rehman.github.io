import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  base: "/",
  plugins: [react()],
  ssr: {
    noExternal: ["react-helmet-async"],
  },
  ssgOptions: {
    script: "async",
    formatting: "minify",
    includedRoutes: () => [
      "/",
      "/about",
      "/projects",
      "/hobbies",
      "/habits",
      "/journal",
      "/contact",
    ],
  },
  server: {
    host: "0.0.0.0",
    port: 5000,
    allowedHosts: true,
    hmr: { overlay: false },
  },
  build: {
    outDir: "dist/public",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
