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
// Session persistence — the island remounts on every Astro view transition,
// so chat state must live in sessionStorage to survive page navigation.
const STORAGE_KEY = "askme-chat-v1";

function restoreSession(): { messages: Message[]; open: boolean } {
  if (typeof sessionStorage === "undefined") return { messages: [], open: false };
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return { messages: [], open: false };
    const parsed = JSON.parse(raw);
    return {
      messages: Array.isArray(parsed.messages) ? parsed.messages : [],
      open: Boolean(parsed.open),
    };
  } catch {
    return { messages: [], open: false };
  }
}

export default function AskMe({ systemPrompt }: { systemPrompt: string }) {
  const [open, setOpen] = useState(() => restoreSession().open);
  const [messages, setMessages] = useState<Message[]>(() => restoreSession().messages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(() => restoreSession().messages.length > 0);

  // Persist chat across page navigations (session-scoped, not localStorage)
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ messages, open }));
    } catch {
      /* storage full/unavailable — chat still works, just won't persist */
    }
  }, [messages, open]);

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

  // Re-focus input after a reply finishes — the textarea is disabled while
  // loading, which drops focus; without this the user must click again.
  useEffect(() => {
    if (!loading && open && hasStarted) {
      inputRef.current?.focus();
    }
  }, [loading, open, hasStarted]);

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

    // Build history for Groq: system + last 6 turns only. The system prompt is
    // large; resending the full transcript each turn burns through the free-tier
    // tokens-per-minute limit after a few messages.
    const history: GroqMessage[] = [
      { role: "system", content: systemPrompt },
      ...messages.slice(-6).map((m) => ({ role: m.role, content: m.content })),
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
        // Never surface raw provider errors (they leak org/account details).
        if (res.status === 429) {
          throw new Error(
            "I'm getting a lot of questions right now — give it a few seconds and ask again."
          );
        }
        throw new Error("The assistant hit a temporary error. Please try again in a moment.");
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
  }, [loading, messages, systemPrompt]);

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
              "fixed z-[110] flex flex-col overflow-hidden",
              "bottom-[calc(8.5rem+env(safe-area-inset-bottom,0px))] right-4 md:bottom-24 md:right-6",
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
          // Mobile: sit above the 64px bottom nav (+ safe area); desktop (md+, nav hidden): bottom corner.
          // z-[110] keeps it above the bottom nav (z-[100]).
          "fixed bottom-[calc(4.75rem+env(safe-area-inset-bottom,0px))] right-4 md:bottom-6 md:right-6 z-[110]",
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
