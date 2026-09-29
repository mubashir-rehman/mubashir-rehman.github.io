// Design tokens + WCAG contrast report. Zero dependencies (Node 18+).
// Source of truth for the palette: edit the OKLCH definitions below, run
//   node tokens.mjs            -> prints the contrast report (markdown tables)
//   node tokens.mjs --css      -> prints the CSS custom properties
//   node tokens.mjs --json     -> prints tokens + contrast results as JSON
// Ratios use the WCAG 2.x relative-luminance formula on the final sRGB hex values.

// ---------- colour maths ----------
const rad = (d) => (d * Math.PI) / 180;
function oklchToLinear(L, C, h) {
  const a = C * Math.cos(rad(h)), b = C * Math.sin(rad(h));
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;
  const l = l_ ** 3, m = m_ ** 3, s = s_ ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}
const inGamut = (rgb) => rgb.every((v) => v >= -0.0005 && v <= 1.0005);
const enc = (c) => {
  c = Math.max(0, Math.min(1, c));
  return c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055;
};
const hex = (rgb) => "#" + rgb.map((v) => Math.round(enc(v) * 255).toString(16).padStart(2, "0")).join("");
// OKLCH -> hex, reducing chroma until the colour is inside sRGB
export function ok(L, C, h) {
  let lo = 0, hi = C, best = 0;
  if (inGamut(oklchToLinear(L, C, h))) return hex(oklchToLinear(L, C, h));
  for (let i = 0; i < 24; i++) {
    const mid = (lo + hi) / 2;
    if (inGamut(oklchToLinear(L, mid, h))) { best = mid; lo = mid; } else hi = mid;
  }
  return hex(oklchToLinear(L, best, h));
}
const s2l = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
export const lum = (h) => { const [r, g, b] = rgb(h).map(s2l); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
export const contrast = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };

// ---------- palette definitions ----------
// Ramp lightness is shared; hue and chroma differ per palette.
const STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
const RAMP_L = { 50: 0.975, 100: 0.95, 200: 0.9, 300: 0.83, 400: 0.73, 500: 0.63, 600: 0.54, 700: 0.46, 800: 0.38, 900: 0.3, 950: 0.22 };
const RAMP_C = { 50: 0.05, 100: 0.11, 200: 0.24, 300: 0.45, 400: 0.72, 500: 1, 600: 1, 700: 0.92, 800: 0.74, 900: 0.52, 950: 0.34 };
const ramp = (h, peak) => Object.fromEntries(STEPS.map((s) => [s, ok(RAMP_L[s], peak * RAMP_C[s], h)]));

export const PALETTES = {
  a: {
    name: "A. Amethyst and Cobalt (recommended)",
    neutral: { h: 285, dark: 0.55, light: 0.7 }, // greys carry a whisper of violet; the page itself is true black / true white
    purple: { h: 305, peak: 0.25 },              // amethyst
    blue: { h: 260, peak: 0.2 },                 // cobalt
    danger: 24, warning: 78, success: 158,
  },
  b: {
    name: "B. Ink (alternative, quieter pigments)",
    neutral: { h: 270, dark: 0.3, light: 0.4 },
    purple: { h: 298, peak: 0.155 },             // dusk violet
    blue: { h: 252, peak: 0.13 },                // steel cobalt
    danger: 22, warning: 82, success: 160,
  },
};

