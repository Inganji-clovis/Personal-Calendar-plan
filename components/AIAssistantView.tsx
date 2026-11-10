"use client";

import React, { useState, useRef, useEffect } from "react";
import { SessionType, Task, Project, DailyScheduleItem, Transaction } from "@/lib/supabase";
import { authHeaders } from "@/lib/apiClient";

interface AIAssistantViewProps {
  activeSession: SessionType;
  tasks: Task[];
  projects: Project[];
  schedule: DailyScheduleItem[];
  transactions: Transaction[];
}

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
}

export const AIAssistantView: React.FC<AIAssistantViewProps> = ({
  activeSession,
  tasks,
  projects,
  schedule,
  transactions,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `Hello Inganji. I am your integrated personal AI advisor for **INGANJI LIFE OS**.\n\nI have real-time visibility into your current **${
        activeSession === "home"
          ? "Home Session (IT / Dev)"
          : activeSession === "studio"
          ? "Iwacu Studio (Production / Print)"
          : "University of Kigali"
      }**, your scheduled time blocks, tasks, labs, and finances (in RWF).\n\nHow can I assist you with your schedule, academic revision, lab setup, or financial goals today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedContextSession, setSelectedContextSession] = useState<SessionType | "all">(activeSession);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = (customPrompt || inputValue).trim();
    if (!textToSend || isLoading) return;

    const userMsg: Message = {
      role: "user",
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customPrompt) setInputValue("");
    setIsLoading(true);
    setErrorBanner(null);

    // Build context payload to send to /api/ai/chat
    const activeTasks = tasks.filter((t) => t.status !== "completed");
    const todayBlocks = schedule.map((s) => `${s.start_time}-${s.end_time}: ${s.title} (${s.session_type}, ${s.status})`);
    const balanceRwf = transactions.reduce((acc, t) => acc + (t.type === "income" ? t.amount : -t.amount), 0);

    const contextPayload = {
      activeSession: selectedContextSession,
      currentTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      todayDate: new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }),
      scheduleSummary: todayBlocks.slice(0, 8),
      pendingTasksCount: activeTasks.length,
      topTasks: activeTasks.slice(0, 5).map((t) => `${t.title} [${t.priority || "normal"}, ${t.focus_area || "general"}]`),
      activeProjectsCount: projects.filter((p) => p.status !== "completed").length,
      currentBalanceRwf: balanceRwf,
    };

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(await authHeaders()) },
        body: JSON.stringify({
          prompt: textToSend,
          context: contextPayload,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to reach AI service.");
      }

      const assistantMsg: Message = {
        role: "assistant",
        content: data.reply || "No response received.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error("AI error:", err);
      const errMsg = err.message || "An unexpected error occurred.";
      setErrorBanner(errMsg);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `⚠️ **AI Service Notice**:\n${errMsg}\n\n*To enable Gemini 1.5/2.0 answers, add \`GEMINI_API_KEY\` to your Vercel Environment Variables or \`.env.local\` file.*`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const PROMPT_CHIPS = [
    { label: "🕒 What should I do right now?", prompt: "Based on my current schedule and today's commitments, what should I be focusing on right now and what comes next?" },
    { label: "💰 6-Month 500,000 RWF Savings Plan", prompt: "Create a practical, step-by-step financial plan to save 500,000 RWF in 6 months from my Iwacu Studio and freelance income, with monthly budget targets." },
    { label: "🐧 Generate Linux Networking Lab", prompt: "Generate a practical hands-on Linux networking lab with objective, CLI commands, iptables configuration, and error troubleshooting steps." },
    { label: "🎓 University Revision Strategy", prompt: "Design an evening revision strategy for my University of Kigali IT courses that fits into my 22:20 to 00:00 night study block." },
    { label: "🖨️ Iwacu Studio Workflow Optimization", prompt: "How can I streamline print job queuing, laser cutting prep, and client proofs to prevent deadline conflicts at Iwacu Studio?" },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] min-h-[600px] bg-slate-900/50 border border-slate-800/80 rounded-2xl overflow-hidden backdrop-blur">
      {/* AI Header */}
      <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-900/80 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-lg shadow-md shadow-emerald-900/30">
            🤖
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white">Inganji Life OS AI Assistant</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Gemini 2.0 / Context-Aware
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Personalized assistant for schedule decisions, IT labs, academic studies, and RWF finances.
            </p>
          </div>
        </div>

        {/* Session context selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Context:</span>
          <select
            value={selectedContextSession}
            onChange={(e) => setSelectedContextSession(e.target.value as any)}
            className="bg-slate-950 border border-slate-700 text-white rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Environments</option>
            <option value="home">Home Session (IT / Dev)</option>
            <option value="studio">Iwacu Studio</option>
            <option value="university">University of Kigali</option>
          </select>
          <button
            onClick={() =>
              setMessages([
                {
                  role: "assistant",
                  content: "Chat cleared. What can I help you organize today?",
                  timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                },
              ])
            }
            className="p-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs transition-colors"
            title="Clear Chat"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Warning Banner if any */}
      {errorBanner ? (
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2.5 text-xs text-amber-300 flex items-center justify-between">
          <span>{errorBanner}</span>
          <button onClick={() => setErrorBanner(null)} className="text-amber-400 font-bold ml-2">
            ✕
          </button>
        </div>
      ) : null}

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((msg, index) => {
          const isUser = msg.role === "user";
          return (
            <div
              key={index}
              className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"} max-w-4xl ${
                isUser ? "ml-auto" : "mr-auto"
              }`}
            >
              {!isUser ? (
                <div className="w-8 h-8 rounded-lg bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-sm shrink-0 mt-1">
                  🤖
                </div>
              ) : null}

              <div
                className={`rounded-2xl p-4 text-sm leading-relaxed ${
                  isUser
                    ? "bg-emerald-600 text-white rounded-tr-none shadow-md shadow-emerald-950/40"
                    : "bg-slate-800/70 text-slate-200 border border-slate-700/60 rounded-tl-none shadow-md shadow-black/20"
                }`}
              >
                <div className="whitespace-pre-wrap font-sans">{msg.content}</div>
                <div
                  className={`text-[10px] mt-2 flex items-center gap-2 ${
                    isUser ? "text-emerald-200/80 justify-end" : "text-slate-400 justify-start"
                  }`}
                >
                  <span>{msg.timestamp}</span>
                  {!isUser ? (
                    <button
                      onClick={() => navigator.clipboard.writeText(msg.content)}
                      className="hover:text-white transition-colors text-[10px]"
                      title="Copy response"
                    >
                      Copy
                    </button>
                  ) : null}
                </div>
              </div>

              {isUser ? (
                <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center text-xs font-bold text-white shrink-0 mt-1">
                  IC
                </div>
              ) : null}
            </div>
          );
        })}

        {isLoading ? (
          <div className="flex gap-3 justify-start max-w-4xl mr-auto">
            <div className="w-8 h-8 rounded-lg bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-sm shrink-0">
              🤖
            </div>
            <div className="bg-slate-800/70 border border-slate-700/60 rounded-2xl rounded-tl-none p-4 text-sm text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse delay-100" />
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse delay-200" />
              <span className="text-xs text-slate-400 ml-2">Analyzing your schedule and generating response...</span>
            </div>
          </div>
        ) : null}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompt Chips */}
      <div className="px-4 py-2 border-t border-slate-800/60 bg-slate-900/40 overflow-x-auto scrollbar-thin">
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-500 whitespace-nowrap font-medium">Quick Prompts:</span>
          {PROMPT_CHIPS.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(chip.prompt)}
              disabled={isLoading}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 whitespace-nowrap transition-colors disabled:opacity-50"
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input bar */}
      <div className="p-4 bg-slate-900/80 border-t border-slate-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask about your schedule, IT labs, Iwacu Studio tasks, University, or RWF budget..."
            disabled={isLoading}
            className="flex-1 bg-slate-950/80 border border-slate-800 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 text-white font-medium text-sm transition-all shadow-md shadow-emerald-950/30 flex items-center gap-2 disabled:opacity-50"
          >
            <span>Send</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </form>
        <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 px-1">
          <span>Real server-side AI integration. Securely communicates with `/api/ai/chat`.</span>
          <span>Never sends sensitive database passwords or service-role keys.</span>
        </div>
      </div>
    </div>
  );
};

