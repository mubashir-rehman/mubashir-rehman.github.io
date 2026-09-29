// Content collections. The schemas enforce the copy rules at build time
// (docs/redesign/20-ux-blueprints.md §7), so a post or case study that breaks
// them fails the build instead of shipping.
import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// Base.astro appends " | Mubashir Rehman" (18 chars); titles are capped at 60 in total.
const seoTitle = z.string().max(42);
const description = z.string().max(155);
const noEmDash = (s: string) => !s.includes("—");

const journal = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/journal" }),
  schema: ({ image }) =>
    z.object({
      title: z.string().max(80).refine(noEmDash, "no em dashes"),
      seoTitle: seoTitle.optional(),
      description,
      lede: z.string().refine((s) => s.split(/\s+/).length <= 45, "lede max 45 words"),
      // Visibility. Only "published" posts are built: drafts and archived posts get no page and
      // stay out of the sitemap, RSS, llms.txt and the chat context. An archived post that was
      // once public sets `redirectTo`, so its old URL keeps working.
      status: z.enum(["published", "draft", "archived"]),
      redirectTo: z.string().regex(/^\/.*\/$/, "site path with trailing slash").optional(),
      type: z.enum(["incident", "lab-note", "build-log", "essay"]),
      date: z.coerce.date(),
      updated: z.coerce.date().optional(),
      tags: z.array(z.string()).max(4),
      rule: z.string().optional(),
      note: z.string().optional(),
      faq: z.array(z.object({ q: z.string(), a: z.string() })).optional(),
      related: z.object({ caseStudy: z.string().optional(), post: z.string().optional() }).optional(),
      cover: image().optional(),
    }),
});

const decision = z.object({
  title: z.string(),
  chose: z.string(),
  rejected: z.string(),
  why: z.string(),
  cost: z.string(),
});

const work = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/work" }),
  schema: z.object({
    title: z.string().max(60).refine(noEmDash, "no em dashes"),
    seoTitle: seoTitle.optional(),
    description,
    summary: z.string().refine((s) => s.split(/\s+/).length <= 22, "summary max 22 words"),
    role: z.string(),
    period: z.string(),
    status: z.string(),
    outcome: z.string(),
    order: z.number(),
    flagship: z.boolean().default(false),
    pillar: z.enum(["Systems", "Applied AI", "Ownership"]),
    tracks: z.array(z.enum(["backend", "ai-backend", "full-stack", "erp-hrms"])),
    stack: z.array(z.string()).max(12),
    problem: z.string(),
    diagram: z.object({
      caption: z.string(),
      nodes: z.array(z.object({ id: z.string(), label: z.string(), text: z.string() })).min(3).max(7),
      edges: z.array(z.tuple([z.string(), z.string()])),
    }),
    decisions: z.array(decision).min(2).max(3),
    broke: z.array(z.object({ title: z.string(), symptom: z.string(), cause: z.string(), fix: z.string() })).max(2).default([]),
    results: z.array(z.string()).max(5),
    rule: z.object({ n: z.number(), text: z.string() }).optional(),
    links: z.object({ repo: z.string().url().optional(), demo: z.string().url().optional() }).default({}),
    relatedPost: z.string().optional(),
  }),
});

export const collections = { journal, work };
