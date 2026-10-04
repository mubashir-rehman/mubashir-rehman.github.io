#!/usr/bin/env node
// Accessibility: axe-core (WCAG 2.0 to 2.2 AA plus best practice) on each page, dark and light, 1440 and 390.
// Usage: node scripts/qa/axe.mjs [paths...]   (default: key pages and every case study). Exit 1 on any violation.
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { BASE, launch, context, KEY_PAGES, caseStudies } from "./lib.mjs";

const axeSrc = readFileSync(createRequire(import.meta.url).resolve("axe-core/axe.min.js"), "utf8");
const paths = process.argv.slice(2).length ? process.argv.slice(2) : [...new Set([...KEY_PAGES, ...caseStudies()])];
const browser = await launch();
let bad = 0;
for (const path of paths) for (const theme of ["dark", "light"]) for (const width of [1440, 390]) {
  const ctx = await context(browser, { theme, width });
  const page = await ctx.newPage();
  await page.goto(BASE + path, { waitUntil: "load" });
  await page.addScriptTag({ content: axeSrc });
  const v = await page.evaluate(async () => (await axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa", "best-practice"] } })).violations.map((x) => `${x.id} (${x.nodes.length}): ${x.nodes.slice(0, 2).map((n) => n.target.join(" ")).join(" | ")}`));
  if (v.length) { bad += v.length; console.log(`${path} ${theme} ${width}\n  ${v.join("\n  ")}`); }
  await ctx.close();
}
await browser.close();
console.log(bad ? `axe: ${bad} violation(s)` : `axe: ${paths.length} pages x 2 themes x 2 widths, 0 violations`);
process.exit(bad ? 1 : 0);
