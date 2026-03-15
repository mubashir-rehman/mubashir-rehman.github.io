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
Title: Backend Engineer · AI/ML · Cloud · Systems
Location: Lahore, Pakistan
Email: mubashirrehman66@gmail.com
Phone: +92 309 552 8384
Website: https://mubashir-rehman.github.io
Available: Yes — Open to Freelance & Full-Time Roles

Bio: Backend-focused Software Engineer with a proven track record building production systems for AI, distributed architectures, and cloud infrastructure. Shipped 7 microservices with 60+ endpoints serving 1,000+ concurrent users, led drone swarm control systems handling 10K msg/sec telemetry, and published ML research in a peer-reviewed journal. Cares deeply about clean design, measurable impact, and systems that hold up under pressure.

Key Metrics:
- 11K+ lines of production code
- 182 commits authored
- 1K+ concurrent users supported
- ~85% test coverage
- Published paper: CSSP 2024
- 99.8% uptime achieved

## SKILLS
Languages: Python, C++, JavaScript, C, Java, Kotlin, C#, SQL
Backend: Django, FastAPI, Flask, Django REST Framework, Node.js
Databases: PostgreSQL, Redis, pgvector
Cloud & DevOps: AWS EC2, ECS, VPC, S3, IAM, Docker, GitHub Actions, CI/CD, DigitalOcean, Nginx
AI / ML: OpenAI GPT, Google Gemini, LangChain, MindsDB, Databricks, Keras, scikit-learn, PyTorch
Tools: Git, Jira, pytest, Postman, Celery, ARQ, MQTT, WebSockets, OAuth2.0, Stripe, OpenCV, n8n

## EXPERIENCE

### Software Engineer — TransData (Mar 2025 – Present) | Lahore, Pakistan
- Sole DRF developer for 7 microservices and 60+ endpoints supporting 1,000+ concurrent users
- Reduced prompt deployment time from 2 hours to 5 minutes via versioned prompt management + n8n across 6 AI pipelines
- Multi-tier data extraction (LinkedIn API → scraper → OpenAI fallback) achieving ~95% profile completion
- WebSocket notifications via Django Channels: 10K+ daily updates with <100ms latency
- Stripe subscriptions with 99.9% payment success; OAuth2 + JWT refresh auth
- 182 commits (66% of repo), 11K+ lines of production code, 89 tests at ~85% coverage
- Semantic search via Google Gemini embeddings + pgvector (768-d): <50ms latency, 90% cache hit rate
- Architected real-time crypto intelligence platform processing 100+ social mentions/hr with 10 microservices
- Async blockchain analysis for 6 networks; ML-based DEX scam detection at 92% accuracy
- Integrated MindsDB and Databricks for enterprise AI workflows; optimised PostgreSQL schemas reducing latency 30%
- HRMS migration to Django: 200+ employees, onboarding cut from 4 hours to 30 minutes, 99.8% uptime

### Software Engineer — VeritusLabs (Jul 2023 – Mar 2025) | Lahore, Pakistan
- Led team of 4 building QGroundControl drone swarm control for 10+ UAVs at 50Hz telemetry; cut mission planning time by 60%
- MQTT telemetry pipeline achieving 10K msg/sec with <20ms latency
- Python ground control with Olympe/Sphinx, real-time video streaming and OpenCV object detection
- AWS infra automation (Boto3), ECS Fargate Flask deployment with autoscaling
- Docker CI/CD + Vagrant cross-platform testing; 95% on-time delivery across 12 sprints
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
  Authors: Syed Anas Ali, Muhammad Saqib Niaz, Mubashir Rehman, et al.
  Journal: Circuits, Systems, and Signal Processing (CSSP), November 2024
  Link: https://arxiv.org/abs/2308.04355v3

## PROJECTS

### AI-Powered LinkedIn Content Platform (BrandMate)
Role: Sole DRF backend developer at TransData
Stack: Python, Django, DRF, WebSockets, OpenAI, pgvector, Stripe, n8n, PostgreSQL
- 7 microservices, 60+ REST endpoints, 1K+ concurrent users
- Versioned prompt management across 6 AI pipelines via n8n
- Multi-tier profile extraction (LinkedIn API → scraper → OpenAI fallback) at ~95% completion
- WebSocket notifications (Django Channels): 10K+ daily updates, <100ms latency
- Stripe subscriptions with 99.9% payment success
- Semantic search: Gemini embeddings + pgvector, <50ms query latency

