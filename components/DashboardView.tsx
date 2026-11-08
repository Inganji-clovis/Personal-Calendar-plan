"use client";

import React, { useMemo } from "react";
import {
  CheckCircle2,
  FolderKanban,
  GraduationCap,
  CircleDollarSign,
  BriefcaseBusiness,
  Activity,
  Plus,
  ArrowUpRight,
  TrendingUp,
  Clock3,
  Calendar,
  AlertCircle,
  CalendarClock,
  Terminal,
  Bot,
  Home,
  Building2,
  School,
} from "lucide-react";
import type { Task, Project, LearningRecord, Transaction, Habit, HabitLog, DailyScheduleItem, SessionType } from "@/lib/supabase";
import { formatRWF } from "@/lib/dataService";
import type { NavSection } from "./Sidebar";

interface DashboardViewProps {
  tasks: Task[];
  projects: Project[];
  learning: LearningRecord[];
  transactions: Transaction[];
  habits: Habit[];
  habitLogs: HabitLog[];
  schedule?: DailyScheduleItem[];
  activeSession?: SessionType;
  onNavigate: (section: NavSection) => void;
  onOpenModal: (type: string) => void;
  onToggleTaskStatus: (task: Task) => void;
  onToggleHabitToday: (habitId: string) => void;
  onSelectSession?: (session: SessionType) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  tasks,
  projects,
  learning,
  transactions,
  habits,
  habitLogs,
  schedule = [],
  activeSession = "home",
  onNavigate,
  onOpenModal,
  onToggleTaskStatus,
  onToggleHabitToday,
  onSelectSession,
}) => {
  const todayStr = new Date().toISOString().slice(0, 10);
  const now = new Date();
  const currentTimeMinutes = now.getHours() * 60 + now.getMinutes();

  // Find Current & Next Schedule Block
  const { currentBlock, nextBlock } = useMemo(() => {
    let cur: DailyScheduleItem | null = null;
    let nxt: DailyScheduleItem | null = null;

    for (const item of schedule) {
      const [sh, sm] = item.start_time.split(":").map(Number);
      const [eh, em] = item.end_time.split(":").map(Number);
      const startMin = sh * 60 + sm;
      const endMin = eh * 60 + em;

      if (currentTimeMinutes >= startMin && currentTimeMinutes < endMin) {
        cur = item;
      } else if (currentTimeMinutes < startMin && !nxt) {
        nxt = item;
      }
    }
    return { currentBlock: cur, nextBlock: nxt };
  }, [schedule, currentTimeMinutes]);

  // Statistics calculation
  const completedTasks = tasks.filter((t) => t.status === "completed").length;
  const pendingTasks = tasks.filter((t) => t.status !== "completed" && t.status !== "cancelled").length;
  const overdueTasks = tasks.filter(
    (t) => t.status !== "completed" && t.status !== "cancelled" && t.due_date && t.due_date < todayStr
  ).length;

  const activeProjects = projects.filter((p) => p.status === "active").length;
  const totalLearningHours = learning.reduce((sum, l) => sum + Number(l.hours || 0), 0);

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);
  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);
  const netBalance = totalIncome - totalExpense;

  // Open priority tasks
  const openPriorityTasks = tasks
    .filter((t) => t.status !== "completed" && t.status !== "cancelled")
    .slice(0, 5);

  // Focus Area statistics
  const iwacuTasks = tasks.filter(
    (t) => t.focus_area === "Iwacu Studio" || t.title.toLowerCase().includes("iwacu")
  ).length;
  const homeTasks = tasks.filter(
    (t) => t.focus_area === "Home Session" || t.session_type === "home"
  ).length;
  const uokTasks = tasks.filter(
    (t) =>
      t.focus_area === "University of Kigali" ||
      t.title.toLowerCase().includes("uok") ||
      t.title.toLowerCase().includes("university")
  ).length;

  return (
    <div>
      {/* Header Banner */}
      <div className="page-heading">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="eyebrow">EXECUTIVE PERSONAL COMMAND CENTER</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold capitalize">
              Active: {activeSession === "home" ? "Home Session" : activeSession === "studio" ? "Iwacu Studio" : "University of Kigali"}
            </span>
          </div>
          <h2>Good to see you, Inganji.</h2>
          <p className="muted">
            All your daily commitments, IT learning roadmap, Iwacu Studio production, and University of Kigali studies in one unified OS.
          </p>
        </div>
        <div className="header-actions">
          <button className="secondary" onClick={() => onNavigate("Smart Planner")}>
            <CalendarClock size={15} /> Daily Planner
          </button>
          <button className="secondary" onClick={() => onOpenModal("task")}>
            <Plus size={15} /> Task
          </button>
          <button className="secondary" onClick={() => onOpenModal("transaction")}>
            <CircleDollarSign size={15} /> Transaction
          </button>
          <button className="primary" onClick={() => onNavigate("Reports")}>
            <ArrowUpRight size={15} /> Reports & Export
          </button>
        </div>
      </div>

      {/* Real-time What should I do right now? Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-emerald-500/30 rounded-2xl p-5 mb-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-32 bg-emerald-500/5 blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <CalendarClock size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  Real-time Schedule Context
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <h3 className="text-lg font-bold text-white mt-0.5">
                {currentBlock ? (
                  <>
                    Now: <span className="text-emerald-400">{currentBlock.title}</span> ({currentBlock.start_time} - {currentBlock.end_time})
                  </>
                ) : (
                  <>No active time block right now ({now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })})</>
                )}
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                {currentBlock?.why_it_matters ||
                  (nextBlock
                    ? `Next up: ${nextBlock.title} at ${nextBlock.start_time}. Keep focused and prepared.`
                    : "No more commitments scheduled for today. Great time for personal IT labs or evening revision.")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onNavigate("Smart Planner")}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <span>View Full Day Timeline</span>
              <ArrowUpRight size={14} />
            </button>
            <button
              onClick={() => onNavigate("AI Assistant")}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-colors flex items-center gap-1.5 shadow-md shadow-emerald-950/40"
            >
              <Bot size={14} />
              <span>Ask AI Guidance</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="stats-row">
        <div className="stat-card" onClick={() => onNavigate("Tasks")}>
          <div className="stat-icon green">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <span className="stat-label">Tasks Pending</span>
            <div className="stat-value">{pendingTasks}</div>
            <span className="stat-sub">{completedTasks} completed · {overdueTasks} overdue</span>
          </div>
        </div>

        <div className="stat-card" onClick={() => onNavigate("Projects")}>
          <div className="stat-icon blue">
            <FolderKanban size={20} />
          </div>
          <div>
            <span className="stat-label">Active Projects</span>
            <div className="stat-value">{activeProjects}</div>
            <span className="stat-sub">{projects.length} total initiatives</span>
          </div>
        </div>

        <div className="stat-card" onClick={() => onNavigate("IT Learning Hub")}>
          <div className="stat-icon purple">
            <GraduationCap size={20} />
          </div>
          <div>
            <span className="stat-label">IT Study Hours</span>
            <div className="stat-value">{totalLearningHours.toFixed(1)}h</div>
            <span className="stat-sub">14 intensive engineering paths</span>
          </div>
        </div>

        <div className="stat-card" onClick={() => onNavigate("Finance")}>
          <div className="stat-icon amber">
            <CircleDollarSign size={20} />
          </div>
          <div>
            <span className="stat-label">Net Financial Balance</span>
            <div className="stat-value">{formatRWF(netBalance)}</div>
            <span className="stat-sub">{transactions.length} recorded transactions</span>
          </div>
        </div>
      </div>

      {/* 3 Isolated Session Environments */}
      <div className="section-block">
        <div className="section-head">
          <div>
            <h3>Three Dedicated Life Sessions</h3>
            <p className="muted">Strictly separated workflows for Home IT, Iwacu Studio, and University of Kigali</p>
          </div>
        </div>

        <div className="focus-grid">
          {/* Home Session */}
          <div
            className={`focus-card ${activeSession === "home" ? "active-border ring-1 ring-emerald-500" : ""}`}
            onClick={() => {
              if (onSelectSession) onSelectSession("home");
              onNavigate("IT Learning Hub");
            }}
          >
            <div className="focus-icon green">
              <Home size={20} />
            </div>
            <div style={{ flex: 1 }}>
              <div className="flex items-center gap-2">
                <b>Home Session</b>
                {activeSession === "home" && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400">CURRENT</span>
                )}
              </div>
              <small className="muted">IT Roadmap, hands-on Linux/Cloud labs, personal software development</small>
            </div>
            <span className="badge focus">{homeTasks} tasks</span>
          </div>

          {/* Iwacu Studio */}
          <div
            className={`focus-card ${activeSession === "studio" ? "active-border ring-1 ring-blue-500" : ""}`}
            onClick={() => {
              if (onSelectSession) onSelectSession("studio");
              onNavigate("Work & University");
            }}
          >
            <div className="focus-icon blue">
              <Building2 size={20} />
            </div>
            <div style={{ flex: 1 }}>
              <div className="flex items-center gap-2">
                <b>Iwacu Studio</b>
                {activeSession === "studio" && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-400">CURRENT</span>
                )}
              </div>
              <small className="muted">Design, UV & laser machines, print production, photo/video media</small>
            </div>
            <span className="badge focus">{iwacuTasks} tasks</span>
          </div>

          {/* University of Kigali */}
          <div
            className={`focus-card ${activeSession === "university" ? "active-border ring-1 ring-purple-500" : ""}`}
            onClick={() => {
              if (onSelectSession) onSelectSession("university");
              onNavigate("Work & University");
            }}
          >
            <div className="focus-icon purple">
              <School size={20} />
            </div>
            <div style={{ flex: 1 }}>
              <div className="flex items-center gap-2">
                <b>University of Kigali</b>
                {activeSession === "university" && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-400">CURRENT</span>
                )}
              </div>
              <small className="muted">IT curriculum, academic modules, assignments, revision & exams</small>
            </div>
            <span className="badge focus">{uokTasks} tasks</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Priority Tasks & Quick Actions */}
      <div className="dashboard-grid">
        {/* Priority Tasks List */}
        <section className="panel">
          <div className="panel-head">
            <div>
              <h3>Priority Action Items</h3>
              <p className="muted">Top tasks requiring your attention</p>
            </div>
            <button className="text-btn" onClick={() => onNavigate("Tasks")}>
              View all ({pendingTasks})
            </button>
          </div>

          {openPriorityTasks.length === 0 ? (
            <div className="empty">
              <CheckCircle2 size={24} />
              <p>All priority tasks are completed. Excellent work!</p>
              <button className="secondary" onClick={() => onOpenModal("task")} style={{ marginTop: 8 }}>
                <Plus size={14} /> Create New Task
              </button>
            </div>
          ) : (
            openPriorityTasks.map((task) => (
              <div className="task-row" key={task.id}>
                <button
                  className={`check ${task.status === "completed" ? "checked" : ""}`}
                  onClick={() => onToggleTaskStatus(task)}
                >
                  <CheckCircle2 size={18} />
                </button>
                <div className="row-main">
                  <b className={task.status === "completed" ? "done" : ""}>{task.title}</b>
                  <small>
                    {task.focus_area || "General"} · Due: {task.due_date || "No deadline"}
                  </small>
                </div>
                <span className={`badge priority-${task.priority || "normal"}`}>{task.priority || "normal"}</span>
              </div>
            ))
          )}
        </section>

        {/* Habits Checklist */}
        <section className="panel">
          <div className="panel-head">
            <div>
              <h3>Daily Habits Checklist</h3>
              <p className="muted">Keep your consistency streak alive today</p>
            </div>
            <button className="text-btn" onClick={() => onNavigate("Goals & Habits")}>
              Manage habits
            </button>
          </div>

          {habits.length === 0 ? (
            <div className="empty">
              <Clock3 size={24} />
              <p>No habits configured yet.</p>
              <button className="secondary" onClick={() => onOpenModal("habit")} style={{ marginTop: 8 }}>
                <Plus size={14} /> Add Daily Habit
              </button>
            </div>
          ) : (
            habits.slice(0, 4).map((habit) => {
              const isDoneToday = habitLogs.some(
                (l) => l.habit_id === habit.id && l.log_date === todayStr && l.completed
              );
              return (
                <div className="task-row" key={habit.id}>
                  <button
                    className={`check ${isDoneToday ? "checked" : ""}`}
                    onClick={() => onToggleHabitToday(habit.id)}
                  >
                    <CheckCircle2 size={18} />
                  </button>
                  <div className="row-main">
                    <b className={isDoneToday ? "done" : ""}>{habit.title}</b>
                    <small>
                      {habit.category} · {habit.frequency}
                    </small>
                  </div>
                  <span className={`badge ${isDoneToday ? "status-completed" : "status-pending"}`}>
                    {isDoneToday ? "Completed" : "Pending"}
                  </span>
                </div>
              );
            })
          )}
        </section>
      </div>

      {/* Projects Portfolio */}
      <div className="dashboard-grid" style={{ marginTop: 24 }}>
        <section className="panel">
          <div className="panel-head">
            <div>
              <h3>Projects Portfolio</h3>
              <p className="muted">Recent progress on strategic initiatives</p>
            </div>
            <button className="text-btn" onClick={() => onNavigate("Projects")}>
              All projects
            </button>
          </div>

          {projects.length === 0 ? (
            <div className="empty">
              <FolderKanban size={24} />
              <p>No active projects yet.</p>
              <button className="secondary" onClick={() => onOpenModal("project")} style={{ marginTop: 8 }}>
                <Plus size={14} /> Create Project
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {projects.slice(0, 3).map((proj) => {
                const progress =
                  proj.progress ||
                  (proj.status === "completed" ? 100 : proj.status === "active" ? 50 : 15);
                return (
                  <div
                    key={proj.id}
                    style={{
                      padding: "12px 14px",
                      background: "var(--panel-alt)",
                      border: "1px solid var(--line)",
                      borderRadius: 10,
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <b style={{ fontSize: 13 }}>{proj.name}</b>
                      <span className={`badge status-${proj.status}`}>{proj.status}</span>
                    </div>
                    <p className="muted" style={{ fontSize: 11, margin: "4px 0 8px", lineHeight: 1.4 }}>
                      {proj.description || "No description provided."}
                    </p>
                    <div className="progress-bar-bg" style={{ margin: 0, height: 5 }}>
                      <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginTop: 4,
                        fontSize: 10,
                        color: "var(--muted)",
                      }}
                    >
                      <span>{proj.focus_area || "General"}</span>
                      <span>{progress}% progress</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Quick Hub Hub Shortcuts */}
        <section className="panel">
          <div className="panel-head">
            <div>
              <h3>Quick Hub Shortcuts</h3>
              <p className="muted">Direct access to new operating modules</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onNavigate("Smart Planner")}
              className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-left transition-colors flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-xl">🕒</span>
                <ArrowUpRight size={14} className="text-slate-500" />
              </div>
              <div className="mt-2">
                <b className="text-xs text-white block">Smart Planner</b>
                <span className="text-[10px] text-slate-400">Hour-by-hour time blocking</span>
              </div>
            </button>

            <button
              onClick={() => onNavigate("Practical Labs")}
              className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-left transition-colors flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-xl">🧪</span>
                <ArrowUpRight size={14} className="text-slate-500" />
              </div>
              <div className="mt-2">
                <b className="text-xs text-white block">Practical Labs</b>
                <span className="text-[10px] text-slate-400">Technical lab notebooks</span>
              </div>
            </button>

            <button
              onClick={() => onNavigate("Resource Library")}
              className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-left transition-colors flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-xl">📚</span>
                <ArrowUpRight size={14} className="text-slate-500" />
              </div>
              <div className="mt-2">
                <b className="text-xs text-white block">Resource Library</b>
                <span className="text-[10px] text-slate-400">Manuals, cheat sheets, docs</span>
              </div>
            </button>

            <button
              onClick={() => onNavigate("AI Assistant")}
              className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-left transition-colors flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-xl">🤖</span>
                <ArrowUpRight size={14} className="text-slate-500" />
              </div>
              <div className="mt-2">
                <b className="text-xs text-white block">AI Assistant</b>
                <span className="text-[10px] text-slate-400">Context-aware advice</span>
              </div>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
