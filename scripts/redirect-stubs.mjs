// Turns a built dist/public into a redirect-only copy for the old host (mubashir-rehman.is-a.dev on
// GitHub Pages). Every HTML page becomes a stub that sends the visitor to the same path on the
// canonical domain; GitHub Pages cannot send a server-side 301, so this uses an immediate meta
// refresh plus location.replace, a canonical link, and noindex. Non-HTML files (résumé PDFs, feeds,
// images) are left in place so old direct links keep working.
// Usage: node scripts/redirect-stubs.mjs [dir]   (default dist/public)
import { readdirSync, statSync, writeFileSync } from "node:fs";
import { join, relative, sep } from "node:path";

const TARGET = "https://mubashirrehman.com";
const root = process.argv[2] || "dist/public";

const walk = (d) => readdirSync(d).flatMap((f) => {
  const p = join(d, f);
  return statSync(p).isDirectory() ? walk(p) : [p];
});

const esc = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
const stub = (url, keepPath) => `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<title>Moved to ${TARGET.replace("https://", "")}</title>
<meta name="robots" content="noindex, follow">
<link rel="canonical" href="${esc(url)}">
<meta http-equiv="refresh" content="0; url=${esc(url)}">
<script>location.replace(${keepPath ? `"${TARGET}"+location.pathname+location.search+location.hash` : `${JSON.stringify(url)}+location.search+location.hash`})</script>
</head><body><p>This site moved to <a href="${esc(url)}">${esc(url)}</a>.</p></body></html>
`;

let n = 0;
for (const file of walk(root)) {
  if (!file.endsWith(".html")) continue;
  const rel = relative(root, file).split(sep).join("/");
  // Search-engine ownership files must stay byte-for-byte, or the old property loses verification.
  if (/^google[0-9a-f]+\.html$/.test(rel) || /^BingSiteAuth/i.test(rel)) continue;
  if (rel === "404.html") {
    // Unknown paths: forward the exact path, so the new host decides whether it exists.
    writeFileSync(file, stub(`${TARGET}/`, true));
  } else {
    const path = rel === "index.html" ? "/" : "/" + rel.replace(/index\.html$/, "").replace(/\.html$/, "/");
    writeFileSync(file, stub(TARGET + path, false));
  }
  n++;
}
console.log(`redirect-stubs: ${n} HTML files now redirect to ${TARGET}`);
