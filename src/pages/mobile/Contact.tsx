import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, MessageCircle, Mail, Github, Linkedin, ChevronDown, CheckCircle } from "lucide-react";
import profile from "@/data/profile.json";
import SEO from "@/components/SEO";
import PageTransition from "@/components/PageTransition";

// ---------------------------------------------------------------------------
// M3 motion
// ---------------------------------------------------------------------------
const emphasized = [0.2, 0, 0, 1.0] as [number, number, number, number];
const emphasizedDecel = [0.05, 0.7, 0.1, 1.0] as [number, number, number, number];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.28, ease: emphasized, delay },
});

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------
const whatsappMsg = encodeURIComponent(
  "Hi Mubashir, I found you via your portfolio and would like to connect!",
);

const primaryLinks = [
  {
    href: `https://wa.me/923095528384?text=${whatsappMsg}`,
    Icon: MessageCircle,
    label: "WhatsApp",
    detail: profile.phone,
    testId: "link-social-whatsapp",
  },
  {
    href: `mailto:${profile.email}`,
    Icon: Mail,
    label: "Email",
    detail: profile.email,
    testId: "link-social-email",
  },
];

const secondaryLinks = [
  {
    href: profile.socialLinks.github,
    Icon: Github,
    label: "GitHub",
    testId: "link-social-github",
  },
  {
    href: profile.socialLinks.linkedin,
    Icon: Linkedin,
    label: "LinkedIn",
    testId: "link-social-linkedin",
  },
];

