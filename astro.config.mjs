import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { readFileSync, readdirSync } from "node:fs";
import rehypeJournal from "./src/lib/rehype-journal.mjs";

const SITE = "https://mubashirrehman.com";

// Frontmatter read straight from the content files, because the config cannot use
// getCollection. Two jobs: redirects for archived posts that were once public, and sitemap
// <lastmod> from real content dates only (never a build timestamp).
function frontmatter(dir) {
  return readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const src = readFileSync(`${dir}/${f}`, "utf8");
      const fm = src.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? "";
      const get = (k) => fm.match(new RegExp(`^${k}:\\s*"?([^"\\n]+)"?`, "m"))?.[1]?.trim();
      return { slug: f.replace(/\.md$/, ""), status: get("status"), redirectTo: get("redirectTo"), date: get("date"), updated: get("updated"), asOf: get("asOf") };
    });
}
const posts = frontmatter("./src/content/journal");
const work = frontmatter("./src/content/work");

const redirects = Object.fromEntries(
  posts.filter((p) => p.status === "archived" && p.redirectTo).map((p) => [`/journal/${p.slug}`, p.redirectTo]),
);
redirects["/for"] = "/";

const lastmod = new Map([
  ...posts.filter((p) => p.status === "published").map((p) => [`${SITE}/journal/${p.slug}/`, p.updated ?? p.date]),
  ...work.filter((w) => w.asOf).map((w) => [`${SITE}/projects/${w.slug}/`, w.asOf]),
]);

export default defineConfig({
  site: SITE,
  output: "static",
  // GitHub Pages serves directory-format URLs (/about/ -> about/index.html) and 301-redirects the
  // slash-less form. Trailing slashes everywhere keep links, canonicals and the sitemap in step.
  trailingSlash: "always",
  outDir: "dist/public",
  build: { assets: "_astro", inlineStylesheets: "always" },
  redirects,
  markdown: {
    rehypePlugins: [rehypeJournal],
    shikiConfig: { theme: "css-variables" },
  },
  integrations: [
    sitemap({
      filter: (page) => !page.includes("/404") && !Object.keys(redirects).some((r) => page === `${SITE}${r}/`),
      serialize(item) {
        const d = lastmod.get(item.url);
        if (d) item.lastmod = new Date(d).toISOString();
        return item;
      },
    }),
  ],
  vite: {
    ...(process.env.VITE_CACHE_DIR ? { cacheDir: process.env.VITE_CACHE_DIR } : {}),
    resolve: { alias: { "@": "/src" } },
  },
});
