// Builds the chat assistant's system prompt at build time from the same data the pages render,
// so the assistant can never say something the site does not. Served as /ask-context.json and
// fetched only when someone opens the chat, never inlined into pages.
import { getCollection } from "astro:content";
import profile from "@/data/profile.json";
import roles from "@/data/roles.json";
import builds from "@/data/builds.json";

const path = (slug: string) => `/projects/${slug}/`;

export async function buildAskPrompt(): Promise<string> {
  const work = (await getCollection("work")).sort((a, b) => a.data.order - b.data.order);
  const posts = (await getCollection("journal", (p) => p.data.status === "published")).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
  );

  const caseStudies = work
    .map((w) => {
      const d = w.data;
      return [
        `### ${d.title} (${path(w.id)})`,
        `Summary: ${d.summary}`,
        `Role: ${d.role}. Period: ${d.period}. Status: ${d.status}.`,
        `Problem: ${d.problem}`,
        `Decisions: ${d.decisions.map((x) => `${x.title}: chose ${x.chose}`).join(" | ")}`,
        d.broke.length ? `What broke: ${d.broke.map((b) => `${b.title}: ${b.fix}`).join(" | ")}` : "",
        `Results: ${d.results.join(" ")}`,
        `Stack: ${d.stack.join(", ")}`,
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n\n");

  const timeline = profile.timeline
    .map((t) => `- ${t.title}, ${t.org} (${t.start} to ${t.end}, ${t.type}): ${t.scope}`)
    .join("\n");

  return `You answer questions about ${profile.name} on his website, using ONLY the facts below. Be brief (2 to 4 sentences), plain and specific. When a page covers the answer, include its path, for example /projects/hiretrack/. If the facts below do not answer the question, say so and suggest emailing ${profile.email}. Never invent employers, dates, numbers, clients, product names or skills. Client and product names are under NDA: never guess them. Do not discuss pricing or freelance work. No em dashes.

## Identity
${profile.name}: ${profile.roleLine}. ${profile.identity} ${profile.positioning}
${profile.availability} Current role: ${profile.current.title} at ${profile.current.employer} since ${profile.current.since} (joined ${profile.current.joined}).
Stack: ${profile.stackLine}

## Bio
${profile.bio.about.join("\n")}

## Timeline
${timeline}

## Case studies
${caseStudies}

## Smaller builds
${builds.map((b) => `- ${b.title} (${b.year}): ${b.line}`).join("\n")}

## Research
${profile.paper.title}, ${profile.paper.journal} (${profile.paper.publisher}, ${profile.paper.year}). ${profile.paper.authorship}. His part: ${profile.paper.contribution} Result: ${profile.paper.result} DOI ${profile.paper.doi}. Page: ${profile.paper.caseStudy}

## Education
${profile.education.degree}, ${profile.education.institution}, ${profile.education.place}.

## Writing
${posts.map((p) => `- ${p.data.title} (/journal/${p.id}/): ${p.data.lede}`).join("\n")}

## Hiring by role (each page has a matching résumé PDF)
${roles.map((r) => `- ${r.label}: /for/${r.slug}/ ${r.fit}`).join("\n")}

## Contact
Email ${profile.email}. LinkedIn ${profile.links.linkedin}. GitHub ${profile.links.github}. Contact page: /contact/`;
}
