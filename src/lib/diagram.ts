// Lays out a case-study system diagram from data (nodes in request-path order, plus edges).
// Two layouts from the same data: a two-row "snake" for wide screens and a single column for
// phones. Path edges between consecutive nodes carry the numbered request path; any other edge
// in the data is drawn dashed. Pure function, so it is testable and ships no JavaScript.
export type DNode = { id: string; label: string; text: string };
export type Box = DNode & { n: number; x: number; y: number; w: number; h: number };
export type Layout = { W: number; H: number; boxes: Box[]; path: string; extras: string[]; hops: string[] };

const cx = (b: Box) => b.x + b.w / 2;
const cy = (b: Box) => b.y + b.h / 2;

// Point where the segment from a box's centre towards (tx, ty) leaves the box.
function exit(b: Box, tx: number, ty: number) {
  const dx = tx - cx(b), dy = ty - cy(b);
  const sx = dx ? b.w / 2 / Math.abs(dx) : Infinity;
  const sy = dy ? b.h / 2 / Math.abs(dy) : Infinity;
  const s = Math.min(sx, sy);
  return [cx(b) + dx * s, cy(b) + dy * s];
}

function hop(a: Box, b: Box, gap = 6) {
  const [x1, y1] = exit(a, cx(b), cy(b));
  const [x2, y2] = exit(b, cx(a), cy(a));
  const len = Math.hypot(x2 - x1, y2 - y1) || 1;
  const ux = (x2 - x1) / len, uy = (y2 - y1) / len;
  return `M${(x1 + ux * 2).toFixed(1)} ${(y1 + uy * 2).toFixed(1)}L${(x2 - ux * gap).toFixed(1)} ${(y2 - uy * gap).toFixed(1)}`;
}

function finish(boxes: Box[], edges: [string, string][], W: number, H: number): Layout {
  const byId = new Map(boxes.map((b) => [b.id, b]));
  const hops = boxes.slice(1).map((b, i) => hop(boxes[i], b));
  const path = "M" + boxes.map((b) => `${cx(b).toFixed(1)} ${cy(b).toFixed(1)}`).join("L");
  const consecutive = new Set(boxes.slice(1).map((b, i) => `${boxes[i].id}>${b.id}`));
  const extras = edges
    .filter(([a, b]) => byId.has(a) && byId.has(b) && !consecutive.has(`${a}>${b}`) && !consecutive.has(`${b}>${a}`))
    .map(([a, b]) => {
      const A = byId.get(a)!, B = byId.get(b)!;
      const [x1, y1] = exit(A, cx(B), cy(B));
      const [x2, y2] = exit(B, cx(A), cy(A));
      const mx = (x1 + x2) / 2, my = (y1 + y2) / 2 - 28;
      return `M${x1.toFixed(1)} ${y1.toFixed(1)}Q${mx.toFixed(1)} ${my.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`;
    });
  return { W, H, boxes, path, extras, hops };
}

export function layoutWide(nodes: DNode[], edges: [string, string][]): Layout {
  const w = 176, h = 60, gx = 64, gy = 72, pad = 24;
  const perRow = nodes.length <= 4 ? nodes.length : Math.ceil(nodes.length / 2);
  const rows = Math.ceil(nodes.length / perRow);
  const boxes = nodes.map((n, i) => {
    const row = Math.floor(i / perRow);
    let col = i % perRow;
    if (row % 2 === 1) col = perRow - 1 - col; // snake: the second row runs right to left
    return { ...n, n: i + 1, x: pad + col * (w + gx), y: pad + 12 + row * (h + gy), w, h };
  });
  return finish(boxes, edges, pad * 2 + perRow * w + (perRow - 1) * gx, pad * 2 + 12 + rows * h + (rows - 1) * gy);
}

export function layoutNarrow(nodes: DNode[], edges: [string, string][]): Layout {
  const w = 280, h = 56, gy = 40, pad = 16;
  const boxes = nodes.map((n, i) => ({ ...n, n: i + 1, x: pad + 14, y: pad + 12 + i * (h + gy), w, h }));
  return finish(boxes, edges, pad * 2 + 14 + w + 40, pad * 2 + 12 + nodes.length * h + (nodes.length - 1) * gy);
}

// Compact layout for the home and index artifacts: small boxes, a snake of up to three per row.
export function layoutMini(nodes: DNode[], edges: [string, string][], cols = 3): Layout {
  const w = 148, h = 46, gx = 34, gy = 40, pad = 14;
  const perRow = Math.min(cols, nodes.length);
  const rows = Math.ceil(nodes.length / perRow);
  const boxes = nodes.map((n, i) => {
    const row = Math.floor(i / perRow);
    let col = i % perRow;
    if (row % 2 === 1) col = perRow - 1 - col;
    return { ...n, n: i + 1, x: pad + col * (w + gx), y: pad + row * (h + gy), w, h };
  });
  return finish(boxes, edges, pad * 2 + perRow * w + (perRow - 1) * gx, pad * 2 + rows * h + (rows - 1) * gy);
}
