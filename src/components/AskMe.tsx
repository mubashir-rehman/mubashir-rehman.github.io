import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User, Loader2 } from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface GroqMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

// ---------------------------------------------------------------------------
// System prompt — placeholder context block that the user will fill in.
// ---------------------------------------------------------------------------
const SYSTEM_PROMPT = `You are an AI assistant embedded in Mubashir Rehman's portfolio website. Your ONLY job is to answer questions about Mubashir based on the information below. Be concise, friendly, and professional.

--- CONTEXT START ---

## PROFILE
Name: Mubashir Rehman
Title: Backend / AI Backend Engineer — ships AI and automation into production (also full-stack and ERP/HRMS)
Location: Lahore, Pakistan
Email: mubashirrehman66@gmail.com
Phone: +92 309 552 8384
Website: https://mubashir-rehman.is-a.dev
Available: Open to remote roles in any timezone (pay-driven); also open to on-site roles in Lahore, Pakistan.

Bio: Backend-focused Software Engineer with 3+ years building production systems for AI automation, distributed architectures, and cloud infrastructure. Primary backend contributor on a multi-tenant SaaS platform (7 services, 60+ REST endpoints), led a 4-engineer drone-control team, and co-authored peer-reviewed ML research (CSSP, Springer 2025). Cares about clean design, measurable impact, and systems that hold up under pressure.

Key Metrics:
- 3+ years building backends
- Primary backend owner of a multi-tenant SaaS platform at TransData
- 7 backend services / 60+ REST endpoints
- 8+ production systems shipped
- 2 open-source tools (HireTrack, this portfolio)
- Co-authored peer-reviewed paper: CSSP (Springer) 2025 — equal contribution
- Led a team of 4 engineers

## SKILLS
Languages: Python, C++, JavaScript, C, Java, Kotlin, C#, SQL
Backend: Django, FastAPI, Flask, Django REST Framework, Node.js
Databases: PostgreSQL, Redis, pgvector
Cloud & DevOps: AWS EC2, ECS, VPC, S3, IAM, Docker, GitHub Actions, CI/CD, DigitalOcean, Nginx
AI / ML: OpenAI GPT, Google Gemini, LangChain, MindsDB, Databricks, Keras, scikit-learn, PyTorch
Tools: Git, Jira, pytest, Postman, Celery, ARQ, MQTT, WebSockets, OAuth2.0, Stripe, OpenCV, n8n

## EXPERIENCE

### Software Engineer — TransData (Mar 2025 – Present) | Lahore, Pakistan
- Primary backend contributor: 7 backend services and 60+ REST endpoints with Django REST Framework on a multi-tenant SaaS platform
- Versioned prompt management with n8n across 6 AI pipelines so prompt changes deploy without code changes
- Multi-tier data extraction (LinkedIn API → scraper → OpenAI fallback) for resilient profile enrichment
- Real-time WebSocket notifications via Django Channels; OAuth2 + JWT refresh auth
- Stripe-based subscription billing
- Owned the bulk of the backend codebase, with 89 automated tests
- Semantic search via Google Gemini embeddings + pgvector (768-d) with Redis caching/queueing
- Built a crypto/social intelligence platform ingesting Telegram, Discord, and X, with ~10 services for summarization, embeddings, semantic search, and alerting
- Async blockchain analysis across 6 networks; ML-based DEX scam-token detection (~92% on an internal test set)
- Integrated MindsDB and Databricks for enterprise AI workflows; optimised PostgreSQL schemas
- Migrated a Django-based HRMS for a ~200-employee workforce with zero-downtime deploys

### Software Engineer — VeritusLabs (Jul 2023 – Mar 2025) | Lahore, Pakistan
- Led a team of 4 building QGroundControl-based drone swarm control for 10+ UAVs at 50Hz telemetry
- High-frequency MQTT telemetry pipeline (designed for ~10K msg/sec)
- Python ground control with Olympe/Sphinx, real-time video streaming and OpenCV object detection
- AWS infra automation (Boto3), ECS Fargate Flask deployment with autoscaling
- Docker CI/CD + Vagrant cross-platform testing across Agile sprints
- AI prompt management platform with OpenAI GPT-4 streaming, LangChain NLP, RBAC, and S3 storage

### Teaching Assistant — Information Technology University (Sep 2022 – Jan 2025) | Lahore, Pakistan
- Mentored 60+ graduate students in Advanced OS, Virtualization, and Distributed Systems
- Analysed foundational research papers including Scheduler Activations, Exokernel, and GFS
- Designed lab assignments for 100+ undergraduates in multithreading, file systems, and system calls
- Guided 15+ research projects in memory management and distributed systems

### Game Development Intern — GameBole (Mar 2022 – Aug 2022) | Lahore, Pakistan
- Endless runner (Unity/C#) with object pooling: 40% memory reduction, 5K+ downloads, 4.2★ rating
- Web game (PlayCanvas/JS) with scene pre-loading, object pooling, and cross-browser optimisation
- Integrated Google Play Services for leaderboards and achievements

## EDUCATION
- BS Computer Science — Information Technology University, Lahore (Sep 2018 – Dec 2024) | PEEF Scholarship for academic excellence
- FSc Pre-Engineering — Govt. Millat Degree College Mumtazabad, Multan (Sep 2016 – Jun 2018) | Fully funded STFS Scholarship by Pakistan Science Foundation
- Matriculation Science — Govt. M. A. Jinnah High School, Multan (Sep 2014 – Jun 2016) | Dalda Scholarship for outstanding merit

## PUBLICATIONS
- "Evaluation of a Low-Cost Single-Lead ECG Module for Vascular Ageing Prediction and Studying Smoking-Induced Changes in ECG"
  Authors: Syed Anas Ali, Muhammad Saqib Niaz, Mubashir Rehman, et al. (Ali, Niaz & Rehman contributed equally)
  Journal: Circuits, Systems, and Signal Processing (CSSP), Springer, 2025
  DOI: 10.1007/s00034-025-03048-2 | arXiv: https://arxiv.org/abs/2308.04355
  Mubashir's role: data collection, ML pipeline (signal preprocessing, segmentation, feature engineering), and model training & evaluation (Random Forest, ResNet-18 transfer learning). No hardware work.

## PROJECTS

### HireTrack — AI Résumé Builder & Job Tracker (open source, live)
Role: Designed and built end to end (personal open-source project)
Stack: React 19, Vite 6, LangGraph, Supabase (Auth + RLS), Google GenAI, docx/mammoth/pdfjs, PWA
- Deterministic-first LangGraph pipeline for résumé tailoring across 5 AI providers (bring-your-own-key)
- Supabase Auth with row-level security; client-side DOCX/PDF/Markdown export; offline-first PWA
- Live: https://job-application-tracker-sigma-liard.vercel.app/ | Repo: https://github.com/mubashir-rehman/job-application-tracker

### AI-Powered LinkedIn Content Platform (BrandMate)
Role: Primary backend developer at TransData
Stack: Python, Django, DRF, WebSockets, OpenAI, pgvector, Stripe, n8n, PostgreSQL
- 7 backend services, 60+ REST endpoints on a multi-tenant SaaS platform
- Versioned prompt management across 6 AI pipelines via n8n
- Multi-tier profile extraction (LinkedIn API → scraper → OpenAI fallback) for resilient enrichment
- Real-time WebSocket notifications (Django Channels)
- Stripe-based subscription billing
- Semantic search: Gemini embeddings + pgvector with Redis caching

### AI-Driven Cryptocurrency Intelligence Platform
Role: Primary backend engineer at TransData
Stack: Python, FastAPI, Docker, Google Gemini, pgvector, Redis, Celery, ARQ, Etherscan
- Ingests social mentions from Telegram/Discord/X with Gemini embeddings + pgvector semantic search
- Async blockchain analysis across 6 networks with token-bucket rate limiting and Redis caching
- ML-based DEX scam-token detection (~92% on an internal test set)
- CI/CD orchestrating ~10 services

### Enterprise AI/ML Pipeline Integration
Role: Collaborator in 7-member team at TransData
Stack: Django, PostgreSQL, MindsDB, Databricks, Slack API, OAuth 2.0
- Connected Slack and enterprise systems via OAuth 2.0
- Optimised PostgreSQL schemas for enterprise AI workflows
- Improved observability with enhanced logging and monitoring

### Enterprise HRMS Migration & Automation (Horilla)
Stack: Python, Django, PostgreSQL, Docker, DigitalOcean, Nginx, Celery, N8N
- Migrated a Django-based HRMS for a ~200-employee workforce
- Built attendance, contract, and reporting modules; ZKTeco biometric sync (Web API)
- Zero-downtime deploys with automated rollback
- Deployed Dockerised system on DigitalOcean with Nginx

### Drone Swarm Control System
Role: Team lead (4 engineers) at VeritusLabs
Stack: C++, Qt, Python, MQTT, ArduPilot, PX4, Gazebo, Docker, Vagrant
- QGroundControl-based controller for 10+ UAVs at 50Hz telemetry
- High-frequency MQTT pipeline (designed for ~10K msg/sec)
- Gazebo SITL multi-drone simulation
- Streamlined mission planning workflow

### Python Ground Control & Video Processing
Stack: Python, Olympe, OpenCV, Sphinx, Android SDK, MQTT, Bing Maps API
- Olympe/Sphinx ground control with multiprocessing and MQTT telemetry
- Real-time video streaming to Android with OpenCV object detection
- OpenStreetMap-enhanced Android ground stations

### AWS Automation & Cloud Deployment
Stack: Python, Boto3, AWS ECS, Flask, Docker, Dynu DDNS
- Automated VPC, EC2, and ECS provisioning with Boto3
- Deployed Flask apps on ECS Fargate with Docker and auto-scaling

### Cardiovascular Age Prediction — Published Research
Stack: Python, Keras, scikit-learn, PyTorch, ESP32, IoT
- ECG data from 42 subjects (6,131 segments, 13 features)
- Random Forest: R²=0.99; ResNet-18 transfer learning: R²=0.87
- Co-authored (equal contribution) and published in CSSP journal (Springer, 2025) — DOI 10.1007/s00034-025-03048-2
- Mubashir's role: data collection, ML pipeline, and model training/evaluation (not hardware)

### AI Prompt Management Platform
Stack: Python, Django, OpenAI GPT-4, LangChain, AWS S3, RBAC, Docker, CI/CD
- GPT-4 streaming responses with prompt versioning
- RBAC access control and secure S3 asset storage

### Distributed Job Scheduler
Stack: C, TCP/IP, Multithreading (Pthread), Distributed Systems
- Supports 50+ simultaneous jobs with process isolation via Fork/Exec

### Real-Time Pub-Sub Messaging System
Stack: Python, Redis, PostgreSQL, Node.js, Distributed Systems
- High-throughput pub/sub with Redis in-memory caching and PostgreSQL persistence

### Endless Runner Mobile Game
Stack: Unity, C#, Android
- Object pooling: 40% memory reduction; 5K+ downloads; 4.2★ rating
- Google Play Services: leaderboards and achievements

### Personal Portfolio Website
Stack: Astro 6, React 18, TypeScript, Tailwind CSS, Framer Motion, shadcn/ui, GitHub Actions
- Astro pre-renders an SEO-optimized HTML shell per route, mounting React islands for interactivity
- 3 themes (Sakura / Dark / Light); role-targeted landing pages; full SEO/GEO (JSON-LD, llms.txt, sitemap)
- Fully static, deployed to GitHub Pages via CI/CD

## ACHIEVEMENTS
- Co-authored (equal contribution) research in CSSP journal (Springer, 2025) — DOI 10.1007/s00034-025-03048-2
- Primary backend owner at TransData — owned the core backend (7 services, 60+ REST endpoints) of a multi-tenant SaaS platform
- Migrated a Django HRMS for a ~200-employee workforce with zero-downtime deploys
- Led a 4-engineer drone-swarm team with a high-frequency MQTT telemetry pipeline
- Built and open-sourced HireTrack (LangGraph résumé tailoring across 5 AI providers)
- ML-based DEX scam-token detection (~92% on an internal test set)
- PEEF, STFS, and Dalda scholarship recipient

## SOCIAL / CONTACT
GitHub: https://github.com/mubashir-rehman
LinkedIn: https://linkedin.com/in/mubashir-rehman
Email: mubashirrehman66@gmail.com
WhatsApp: https://wa.me/923095528384

--- CONTEXT END ---

Rules:
- Only answer questions based on the context above.
- If asked something not covered by the context, respond: "I don't have that info, but you can reach Mubashir directly at mubashirrehman66@gmail.com"
- Never invent or hallucinate projects, skills, or experience.
- Keep answers under 3–4 sentences unless a detailed breakdown is explicitly requested.
- Politely decline and redirect off-topic questions (e.g. "What's 2+2?") back to portfolio-related questions.`;

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.3-70b-versatile";
const GROQ_API_KEY = import.meta.env.PUBLIC_GROQ_API_KEY as string | undefined;

