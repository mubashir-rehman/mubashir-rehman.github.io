// "Ask about my work": a small, framework-free chat client. Loaded only when the visitor opens
// the dialog, so content pages ship none of it up front. The system prompt is generated at
// build time from the same data the pages render (src/lib/askPrompt.ts) and fetched here from
// /ask-context.json on first use, never inlined into every page.
//
// The Groq key is a PUBLIC_ build-time value and therefore visible to anyone. It relies on
// free-tier rate limits for abuse protection until it moves behind a proxy (see REPORT.md).

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.3-70b-versatile";
const KEY = import.meta.env.PUBLIC_GROQ_API_KEY as string | undefined;
const STORE = "ask-v2";

type Turn = { role: "user" | "assistant"; content: string };

const COPY = {
  waiting: "Reading the site. This usually takes a few seconds.",
  down: "No answer. The chat service did not respond. Try again, or email me.",
  limited: "Too many questions for now. Wait a minute and try again, or email me.",
  unavailable: "The chat is not configured on this build. Email me instead.",
};

let promptPromise: Promise<string> | null = null;
function loadPrompt(): Promise<string> {
  promptPromise ??= fetch("/ask-context.json")
    .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
    .then((d: { prompt: string }) => d.prompt);
  return promptPromise;
}

function load(): Turn[] {
  try {
    const raw = sessionStorage.getItem(STORE);
    const v = raw ? JSON.parse(raw) : [];
    return Array.isArray(v) ? v.slice(-20) : [];
  } catch {
    return [];
  }
}
function save(turns: Turn[]) {
  try {
    sessionStorage.setItem(STORE, JSON.stringify(turns.slice(-20)));
  } catch {
    /* storage unavailable: the chat still works, it just will not persist */
  }
}

// Answers may contain on-site paths like /projects/x/ and plain URLs. Render them as links,
// everything else as escaped text. No HTML from the model is ever trusted.
function renderText(el: HTMLElement, text: string) {
  el.textContent = "";
  const re = /(https?:\/\/[^\s)]+|\/(?:projects|journal|about|contact|for|services|resume)\/[^\s),.]*)/g;
  let last = 0;
  for (const m of text.matchAll(re)) {
    const i = m.index ?? 0;
    if (i > last) el.append(text.slice(last, i));
    const a = document.createElement("a");
    a.href = m[0];
    a.textContent = m[0];
    if (m[0].startsWith("http")) a.rel = "noopener";
    el.append(a);
    last = i + m[0].length;
  }
  if (last < text.length) el.append(text.slice(last));
}

export function initAsk(root: HTMLElement) {
  const log = root.querySelector<HTMLOListElement>("[data-ask-log]")!;
  const form = root.querySelector<HTMLFormElement>("[data-ask-form]")!;
  const input = root.querySelector<HTMLTextAreaElement>("[data-ask-input]")!;
  const status = root.querySelector<HTMLElement>("[data-ask-status]")!;
  const send = root.querySelector<HTMLButtonElement>("[data-ask-send]")!;
  let turns = load();
  let busy = false;

  function add(turn: Turn) {
    root.querySelector(".ask-empty-row")?.remove();
    const li = document.createElement("li");
    li.dataset.role = turn.role;
    const who = document.createElement("span");
    who.className = "ask-who";
    who.textContent = turn.role === "user" ? "You" : "Answer";
    const body = document.createElement("p");
    renderText(body, turn.content);
    li.append(who, body);
    log.append(li);
    li.scrollIntoView({ block: "nearest" });
  }
  turns.forEach(add);

  root.querySelectorAll<HTMLButtonElement>("[data-ask-suggest]").forEach((b) =>
    b.addEventListener("click", () => {
      input.value = b.textContent?.trim() ?? "";
      form.requestSubmit();
    }),
  );

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      form.requestSubmit();
    }
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const q = input.value.trim();
    if (!q || busy) return;
    if (!KEY) {
      status.textContent = COPY.unavailable;
      return;
    }
    busy = true;
    send.disabled = true;
    input.value = "";
    const user: Turn = { role: "user", content: q };
    turns.push(user);
    add(user);
    status.textContent = COPY.waiting;
    try {
      const system = await loadPrompt();
      const res = await fetch(GROQ_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${KEY}` },
        body: JSON.stringify({
          model: MODEL,
          temperature: 0.3,
          max_tokens: 400,
          // System prompt plus the last six turns: the prompt is large and the free tier is
          // limited by tokens per minute.
          messages: [{ role: "system", content: system }, ...turns.slice(-7)],
        }),
      });
      if (!res.ok) throw new Error(res.status === 429 ? "limited" : "down");
      const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
      const text = data.choices?.[0]?.message?.content?.trim();
      if (!text) throw new Error("down");
      const reply: Turn = { role: "assistant", content: text };
      turns.push(reply);
      add(reply);
      save(turns);
      status.textContent = "";
    } catch (err) {
      // Never surface raw provider errors: they can leak account details.
      status.textContent = err instanceof Error && err.message === "limited" ? COPY.limited : COPY.down;
      turns = turns.filter((t) => t !== user);
    } finally {
      busy = false;
      send.disabled = false;
      input.focus();
    }
  });
}
