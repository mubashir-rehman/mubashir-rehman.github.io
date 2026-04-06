import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Typewriter } from "@/components/Typewriter";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import SEO from "@/components/SEO";
import PageTransition from "@/components/PageTransition";
import { useMobile } from "@/hooks/useMobile";
import MobileLanding from "@/components/pages/mobile/Landing";

const stats = [
  { value: "11K+", label: "Lines Shipped" },
  { value: "182", label: "Commits" },
  { value: "1K+", label: "Concurrent Users" },
  { value: "1", label: "Published Paper" },
];

export default function Landing() {
  const isMobile = useMobile();
  if (isMobile) return <MobileLanding />;

  return (
    <PageTransition>
      <SEO />
      <section className="grain-overlay relative flex min-h-screen flex-col items-center justify-center px-4">
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-heading text-5xl font-bold leading-tight sm:text-6xl lg:text-7xl"
          >
            Mubashir Rehman
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-4 h-10 text-xl text-primary sm:text-2xl"
          >
            <Typewriter />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            Building production systems — from drone swarms to AI-powered SaaS at scale.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link
              to="/projects"
              data-testid="link-view-work"
              className="inline-flex items-center gap-2 rounded-lg border border-primary bg-primary/10 px-6 py-3 text-sm font-semibold text-primary transition-all hover:bg-primary hover:text-primary-foreground"
            >
              View My Work <ArrowRight size={16} />
            </Link>
            <Link
              to="/contact"
              data-testid="link-get-in-touch"
              className="inline-flex items-center gap-2 rounded-lg border border-border px-6 py-3 text-sm font-semibold text-foreground transition-all hover:border-primary/30 hover:text-primary"
            >
              Get In Touch
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="mt-16 grid grid-cols-2 gap-8 sm:grid-cols-4"
          >
            {stats.map((s) => (
              <AnimatedCounter key={s.label} value={s.value} label={s.label} />
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 z-10 animate-scroll-indicator"
        >
          <ChevronDown size={24} className="text-muted-foreground" />
        </motion.div>
      </section>
    </PageTransition>
  );
}
