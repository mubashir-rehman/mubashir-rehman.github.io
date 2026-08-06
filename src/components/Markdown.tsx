/**
 * Markdown.tsx — build-time markdown renderer.
 * Mounted WITHOUT a client directive in Astro pages, so it server-renders
 * to static HTML and ships zero client-side JavaScript.
 *
 * Beyond CommonMark this adds three authoring affordances, all resolved at
 * build time and none of which require raw HTML in the content:
 *
 *   tables        `| a | b |`                     (remark-gfm)
 *   figures       `![alt](/x.webp "Caption")`     (image title => <figcaption>)
 *   callouts      `> [!NOTE] …`                   (GitHub alert syntax)
 */
import type { ComponentPropsWithoutRef, ReactElement, ReactNode } from "react";
import { Children, cloneElement, isValidElement } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeUnwrapImages from "rehype-unwrap-images";
import { Info, Lightbulb, TriangleAlert } from "lucide-react";

/** `> [!NOTE]` and friends. The syntax is case-sensitive in the source. */
const ALERTS = {
  NOTE: { label: "Note", Icon: Info },
  TIP: { label: "Tip", Icon: Lightbulb },
  WARNING: { label: "Warning", Icon: TriangleAlert },
} as const;

type AlertKind = keyof typeof ALERTS;
type WithChildren = { children?: ReactNode };

const MARKER = /^\s*\[!(\w+)\]\s*/;

/**
 * Collects text from a React subtree. The `[!NOTE]` marker sits inside the
 * blockquote's first paragraph, which react-markdown has already turned into
 * elements by the time this component sees it.
 */
function textOf(node: ReactNode): string {
  if (typeof node === "string") return node;
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (isValidElement<WithChildren>(node)) return textOf(node.props.children);
  return "";
}

/**
 * Removes the `[!TYPE]` token from the first text node that carries it, then
 * stops. Walking rather than indexing matters: react-markdown puts whitespace
 * text nodes between elements, so the marker is never at index 0.
 */
function stripMarker(node: ReactNode): ReactNode {
  let done = false;

  function walk(n: ReactNode): ReactNode {
    if (done) return n;
    if (typeof n === "string") {
      if (!MARKER.test(n)) return n;
      done = true;
      return n.replace(MARKER, "");
    }
    if (Array.isArray(n)) return n.map(walk);
    if (isValidElement<WithChildren>(n)) {
      const el = n as ReactElement<WithChildren>;
      return cloneElement(el, undefined, walk(el.props.children));
    }
    return n;
  }

  return walk(node);
}

const components = {
  /**
   * A markdown image carrying a title becomes a captioned figure.
   * `rehype-unwrap-images` strips the wrapping <p> on the hast tree first —
   * <figure> inside <p> is invalid HTML and browsers silently reparent it.
   */
  img({ src, alt, title }: ComponentPropsWithoutRef<"img">) {
    const image = <img src={src} alt={alt ?? ""} loading="lazy" decoding="async" />;
    if (!title) return image;
    return (
      <figure>
        {image}
        <figcaption>{title}</figcaption>
      </figure>
    );
  },

  /** Wide tables scroll inside their own container, never the page body. */
  table({ children }: ComponentPropsWithoutRef<"table">) {
    return (
      <div className="table-scroll">
        <table>{children}</table>
      </div>
    );
  },

  blockquote({ children }: ComponentPropsWithoutRef<"blockquote">) {
    const kind = textOf(Children.toArray(children))
      .match(MARKER)?.[1]
      ?.toUpperCase() as AlertKind | undefined;

    if (!kind || !(kind in ALERTS)) return <blockquote>{children}</blockquote>;

    const { label, Icon } = ALERTS[kind];
    return (
      <div className={`callout callout-${kind.toLowerCase()}`}>
        <p className="callout-label">
          <Icon size={16} strokeWidth={1.5} aria-hidden="true" />
          {label}
        </p>
        {stripMarker(children)}
      </div>
    );
  },
};

export default function Markdown({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeUnwrapImages]}
      components={components}
    >
      {content}
    </ReactMarkdown>
  );
}