export function build(key) {
  const P = PALETTES[key];
  const purple = ramp(P.purple.h, P.purple.peak);
  const blue = ramp(P.blue.h, P.blue.peak);
  const nDark = (L, C = 0.012) => ok(L, C * P.neutral.dark, P.neutral.h);
  const nLight = (L, C = 0.008) => ok(L, C * P.neutral.light, P.neutral.h);
  const sem = (h, L, C) => ok(L, C, h);

  const dark = {
    "bg-0": "#000000", "bg-1": nDark(0.17, 0.012), "bg-2": nDark(0.205, 0.014), "bg-3": nDark(0.25, 0.016),
    "bg-overlay": nDark(0.19, 0.014),
    "line-1": nDark(0.24, 0.014), "line-2": nDark(0.315, 0.02), "line-3": nDark(0.53, 0.03),
    "text-1": nDark(0.955, 0.006), "text-2": nDark(0.79, 0.014), "text-3": nDark(0.665, 0.02), "text-4": nDark(0.46, 0.02),
    "accent": purple[500], "accent-hover": purple[400], "accent-press": ok(0.6, P.purple.peak, P.purple.h),
    "on-accent": "#000000", "accent-text": purple[400], "accent-tint": ok(0.235, P.purple.peak * 0.36, P.purple.h),
    "accent-line": purple[500],
    "signal": blue[500], "signal-text": blue[400], "signal-tint": ok(0.235, P.blue.peak * 0.4, P.blue.h),
    "focus": blue[400],
    "selection-bg": purple[800], "selection-text": nDark(0.98, 0.004),
    "success": sem(P.success, 0.79, 0.14), "success-tint": sem(P.success, 0.24, 0.05), "success-line": sem(P.success, 0.62, 0.12),
    "warning": sem(P.warning, 0.83, 0.15), "warning-tint": sem(P.warning, 0.25, 0.05), "warning-line": sem(P.warning, 0.66, 0.13),
    "danger": sem(P.danger, 0.72, 0.17), "danger-tint": sem(P.danger, 0.24, 0.06), "danger-line": sem(P.danger, 0.62, 0.19),
    // diagram
    "dg-node-fill": "#000000", "dg-node-stroke": nDark(0.56, 0.03),
    "dg-own-fill": ok(0.19, P.purple.peak * 0.3, P.purple.h), "dg-own-stroke": ok(0.55, P.purple.peak, P.purple.h),
    "dg-edge": ok(0.665, P.blue.peak * 0.85, P.blue.h), "dg-edge-idle": nDark(0.44, 0.03),
    "dg-boundary": nDark(0.5, 0.03), "dg-label": nDark(0.79, 0.014), "dg-note": nDark(0.665, 0.02),
    "dg-active-fill": ok(0.2, P.blue.peak * 0.35, P.blue.h), "dg-fail": sem(P.danger, 0.66, 0.18),
    "dg-step-bg": purple[500], "dg-step-text": "#000000",
    // syntax
    "syn-bg": nDark(0.17, 0.012), "syn-plain": nDark(0.93, 0.008), "syn-punct": nDark(0.72, 0.015),
    "syn-comment": nDark(0.665, 0.02), "syn-keyword": purple[300], "syn-function": blue[300], "syn-property": blue[400],
    "syn-string": sem(P.success, 0.82, 0.11), "syn-number": sem(P.warning, 0.84, 0.12), "syn-type": purple[200],
    "syn-line-hl": nDark(0.21, 0.02),
  };

  const light = {
    "bg-0": "#ffffff", "bg-1": nLight(0.965, 0.006), "bg-2": nLight(0.935, 0.009), "bg-3": nLight(0.905, 0.011),
    "bg-overlay": "#ffffff",
    "line-1": nLight(0.925, 0.008), "line-2": nLight(0.87, 0.01), "line-3": nLight(0.585, 0.02),
    "text-1": nLight(0.16, 0.014), "text-2": nLight(0.4, 0.02), "text-3": nLight(0.485, 0.02), "text-4": nLight(0.66, 0.015),
    "accent": purple[600], "accent-hover": purple[700], "accent-press": purple[800],
    "on-accent": "#ffffff", "accent-text": purple[700], "accent-tint": purple[100],
    "accent-line": purple[600],
    "signal": blue[600], "signal-text": blue[700], "signal-tint": blue[100],
    "focus": blue[600],
    "selection-bg": purple[200], "selection-text": nLight(0.16, 0.014),
    "success": sem(P.success, 0.44, 0.11), "success-tint": sem(P.success, 0.95, 0.04), "success-line": sem(P.success, 0.6, 0.12),
    "warning": sem(P.warning, 0.46, 0.1), "warning-tint": sem(P.warning, 0.95, 0.05), "warning-line": sem(P.warning, 0.64, 0.13),
    "danger": sem(P.danger, 0.5, 0.19), "danger-tint": sem(P.danger, 0.95, 0.03), "danger-line": sem(P.danger, 0.58, 0.2),
    "dg-node-fill": "#ffffff", "dg-node-stroke": nLight(0.52, 0.02),
    "dg-own-fill": purple[50], "dg-own-stroke": ok(0.46, P.purple.peak, P.purple.h),
    "dg-edge": ok(0.6, P.blue.peak * 0.95, P.blue.h), "dg-edge-idle": nLight(0.72, 0.015),
    "dg-boundary": nLight(0.58, 0.02), "dg-label": nLight(0.36, 0.02), "dg-note": nLight(0.46, 0.02),
    "dg-active-fill": blue[50], "dg-fail": sem(P.danger, 0.5, 0.19),
    "dg-step-bg": purple[600], "dg-step-text": "#ffffff",
    "syn-bg": nLight(0.965, 0.006), "syn-plain": nLight(0.2, 0.014), "syn-punct": nLight(0.42, 0.02),
    "syn-comment": nLight(0.47, 0.02), "syn-keyword": purple[700], "syn-function": blue[700], "syn-property": blue[800],
    "syn-string": sem(P.success, 0.42, 0.1), "syn-number": sem(P.warning, 0.44, 0.1), "syn-type": purple[800],
    "syn-line-hl": nLight(0.925, 0.012),
  };
  return { purple, blue, dark, light };
}

