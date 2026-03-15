import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { House } from "lucide-react";

const emphasized = [0.2, 0, 0, 1.0] as [number, number, number, number];

export default function MobileNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[hsl(var(--m3-surface))] px-6 pb-28">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.32, ease: emphasized }}
        className="flex flex-col items-center text-center"
      >
        {/* Large 404 */}
        <p
          className="font-heading text-[7rem] font-bold leading-none"
          style={{ color: "hsl(var(--m3-primary-container))" }}
        >
          404
        </p>

        {/* Icon */}
        <div
          className="mt-4 flex h-16 w-16 items-center justify-center rounded-full"
          style={{ backgroundColor: "hsl(var(--m3-primary-container))" }}
        >
          <House
            size={28}
            style={{ color: "hsl(var(--m3-on-primary-container))" }}
          />
        </div>

        {/* Message */}
        <h1 className="mt-5 font-heading text-2xl font-bold text-[hsl(var(--m3-on-surface))]">
          Page not found
        </h1>
        <p className="mt-2 font-body text-sm text-[hsl(var(--m3-on-surface-var))]">
          The page you're looking for doesn't exist or has been moved.
        </p>

        {/* CTA */}
        <Link to="/">
          <motion.div
            whileTap={{ scale: 0.96 }}
            className="mt-8 flex items-center gap-2 rounded-full px-8 py-3.5 font-body text-sm font-semibold"
            style={{
              backgroundColor: "hsl(var(--primary))",
              color: "hsl(var(--primary-foreground))",
            }}
          >
            <House size={16} />
            Go Home
          </motion.div>
        </Link>
      </motion.div>
    </div>
  );
}
