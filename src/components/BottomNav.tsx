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
    /* Floating container — margin on all sides, fully rounded */
    <div className="fixed bottom-3 left-3 right-3 z-50">
      <nav
        className="flex rounded-[24px] bg-[hsl(var(--m3-surface))] px-2 py-2 shadow-[0_4px_24px_0_rgba(0,0,0,0.12)] border border-[hsl(var(--m3-outline-var)/0.6)]"
        aria-label="Mobile navigation"
      >
        {links.map(({ to, Icon, label }) => {
          const isActive =
            to === "/" ? pathname === "/" : pathname.startsWith(to);

          return (
            <NavLink
              key={to}
              to={to}
              aria-label={label}
              className="relative flex flex-1 items-center justify-center"
            >
              {/* Active pill wraps icon + label together */}
              {isActive && (
                <motion.span
                  layoutId="bottom-nav-pill"
                  className="absolute inset-0 rounded-[16px]"
                  style={{ backgroundColor: "hsl(var(--m3-primary-container))" }}
                  transition={{ type: "spring", stiffness: 400, damping: 35 }}
                />
              )}

              <motion.span
                animate={isActive ? { scale: 1.02 } : { scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="relative z-10 flex flex-col items-center gap-0.5 px-3 py-2"
              >
                <Icon
                  size={22}
                  fill={isActive ? "currentColor" : "none"}
                  stroke={isActive ? "hsl(var(--m3-surface))" : "currentColor"}
                  strokeWidth={1.75}
                  className={
                    isActive
                      ? "text-[hsl(var(--m3-on-primary-container))]"
                      : "text-[hsl(var(--m3-on-surface-var))]"
                  }
                />
                <span
                  className={[
                    "font-body text-[10px] font-semibold leading-none transition-colors",
                    isActive
                      ? "text-[hsl(var(--m3-on-primary-container))]"
                      : "text-[hsl(var(--m3-on-surface-var))]",
                  ].join(" ")}
                >
                  {label}
                </span>
              </motion.span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}
