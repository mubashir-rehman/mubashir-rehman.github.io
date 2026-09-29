import { describe, it, expect } from "vitest";
import { layoutWide, layoutNarrow } from "../diagram";
import rehypeJournal from "../rehype-journal.mjs";

const nodes = ["a", "b", "c", "d", "e"].map((id) => ({ id, label: id.toUpperCase(), text: id }));
const edges: [string, string][] = [["a", "b"], ["b", "c"], ["c", "d"], ["d", "e"], ["a", "e"]];

describe("diagram layout", () => {
  it("numbers nodes in path order and draws one hop per consecutive pair", () => {
    const L = layoutWide(nodes, edges);
    expect(L.boxes.map((b) => b.n)).toEqual([1, 2, 3, 4, 5]);
    expect(L.hops).toHaveLength(4);
    expect(L.extras).toHaveLength(1); // a -> e is not consecutive, so it is drawn dashed
  });
  it("stacks nodes vertically on narrow screens", () => {
    const L = layoutNarrow(nodes, edges);
    const ys = L.boxes.map((b) => b.y);
    expect([...ys].sort((x, y) => x - y)).toEqual(ys);
  });
});

describe("rehype-journal", () => {
  it("turns a [!NOTE] blockquote into a callout", () => {
    const tree = { type: "root", children: [{ type: "element", tagName: "blockquote", properties: {}, children: [{ type: "element", tagName: "p", properties: {}, children: [{ type: "text", value: "[!NOTE] hello" }] }] }] };
    rehypeJournal()(tree);
    const div = tree.children[0] as { tagName: string; properties: { className: string[] } };
    expect(div.tagName).toBe("div");
    expect(div.properties.className).toContain("callout");
  });
});
