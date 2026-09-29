// Renders the site-wide social card and icons: node scripts/og.mjs
// Satori (layout to SVG) + resvg (SVG to PNG), with static Archivo cuts from Fontsource.
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { makeTrace, STAR } from "../src/lib/trace.ts";

const font = (w) => readFileSync(`node_modules/@fontsource/archivo/files/archivo-latin-${w}-normal.woff`);
const fonts = [400, 600, 800].map((weight) => ({ name: "Archivo", data: font(weight), weight, style: "normal" }));
const t = makeTrace(1200, 96, 470, 11, 78);
const h = (type, props, ...children) => ({ type, props: { ...props, children: children.length <= 1 ? children[0] : children } });

const card = h("div", { style: { width: 1200, height: 630, display: "flex", flexDirection: "column", background: "#000", color: "#efeff3", fontFamily: "Archivo", padding: "56px 64px", position: "relative" } },
  h("div", { style: { display: "flex", alignItems: "center", gap: 14, fontSize: 30, fontWeight: 600 } },
    h("svg", { width: 36, height: 36, viewBox: "0 0 24 24" }, h("path", { d: STAR, fill: "none", stroke: "#ae4efe", strokeWidth: 1.5 }), h("rect", { x: 10, y: 10, width: 4, height: 4, fill: "#3883ff", transform: "rotate(45 12 12)" })),
    "Mubashir Rehman"),
  h("div", { style: { display: "flex", flexDirection: "column", marginTop: 56, fontSize: 64, lineHeight: 1.04, letterSpacing: "-0.02em" } },
    h("span", { style: { fontWeight: 800 } }, "I like difficult systems."),
    h("span", { style: { fontWeight: 600 } }, "I like figuring out why they break."),
    h("span", { style: { fontWeight: 400 } }, "Then I like making them boring.")),
  h("svg", { width: 1200, height: 96, viewBox: "0 0 1200 96", style: { position: "absolute", left: 0, bottom: 96 } },
    h("path", { d: t.d, fill: "none", stroke: "#3883ff", strokeWidth: 2 }),
    h("rect", { x: t.mx - 6, y: t.my - 6, width: 12, height: 12, fill: "#ae4efe", transform: `rotate(45 ${t.mx} ${t.my})` })),
  h("div", { style: { position: "absolute", left: 64, right: 64, bottom: 40, display: "flex", justifyContent: "space-between", fontSize: 24, color: "#a9a9b6" } },
    h("span", {}, "Backend software engineer, Lahore"), h("span", {}, "mubashir-rehman.is-a.dev")));

const png = (svg, w) => new Resvg(svg, { fitTo: { mode: "width", value: w } }).render().asPng();
mkdirSync("public/og", { recursive: true });
writeFileSync("public/og/default.png", png(await satori(card, { width: 1200, height: 630, fonts }), 1200));

const fav = (bg, s, c) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" rx="5" fill="${bg}"/><path d="${STAR}" fill="none" stroke="${s}" stroke-width="1.9" transform="translate(12 12) scale(.8) translate(-12 -12)"/><rect x="10" y="10" width="4" height="4" fill="${c}" transform="rotate(45 12 12)"/></svg>`;
writeFileSync("public/favicon.svg", `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><style>.b{fill:#000}.s{fill:none;stroke:#ae4efe;stroke-width:1.9}.c{fill:#3883ff}@media(prefers-color-scheme:light){.b{fill:#fff}.s{stroke:#922adf}.c{fill:#1866e0}}</style><rect class="b" width="24" height="24" rx="5"/><path class="s" d="${STAR}" transform="translate(12 12) scale(.8) translate(-12 -12)"/><rect class="c" x="10" y="10" width="4" height="4" transform="rotate(45 12 12)"/></svg>\n`);
writeFileSync("public/apple-touch-icon.png", png(fav("#000", "#ae4efe", "#3883ff"), 180));
console.log("og/default.png, favicon.svg, apple-touch-icon.png written");
