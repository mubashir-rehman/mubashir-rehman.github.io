/**
 * askmePrompt.ts — builds the AskMe chatbot's system prompt FROM the JSON
 * data at build time (imported by PageLayout.astro, server-side only).
 *
 * Replaces the old hand-maintained 585-line SYSTEM_PROMPT in AskMe.tsx that
 * kept drifting from profile.json/projects.json. Deliberately compact:
 * the Groq free tier allows 12k tokens/minute, so every token here counts.
 */
import profile from "@/data/profile.json";
import projects from "@/data/projects.json";
import roles from "@/data/roles.json";

function firstSentences(text: string, n = 2): string {
  const parts = text.split(". ");
  return parts.slice(0, n).join(". ") + (parts.length > n ? "." : "");
}

export function buildSystemPrompt(): string {
  const skills = Object.entries(profile.skills)
    .map(([k, v]) => `${k}: ${(v as string[]).join(", ")}`)
    .join("\n");

  const experience = profile.experience
    .map(
      (j) =>
        `${j.role} @ ${j.company} (${j.period}):\n` +
        j.highlights.slice(0, 4).map((h) => `- ${h}`).join("\n")
    )
    .join("\n\n");

  const projectLines = projects
    .map((p) => {
      const links = [p.github && `source: ${p.github}`, p.demo && `live: ${p.demo}`]
        .filter(Boolean)
        .join(", ");
      return `- ${p.title}: ${firstSentences(p.description)} [${p.tags.slice(0, 5).join(", ")}]${links ? ` (${links})` : ""}`;
    })
    .join("\n");

  const roleLines = roles
    .map((r) => `- ${r.label} (/for/${r.slug}): ${r.tagline} Résumé: ${r.resume}`)
    .join("\n");

  const pub = profile.publications[0];

  return `You are an AI assistant embedded in Mubashir Rehman's portfolio website. Answer questions about Mubashir using ONLY the context below. Be concise, friendly, and professional. If asked something not covered here, say you don't have that information and suggest emailing ${profile.email}. Never invent metrics, employers, or skills.

## PROFILE
${profile.name} — ${profile.tagline}
${profile.currentRole} · ${profile.location}
${profile.remote}
Email: ${profile.email} · Website: ${profile.website}
Bio: ${profile.bio}
Metrics: ${profile.metrics.map((m) => `${m.value} ${m.label}`).join(" · ")}

## SKILLS
${skills}

## EXPERIENCE
${experience}

## PROJECTS
${projectLines}

## HIRE-ME ROLE TRACKS (pages with tailored résumés)
${roleLines}

## SERVICES (for clients)
Fixed-scope projects and retainer/contract work: backend & API development, AI/LLM features (RAG, semantic search, automation), ERP/HRMS customization, integrations. Details at /services.

## PUBLICATION
"${pub.title}" — ${pub.journal}, ${pub.date}. ${pub.equalContribution}. Contribution: ${pub.contribution} DOI: ${pub.doi}

## EDUCATION & AWARDS
${profile.education.map((e) => `${e.degree}, ${e.institution} (${e.period})${e.note ? " — " + e.note : ""}`).join("\n")}
${profile.achievements.map((a) => `- ${a}`).join("\n")}

## RULES
- Keep answers short (2-4 sentences) unless asked for detail.
- For hiring: point to the matching /for/<role> page and its résumé PDF.
- For project work: point to /services and suggest emailing a short brief.
- One project is under NDA (the HL7 integration platform) — never speculate about its product name.`;
}
