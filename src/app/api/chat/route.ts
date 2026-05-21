import { readFile } from "fs/promises";
import path from "path";
import { streamText, type ModelMessage } from "ai";
import { google } from "@ai-sdk/google";

export const runtime = "nodejs";

const MAX_MESSAGES = 40;
const MAX_MESSAGE_LENGTH = 2000;
const PERSONA_PATH = path.join(process.cwd(), "content", "persona.md");

type ClientMessage = {
  role: "user" | "assistant";
  content: string;
};

async function loadPersonaSystemPrompt(): Promise<string> {
  try {
    const raw = await readFile(PERSONA_PATH, "utf8");
    const prompt = raw.trim();
    if (!prompt) {
      throw new Error("Persona prompt is empty.");
    }
    return prompt;
  } catch (err) {
    console.error("[/api/chat] Failed to read content/persona.md", err);
    throw new Error("Persona prompt is unavailable.");
  }
}

function parseMessages(body: unknown): ClientMessage[] {
  if (!body || typeof body !== "object" || !("messages" in body)) {
    return [];
  }

  const raw = (body as { messages: unknown }).messages;
  if (!Array.isArray(raw)) return [];

  const parsed: ClientMessage[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const role = (item as { role?: unknown }).role;
    const content = (item as { content?: unknown }).content;
    if (role !== "user" && role !== "assistant") continue;
    if (typeof content !== "string") continue;
    const trimmed = content.trim();
    if (!trimmed) continue;
    if (trimmed.length > MAX_MESSAGE_LENGTH) {
      throw new Error(`Each message must be at most ${MAX_MESSAGE_LENGTH} characters.`);
    }
    parsed.push({ role, content: trimmed });
  }

  return parsed;
}

function toModelMessages(messages: ClientMessage[]): ModelMessage[] {
  return messages.map((message) => ({
    role: message.role,
    content: message.content,
  }));
}

export async function POST(request: Request) {
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    return new Response("Chat is not configured.", { status: 503 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response("Invalid JSON.", { status: 400 });
  }

  let messages: ClientMessage[];
  try {
    messages = parseMessages(body);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid messages.";
    return new Response(message, { status: 400 });
  }

  if (messages.length === 0) {
    return new Response("At least one message is required.", { status: 400 });
  }

  if (messages.length > MAX_MESSAGES) {
    return new Response(`Too many messages (max ${MAX_MESSAGES}).`, {
      status: 400,
    });
  }

  const last = messages[messages.length - 1];
  if (last.role !== "user") {
    return new Response("The last message must be from the user.", { status: 400 });
  }

  let system: string;
  try {
    system = await loadPersonaSystemPrompt();
  } catch {
    return new Response("Persona prompt is unavailable.", { status: 500 });
  }

  try {
    const result = streamText({
      model: google("gemini-2.5-flash"),
      system,
      messages: toModelMessages(messages),
    });

    return result.toTextStreamResponse();
  } catch (err) {
    console.error("[/api/chat]", err);
    return new Response(
      "Sorry — the model didn't respond. Try again in a moment.",
      { status: 502 },
    );
  }
}
