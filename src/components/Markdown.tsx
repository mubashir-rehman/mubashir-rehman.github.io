/**
 * Markdown.tsx — build-time markdown renderer.
 * Mounted WITHOUT a client directive in Astro pages, so it server-renders
 * to static HTML and ships zero client-side JavaScript.
 */
import ReactMarkdown from "react-markdown";

export default function Markdown({ content }: { content: string }) {
  return <ReactMarkdown>{content}</ReactMarkdown>;
}
