#!/usr/bin/env node
// Screenshots for owner review. Usage: node scripts/qa/shots.mjs <outDir> [--fold] [--phone-only] [paths...]
// Default: full pages, dark and light, at 1440 and 390. --fold captures only the first screen (1536x710 too,
// the owner's laptop). Output names: <slug>-<theme>-<width>.png. Keep outDir outside the repo (scratchpad).
import { mkdirSync } from "node:fs";
import { BASE, launch, context, settle, KEY_PAGES, slug } from "./lib.mjs";

const args = process.argv.slice(2);
const out = args.shift();
if (!out) { console.error("usage: shots.mjs <outDir> [--fold] [--phone-only] [paths...]"); process.exit(2); }
const fold = args.includes("--fold"), phoneOnly = args.includes("--phone-only");
const paths = args.filter((a) => !a.startsWith("--"));
const sizes = phoneOnly ? [[390, 844]] : fold ? [[1536, 710], [1440, 900], [390, 844]] : [[1440, 900], [390, 844]];
mkdirSync(out, { recursive: true });
const browser = await launch();
for (const path of paths.length ? paths : KEY_PAGES) for (const theme of ["dark", "light"]) for (const [width, height] of sizes) {
  const ctx = await context(browser, { theme, width, height, phone: width < 600 });
  const page = await ctx.newPage();
  await page.goto(BASE + path, { waitUntil: "load" });
  await settle(page);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  const file = `${out}/${slug(path)}-${theme}-${width}.png`;
  await page.screenshot({ path: file, fullPage: !fold });
  console.log(file + (overflow > 1 ? `  (scrolls sideways by ${overflow}px)` : ""));
  await ctx.close();
}
await browser.close();
