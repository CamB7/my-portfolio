import { NextResponse } from "next/server";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { getSystemPrompt } from "@/resources/chat-system-prompt";

export const runtime = "nodejs";

const MAX_MESSAGE_LENGTH = 2000;

export async function POST(request: Request) {
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    return NextResponse.json(
      { error: "Chat is not configured." },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const message =
    typeof (body as { message?: unknown })?.message === "string"
      ? ((body as { message: string }).message).trim()
      : "";

  if (!message) {
    return NextResponse.json({ error: "Message is required." }, { status: 400 });
  }
  if (message.length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json(
      { error: `Message too long (max ${MAX_MESSAGE_LENGTH} chars).` },
      { status: 400 },
    );
  }

  try {
    const { text } = await generateText({
      model: google("gemini-2.5-flash"),
      system: getSystemPrompt(),
      prompt: message,
    });

    return NextResponse.json({ reply: text });
  } catch (err) {
    console.error("[/api/chat]", err);
    return NextResponse.json(
      { error: "Sorry — the model didn't respond. Try again in a moment." },
      { status: 502 },
    );
  }
}
