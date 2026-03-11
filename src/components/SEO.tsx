import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

interface SEOProps {
  title?: string;
  description?: string;
}

const BASE_TITLE = "Mubashir Rehman — Backend Engineer";
const BASE_DESC = "Backend Software Engineer specializing in Python, Django, AWS, and AI/ML systems. 11K+ lines shipped, 99.8% uptime. Open to freelance and full-time roles.";
const SITE_URL = "https://mubashir-rehman.github.io";

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Mubashir Rehman",
  jobTitle: "Backend Software Engineer",
  description: BASE_DESC,
  url: SITE_URL,
  email: "mubashirrehman66@gmail.com",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Lahore",
    addressCountry: "Pakistan",
  },
  alumniOf: {
    "@type": "EducationalOrganization",
    name: "Information Technology University",
  },
  knowsAbout: [
    "Python", "Django", "FastAPI", "PostgreSQL", "Docker",
    "AWS", "Redis", "AI/ML", "Distributed Systems", "Microservices",
  ],
  sameAs: [
    "https://github.com/mubashir-rehman",
    "https://linkedin.com/in/mubashir-rehman",
  ],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Mubashir Rehman — Portfolio",
  url: SITE_URL,
  description: BASE_DESC,
  author: {
    "@type": "Person",
    name: "Mubashir Rehman",
  },
};

export default function SEO({ title, description }: SEOProps) {
  const { pathname } = useLocation();
  const fullTitle = title ? `${title} | ${BASE_TITLE}` : BASE_TITLE;
  const desc = description || BASE_DESC;
  const isHome = !title;
  const pageUrl = pathname === "/" ? SITE_URL : `${SITE_URL}/#${pathname}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <link rel="canonical" href={pageUrl} />
      <meta name="description" content={desc} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={pageUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      {isHome && (
        <script type="application/ld+json">
          {JSON.stringify([personSchema, websiteSchema])}
        </script>
      )}
    </Helmet>
  );
}
