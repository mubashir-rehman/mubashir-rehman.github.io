import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://mubashir-rehman.is-a.dev",
  output: "static",
  outDir: "dist/public",
  build: {
    // Match existing output structure so GitHub Actions workflow needs no changes
    assets: "_astro",
  },
  integrations: [
    react(),
    tailwind({
      // We manage our own @tailwind directives in src/index.css
      applyBaseStyles: false,
    }),
    sitemap({
      filter: (page) => !page.includes("/404"),
    }),
  ],
  vite: {
    // Allow overriding the Vite cache location (e.g. sandboxed/CI environments
    // where node_modules/.vite is not writable). No effect when unset.
    ...(process.env.VITE_CACHE_DIR ? { cacheDir: process.env.VITE_CACHE_DIR } : {}),
    resolve: {
      alias: {
        "@": "/src",
      },
    },
    ssr: {
      // react-helmet-async touches the DOM on SSR, skip it
      noExternal: ["react-helmet-async"],
    },
  },
});
