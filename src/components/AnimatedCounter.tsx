import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface CounterProps {
  value: string;
  label: string;
}

function parseNumeric(val: string): number {
  const cleaned = val.replace(/[^0-9.]/g, "");
  const num = parseFloat(cleaned);
  if (val.includes("K")) return num * 1000;
  return num || 0;
}

function formatLike(target: string, current: number): string {
  if (target.includes("K+")) return (current / 1000).toFixed(0) + "K+";
  if (target.includes("K")) return (current / 1000).toFixed(0) + "K";
  if (target.startsWith("~")) return "~" + Math.round(current) + "%";
  if (target.endsWith("%")) return Math.round(current) + "%";
  return Math.round(current).toString();
}

export function AnimatedCounter({ value, label }: CounterProps) {
  const [count, setCount] = useState(0);
  const [triggered, setTriggered] = useState(false);
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const target = parseNumeric(value);

  // Mark as mounted so SSG and client first-render agree (both show final value
  // string, not "0"), eliminating the React #418/#425 hydration mismatch.
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !triggered) {
          setTriggered(true);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [triggered, mounted]);

  useEffect(() => {
    if (!triggered) return;
    const duration = 1500;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(current);
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [triggered, target]);

  // Before mount: render the final value so SSG HTML and client first-render match.
  // After mount: show animated count (starts at 0, animates up on intersection).
  const display = !mounted ? value : triggered ? formatLike(value, count) : value;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center"
    >
      <div className="font-heading text-3xl font-bold text-primary sm:text-4xl">
        {display}
      </div>
      <div className="mt-1 text-xs text-muted-foreground sm:text-sm">{label}</div>
    </motion.div>
  );
}