### AI-Driven Cryptocurrency Intelligence Platform
Role: Sole engineer at TransData
Stack: Python, FastAPI, Docker, Google Gemini, pgvector, Redis, Celery, ARQ, Etherscan
- Processes 100+ social mentions/hr with Gemini embeddings + pgvector semantic search
- Async blockchain analysis across 6 networks with token-bucket rate limiting (80%+ cache hits)
- ML-based DEX scam token detection at 92% accuracy
- CI/CD orchestrating 10 microservices

### Enterprise AI/ML Pipeline Integration
Role: Collaborator in 7-member team at TransData
Stack: Django, PostgreSQL, MindsDB, Databricks, Slack API, OAuth 2.0
- Connected Slack and enterprise systems via OAuth 2.0
- Optimised PostgreSQL schemas reducing query latency by 30%
- Reduced support tickets by 25% via enhanced logging and monitoring

### Enterprise HRMS Migration & Automation (Horilla)
Stack: Python, Django, PostgreSQL, Docker, DigitalOcean, Nginx, Celery, N8N
- Migrated legacy HRMS to Django serving 200+ employees
- Built attendance, contract, payroll modules; ZKTeco biometric sync (Web API)
- 99.8% uptime; onboarding cut from 4 hours to 30 minutes
- Deployed Dockerised system on DigitalOcean with Nginx and automated rollback

### Drone Swarm Control System
Role: Team lead (4 engineers) at VeritusLabs
Stack: C++, Qt, Python, MQTT, ArduPilot, PX4, Gazebo, Docker, Vagrant
- QGroundControl-based controller for 10+ UAVs at 50Hz telemetry
- MQTT pipeline: 10K msg/sec, <20ms latency
- Gazebo SITL multi-drone simulation
- Mission planning time reduced by 60%

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
- Published in CSSP journal, Nov 2024 — arXiv:2308.04355v3

### AI Prompt Management Platform
Stack: Python, Django, OpenAI GPT-4, LangChain, AWS S3, RBAC, Docker, CI/CD
- GPT-4 streaming responses with prompt versioning
- RBAC access control and secure S3 asset storage

### Distributed Job Scheduler
Stack: C, TCP/IP, Multithreading (Pthread), Distributed Systems
- Supports 50+ simultaneous jobs with process isolation via Fork/Exec

### Real-Time Pub-Sub Messaging System
Stack: Python, Redis, PostgreSQL, Node.js, Distributed Systems
- 1K+ msg/sec with Redis in-memory caching and PostgreSQL persistence

### Endless Runner Mobile Game
Stack: Unity, C#, Android
- Object pooling: 40% memory reduction; 5K+ downloads; 4.2★ rating
- Google Play Services: leaderboards and achievements

### Personal Portfolio Website
Stack: React 18, TypeScript, Vite, Tailwind CSS, Framer Motion, shadcn/ui, SSG, GitHub Actions
- 8 SSG-rendered pages, 3 themes (Sakura / Dark / Light)
- Fully static, deployed to GitHub Pages via CI/CD

## ACHIEVEMENTS
- Published research in CSSP journal (Nov 2024) — arXiv:2308.04355v3
- Authored 66% of production codebase at TransData (182 commits, 11K+ lines)
- Achieved 99.8% uptime on HRMS serving 200+ employees
- Reduced HRMS onboarding time from 4 hours to 30 minutes
- Led drone swarm system with 10K msg/sec MQTT pipeline at <20ms latency
- ML-based DEX scam detection model at 92% accuracy
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
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY as string | undefined;

const SUGGESTED_QUESTIONS = [
  "What stack does he use?",
  "Tell me about his experience",
  "What projects has he built?",
  "Is he open to freelance work?",
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
      if (!GROQ_API_KEY) throw new Error("VITE_GROQ_API_KEY is not set.");

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
              "bottom-24 right-4 sm:right-6",
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
          "fixed bottom-6 right-4 sm:right-6 z-50",
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
