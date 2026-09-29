// The hero trace: a rule that starts as noisy telemetry, spikes twice (two incidents), then
// settles flat. It is the site's one bold element and the visual form of the hero line.
// Seeded, so every build draws the same curve.
function rng(seed: number) {
  let s = seed >>> 0;
  return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296;
}

export function makeTrace(W: number, H: number, noiseEnd: number, seed: number, amp: number) {
  const r = rng(seed);
  const base = H - 8;
  const pts: [number, number][] = [[0, base - amp * 0.22]];
  let x = 0;
  const step = noiseEnd / 46;
  while (x < noiseEnd - step * 0.5) {
    const t = x / noiseEnd;
    const env = t < 0.22 ? 0.38 : t < 0.5 ? 0.38 + (t - 0.22) * 2.2 : Math.max(0.03, (1 - (t - 0.5) / 0.5) ** 1.9);
    x += step * (0.55 + r() * 0.95);
    const big = (t > 0.26 && t < 0.34) || (t > 0.44 && t < 0.5);
    const spike = big ? 0.85 + r() * 0.15 : r() < 0.2 ? 0.7 : 0.22 + r() * 0.35;
    pts.push([Math.min(x, noiseEnd - 2), base - amp * env * spike]);
  }
  pts.push([noiseEnd, base], [W, base]);
  const d = "M" + pts.map(([px, py]) => `${px.toFixed(1)} ${py.toFixed(1)}`).join("L");
  return { d, mx: noiseEnd, my: base, W, H };
}

export const TRACE_WIDE = makeTrace(1200, 96, 470, 11, 78);
export const TRACE_NARROW = makeTrace(360, 64, 138, 5, 46);

// Eight-point star (the Multan tile motif) used by the brand mark and favicon.
export const STAR = "M22 12L19.07 14.93V19.07H14.93L12 22L9.07 19.07H4.93V14.93L2 12L4.93 9.07V4.93H9.07L12 2L14.93 4.93H19.07V9.07Z";
