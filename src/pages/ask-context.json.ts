import type { APIRoute } from "astro";
import { buildAskPrompt } from "@/lib/askPrompt";

export const GET: APIRoute = async () =>
  new Response(JSON.stringify({ prompt: await buildAskPrompt() }), {
    headers: { "Content-Type": "application/json" },
  });
