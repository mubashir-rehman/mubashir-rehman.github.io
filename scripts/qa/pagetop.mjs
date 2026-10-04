#!/usr/bin/env node
// Design rule "one page top": every inner page's PageTop cards have the same height, the h1 sits at the same
// y (within 2px), and nothing inside the cards is clipped. Checked at 1000, 1280, 1440, 1536 and 1920 wide.
import { BASE, launch, INNER_PAGES } from "./lib.mjs";

const browser = await launch();
const fails = [];
for (const [w, h] of [[1000, 700], [1280, 720], [1440, 900], [1536, 710], [1920, 890]]) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  const seen = new Map();
  for (const path of INNER_PAGES()) {
    await page.goto(BASE + path, { waitUntil: "load" });
    await page.evaluate(() => document.fonts.ready);
    const r = await page.evaluate(() => {
      const pt = document.querySelector(".pt");
      if (!pt) return null;
      const kids = [...pt.children];
      return { hs: kids.map((k) => Math.round(k.getBoundingClientRect().height)).join("/"), clipped: kids.some((k) => k.scrollHeight - k.clientHeight > 1), h1: Math.round(document.querySelector(".pt h1").getBoundingClientRect().top) };
    });
    if (!r) { fails.push(`${w}px ${path}: no PageTop`); continue; }
    if (r.clipped) fails.push(`${w}px ${path}: content clipped inside the page-top cards`);
    seen.set(path, r);
  }
  const heights = new Set([...seen.values()].map((r) => r.hs));
  const h1s = [...seen.values()].map((r) => r.h1);
  if (heights.size > 1) fails.push(`${w}px: card heights differ (${[...heights].join(", ")})`);
  if (Math.max(...h1s) - Math.min(...h1s) > 2) fails.push(`${w}px: h1 position differs (${Math.min(...h1s)} to ${Math.max(...h1s)}px)`);
  await page.close();
}
await browser.close();
if (fails.length) { console.error(`pagetop: ${fails.length} problem(s)\n  - ${fails.join("\n  - ")}`); process.exit(1); }
console.log(`pagetop: ${INNER_PAGES().length} inner pages x 5 widths OK`);
