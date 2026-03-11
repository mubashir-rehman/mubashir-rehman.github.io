import { motion } from "framer-motion";
import { ExternalLink, Award, BookOpen, MapPin, Briefcase, GraduationCap } from "lucide-react";
import profile from "@/data/profile.json";
import SEO from "@/components/SEO";
import PageTransition from "@/components/PageTransition";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

export default function About() {
  return (
    <PageTransition>
      <SEO
        title="About"
        description="Mubashir Rehman — Backend Engineer in Lahore, Pakistan. Python, Django, FastAPI, AWS, Docker. 7 microservices, 60+ endpoints, 99.8% uptime."
        schema={{
          "@context": "https://schema.org",
          "@type": "ProfilePage",
          mainEntity: {
            "@type": "Person",
            name: "Mubashir Rehman",
            jobTitle: "Backend Software Engineer",
            url: "https://mubashir-rehman.github.io",
            sameAs: [
              "https://github.com/mubashir-rehman",
              "https://linkedin.com/in/mubashir-rehman",
            ],
          },
        }}
      />
      <div className="mx-auto max-w-4xl px-4 pb-20 pt-24 sm:px-6">
        <motion.div {...fadeUp} className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
          <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-full border-2 border-primary/40 bg-primary/5 font-heading text-3xl font-bold text-primary">
            MR
          </div>
          <div>
            <h1 className="text-center font-heading text-3xl font-bold sm:text-left sm:text-4xl">
              {profile.name}
            </h1>
            <p className="mt-1 text-center text-muted-foreground sm:text-left">
              <MapPin size={14} className="mr-1 inline" />
              {profile.location}
            </p>
            {profile.available && (
              <Badge variant="outline" className="mt-2 border-primary/30 text-primary" data-testid="badge-availability">
                {profile.availabilityNote}
              </Badge>
            )}
          </div>
        </motion.div>

        <motion.p {...fadeUp} className="mt-8 leading-relaxed text-muted-foreground">
          {profile.bio}
        </motion.p>

        <motion.div {...fadeUp}>
          <Card className="mt-10">
            <CardContent className="flex flex-wrap justify-center gap-x-6 gap-y-2 p-4 text-sm text-muted-foreground">
              {["7 Microservices", "60+ Endpoints", "85% Test Coverage", "99.8% Uptime"].map((m) => (
                <span key={m} className="whitespace-nowrap" data-testid={`text-metric-${m.split(" ")[0]}`}>
                  <span className="font-semibold text-foreground">{m.split(" ")[0]}</span>{" "}
                  {m.split(" ").slice(1).join(" ")}
                </span>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        <motion.section {...fadeUp} className="mt-12">
          <h2 className="font-heading text-2xl font-bold">Skills</h2>
          <div className="mt-4 space-y-4">
            {Object.entries(profile.skills).map(([cat, skills]) => (
              <div key={cat}>
                <h3 className="text-sm font-semibold text-primary">{cat}</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {skills.map((s) => (
                    <motion.div
                      key={s}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                    >
                      <Badge variant="secondary" className="font-normal" data-testid={`badge-skill-${s}`}>
                        {s}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        <motion.section {...fadeUp} className="mt-12">
          <h2 className="mb-6 font-heading text-2xl font-bold">
            <Briefcase size={20} className="mr-2 inline text-primary" />
            Experience
          </h2>
          <div className="relative border-l-2 border-border pl-6">
            {profile.experience.map((exp, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative mb-10 last:mb-0"
                data-testid={`card-experience-${i}`}
              >
                <span className="absolute -left-[31px] top-1.5 h-3 w-3 rounded-full border-2 border-primary bg-background" />
                <div className="text-xs text-primary font-semibold">{exp.period}</div>
                <h3 className="mt-1 text-lg font-semibold">{exp.role}</h3>
                <p className="text-sm text-muted-foreground">
                  {exp.company} · {exp.location}
                </p>
                <ul className="mt-3 space-y-1.5">
                  {exp.highlights.map((h, j) => (
                    <li key={j} className="text-sm leading-relaxed text-muted-foreground">
                      <span className="mr-2 text-primary">&#9656;</span>
                      {h}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section {...fadeUp} className="mt-12">
          <h2 className="mb-4 font-heading text-2xl font-bold">
            <GraduationCap size={20} className="mr-2 inline text-primary" />
            Education
          </h2>
          {profile.education.map((edu, i) => (
            <Card key={i} data-testid={`card-education-${i}`}>
              <CardContent className="p-5">
                <h3 className="font-semibold">{edu.degree}</h3>
                <p className="text-sm text-muted-foreground">
                  {edu.institution} · {edu.period}
                </p>
                {edu.note && (
                  <Badge variant="secondary" className="mt-2 text-xs font-normal">
                    {edu.note}
                  </Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </motion.section>

        <motion.section {...fadeUp} className="mt-12">
          <h2 className="mb-4 font-heading text-2xl font-bold">
            <Award size={20} className="mr-2 inline text-primary" />
            Achievements
          </h2>
          <ul className="space-y-2">
            {profile.achievements.map((a, i) => (
              <li key={i} className="text-sm text-muted-foreground" data-testid={`text-achievement-${i}`}>
                <span className="mr-2 text-primary">&#10022;</span>
                {a}
              </li>
            ))}
          </ul>
        </motion.section>

        <motion.section {...fadeUp} className="mt-12">
          <h2 className="mb-4 font-heading text-2xl font-bold">
            <BookOpen size={20} className="mr-2 inline text-primary" />
            Publication
          </h2>
          {profile.publications.map((pub, i) => (
            <Card key={i} className="border-primary/20" data-testid={`card-publication-${i}`}>
              <CardContent className="p-5">
                <h3 className="text-sm font-semibold leading-snug">{pub.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{pub.authors}</p>
                <p className="mt-1 text-xs text-muted-foreground italic">
                  {pub.journal} · {pub.date}
                </p>
                <a
                  href={pub.arxiv}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                  data-testid={`link-publication-${i}`}
                >
                  {pub.doi} <ExternalLink size={12} />
                </a>
              </CardContent>
            </Card>
          ))}
        </motion.section>
      </div>
    </PageTransition>
  );
}
