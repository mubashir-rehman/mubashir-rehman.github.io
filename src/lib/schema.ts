// One JSON-LD @graph per page, built from the data layer only (docs/redesign/40-search-strategy.md §4).
// Stable @ids: /#person, /#website, and {canonical}#webpage / #article / #breadcrumb per page.
// Every on-domain URL ends in "/" unless it has a file extension.
import profile from "@/data/profile.json";

export const SITE = "https://mubashirrehman.com";
export const PERSON_ID = `${SITE}/#person`;
export const WEBSITE_ID = `${SITE}/#website`;

export const abs = (path: string) => (path.startsWith("http") ? path : `${SITE}${path}`);

type Node = Record<string, unknown>;
export type Crumb = { name: string; path: string };

const sameAs = Object.values(profile.links);

/** The full Person node: only on Home and About (plus email on About). */
export function personFull(withEmail = false): Node {
  return {
    "@type": "Person",
    "@id": PERSON_ID,
    name: profile.name,
    givenName: profile.givenName,
    familyName: profile.familyName,
    url: `${SITE}/about/`,
    mainEntityOfPage: `${SITE}/about/`,
    jobTitle: profile.jobTitle,
    description: profile.bio.medium,
    image: { "@type": "ImageObject", url: `${SITE}/mubashir-rehman.webp`, width: 400, height: 400 },
    address: {
      "@type": "PostalAddress",
      addressLocality: profile.location.city,
      addressCountry: profile.location.countryCode,
    },
    worksFor: { "@type": "Organization", name: profile.current.employer, url: profile.current.employerUrl },
    alumniOf: { "@type": "CollegeOrUniversity", name: profile.education.institution },
    knowsAbout: profile.seo.knowsAbout,
    hasOccupation: {
      "@type": "Occupation",
      name: profile.jobTitle,
      occupationalCategory: "15-1252.00",
      skills: profile.seo.occupationSkills,
    },
    sameAs,
    ...(withEmail ? { email: `mailto:${profile.email}` } : {}),
  };
}

/** The slim Person reference used everywhere else (Google evaluates each page on its own). */
export const personRef: Node = { "@type": "Person", "@id": PERSON_ID, name: profile.name, url: `${SITE}/about/` };

export const website: Node = {
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  url: `${SITE}/`,
  name: profile.seo.siteName,
  description: profile.seo.homeDescription,
  inLanguage: "en",
  publisher: { "@id": PERSON_ID },
};

export function breadcrumb(canonical: string, crumbs: Crumb[]): Node {
  return {
    "@type": "BreadcrumbList",
    "@id": `${canonical}#breadcrumb`,
    itemListElement: [{ name: "Home", path: "/" }, ...crumbs].map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: abs(c.path),
    })),
  };
}

export function webPage(type: string, canonical: string, name: string, description: string, extra: Node = {}): Node {
  return {
    "@type": type,
    "@id": `${canonical}#webpage`,
    url: canonical,
    name,
    description,
    inLanguage: "en",
    isPartOf: { "@id": WEBSITE_ID },
    ...extra,
  };
}

export function faqPage(canonical: string, faqs: { q: string; a: string }[]): Node {
  return {
    "@type": "FAQPage",
    "@id": `${canonical}#faq`,
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}

export const graph = (nodes: Node[]) => ({ "@context": "https://schema.org", "@graph": nodes.filter(Boolean) });
