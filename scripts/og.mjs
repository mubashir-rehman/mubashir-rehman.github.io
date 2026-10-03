// Renders the site-wide social card and icons: node scripts/og.mjs
// Satori (layout to SVG) + resvg (SVG to PNG), with static Bricolage Grotesque and DM Sans cuts from
// Fontsource (Satori cannot read the variable woff2 files the site serves). Colours are the v3 dark palette.
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { makeTrace, STAR } from "../src/lib/trace.ts";

const ff = (pkg, file) => readFileSync(`node_modules/@fontsource/${pkg}/files/${file}`);
const fonts = [
  ...[300, 500, 700].map((weight) => ({ name: "Bricolage", data: ff("bricolage-grotesque", `bricolage-grotesque-latin-${weight}-normal.woff`), weight, style: "normal" })),
  ...[400, 600].map((weight) => ({ name: "DM Sans", data: ff("dm-sans", `dm-sans-latin-${weight}-normal.woff`), weight, style: "normal" })),
];
const C = { bg: "#0c0b0f", card: "#16141b", line: "#29252f", text: "#f4f1f8", mid: "#b8afc6", muted: "#9c95a8", accent: "#a96bff", accent2: "#d6b8ff", gold: "#e3a95c" };
const t = makeTrace(1144, 96, 450, 11, 70);
const h = (type, props, ...children) => ({ type, props: { ...props, children: children.length <= 1 ? children[0] : children } });

const card = h("div", { style: { width: 1200, height: 630, display: "flex", background: C.bg, padding: 28, fontFamily: "DM Sans" } },
  h("div", { style: { flex: 1, display: "flex", flexDirection: "column", position: "relative", borderRadius: 28, border: `1px solid ${C.line}`, padding: "44px 52px",
    backgroundColor: C.card, backgroundImage: "radial-gradient(circle at 85% 0%, rgba(150,80,255,0.28), rgba(22,20,27,0) 55%)", color: C.text } },
    h("div", { style: { display: "flex", alignItems: "center", gap: 14, fontFamily: "Bricolage", fontWeight: 700, fontSize: 30 } },
      h("svg", { width: 34, height: 34, viewBox: "0 0 24 24" }, h("path", { d: STAR, fill: "none", stroke: C.accent, strokeWidth: 1.5 }), h("rect", { x: 10, y: 10, width: 4, height: 4, fill: C.gold, transform: "rotate(45 12 12)" })),
      "Mubashir Rehman"),
    h("div", { style: { display: "flex", flexDirection: "column", marginTop: 40, fontFamily: "Bricolage", fontSize: 66, lineHeight: 1.04, letterSpacing: "-0.03em" } },
      h("span", { style: { fontWeight: 700, color: C.text } }, "I like difficult systems."),
      h("span", { style: { fontWeight: 500, color: C.mid } }, "I like figuring out why they break."),
      h("span", { style: { fontWeight: 300, color: C.accent2 } }, "Then I like making them boring.")),
    h("svg", { width: 1144, height: 96, viewBox: "0 0 1144 96", style: { position: "absolute", left: 0, bottom: 84 } },
      h("path", { d: t.d, fill: "none", stroke: C.gold, strokeWidth: 2.2 }),
      h("rect", { x: t.mx - 6, y: t.my - 6, width: 12, height: 12, fill: C.accent, transform: `rotate(45 ${t.mx} ${t.my})` })),
    h("div", { style: { position: "absolute", left: 52, right: 52, bottom: 36, display: "flex", justifyContent: "space-between", fontSize: 24, fontWeight: 600, color: C.muted } },
      h("span", {}, "Backend / systems engineer · Lahore"), h("span", { style: { color: C.accent2 } }, "mubashirrehman.com"))));

const png = (svg, w) => new Resvg(svg, { fitTo: { mode: "width", value: w } }).render().asPng();
mkdirSync("public/og", { recursive: true });
writeFileSync("public/og/default.png", png(await satori(card, { width: 1200, height: 630, fonts }), 1200));

const fav = (bg, s, c) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" rx="5" fill="${bg}"/><path d="${STAR}" fill="none" stroke="${s}" stroke-width="1.9" transform="translate(12 12) scale(.8) translate(-12 -12)"/><rect x="10" y="10" width="4" height="4" fill="${c}" transform="rotate(45 12 12)"/></svg>`;
writeFileSync("public/favicon.svg", `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><style>.b{fill:#0c0b0f}.s{fill:none;stroke:#a96bff;stroke-width:1.9}.c{fill:#e3a95c}@media(prefers-color-scheme:light){.b{fill:#f5f0e7}.s{stroke:#7a2fd9}.c{fill:#9a6413}}</style><rect class="b" width="24" height="24" rx="5"/><path class="s" d="${STAR}" transform="translate(12 12) scale(.8) translate(-12 -12)"/><rect class="c" x="10" y="10" width="4" height="4" transform="rotate(45 12 12)"/></svg>\n`);
writeFileSync("public/apple-touch-icon.png", png(fav("#0c0b0f", "#a96bff", "#e3a95c"), 180));
console.log("og/default.png, favicon.svg, apple-touch-icon.png written");
