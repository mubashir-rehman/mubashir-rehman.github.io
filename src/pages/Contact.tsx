import { useState } from "react";
import { motion } from "framer-motion";
import { Send, MessageCircle, Mail, Github, Linkedin } from "lucide-react";
import profile from "@/data/profile.json";
import SEO from "@/components/SEO";
import PageTransition from "@/components/PageTransition";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Contact() {
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
      } else {
        setError("Something went wrong. Please try again or email me directly.");
      }
    } catch {
      setError("Network error. Please try again or email me directly.");
    } finally {
      setSubmitting(false);
    }
  };

  const whatsappMsg = encodeURIComponent(
    "Hi Mubashir, I found you via your portfolio and would like to connect!"
  );

  const socialLinks = [
    {
      href: `https://wa.me/923095528384?text=${whatsappMsg}`,
      icon: MessageCircle,
      label: "WhatsApp",
      detail: profile.phone,
      external: true,
    },
    {
      href: `mailto:${profile.email}`,
      icon: Mail,
      label: "Email",
      detail: profile.email,
      external: false,
    },
    {
      href: profile.socialLinks.github,
      icon: Github,
      label: "GitHub",
      detail: "mubashir-rehman",
      external: true,
    },
    {
      href: profile.socialLinks.linkedin,
      icon: Linkedin,
      label: "LinkedIn",
      detail: "mubashir-rehman",
      external: true,
    },
  ];

  return (
    <PageTransition>
      <SEO title="Contact" description="Reach out to Mubashir Rehman — available for freelance projects and full-time backend engineering roles. Contact via email, WhatsApp, GitHub, or LinkedIn." />
      <div className="mx-auto max-w-3xl px-4 pb-20 pt-24 sm:px-6">
        <h1 className="font-heading text-3xl font-bold sm:text-4xl">Get In Touch</h1>
        <p className="mt-2 text-muted-foreground">
          Open to freelance projects and full-time roles. Let's build something great.
        </p>

        <div className="mt-10 grid gap-10 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {submitted ? (
              <Card className="border-primary/20">
                <CardContent className="flex flex-col items-center justify-center p-10 text-center">
                  <Send size={32} className="text-primary" />
                  <h3 className="mt-4 font-heading text-xl font-bold">Message Sent!</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Thanks for reaching out. I'll get back to you soon.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4" data-testid="form-contact">
                <div>
                  <label htmlFor="name" className="mb-1.5 block text-sm font-medium">Name</label>
                  <Input id="name" name="name" required placeholder="Your name" autoComplete="name" data-testid="input-name" />
                </div>
                <div>
                  <label htmlFor="email" className="mb-1.5 block text-sm font-medium">Email</label>
                  <Input id="email" name="email" type="email" required placeholder="you@example.com" autoComplete="email" data-testid="input-email" />
                </div>
                <div>
                  <label htmlFor="subject" className="mb-1.5 block text-sm font-medium">Subject</label>
                  <Input id="subject" name="subject" required placeholder="What's this about?" data-testid="input-subject" />
                </div>
                <div>
                  <label htmlFor="message" className="mb-1.5 block text-sm font-medium">Message</label>
                  <Textarea id="message" name="message" required rows={5} placeholder="Tell me about your project..." data-testid="input-message" />
                </div>
                {error && (
                  <p className="text-sm text-red-500" data-testid="text-error">{error}</p>
                )}
                <Button type="submit" className="w-full" disabled={submitting} data-testid="button-submit">
                  <Send size={16} className="mr-2" /> {submitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 gap-4 content-start"
          >
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                data-testid={`link-social-${link.label.toLowerCase()}`}
              >
                <Card className="group h-full transition-all hover:border-primary/40 hover:shadow-md hover:shadow-primary/5">
                  <CardContent className="flex flex-col items-center justify-center gap-3 p-6 text-center">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                      <link.icon size={22} />
                    </span>
                    <div>
                      <p className="text-sm font-semibold">{link.label}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{link.detail}</p>
                    </div>
                  </CardContent>
                </Card>
              </a>
            ))}
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
