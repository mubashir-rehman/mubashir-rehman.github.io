import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { House, User, FolderOpen, Mail } from "lucide-react";
import { useMobile } from "@/hooks/useMobile";

const links = [
  { to: "/",         Icon: House,      label: "Home"     },
  { to: "/projects", Icon: FolderOpen, label: "Projects" },
  { to: "/about",    Icon: User,       label: "About"    },
  { to: "/contact",  Icon: Mail,       label: "Contact"  },
];

export default function BottomNav() {
  const { pathname } = useLocation();
  const isMobile = useMobile();

  if (!isMobile) return null;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-[hsl(var(--m3-outline-var))] bg-[hsl(var(--m3-surface))]/95 backdrop-blur-xl shadow-[0_-1px_12px_0_rgba(0,0,0,0.06)]"
      aria-label="Mobile navigation"
    >
      <div className="flex">
        {links.map(({ to, Icon, label }) => {
          const isActive =
            to === "/" ? pathname === "/" : pathname.startsWith(to);

          return (
            <NavLink
              key={to}
              to={to}
              aria-label={label}
              className="relative flex flex-1 flex-col items-center justify-center gap-0.5 py-2"
            >
              {/* M3 active indicator pill */}
              {isActive && (
                <motion.span
                  layoutId="bottom-nav-indicator"
                  className="absolute top-1.5 h-8 w-16 rounded-full bg-[hsl(var(--m3-primary-container))]"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}

              <motion.span
                animate={isActive ? { scale: 1.1 } : { scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="relative z-10 flex items-center justify-center"
              >
                <Icon
                  size={24}
                  fill={isActive ? "currentColor" : "none"}
                  stroke={isActive ? "hsl(var(--m3-surface))" : "currentColor"}
                  strokeWidth={1.75}
                  className={
                    isActive
                      ? "text-[hsl(var(--m3-on-primary-container))]"
                      : "text-[hsl(var(--m3-on-surface-var))]"
                  }
                />
              </motion.span>

              <span
                className={[
                  "relative z-10 font-body text-[10px] font-medium leading-none transition-colors",
                  isActive
                    ? "text-[hsl(var(--m3-on-primary-container))]"
                    : "text-[hsl(var(--m3-on-surface-var))]",
                ].join(" ")}
              >
                {label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
