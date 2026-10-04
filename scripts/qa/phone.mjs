#!/usr/bin/env node
// Phone audit at 390px: page height, distinct font sizes (the phone scale allows about seven), narrowest text
// column, and links shorter than 24px (WCAG 2.5.8 target size). Usage: node scripts/qa/phone.mjs [paths...]
import { BASE, launch, context, KEY_PAGES } from "./lib.mjs";

const browser = await launch();
const ctx = await context(browser, { theme: "light", width: 390, height: 844, phone: true });
const page = await ctx.newPage();
let small = 0;
for (const path of process.argv.slice(2).length ? process.argv.slice(2) : KEY_PAGES) {
  await page.goto(BASE + path, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  const r = await page.evaluate(() => {
    const sizes = new Set();
    for (const e of document.querySelectorAll("main *")) if ([...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) sizes.add(getComputedStyle(e).fontSize);
    const text = [...document.querySelectorAll("main p, main li, main dd")].filter((e) => e.textContent.trim().length > 40).map((e) => Math.round(e.getBoundingClientRect().width)).filter(Boolean);
    const tiny = [...document.querySelectorAll("main a")].filter((a) => { const b = a.getBoundingClientRect(); return b.width > 0 && b.height < 24; }).map((a) => `"${a.textContent.trim().slice(0, 30)}" ${Math.round(a.getBoundingClientRect().height)}px`);
    return { height: document.body.scrollHeight, sizes: [...sizes].sort((a, b) => parseFloat(a) - parseFloat(b)), minText: Math.min(...text), tiny };
  });
  small += r.tiny.length;
  console.log(`${path}  height ${r.height}px  narrowest text ${r.minText}px  sizes ${r.sizes.join(" ")}${r.tiny.length ? `\n  small targets: ${r.tiny.join(", ")}` : ""}`);
}
await browser.close();
process.exit(small ? 1 : 0);
