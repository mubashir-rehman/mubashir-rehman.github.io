import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { House, User, Mail, FolderOpen, Heart, Flame, BookOpen } from "lucide-react";
import { useMobile } from "@/hooks/useMobile";

// Mobile landing: 3 primary tabs only (LinkedIn style — icon + label)
const mobilePrimaryLinks = [
  { to: "/",        Icon: House,  label: "Home"    },
  { to: "/about",   Icon: User,   label: "About"   },
  { to: "/contact", Icon: Mail,   label: "Contact" },
];

// All other mobile pages: full 7-tab icon nav
const mobileFullLinks = [
  { to: "/",         Icon: House,      label: "Home"     },
  { to: "/about",    Icon: User,       label: "About"    },
  { to: "/projects", Icon: FolderOpen, label: "Projects" },
  { to: "/hobbies",  Icon: Heart,      label: "Hobbies"  },
  { to: "/habits",   Icon: Flame,      label: "Habits"   },
  { to: "/journal",  Icon: BookOpen,   label: "Journal"  },
  { to: "/contact",  Icon: Mail,       label: "Contact"  },
];

const PRIMARY_ROUTES = ["/", "/about", "/contact"];

export default function BottomNav() {
  const { pathname } = useLocation();
  const isMobile = useMobile();

  if (!isMobile) return null;

  const isPrimaryRoute = PRIMARY_ROUTES.includes(pathname);
  const links = isPrimaryRoute ? mobilePrimaryLinks : mobileFullLinks;
  const showLabels = isPrimaryRoute;

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
                  size={showLabels ? 24 : 22}
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
                  showLabels ? "block" : "sr-only",
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
