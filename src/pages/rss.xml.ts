/**
 * rss.xml.ts — RSS 2.0 feed for the blog, built from the same static
 * `src/data/journal.json` that `journal.astro` renders.
 *
 * A feed gives readers (and crawlers / AI ingestion pipelines) a standard
 * freshness signal without any backend. Items are newest-first and link to
 * the canonical trailing-slash post URLs.
 */
import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import journal from "@/data/journal.json";

export async function GET(context: APIContext) {
  const posts = [...journal].sort((a, b) => (a.date < b.date ? 1 : -1));

  return rss({
    title: "Mubashir Rehman — Blog",
    description:
      "Technical writing by Mubashir Rehman — articles on backend engineering, distributed systems, Python, and software architecture.",
    site: context.site!,
    items: posts.map((post) => ({
      title: post.title,
      description: post.excerpt,
      // Dates in journal.json are plain `YYYY-MM-DD`; parsed as UTC midnight.
      pubDate: new Date(`${post.date}T00:00:00Z`),
      link: `/journal/${post.slug}/`,
      categories: post.tags,
    })),
  });
}
