// llms.txt, generated from the data layer (docs/redesign/40-search-strategy.md §6.5).
// Never hand-edited: no services block, no phone, no email.
import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import profile from "@/data/profile.json";
import roles from "@/data/roles.json";
import toolbox from "@/data/toolbox.json";
import { SITE } from "@/lib/schema";

export const GET: APIRoute = async () => {
  const work = (await getCollection("work")).sort((a, b) => a.data.order - b.data.order);
  const posts = (await getCollection("journal", (p) => p.data.status === "published")).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
  );
  const rules = work.filter((w) => w.data.rule).map((w) => ({ ...w.data.rule!, slug: w.id, title: w.data.title })).sort((a, b) => a.n - b.n);
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
    "## How I work",
    ...rules.map((r) => `- Rule ${r.n}: ${r.text} (from [${r.title}](${SITE}/projects/${r.slug}/))`),
    "",
    "## Toolbox",
    "Daily tools first; then tools used in production; project exposure and tools used before are marked.",
    ...toolbox.areas.map((a) => {
      const parts = [`daily: ${a.daily.join(", ")}`, a.production.length ? `production: ${a.production.join(", ")}` : "", a.exposure.length ? `project exposure: ${a.exposure.join(", ")}` : "", a.earlier.length ? `used before: ${a.earlier.join(", ")}` : ""].filter(Boolean);
      return `- ${a.name}: ${parts.join("; ")}`;
    }),
    "",
    "## Writing",
    ...posts.map((p) => `- [${p.data.title}](${SITE}/journal/${p.id}/): ${p.data.lede}`),
    "",
    "## Roles",
    ...roles.map((r) => `- [${r.h1}](${SITE}/for/${r.slug}/): résumé ${SITE}${profile.resumes[r.slug as keyof typeof profile.resumes].file}`),
    "",
    "## Profiles",
    `- [About](${SITE}/about/)`,
    `- [Contact](${SITE}/contact/)`,
    `- [GitHub](${profile.links.github})`,
    `- [LinkedIn](${profile.links.linkedin})`,
    `- [Google Scholar](${profile.links.scholar})`,
    `- [ORCID](${profile.links.orcid})`,
  ];
  return new Response(lines.join("\n") + "\n", { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