const SUGGESTED_QUESTIONS = [
  "What stack does he use?",
  "Tell me about his experience",
  "What projects has he built?",
  "Is he open to remote roles?",
];

// ---------------------------------------------------------------------------
// Typing indicator sub-component
// ---------------------------------------------------------------------------
function TypingIndicator() {
  return (
    <div className="flex items-end gap-2">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Bot size={14} />
      </span>
      <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm bg-card border border-border px-4 py-3">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="block h-1.5 w-1.5 rounded-full bg-muted-foreground"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
          />
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export default function AskMe() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Focus input when panel opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    setHasStarted(true);
    setError(null);

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    // Build history for Groq (system + all prior turns + new user message)
    const history: GroqMessage[] = [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages.map((m) => ({ role: m.role, content: m.content })),
      { role: "user", content: trimmed },
    ];

    try {
      if (!GROQ_API_KEY) throw new Error("PUBLIC_GROQ_API_KEY is not set.");

      const res = await fetch(GROQ_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: GROQ_MODEL,
          messages: history,
          max_tokens: 512,
          temperature: 0.4,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({})) as { error?: { message?: string } };
        throw new Error(body.error?.message ?? `Groq API error ${res.status}`);
      }

      const data = await res.json() as { choices: Array<{ message: { content: string } }> };
      const reply = data.choices[0]?.message?.content ?? "Sorry, I couldn't generate a response.";

      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: "assistant", content: reply },
      ]);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [loading, messages]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  // Auto-resize textarea
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  };

  return (
    <>
      {/* ------------------------------------------------------------------ */}
      {/* Chat panel                                                           */}
      {/* ------------------------------------------------------------------ */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className={[
              "fixed z-50 flex flex-col overflow-hidden",
              "bottom-[5.5rem] right-4 sm:bottom-24 sm:right-6",
              "w-[calc(100vw-2rem)] sm:w-[380px]",
              "h-[min(500px,calc(100dvh-7rem))]",
              "rounded-2xl border border-border bg-background shadow-2xl",
            ].join(" ")}
            role="dialog"
            aria-label="Ask me anything"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border bg-card px-4 py-3 shrink-0">
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-primary">
                  <Bot size={16} />
                </span>
                <div>
                  <p className="font-heading text-sm font-semibold leading-tight text-foreground">
                    Ask Me Anything
                  </p>
                  <p className="font-body text-[11px] text-muted-foreground leading-tight">
                    About Mubashir's work &amp; experience
                  </p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label="Close chat"
              >
                <X size={16} />
              </button>
            </div>

            {/* Messages area */}
            <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-4 space-y-4 scrollbar-thin">
              {/* Welcome state */}
              {!hasStarted && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="flex items-end gap-2">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Bot size={14} />
                    </span>
                    <div className="rounded-2xl rounded-bl-sm bg-card border border-border px-4 py-3 text-sm text-foreground font-body leading-relaxed max-w-[85%]">
                      Hi! I can answer questions about Mubashir's skills, projects, and experience. What would you like to know?
                    </div>
                  </div>
                  <div className="ml-9 flex flex-wrap gap-2">
                    {SUGGESTED_QUESTIONS.map((q) => (
                      <button
                        key={q}
                        onClick={() => sendMessage(q)}
                        className="rounded-full border border-border bg-card px-3 py-1.5 font-body text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:bg-primary/5 hover:text-primary"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Message list */}
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex items-end gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  {/* Avatar */}
                  <span
                    className={[
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
                      msg.role === "assistant"
                        ? "bg-primary/10 text-primary"
                        : "bg-secondary text-secondary-foreground",
                    ].join(" ")}
                  >
                    {msg.role === "assistant" ? <Bot size={14} /> : <User size={14} />}
                  </span>

                  {/* Bubble */}
                  <div
                    className={[
                      "rounded-2xl px-4 py-3 font-body text-sm leading-relaxed max-w-[78%]",
                      msg.role === "assistant"
                        ? "rounded-bl-sm bg-card border border-border text-foreground"
                        : "rounded-br-sm bg-primary text-primary-foreground",
                    ].join(" ")}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {loading && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                  <TypingIndicator />
                </motion.div>
              )}

              {/* Error notice */}
              {error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="ml-9 font-body text-xs text-destructive"
                >
                  Error: {error}
                </motion.p>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Input area */}
            <div className="shrink-0 border-t border-border bg-card px-3 py-3">
              <div className="flex items-end gap-2 rounded-xl border border-border bg-background px-3 py-2 transition-colors focus-within:border-primary/60 focus-within:ring-1 focus-within:ring-primary/20">
                <textarea
                  ref={inputRef}
                  rows={1}
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about skills, projects…"
                  disabled={loading}
                  className="flex-1 resize-none bg-transparent font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none disabled:opacity-50 leading-relaxed"
                  style={{ minHeight: "24px", maxHeight: "120px" }}
                />
                <button
                  onClick={() => sendMessage(input)}
                  disabled={loading || !input.trim()}
                  aria-label="Send message"
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-all hover:opacity-90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {loading ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
                </button>
              </div>
              <p className="mt-1.5 text-center font-body text-[10px] text-muted-foreground/60">
                Powered by Groq · llama-3.3-70b
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ------------------------------------------------------------------ */}
      {/* Floating trigger button                                             */}
      {/* ------------------------------------------------------------------ */}
      <motion.button
        onClick={() => setOpen((v) => !v)}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 20, delay: 1 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.93 }}
        className={[
          "fixed bottom-[5.5rem] right-4 sm:bottom-6 sm:right-6 z-50",
          "flex h-13 w-13 items-center justify-center",
          "h-[52px] w-[52px] rounded-full",
          "bg-primary text-primary-foreground shadow-lg shadow-primary/25",
          "transition-shadow hover:shadow-xl hover:shadow-primary/30",
          open ? "rotate-0" : "",
        ].join(" ")}
        aria-label={open ? "Close chat" : "Ask me anything"}
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X size={22} />
            </motion.span>
          ) : (
            <motion.span
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <MessageCircle size={22} />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  );
}