// ---------- contrast pairs ----------
// [id, fg token, bg token, minimum, group]
const T = 4.5, U = 3;
const layers = ["bg-0", "bg-1", "bg-2"];
export const PAIRS = [
  ...["text-1", "text-2", "text-3"].flatMap((f) => [...layers, "bg-3"].map((b) => [`${f} on ${b}`, f, b, T, "Text"])),
  ...layers.map((b) => [`accent-text on ${b}`, "accent-text", b, T, "Text"]),
  ...layers.map((b) => [`signal-text on ${b}`, "signal-text", b, T, "Text"]),
  ["accent-text on accent-tint", "accent-text", "accent-tint", T, "Text"],
  ["signal-text on signal-tint", "signal-text", "signal-tint", T, "Text"],
  ["on-accent on accent (primary button)", "on-accent", "accent", T, "Text"],
  ["on-accent on accent-hover", "on-accent", "accent-hover", T, "Text"],
  ["on-accent on accent-press", "on-accent", "accent-press", T, "Text"],
  ["text-1 on selection-bg", "selection-text", "selection-bg", T, "Text"],
  ["success on bg-0", "success", "bg-0", T, "Text"], ["success on success-tint", "success", "success-tint", T, "Text"],
  ["warning on bg-0", "warning", "bg-0", T, "Text"], ["warning on warning-tint", "warning", "warning-tint", T, "Text"],
  ["danger on bg-0", "danger", "bg-0", T, "Text"], ["danger on danger-tint", "danger", "danger-tint", T, "Text"],
  ["syn-plain on syn-bg", "syn-plain", "syn-bg", T, "Code"], ["syn-punct on syn-bg", "syn-punct", "syn-bg", T, "Code"],
  ["syn-comment on syn-bg", "syn-comment", "syn-bg", T, "Code"], ["syn-keyword on syn-bg", "syn-keyword", "syn-bg", T, "Code"],
  ["syn-function on syn-bg", "syn-function", "syn-bg", T, "Code"], ["syn-property on syn-bg", "syn-property", "syn-bg", T, "Code"],
  ["syn-string on syn-bg", "syn-string", "syn-bg", T, "Code"], ["syn-number on syn-bg", "syn-number", "syn-bg", T, "Code"],
  ["syn-type on syn-bg", "syn-type", "syn-bg", T, "Code"], ["syn-plain on syn-line-hl", "syn-plain", "syn-line-hl", T, "Code"],
  ["syn-comment on syn-line-hl", "syn-comment", "syn-line-hl", T, "Code"],
  ["dg-label on dg-node-fill", "dg-label", "dg-node-fill", T, "Diagram text"], ["dg-note on bg-0", "dg-note", "bg-0", T, "Diagram text"],
  ["dg-label on dg-own-fill", "dg-label", "dg-own-fill", T, "Diagram text"],
  ["dg-label on dg-active-fill", "dg-label", "dg-active-fill", T, "Diagram text"],
  ["dg-step-text on dg-step-bg", "dg-step-text", "dg-step-bg", T, "Diagram text"],
  ["dg-fail on bg-0 (annotation text)", "dg-fail", "bg-0", T, "Diagram text"],
  // UI components and graphics (3:1)
  ["line-3 on bg-0 (input, secondary button border)", "line-3", "bg-0", U, "UI"],
  ["line-3 on bg-1", "line-3", "bg-1", U, "UI"],
  ["accent on bg-0 (primary button boundary)", "accent", "bg-0", U, "UI"],
  ["focus on bg-0", "focus", "bg-0", U, "UI"], ["focus on bg-1", "focus", "bg-1", U, "UI"], ["focus on bg-2", "focus", "bg-2", U, "UI"],
  ["signal on bg-0 (toggle, active marker)", "signal", "bg-0", U, "UI"],
  ["accent-line on bg-0 (selected tag, current marker)", "accent-line", "bg-0", U, "UI"],
  ["text-3 on bg-0 (icons)", "text-3", "bg-0", U, "UI"],
  ["success-line on bg-0", "success-line", "bg-0", U, "UI"], ["warning-line on bg-0", "warning-line", "bg-0", U, "UI"],
  ["danger-line on bg-0 (invalid field border)", "danger-line", "bg-0", U, "UI"],
  ["dg-node-stroke on bg-0", "dg-node-stroke", "bg-0", U, "Diagram"], ["dg-own-stroke on bg-0", "dg-own-stroke", "bg-0", U, "Diagram"],
  ["dg-own-stroke on dg-own-fill", "dg-own-stroke", "dg-own-fill", U, "Diagram"],
  ["dg-edge on bg-0", "dg-edge", "bg-0", U, "Diagram"], ["dg-edge on dg-active-fill", "dg-edge", "dg-active-fill", U, "Diagram"],
  ["dg-boundary on bg-0", "dg-boundary", "bg-0", U, "Diagram"], ["dg-fail on bg-0 (stroke)", "dg-fail", "bg-0", U, "Diagram"],
  ["dg-step-bg on bg-0", "dg-step-bg", "bg-0", U, "Diagram"],
  ["dg-edge-idle on bg-0 (decorative, not required)", "dg-edge-idle", "bg-0", 0, "Diagram"],
  ["line-2 on bg-0 (decorative hairline, not required)", "line-2", "bg-0", 0, "Decorative"],
  ["line-1 on bg-0 (decorative hairline, not required)", "line-1", "bg-0", 0, "Decorative"],
];

