import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getCollection } from "astro:content";
import profile from "@/data/profile.json";

export async function GET(context: APIContext) {
  const posts = (await getCollection("journal", (p) => p.data.status === "published")).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
  );
  return rss({
    title: `Writing: ${profile.name}`,
    description: "Build logs and incident write-ups on backend systems and applied AI.",
    site: context.site!,
    xmlns: { atom: "http://www.w3.org/2005/Atom" },
    customData: `<language>en</language><lastBuildDate>${new Date().toUTCString()}</lastBuildDate><atom:link href="${new URL("/rss.xml", context.site)}" rel="self" type="application/rss+xml"/>`,
    items: posts.map((p) => ({
      title: p.data.title,
      description: p.data.lede,
      pubDate: p.data.date,
      link: `/journal/${p.id}/`,
      categories: p.data.tags,
    })),
  });
}
