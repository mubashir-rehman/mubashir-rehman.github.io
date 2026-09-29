#!/usr/bin/env node
// Layout regression check across real-world viewports. Run against a preview server:
//   npx astro preview --port 4321 &  node scripts/viewport-check.mjs
// Fails if any page scrolls sideways, or if the home page's primary actions fall below the fold.
// Sizes cover phones, tablets, scaled laptops (125% and 150% Windows scaling) and desktops,
// plus 200% zoom on a 1280 laptop (WCAG 1.4.10 reflow: equivalent to a 640px-wide viewport).
import { chromium } from "playwright";

const BASE = process.env.BASE_URL || "http://localhost:4321";
const VIEWPORTS = [
  [320, 568, "small phone / 200% zoom reflow"], [375, 667, "iPhone SE"], [390, 844, "iPhone 14"],
  [412, 915, "Android"], [768, 1024, "iPad portrait"], [1024, 768, "iPad landscape"],
  [1280, 590, "laptop at 150% scaling"], [1366, 657, "common laptop"], [1536, 730, "laptop at 125% scaling"],
  [1440, 900, "MacBook"], [1920, 960, "desktop"], [2560, 1300, "large desktop"], [640, 400, "1280 at 200% zoom"],
];
const PAGES = ["/", "/projects/", "/projects/dental-ai-front-desk/", "/about/", "/journal/replacing-scraping-with-tavily/", "/for/backend/", "/contact/"];

const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH, args: ["--no-sandbox"] } : {});
const failures = [];
for (const [w, h, label] of VIEWPORTS) {
  const page = await (await browser.newContext({ viewport: { width: w, height: h }, reducedMotion: "reduce" })).newPage();
  for (const path of PAGES) {
    await page.goto(BASE + path, { waitUntil: "networkidle" });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    if (overflow > 1) failures.push(`${w}x${h} (${label}) ${path}: scrolls sideways by ${overflow}px`);
    if (path === "/") {
      const bottom = await page.$eval(".hero__main .actions", (e) => e.getBoundingClientRect().bottom);
      // On very short screens (a phone in landscape, heavy zoom) the name and headline come first
      // by design; the actions must still be within about one scroll.
      const limit = h >= 560 ? h : h * 1.6;
      if (bottom > limit) failures.push(`${w}x${h} (${label}) /: résumé and email buttons end at ${Math.round(bottom)}px (limit ${Math.round(limit)})`);
    }
  }
  await page.context().close();
}
await browser.close();
if (failures.length) { console.error(`viewport-check: ${failures.length} problem(s)\n  - ` + failures.join("\n  - ")); process.exit(1); }
console.log(`viewport-check: ${PAGES.length} pages x ${VIEWPORTS.length} viewports OK`);
