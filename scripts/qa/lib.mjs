// Shared helpers for the QA scripts. Needs a preview server: npm run build && npx astro preview --port 4321
// Uses CHROME_PATH when set (cloud sessions), otherwise Playwright's own browser.
import { chromium } from "playwright";
import { readdirSync } from "node:fs";

export const BASE = process.env.BASE_URL || "http://localhost:4321";
export const launch = () => chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH, args: ["--no-sandbox"] } : {});

// One context per theme, with the theme stored the way the site's toggle stores it.
export async function context(browser, { theme = "dark", width = 1440, height = 900, phone = false } = {}) {
  const ctx = await browser.newContext({ viewport: { width, height }, colorScheme: theme, reducedMotion: "reduce", ...(phone ? { isMobile: true, hasTouch: true } : {}) });
  // localStorage can throw in some contexts; the site then falls back to the system theme, which is fine here.
  await ctx.addInitScript((t) => { try { localStorage.setItem("theme", t); } catch { /* ignore */ } }, theme);
  return ctx;
}

// Scroll the page so lazy images load, then wait for fonts.
export const settle = (page) => page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 700) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 40)); } scrollTo(0, 0); await document.fonts.ready; });

export const caseStudies = () => readdirSync("src/content/work").filter((f) => f.endsWith(".md")).map((f) => `/projects/${f.slice(0, -3)}/`);
export const KEY_PAGES = ["/", "/projects/", "/projects/dental-ai-front-desk/", "/about/", "/services/", "/for/backend/", "/journal/", "/journal/rebuilding-for-mobile/", "/contact/", "/404.html"];
export const INNER_PAGES = () => ["/projects/", ...caseStudies(), "/about/", "/services/", "/for/backend/", "/for/ai-backend/", "/for/full-stack/", "/for/erp-hrms/", "/journal/", "/contact/", "/404.html"];
export const slug = (path) => (path === "/" ? "home" : path.replace(/\//g, "_").replace(/^_|_$/g, ""));
