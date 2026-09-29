#!/usr/bin/env node
// Post-build gate. Runs against dist/public after `astro build` and fails the build on any
// regression of the SEO and copy rules in CLAUDE.md and docs/redesign/00-brief.md:
//   - exactly one <h1> per page
//   - <link rel="canonical"> byte-identical to the page's <loc> in the sitemap
//   - <title> <= 60 chars, meta description <= 155 chars
//   - valid JSON-LD
//   - og:image present and resolvable
//   - internal links resolve and keep the trailing-slash rule
//   - no em dashes and no banned marketing words in visible copy
//   - redirect stubs never appear in the sitemap
// Optional: set NDA_DENYLIST to a local file (one term per line) to also scan for terms that
// must never be published. The list itself is deliberately kept out of this public repo.
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

const DIST = process.argv[2] || "dist/public";
const SITE = "https://mubashir-rehman.is-a.dev";
const TITLE_MAX = 60;
const DESC_MAX = 155;
const BANNED = [
  "passionate", "innovative solution", "cutting-edge", "cutting edge", "digital transformation",
  "revolutioniz", "leveraging", "spearhead", "ai enthusiast", "synergy", "world-class",
];

const errors = [];
const fail = (file, msg) => errors.push(`${file}: ${msg}`);

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

const decode = (s) =>
  s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"')
    .replace(/&#39;|&#x27;/g, "'").replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)));

function visibleText(html) {
  return decode(
    html
      .replace(/<head[\s\S]*?<\/head>/i, " ")
      .replace(/<(script|style|pre|code|svg|template|noscript)\b[\s\S]*?<\/\1>/gi, " ")
      .replace(/<[^>]+>/g, " "),
  ).replace(/\s+/g, " ");
}

const attr = (tag, name) => {
  const m = tag.match(new RegExp(`\\s${name}\\s*=\\s*("([^"]*)"|'([^']*)')`, "i"));
  return m ? decode(m[2] ?? m[3]) : null;
};

// Sitemap locs
const sitemapFiles = walk(DIST).filter((f) => /sitemap-\d+\.xml$/.test(f));
if (!sitemapFiles.length) fail("sitemap", "no sitemap-*.xml found");
const locs = new Set(
  sitemapFiles.flatMap((f) => [...readFileSync(f, "utf8").matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])),
);

const denylist = process.env.NDA_DENYLIST && existsSync(process.env.NDA_DENYLIST)
  ? readFileSync(process.env.NDA_DENYLIST, "utf8").split("\n").map((s) => s.trim().toLowerCase()).filter(Boolean)
  : [];

// Search-engine ownership files (e.g. google<hash>.html) are not pages.
const htmlFiles = walk(DIST).filter((f) => f.endsWith(".html") && !/(^|[\\/])google[0-9a-f]+\.html$/.test(f));
const textFiles = walk(DIST).filter((f) => /\.(txt|xml|json)$/.test(f));

function resolveInternal(href) {
  const clean = href.split("#")[0].split("?")[0];
  if (!clean) return true;
  const target = join(DIST, decodeURIComponent(clean));
  if (clean.endsWith("/")) return existsSync(join(target, "index.html"));
  return existsSync(target);
}

for (const file of htmlFiles) {
  const rel = relative(DIST, file).split(sep).join("/");
  const html = readFileSync(file, "utf8");
  const isRedirect = /<meta[^>]+http-equiv=["']?refresh/i.test(html);
  const is404 = rel === "404.html";
  const urlPath = "/" + rel.replace(/index\.html$/, "").replace(/\.html$/, "/");
  const url = SITE + urlPath;

  if (isRedirect) {
    if (locs.has(url)) fail(rel, "redirect stub is listed in the sitemap");
    continue;
  }

  // h1
  const h1s = (html.match(/<h1[\s>]/gi) || []).length;
  if (h1s !== 1) fail(rel, `expected exactly one <h1>, found ${h1s}`);

  // title
  const title = decode((html.match(/<title>([\s\S]*?)<\/title>/i) || [])[1] || "").trim();
  if (!title) fail(rel, "missing <title>");
  else if ([...title].length > TITLE_MAX) fail(rel, `title is ${[...title].length} chars (max ${TITLE_MAX}): "${title}"`);

  // description
  const descTag = (html.match(/<meta[^>]+name=["']description["'][^>]*>/i) || [])[0];
  const desc = descTag ? attr(descTag, "content") : null;
  if (!desc) fail(rel, "missing meta description");
  else if ([...desc].length > DESC_MAX) fail(rel, `description is ${[...desc].length} chars (max ${DESC_MAX})`);

  // canonical vs sitemap
  if (!is404) {
    const canTag = (html.match(/<link[^>]+rel=["']canonical["'][^>]*>/i) || [])[0];
    const canonical = canTag ? attr(canTag, "href") : null;
    if (!canonical) fail(rel, "missing canonical");
    else {
      if (!locs.has(canonical)) fail(rel, `canonical ${canonical} is not a <loc> in the sitemap`);
      if (canonical !== url) fail(rel, `canonical ${canonical} does not match its URL ${url}`);
      if (!/\/$/.test(new URL(canonical).pathname)) fail(rel, "canonical lacks trailing slash");
    }
  }

  // og:image
  const ogTag = (html.match(/<meta[^>]+property=["']og:image["'][^>]*>/i) || [])[0];
  const og = ogTag ? attr(ogTag, "content") : null;
  if (!og) fail(rel, "missing og:image");
  else if (og.startsWith(SITE)) {
    if (!existsSync(join(DIST, new URL(og).pathname))) fail(rel, `og:image not found in build: ${og}`);
  }

  // JSON-LD
  for (const m of html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try { JSON.parse(m[1]); } catch (e) { fail(rel, `invalid JSON-LD: ${e.message}`); }
  }

  // internal links
  for (const m of html.matchAll(/<a\b[^>]*>/gi)) {
    const href = attr(m[0], "href");
    if (!href || !href.startsWith("/") || href.startsWith("//")) continue;
    const path = href.split("#")[0].split("?")[0];
    const last = path.split("/").pop();
    if (path && !path.endsWith("/") && !last.includes(".")) fail(rel, `internal link without trailing slash: ${href}`);
    else if (!resolveInternal(href)) fail(rel, `broken internal link: ${href}`);
  }

  // copy rules
  const text = visibleText(html);
  if (text.includes("—")) {
    const i = text.indexOf("—");
    fail(rel, `em dash in visible copy: "...${text.slice(Math.max(0, i - 40), i + 40).trim()}..."`);
  }
  const lower = text.toLowerCase();
  for (const w of BANNED) if (lower.includes(w)) fail(rel, `banned phrase in copy: "${w}"`);
  for (const w of denylist) if (new RegExp(`\\b${w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i").test(text)) fail(rel, "NDA denylist term in copy");
}

for (const file of textFiles) {
  if (!denylist.length) break;
  const rel = relative(DIST, file);
  const text = readFileSync(file, "utf8");
  for (const w of denylist) if (new RegExp(`\\b${w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i").test(text)) fail(rel, "NDA denylist term");
}

if (errors.length) {
  console.error(`check-dist: ${errors.length} problem(s)\n` + errors.map((e) => `  - ${e}`).join("\n"));
  process.exit(1);
}
console.log(`check-dist: ${htmlFiles.length} HTML files OK${denylist.length ? " (NDA denylist applied)" : ""}`);
