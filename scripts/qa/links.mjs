#!/usr/bin/env node
// Link audit: groups every text link by computed font, weight, size, colour and underline, so a new page that
// drifts from the five link roles (inline, action, title, navigation, on purple) shows up as a new group.
import { BASE, launch, KEY_PAGES } from "./lib.mjs";

const browser = await launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const groups = new Map();
for (const path of process.argv.slice(2).length ? process.argv.slice(2) : KEY_PAGES) {
  await page.goto(BASE + path, { waitUntil: "load" });
  const rows = await page.evaluate(() => [...document.querySelectorAll("main a, footer a")].filter((a) => a.getBoundingClientRect().width > 0 && !a.classList.contains("btn") && !a.classList.contains("j-card")).map((a) => {
    const c = getComputedStyle(a);
    return { sig: [c.fontFamily.split(",")[0], c.fontWeight, c.fontSize, c.color, c.textDecorationLine].join(" | "), ex: `"${a.textContent.trim().slice(0, 30)}" in .${a.parentElement.className || a.parentElement.tagName}` };
  }));
  for (const r of rows) { const g = groups.get(r.sig) || { n: 0, ex: [] }; g.n++; if (g.ex.length < 2) g.ex.push(`${path} ${r.ex}`); groups.set(r.sig, g); }
}
await browser.close();
console.log(`${groups.size} distinct text-link styles`);
for (const [sig, g] of [...groups].sort((a, b) => b[1].n - a[1].n)) console.log(`${String(g.n).padStart(4)}x  ${sig}\n        ${g.ex.join("\n        ")}`);