export function report(key) {
  const set = build(key);
  const out = {};
  for (const theme of ["dark", "light"]) {
    out[theme] = PAIRS.map(([id, f, b, min, group]) => {
      const fg = set[theme][f], bg = set[theme][b];
      const r = contrast(fg, bg);
      return { id, fg: f, bg: b, fgHex: fg, bgHex: bg, ratio: +r.toFixed(2), min, group, pass: r >= min };
    });
  }
  return out;
}

export function css(key) {
  const set = build(key);
  const sel = key === "a"
    ? { prim: ':root,\n[data-palette="a"]', dark: ':root,\n[data-theme="dark"]', light: '[data-theme="light"]' }
    : { prim: '[data-palette="b"]', dark: '[data-palette="b"][data-theme="dark"]', light: '[data-palette="b"][data-theme="light"]' };
  const ref = (v) => {
    for (const [n, r] of [["purple", set.purple], ["blue", set.blue]])
      for (const st of STEPS) if (r[st] === v) return `var(--${n}-${st})`;
    return v;
  };
  const lines = [];
  lines.push(`/* ${PALETTES[key].name}: primitives */`);
  lines.push(`${sel.prim} {`);
  for (const [n, r] of [["purple", set.purple], ["blue", set.blue]])
    for (const st of STEPS) lines.push(`  --${n}-${st}: ${r[st]};`);
  lines.push("}");
  for (const theme of ["dark", "light"]) {
    lines.push(`/* ${PALETTES[key].name}: ${theme} semantic */`);
    lines.push(`${sel[theme]} {`);
    lines.push(`  color-scheme: ${theme};`);
    for (const [k, v] of Object.entries(set[theme])) lines.push(`  --${k}: ${ref(v)};`);
    lines.push("}");
  }
  return lines.join("\n");
}

