#!/usr/bin/env node
// The built site ships no JavaScript files (CLAUDE.md). Fails if dist/public contains any .js file.
import { readdirSync } from "node:fs";
import { join } from "node:path";
const walk = (d) => readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(join(d, e.name)) : [join(d, e.name)]));
const js = walk("dist/public").filter((f) => f.endsWith(".js") || f.endsWith(".mjs"));
if (js.length) { console.error(`zero-js: ${js.length} JavaScript file(s) in the build\n  ${js.join("\n  ")}`); process.exit(1); }
console.log("zero-js: OK");