// ---------------------------------------------------------------------------
// M3 filled text field
// ---------------------------------------------------------------------------
function Field({
  id,
  label,
  type = "text",
  name,
  required,
  placeholder,
  multiline,
  autoComplete,
  testId,
}: {
  id: string;
  label: string;
  type?: string;
  name: string;
  required?: boolean;
  placeholder?: string;
  multiline?: boolean;
  autoComplete?: string;
  testId?: string;
}) {
  const base = [
    "w-full rounded-[16px] border border-[hsl(var(--m3-outline-var))]",
    "bg-[hsl(var(--m3-surface-highest))]",
    "px-4 py-3 font-body text-sm text-[hsl(var(--m3-on-surface))]",
    "placeholder:text-[hsl(var(--m3-on-surface-var))]",
    "focus:outline-none focus:border-[hsl(var(--primary))] focus:ring-1 focus:ring-[hsl(var(--primary)/0.3)]",
    "transition-colors",
  ].join(" ");

  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="font-body text-xs font-semibold text-[hsl(var(--m3-on-surface-var))]"
      >
        {label}
      </label>
      {multiline ? (
        <textarea
          id={id}
          name={name}
          required={required}
          placeholder={placeholder}
          rows={4}
          data-testid={testId}
          className={`${base} resize-none`}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          required={required}
          placeholder={placeholder}
          autoComplete={autoComplete}
          data-testid={testId}
          className={base}
        />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------
export default function MobileContact() {
  const [formOpen, setFormOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("https://formspree.io/f/mwvrvwjn", {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });

      if (res.ok) {
        setSubmitted(true);
        setFormOpen(false);
      } else {
        setError("Something went wrong. Please try again or email me directly.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageTransition>
      <SEO
        title="Contact"
        description="Reach out to Mubashir Rehman — available for full-time backend engineering roles."
      />

      <div className="min-h-screen bg-[hsl(var(--m3-surface))] pb-28 pt-4">
        <div className="mx-auto max-w-lg space-y-3 px-4 pt-5">

          {/* ---------------------------------------------------------------- */}
          {/* Page header                                                      */}
          {/* ---------------------------------------------------------------- */}
          <motion.div {...fadeUp(0)}>
            <h1 className="font-heading text-2xl font-bold text-[hsl(var(--m3-on-surface))]">
              Get In Touch
            </h1>
            <p className="mt-1 font-body text-sm text-[hsl(var(--m3-on-surface-var))]">
              Open to full-time roles.
            </p>
          </motion.div>

          {/* ---------------------------------------------------------------- */}
          {/* Success state                                                    */}
          {/* ---------------------------------------------------------------- */}
          <AnimatePresence>
            {submitted && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, ease: emphasized }}
                className="rounded-[24px] p-6 text-center"
                style={{ backgroundColor: "hsl(var(--m3-primary-container))" }}
              >
                <CheckCircle
                  size={36}
                  style={{ color: "hsl(var(--m3-on-primary-container))" }}
                  className="mx-auto"
                />
                <h3
                  className="mt-3 font-heading text-lg font-bold"
                  style={{ color: "hsl(var(--m3-on-primary-container))" }}
                >
                  Message Sent!
                </h3>
                <p
                  className="mt-1 font-body text-sm"
                  style={{ color: "hsl(var(--m3-on-primary-container)/0.8)" }}
                >
                  I'll get back to you soon.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ---------------------------------------------------------------- */}
          {/* Primary links — WhatsApp + Email, full width                    */}
          {/* ---------------------------------------------------------------- */}
          <motion.div {...fadeUp(0.06)} className="space-y-2">
            <p className="px-1 font-body text-xs font-semibold uppercase tracking-widest text-[hsl(var(--m3-on-surface-var))]">
              Reach out directly
            </p>

            {primaryLinks.map(({ href, Icon, label, detail, testId }) => (
              <motion.a
                key={label}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                data-testid={testId}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-4 rounded-[20px] bg-[hsl(var(--m3-surface-high))] px-5 py-4 shadow-sm active:bg-[hsl(var(--m3-surface-highest))]"
              >
                <span
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full"
                  style={{ backgroundColor: "hsl(var(--m3-primary-container))" }}
                >
                  <Icon
                    size={22}
                    style={{ color: "hsl(var(--m3-on-primary-container))" }}
                  />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-body text-sm font-semibold text-[hsl(var(--m3-on-surface))]">
                    {label}
                  </p>
                  <p className="truncate font-body text-xs text-[hsl(var(--m3-on-surface-var))]">
                    {detail}
                  </p>
                </div>
                {/* Ripple arrow */}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  className="shrink-0 text-[hsl(var(--m3-on-surface-var))]"
                >
                  <path
                    d="M3 8h10M9 4l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.a>
            ))}
          </motion.div>

          {/* ---------------------------------------------------------------- */}
          {/* Secondary links — GitHub + LinkedIn, 2-col                      */}
          {/* ---------------------------------------------------------------- */}
          <motion.div {...fadeUp(0.1)}>
            <p className="mb-2 px-1 font-body text-xs font-semibold uppercase tracking-widest text-[hsl(var(--m3-on-surface-var))]">
              Find me on
            </p>
            <div className="grid grid-cols-2 gap-3">
              {secondaryLinks.map(({ href, Icon, label, testId }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid={testId}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-3 rounded-[20px] bg-[hsl(var(--m3-surface-high))] px-4 py-4 active:bg-[hsl(var(--m3-surface-highest))]"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[hsl(var(--m3-outline-var))]">
                    <Icon
                      size={18}
                      className="text-[hsl(var(--m3-on-surface))]"
                    />
                  </span>
                  <span className="font-body text-sm font-semibold text-[hsl(var(--m3-on-surface))]">
                    {label}
                  </span>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* ---------------------------------------------------------------- */}
          {/* Collapsible form                                                 */}
          {/* ---------------------------------------------------------------- */}
          <motion.div {...fadeUp(0.14)}>
            <button
              onClick={() => setFormOpen((v) => !v)}
              className="flex w-full items-center justify-between rounded-[20px] bg-[hsl(var(--m3-surface-high))] px-5 py-4 active:bg-[hsl(var(--m3-surface-highest))]"
            >
              <div className="flex items-center gap-3">
                <span
                  className="flex h-9 w-9 items-center justify-center rounded-full"
                  style={{ backgroundColor: "hsl(var(--m3-primary-container))" }}
                >
                  <Send
                    size={16}
                    style={{ color: "hsl(var(--m3-on-primary-container))" }}
                  />
                </span>
                <span className="font-body text-sm font-semibold text-[hsl(var(--m3-on-surface))]">
                  Prefer to write a message?
                </span>
              </div>
              <motion.span
                animate={{ rotate: formOpen ? 180 : 0 }}
                transition={{ duration: 0.22, ease: emphasized }}
                className="text-[hsl(var(--m3-on-surface-var))]"
              >
                <ChevronDown size={18} />
              </motion.span>
            </button>

            <AnimatePresence initial={false}>
              {formOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: emphasizedDecel }}
                  className="overflow-hidden"
                >
                  <form
                    onSubmit={handleSubmit}
                    className="space-y-4 rounded-b-[20px] bg-[hsl(var(--m3-surface-high))] px-5 pb-5 pt-3 border-t border-[hsl(var(--m3-outline-var))]"
                    data-testid="form-contact"
                  >
                    <Field
                      id="name"
                      label="Name"
                      name="name"
                      required
                      placeholder="Your name"
                      autoComplete="name"
                      testId="input-name"
                    />
                    <Field
                      id="email"
                      label="Email"
                      type="email"
                      name="email"
                      required
                      placeholder="you@example.com"
                      autoComplete="email"
                      testId="input-email"
                    />
                    <Field
                      id="message"
                      label="Message"
                      name="message"
                      required
                      placeholder="Tell me about your project..."
                      multiline
                      testId="input-message"
                    />

                    {error && (
                      <p className="font-body text-xs text-red-500" data-testid="text-error">
                        {error}
                      </p>
                    )}

                    <motion.button
                      type="submit"
                      disabled={submitting}
                      whileTap={{ scale: 0.97 }}
                      data-testid="button-submit"
                      className="flex w-full items-center justify-center gap-2 rounded-full py-3.5 font-body text-sm font-semibold transition-opacity disabled:opacity-60"
                      style={{
                        backgroundColor: "hsl(var(--primary))",
                        color: "hsl(var(--primary-foreground))",
                      }}
                    >
                      <Send size={15} />
                      {submitting ? "Sending..." : "Send Message"}
                    </motion.button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

        </div>
      </div>
    </PageTransition>
  );
}
