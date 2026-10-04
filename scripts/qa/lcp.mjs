#!/usr/bin/env node
// Portrait loading (the home page's LCP): for each system theme and chosen theme, which photo shows, which
// photos download and at what priority. Expected: the shown photo downloads at High; a visitor whose chosen
// theme matches the system downloads exactly one photo.
import { BASE, launch } from "./lib.mjs";

const browser = await launch();
for (const [system, chosen] of [["dark", null], ["light", null], ["dark", "light"], ["light", "dark"]]) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: system });
  if (chosen) await ctx.addInitScript((t) => localStorage.setItem("theme", t), chosen);
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  await cdp.send("Network.enable");
  const reqs = [];
  cdp.on("Network.requestWillBeSent", (e) => { if (/mubashir-rehman/.test(e.request.url)) reqs.push(`${e.request.url.split("/").pop()} @${e.request.initialPriority}`); });
  await page.goto(BASE + "/", { waitUntil: "load" });
  await page.waitForTimeout(500);
  const lcp = await page.evaluate(() => new Promise((r) => { new PerformanceObserver((l) => { const e = l.getEntries().pop(); r(e ? `${e.element?.tagName} ${(e.url || "").split("/").pop()} ${Math.round(e.startTime)}ms` : "none"); }).observe({ type: "largest-contentful-paint", buffered: true }); setTimeout(() => r("timeout"), 1500); }));
  console.log(`system ${system}, chosen ${chosen ?? "(none)"}\n  downloads: ${reqs.join(", ")}\n  LCP: ${lcp}`);
  await ctx.close();
}
await browser.close();
