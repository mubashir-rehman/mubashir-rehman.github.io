// llms.txt, generated from the data layer (docs/redesign/40-search-strategy.md §6.5).
// Never hand-edited: no services block, no phone, no email.
import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import profile from "@/data/profile.json";
import roles from "@/data/roles.json";
import { SITE } from "@/lib/schema";

export const GET: APIRoute = async () => {
  const work = (await getCollection("work")).sort((a, b) => a.data.order - b.data.order);
  const posts = (await getCollection("journal", (p) => p.data.status === "published")).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
  );
  const lines = [
    `# ${profile.name}`,
    "",
    `> ${profile.bio.short}`,
    "",
    "## Facts",
    `- Role: ${profile.current.title} at ${profile.current.employer}, lead since ${profile.current.since}, joined ${profile.current.joined}`,
    `- Location: ${profile.location.city}, ${profile.location.country}. ${profile.availability}`,
    `- Experience: ${profile.yearsFullTime} years of full-time engineering`,
    `- Stack: ${profile.stackLine}`,
    `- Paper: ${profile.paper.authorship}, ${profile.paper.journal} (${profile.paper.publisher}, ${profile.paper.year}), DOI ${profile.paper.doi}`,
    "",
    "## Case studies",
    ...work.map((w) => `- [${w.data.title}](${SITE}/projects/${w.id}/): ${w.data.summary}`),
    "",
    "## Writing",
    ...posts.map((p) => `- [${p.data.title}](${SITE}/journal/${p.id}/): ${p.data.lede}`),
    "",
    "## Roles",
    ...roles.map((r) => `- [${r.h1}](${SITE}/for/${r.slug}/): résumé ${SITE}${profile.resumes[r.slug as keyof typeof profile.resumes].file}`),
    "",
    "## Profiles",
    `- [About](${SITE}/about/)`,
    `- [GitHub](${profile.links.github})`,
    `- [LinkedIn](${profile.links.linkedin})`,
    `- [Google Scholar](${profile.links.scholar})`,
    `- [ORCID](${profile.links.orcid})`,
  ];
  return new Response(lines.join("\n") + "\n", { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
