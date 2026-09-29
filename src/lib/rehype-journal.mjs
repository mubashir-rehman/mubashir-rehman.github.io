// Build-time rehype pass for journal Markdown. Three authoring affordances, none of which need
// raw HTML in the content and none of which ship JavaScript:
//
//   callouts   `> [!NOTE] ...`                 (GitHub alert syntax: NOTE, TIP, WARNING)
//   figures    `![alt](./x.webp "Caption")`    (an image with a title becomes a <figure>)
//   tables     wide tables scroll inside their own container, never the page body
//
// Works on the hast tree directly so it adds no dependencies.

const ALERTS = { NOTE: "Note", TIP: "Tip", WARNING: "Warning" };
const MARKER = /^\s*\[!(\w+)\]\s*/;

const isEl = (n, tag) => n && n.type === "element" && (!tag || n.tagName === tag);
const isBlank = (n) => n.type === "text" && !n.value.trim();

function firstText(node) {
  if (!node) return null;
  if (node.type === "text") return node;
  for (const c of node.children || []) {
    const t = firstText(c);
    if (t) return t;
  }
  return null;
}

function transform(node) {
  if (!node.children) return;
  node.children = node.children.map((child) => {
    // Callout
    if (isEl(child, "blockquote")) {
      const firstP = child.children.find((c) => isEl(c, "p"));
      const t = firstText(firstP);
      const m = t && t.value.match(MARKER);
      const kind = m && m[1].toUpperCase();
      if (kind && ALERTS[kind]) {
        t.value = t.value.replace(MARKER, "");
        return {
          type: "element",
          tagName: "div",
          properties: { className: ["callout"], dataKind: kind.toLowerCase(), role: "note" },
          children: [
            { type: "element", tagName: "p", properties: { className: ["callout-label"] }, children: [{ type: "text", value: ALERTS[kind] }] },
            ...child.children,
          ],
        };
      }
    }
    // Figure: a paragraph that holds only an image
    if (isEl(child, "p")) {
      const kids = child.children.filter((c) => !isBlank(c));
      if (kids.length === 1 && isEl(kids[0], "img")) {
        const img = kids[0];
        const caption = img.properties && img.properties.title;
        if (caption) {
          delete img.properties.title;
          return {
            type: "element",
            tagName: "figure",
            properties: {},
            children: [img, { type: "element", tagName: "figcaption", properties: {}, children: [{ type: "text", value: String(caption) }] }],
          };
        }
        return img;
      }
    }
    // Table
    if (isEl(child, "table")) {
      return {
        type: "element",
        tagName: "div",
        properties: { className: ["table-scroll"], tabIndex: 0, role: "region", ariaLabel: "Table, scrolls sideways" },
        children: [child],
      };
    }
    transform(child);
    return child;
  });
}

export default function rehypeJournal() {
  return (tree) => transform(tree);
}
