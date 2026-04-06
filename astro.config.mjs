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
