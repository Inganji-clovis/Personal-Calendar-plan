import { NextResponse } from "next/server";
import { verifyRequestAuth } from "@/lib/serverAuth";
import { rateLimit, clientKey } from "@/lib/rateLimit";

const MAX_PROMPT_CHARS = 4000;

interface AiContext {
  activeSession?: string;
  currentTime?: string;
  todayDate?: string;
  scheduleSummary?: string[];
  pendingTasksCount?: number;
  topTasks?: string[];
  activeProjectsCount?: number;
  currentBalanceRwf?: number;
}

function buildSystemPrompt(ctx: AiContext): string {
  const activeSession = ctx.activeSession || "Home Session";
  const schedule = Array.isArray(ctx.scheduleSummary) ? ctx.scheduleSummary.slice(0, 8) : [];
  const topTasks = Array.isArray(ctx.topTasks) ? ctx.topTasks.slice(0, 6) : [];
  const balance = Number(ctx.currentBalanceRwf || 0).toLocaleString();

  return `You are the executive AI Assistant and Chief Operations Advisor inside INGANJI LIFE OS, built for Inganji.
Inganji runs his life across 3 isolated sessions:
1. HOME SESSION: personal IT learning (6-month technical roadmap), hands-on labs, software engineering, reading.
2. IWACU STUDIO: graphic design, print & production, laser/UV machine operation, photography, video, client deadlines.
3. UNIVERSITY OF KIGALI: IT degree modules, timetable, assignments, exams, revision, grades.

REAL USER CONTEXT (use this, never invent data):
- Active session: ${activeSession}
- Today: ${ctx.todayDate || "unknown"} (current time ${ctx.currentTime || "unknown"})
- Available balance: ${balance} RWF
- Pending tasks: ${ctx.pendingTasksCount ?? topTasks.length}
- Active projects: ${ctx.activeProjectsCount ?? 0}
- Today's scheduled blocks: ${schedule.length ? schedule.join(" | ") : "none scheduled yet"}
- Priority tasks: ${topTasks.length ? topTasks.join(" | ") : "none"}

RULES OF ENGAGEMENT:
1. Never fabricate financial records, transactions, or numbers. Separate real data from estimates and state assumptions.
2. For money-related requests, compute concrete figures from the real balance/tasks provided, show the math, and ask for confirmation before proposing a saved plan. Currency is Rwandan Francs (RWF).
3. For "What should I do now?", answer with a short, prioritized, actionable plan tied to the active session and today's schedule.
4. For IT learning, be technically deep and correct (Linux, SQL/PostgreSQL, networking, full-stack, cybersecurity, cloud, DevOps, hardware, AI).
5. Address Inganji professionally, concisely and practically. Prefer short sections and bullet lists over long paragraphs.`;
}

export async function POST(request: Request) {
  try {
    // 1. Authentication — block anonymous callers when auth is configured.
    const auth = await verifyRequestAuth(request);
    if (auth.configured && !auth.userId) {
      return NextResponse.json({ error: "Unauthorized. Please sign in." }, { status: 401 });
    }

    // 2. Rate limiting — protect paid AI credits from abuse.
    const limit = auth.userId ? 30 : 10;
    const rl = rateLimit(clientKey(request, auth.userId), limit, 60_000);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please wait a moment and try again." },
        { status: 429, headers: { "Retry-After": String(Math.ceil((rl.reset - Date.now()) / 1000)) } }
      );
    }

    // 3. Input validation.
    const body = await request.json().catch(() => ({}));
    const rawPrompt = body?.prompt ?? body?.message;
    if (!rawPrompt || typeof rawPrompt !== "string" || !rawPrompt.trim()) {
      return NextResponse.json({ error: "A non-empty 'prompt' is required." }, { status: 400 });
    }
    const prompt = rawPrompt.trim().slice(0, MAX_PROMPT_CHARS);
    const context: AiContext = body?.context ?? body?.userContext ?? {};

    const geminiKey = process.env.GEMINI_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;

    // Honest reporting when AI provider is not yet configured on server.
    if (!geminiKey && !openaiKey) {
      return NextResponse.json({
        configured: false,
        reply:
          "AI provider API key not detected on the server. To enable live AI intelligence across INGANJI LIFE OS:\n\n1. Get a free Google Gemini API key at https://aistudio.google.com/ (or an OpenAI key).\n2. Add `GEMINI_API_KEY=your_key_here` to your `.env.local` (and in Vercel → Environment Variables).\n3. Restart the server.\n\nOnce configured, I will evaluate your real Home, Iwacu Studio, and University sessions and analyze your RWF finances.",
        setupGuide: {
          recommended: "Google Gemini Flash (free tier available)",
          keyEnvVar: "GEMINI_API_KEY",
          portalUrl: "https://aistudio.google.com/",
        },
      });
    }

    const systemPrompt = buildSystemPrompt(context);

    // 4. Provider call — never leak raw provider errors/responses to the client.
    if (geminiKey) {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`;
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: `${systemPrompt}\n\nUser request:\n${prompt}` }] }],
          generationConfig: { temperature: 0.3, maxOutputTokens: 1400 },
        }),
      });

      if (!response.ok) {
        console.error("[ai/chat] Gemini error", response.status, await response.text().catch(() => ""));
        return NextResponse.json({ error: "The AI provider is temporarily unavailable. Please try again." }, { status: 502 });
      }

      const data = await response.json();
      const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      return NextResponse.json({
        configured: true,
        provider: "gemini",
        reply: reply || "No response received from the AI model.",
      });
    }

    // openaiKey is guaranteed here.
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${openaiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt },
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      console.error("[ai/chat] OpenAI error", response.status, await response.text().catch(() => ""));
      return NextResponse.json({ error: "The AI provider is temporarily unavailable. Please try again." }, { status: 502 });
    }

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content;
    return NextResponse.json({
      configured: true,
      provider: "openai",
      reply: reply || "No response received from the AI model.",
    });
  } catch (err) {
    console.error("[ai/chat] Unexpected error", err);
    return NextResponse.json({ error: "Failed to process AI request." }, { status: 500 });
  }
}
