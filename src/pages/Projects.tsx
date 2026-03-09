import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Github, Star } from "lucide-react";
import projects from "@/data/projects.json";
import SEO from "@/components/SEO";
import PageTransition from "@/components/PageTransition";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default function Projects() {
  const allTags = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => p.tags.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, []);

  const [filter, setFilter] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const list = filter ? projects.filter((p) => p.tags.includes(filter)) : projects;
    return [...list].sort((a, b) => (a.featured === b.featured ? 0 : a.featured ? -1 : 1));
  }, [filter]);

  return (
    <PageTransition>
      <SEO title="Projects" description="Production projects with real metrics — from AI-powered SaaS to drone swarm systems." />
      <div className="mx-auto max-w-6xl px-4 pb-20 pt-24 sm:px-6">
        <h1 className="font-heading text-3xl font-bold sm:text-4xl">Projects</h1>
        <p className="mt-2 text-muted-foreground">Production systems with real metrics.</p>

        <div className="mt-6 flex flex-wrap gap-2">
          <button
            data-testid="button-filter-all"
            onClick={() => setFilter(null)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              !filter
                ? "border border-primary bg-primary/10 text-primary"
                : "border border-border bg-card text-muted-foreground hover:border-primary/30 hover:text-foreground"
            }`}
          >
            All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              data-testid={`button-filter-${tag}`}
              onClick={() => setFilter(tag === filter ? null : tag)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                filter === tag
                  ? "border border-primary bg-primary/10 text-primary"
                  : "border border-border bg-card text-muted-foreground hover:border-primary/30 hover:text-foreground"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {filtered.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Card
                data-testid={`card-project-${project.id}`}
                className="group relative flex h-full flex-col transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
              >
                <CardContent className="flex flex-1 flex-col p-6">
                  {project.featured && (
                    <Badge variant="outline" className="absolute right-4 top-4 border-primary/30 text-primary">
                      <Star size={12} className="mr-1" /> Featured
                    </Badge>
                  )}
                  <h3 className="pr-20 font-heading text-lg font-bold">{project.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {project.description.slice(0, 200)}
                    {project.description.length > 200 && "..."}
                  </p>

                  {project.metrics.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {project.metrics.map((m) => (
                        <Badge key={m} variant="outline" className="border-primary/20 text-primary font-medium">
                          {m}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {project.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs font-normal">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="mt-4 flex gap-3">
                    {project.github && (
                      <a href={project.github} target="_blank" rel="noopener noreferrer"
                        data-testid={`link-github-${project.id}`}
                        className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground">
                        <Github size={14} /> Code
                      </a>
                    )}
                    {project.demo && (
                      <a href={project.demo} target="_blank" rel="noopener noreferrer"
                        data-testid={`link-demo-${project.id}`}
                        className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
                        <ExternalLink size={14} /> Demo
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
