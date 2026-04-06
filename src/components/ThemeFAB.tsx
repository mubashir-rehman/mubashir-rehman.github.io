import { motion } from "framer-motion";
import { Sun, Moon, Flower2 } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import type { Theme } from "@/components/ThemeProvider";
import { useMobile } from "@/hooks/useMobile";

function ThemeIcon({ theme }: { theme: Theme }) {
  if (theme === "light")  return <Moon size={16} />;
  if (theme === "dark")   return <Flower2 size={16} />;
  return <Sun size={16} />;
}

function themeLabel(theme: Theme): string {
  if (theme === "light")  return "Switch to dark";
  if (theme === "dark")   return "Switch to sakura";
  return "Switch to light";
}

export default function ThemeFAB() {
  const { theme, cycleTheme } = useTheme();
  const isMobile = useMobile();

  // On desktop the theme toggle lives in the navbar — no FAB needed
  if (!isMobile) return null;

  return (
    <motion.button
      onClick={cycleTheme}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 20, delay: 1.1 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.91 }}
      aria-label={themeLabel(theme)}
      data-testid="button-toggle-theme"
      className={[
        // M3 small FAB — 40px, tonal style
        "fixed right-4 z-50",
        // Stacked above AskMe button: AskMe is at bottom-[4.5rem] (72px, 52px tall)
        // So this sits at 72 + 52 + 8px gap = 132px from bottom
        "bottom-[9.5rem] sm:bottom-auto sm:top-auto",
        // On desktop this is hidden (isMobile check above), but keep sm positioning safe
        "sm:hidden",
        "flex h-10 w-10 items-center justify-center rounded-full",
        "bg-[hsl(var(--m3-surface-highest))] text-[hsl(var(--primary))]",
        "shadow-md shadow-black/10",
        "border border-[hsl(var(--m3-outline-var))]",
        "transition-colors active:bg-[hsl(var(--m3-primary-container))]",
      ].join(" ")}
    >
      <motion.span
        key={theme}
        initial={{ rotate: -30, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        exit={{ rotate: 30, opacity: 0 }}
        transition={{ duration: 0.15 }}
      >
        <ThemeIcon theme={theme} />
      </motion.span>
    </motion.button>
  );
}
