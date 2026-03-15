import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  House,
  User,
  FolderOpen,
  Heart,
  Flame,
  BookOpen,
  Mail,
} from "lucide-react";

const links = [
  { to: "/",         Icon: House,       label: "Home"     },
  { to: "/about",    Icon: User,        label: "About"    },
  { to: "/projects", Icon: FolderOpen,  label: "Projects" },
  { to: "/hobbies",  Icon: Heart,       label: "Hobbies"  },
  { to: "/habits",   Icon: Flame,       label: "Habits"   },
  { to: "/journal",  Icon: BookOpen,    label: "Journal"  },
  { to: "/contact",  Icon: Mail,        label: "Contact"  },
];

export default function BottomNav() {
  const { pathname } = useLocation();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex md:hidden border-t border-border bg-background/90 backdrop-blur-xl"
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
            className="relative flex flex-1 flex-col items-center justify-center py-3"
          >
            <motion.span
              animate={isActive ? { scale: 1.15 } : { scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="flex items-center justify-center"
            >
              <Icon
                size={22}
                fill={isActive ? "currentColor" : "none"}
                stroke={isActive ? "hsl(var(--background))" : "currentColor"}
                strokeWidth={1.75}
                className={isActive ? "text-primary" : "text-muted-foreground"}
              />
            </motion.span>

            {/* Active dot */}
            {isActive && (
              <motion.span
                layoutId="bottom-nav-dot"
                className="absolute bottom-1.5 h-1 w-1 rounded-full bg-primary"
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </NavLink>
        );
      })}
    </nav>
  );
}