// ---------- type scale (fluid between 360px and 1440px viewports) ----------
// [token, min px @360, max px @1440, line-height, tracking, weight, family, role]
export const TYPE = [
  // token, min px @360, max px @1440, line-height, tracking, weight, width (font-stretch %), family, role
  ["label",   13, 14,   1.35, "0.015em", 500, 78,  "sans", "Drafting-style labels: captions, metadata, figure notes (sentence case)"],
  ["small",   14, 15,   1.5,  "0",       400, 100, "sans", "Helper text, table cells, form hints"],
  ["body",    17, 18,   1.62, "0",       400, 100, "sans", "Body copy and long-form prose"],
  ["lead",    20, 23,   1.45, "-0.005em",400, 100, "sans", "Intro paragraph under a title"],
  ["h4",      24, 30,   1.22, "-0.015em",600, 100, "sans", "Work titles, minor headings"],
  ["h3",      29, 40,   1.15, "-0.02em", 620, 100, "sans", "Subsection headings"],
  ["h2",      34, 50,   1.08, "-0.028em",640, 100, "sans", "Section headings"],
  ["h1",      40, 66,   1.03, "-0.03em", 680, 100, "sans", "Page title (exactly one per page)"],
  ["display", 34, 68,   1.03, "-0.02em", 800, 66,  "sans", "Hero statement only; axes travel per line"],
  ["code",    13, 14,   1.65, "0",       400, 90,  "mono", "Code blocks and inline code only"],
];
const fluid = (a, b) => {
  const slope = (b - a) / (1440 - 360), inter = a - slope * 360;
  const f = (n) => +n.toFixed(4);
  return `clamp(${f(a / 16)}rem, ${f(inter / 16)}rem + ${f(slope * 100)}vw, ${f(b / 16)}rem)`;
};
export function typeCss() {
  return TYPE.map(([n, a, b, lh, ls]) => `  --fs-${n}: ${fluid(a, b)};\n  --lh-${n}: ${lh};\n  --ls-${n}: ${ls};`).join("\n");
}

// ---------- CLI ----------
// ---------- site output: palette A, dark by default, system-aware light ----------
export function siteCss() {
  const set = build("a");
  const block = (t) => Object.entries(set[t]).map(([k, v]) => `  --${k}: ${v};`).join("\n");
  return [
    "/* Generated by design/tokens.mjs (npm run tokens). Do not edit by hand. */",
    ":root {",
    "  color-scheme: dark;",
    block("dark"),
    typeCss(),
    "}",
    "@media (prefers-color-scheme: light) {",
    "  :root:not([data-theme=\"dark\"]) {",
    "    color-scheme: light;",
    block("light").replace(/^/gm, "  "),
    "  }",
    "}",
    ':root[data-theme="light"] {',
    "  color-scheme: light;",
    block("light"),
    "}",
    "",
  ].join("\n");
}

const isMain = process.argv[1] && process.argv[1].endsWith("tokens.mjs");
if (isMain) {
  const arg = process.argv[2];
  if (arg === "--site") { console.log(siteCss()); }
  else if (arg === "--css") { console.log(css("a")); console.log(css("b")); }
  else if (arg === "--type") { console.log(typeCss()); }
  else if (arg === "--json") {
    console.log(JSON.stringify({ a: { tokens: build("a"), contrast: report("a") }, b: { tokens: build("b"), contrast: report("b") } }, null, 2));
  } else {
    let fails = 0;
    for (const key of ["a", "b"]) {
      const rep = report(key);
      console.log(`\n# ${PALETTES[key].name}`);
      for (const theme of ["dark", "light"]) {
        console.log(`\n## ${theme}`);
        console.log("| Pair | Ratio | Needs | Result |\n|---|---|---|---|");
        for (const r of rep[theme]) {
          if (!r.pass) fails++;
          console.log(`| ${r.id} (${r.fgHex} on ${r.bgHex}) | ${r.ratio}:1 | ${r.min ? r.min + ":1" : "n/a"} | ${r.min ? (r.pass ? "pass" : "FAIL") : "info"} |`);
        }
      }
    }
    console.log(`\nfailures: ${fails}`);
    process.exitCode = fails ? 1 : 0;
  }
}
