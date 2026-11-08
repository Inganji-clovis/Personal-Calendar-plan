import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message, contextType, userContext } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required." },
        { status: 400 }
      );
    }

    const geminiKey = process.env.GEMINI_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;

    // Honest reporting when AI provider is not yet configured on server
    if (!geminiKey && !openaiKey) {
      return NextResponse.json({
        configured: false,
        reply: "AI Provider API key not detected on the server. To enable live AI intelligence across INGANJI LIFE OS:\n\n1. Get a free Google Gemini API key at https://aistudio.google.com/ (or an OpenAI key).\n2. Add `GEMINI_API_KEY=your_key_here` to your `.env.local` file (and in Vercel Project Settings -> Environment Variables).\n3. Redeploy or restart your local server.\n\nOnce configured, I will directly evaluate your real-time Home, Iwacu Studio, and University sessions, plan your daily hours, and analyze your RWF finances.",
        setupGuide: {
          recommended: "Google Gemini 1.5 Flash (Free tier available)",
          keyEnvVar: "GEMINI_API_KEY",
          portalUrl: "https://aistudio.google.com/"
        }
      });
    }

    // Build context-aware prompt using actual user workspace data
    const activeSession = userContext?.activeSession || "Home Session";
    const currentActivity = userContext?.currentActivity || "Unscheduled";
    const totalIncome = userContext?.finance?.totalIncome || 0;
    const totalExpense = userContext?.finance?.totalExpense || 0;
    const netBalance = userContext?.finance?.netBalance || 0;
    const pendingTasks = userContext?.pendingTasks || [];
    const openProjects = userContext?.openProjects || [];
    const studyHours = userContext?.studyHours || 0;

    const systemPrompt = `You are the executive AI Assistant and Chief Operations Advisor inside INGANJI LIFE OS, a personal management system built for Inganji.
Inganji manages his life across 3 isolated, independent time sessions:
1. HOME SESSION: Personal IT learning, 6-month intensive technical roadmap, practical hands-on labs, software engineering, reading, and personal responsibilities.
2. IWACU STUDIO: Graphic design, printing & production, laser & UV machine operation, photography, video production, client deadlines, and practical technical skills.
3. UNIVERSITY OF KIGALI: Academic degree modules (IT), lecture timetable, assignments, exams, revision, and grades.

REAL USER CONTEXT:
- Active Session: ${activeSession}
- Current Scheduled Activity: ${currentActivity}
- Available Financial Balance: ${Number(netBalance).toLocaleString()} RWF (Total Recorded Income: ${Number(totalIncome).toLocaleString()} RWF, Total Expenses: ${Number(totalExpense).toLocaleString()} RWF)
- Total IT Study Hours Logged: ${studyHours} hrs
- Pending Tasks Count: ${pendingTasks.length}
- Active Projects Count: ${openProjects.length}

RULES OF ENGAGEMENT:
1. Never fabricate financial records, transactions, or fake numbers. Distinguish actual data from estimates.
2. When answering financial requests (e.g. "I want to save 500,000 RWF in 6 months"), analyze the actual cashflow, calculate exact monthly requirements (~83,333 RWF/month), explain assumptions, and ask for confirmation before saving any plan.
3. For daily execution, answer "What should I do now?" with clear, actionable advice based on his active session and current schedule.
4. For IT learning, provide deep technical accuracy across the 14 roadmap disciplines (Linux, SQL/PostgreSQL, Networking, Full-Stack, Cybersecurity, Cloud, DevOps, Hardware, AI).
5. Always address Inganji professionally, concisely, and practically. Currency is Rwandan Francs (RWF).`;

    // 1. Google Gemini Provider
    if (geminiKey) {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: `${systemPrompt}\n\nUser Request (${contextType || "general"} context):\n${message}` }]
            }
          ],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 1400
          }
        })
      });

      if (!response.ok) {
        const errText = await response.text();
        return NextResponse.json(
          { error: `Gemini API Error: ${response.statusText}`, details: errText },
          { status: response.status }
        );
      }

      const data = await response.json();
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response received from AI model.";
      return NextResponse.json({ configured: true, provider: "gemini", reply });
    }

    // 2. OpenAI Provider
    if (openaiKey) {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${openaiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: message }
          ],
          temperature: 0.3
        })
      });

      if (!response.ok) {
        const errText = await response.text();
        return NextResponse.json(
          { error: `OpenAI API Error: ${response.statusText}`, details: errText },
          { status: response.status }
        );
      }

      const data = await response.json();
      const reply = data.choices?.[0]?.message?.content || "No response received from AI model.";
      return NextResponse.json({ configured: true, provider: "openai", reply });
    }

    return NextResponse.json({ configured: false, reply: "No provider configured." });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to process AI request." },
      { status: 500 }
    );
  }
}
