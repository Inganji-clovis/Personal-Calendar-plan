import React from "react";
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
  AlertCircle
} from "lucide-react";
import type { Task, Project, LearningRecord, Transaction, Habit, HabitLog } from "@/lib/supabase";
import { formatRWF } from "@/lib/dataService";
import type { NavSection } from "./Sidebar";

interface DashboardViewProps {
  tasks: Task[];
  projects: Project[];
  learning: LearningRecord[];
  transactions: Transaction[];
  habits: Habit[];
  habitLogs: HabitLog[];
  onNavigate: (section: NavSection) => void;
  onOpenModal: (type: string) => void;
  onToggleTaskStatus: (task: Task) => void;
  onToggleHabitToday: (habitId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  tasks,
  projects,
  learning,
  transactions,
  habits,
  habitLogs,
  onNavigate,
  onOpenModal,
  onToggleTaskStatus,
  onToggleHabitToday
}) => {
  const todayStr = new Date().toISOString().slice(0, 10);

  // Statistics calculation
  const completedTasks = tasks.filter(t => t.status === "completed").length;
  const pendingTasks = tasks.filter(t => t.status !== "completed" && t.status !== "cancelled").length;
  const overdueTasks = tasks.filter(
    t => t.status !== "completed" && t.status !== "cancelled" && t.due_date && t.due_date < todayStr
  ).length;

  const activeProjects = projects.filter(p => p.status === "active").length;
  const totalLearningHours = learning.reduce((sum, l) => sum + Number(l.hours || 0), 0);

  const totalIncome = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);
  const totalExpense = transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);
  const netBalance = totalIncome - totalExpense;

  // Priority tasks
  const openPriorityTasks = tasks
    .filter(t => t.status !== "completed" && t.status !== "cancelled")
    .slice(0, 5);

  // Focus Area statistics
  const iwacuTasks = tasks.filter(t => t.focus_area === "Iwacu Studio" || t.title.toLowerCase().includes("iwacu")).length;
  const vaxTasks = tasks.filter(t => t.focus_area === "VAX2040" || t.title.toLowerCase().includes("vax")).length;
  const uokTasks = tasks.filter(t => t.focus_area === "University of Kigali" || t.title.toLowerCase().includes("uok") || t.title.toLowerCase().includes("university")).length;

  return (
    <div>
      {/* Header Banner */}
      <div className="page-heading">
        <div>
          <p className="eyebrow">EXECUTIVE PERSONAL COMMAND CENTER</p>
          <h2>Good to see you, Inganji.</h2>
          <p className="muted">
            All your daily priorities, academic roadmaps, Iwacu Studio, VAX2040, and finances in one view.
          </p>
        </div>
        <div className="header-actions">
          <button className="secondary" onClick={() => onOpenModal("task")}>
            <Plus size={15} /> Task
          </button>
          <button className="secondary" onClick={() => onOpenModal("learning")}>
            <Clock3 size={15} /> Study Hours
          </button>
          <button className="secondary" onClick={() => onOpenModal("transaction")}>
            <CircleDollarSign size={15} /> Transaction
          </button>
          <button className="primary" onClick={() => onNavigate("Reports")}>
            <ArrowUpRight size={15} /> Reports & Export
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <CheckCircle2 size={20} />
          </div>
          <p>Tasks Completed</p>
          <h3>{completedTasks} / {tasks.length}</h3>
          <small style={{ color: overdueTasks > 0 ? "#fb7185" : "inherit" }}>
            {overdueTasks > 0 ? `⚠️ ${overdueTasks} overdue` : `${pendingTasks} open tasks`}
          </small>
        </div>

        <div className="stat-card">
          <div className="stat-icon blue">
            <FolderKanban size={20} />
          </div>
          <p>Active Projects</p>
          <h3>{activeProjects}</h3>
          <small>{projects.length} total across all ventures</small>
        </div>

        <div className="stat-card">
          <div className="stat-icon amber">
            <GraduationCap size={20} />
          </div>
          <p>Learning & IT Labs</p>
          <h3>{totalLearningHours.toFixed(1)} hrs</h3>
          <small>{learning.length} practical sessions recorded</small>
        </div>

        <div className="stat-card">
          <div className="stat-icon purple">
            <CircleDollarSign size={20} />
          </div>
          <p>Available Balance (RWF)</p>
          <h3 style={{ color: netBalance >= 0 ? "#34d399" : "#fb7185" }}>
            {formatRWF(netBalance)}
          </h3>
          <small>
            + {formatRWF(totalIncome)} in · - {formatRWF(totalExpense)} out
          </small>
        </div>
      </div>

      {/* Main Grid: Priority Tasks + Focus Areas */}
      <div className="dashboard-grid">
        {/* Left Column: Priority Tasks */}
        <section className="panel">
          <div className="panel-head">
            <div>
              <h3>Priority & Urgent Tasks</h3>
              <p className="muted">Pending deliverables scheduled for action</p>
            </div>
            <button className="text-btn" onClick={() => onNavigate("Tasks")}>
              View all ({tasks.length})
            </button>
          </div>

          {openPriorityTasks.length === 0 ? (
            <div className="empty">
              <CheckCircle2 size={28} />
              <p>No open tasks! You are completely caught up.</p>
              <button className="secondary" onClick={() => onOpenModal("task")} style={{ marginTop: 8 }}>
                <Plus size={14} /> Create Task
              </button>
            </div>
          ) : (
            openPriorityTasks.map(task => {
              const isOverdue = task.due_date && task.due_date < todayStr;
              return (
                <div className="task-row" key={task.id}>
                  <button
                    className={`check ${task.status === "completed" ? "checked" : ""}`}
                    onClick={() => onToggleTaskStatus(task)}
                    title="Toggle completion"
                  >
                    <CheckCircle2 size={19} />
                  </button>
                  <div className="row-main">
                    <b className={task.status === "completed" ? "done" : ""}>
                      {task.title}
                    </b>
                    <small>
                      {task.due_date ? (
                        <span style={{ color: isOverdue ? "#fb7185" : "inherit" }}>
                          {isOverdue ? `⚠️ Overdue (${task.due_date})` : `Due ${task.due_date}`}
                        </span>
                      ) : (
                        "No deadline set"
                      )}
                      {task.focus_area && ` · ${task.focus_area}`}
                    </small>
                  </div>
                  <span className={`badge priority-${task.priority}`}>
                    {task.priority}
                  </span>
                </div>
              );
            })
          )}
        </section>

        {/* Right Column: Strategic Focus Areas */}
        <section className="panel">
          <div className="panel-head">
            <div>
              <h3>Core Focus Workspaces</h3>
              <p className="muted">Your primary academic & professional tracks</p>
            </div>
            <button className="text-btn" onClick={() => onNavigate("Work & University")}>
              Explore
            </button>
          </div>

          <div
            className="focus-row"
            style={{ cursor: "pointer" }}
            onClick={() => onNavigate("Work & University")}
          >
            <div className="focus-icon">
              <BriefcaseBusiness size={20} />
            </div>
            <div style={{ flex: 1 }}>
              <b>Iwacu Studio</b>
              <small className="muted">Creative production, media, and client deliverables</small>
            </div>
            <span className="badge focus">{iwacuTasks} tasks</span>
          </div>

          <div
            className="focus-row"
            style={{ cursor: "pointer" }}
            onClick={() => onNavigate("Work & University")}
          >
            <div className="focus-icon blue">
              <Activity size={20} />
            </div>
            <div style={{ flex: 1 }}>
              <b>VAX2040</b>
              <small className="muted">Software architecture, development, and system engineering</small>
            </div>
            <span className="badge focus">{vaxTasks} tasks</span>
          </div>

          <div
            className="focus-row"
            style={{ cursor: "pointer" }}
            onClick={() => onNavigate("Work & University")}
          >
            <div className="focus-icon purple">
              <GraduationCap size={20} />
            </div>
            <div style={{ flex: 1 }}>
              <b>University of Kigali</b>
              <small className="muted">IT curriculum, academic modules, exams & practical labs</small>
            </div>
            <span className="badge focus">{uokTasks} tasks</span>
          </div>
        </section>
      </div>

      {/* Habits & Recent Projects */}
      <div className="dashboard-grid">
        {/* Daily Habits Quick Checklist */}
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
            habits.slice(0, 4).map(habit => {
              const isDoneToday = habitLogs.some(
                l => l.habit_id === habit.id && l.log_date === todayStr && l.completed
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
                    <small>{habit.category} · {habit.frequency}</small>
                  </div>
                  <span className={`badge ${isDoneToday ? "status-completed" : "status-pending"}`}>
                    {isDoneToday ? "Completed Today" : "Pending"}
                  </span>
                </div>
              );
            })
          )}
        </section>

        {/* Recent Projects */}
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
              {projects.slice(0, 3).map(proj => {
                const progress = proj.progress || (proj.status === "completed" ? 100 : proj.status === "active" ? 50 : 15);
                return (
                  <div
                    key={proj.id}
                    style={{
                      padding: "12px 14px",
                      background: "var(--panel-alt)",
                      border: "1px solid var(--line)",
                      borderRadius: 10
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
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, fontSize: 10, color: "var(--muted)" }}>
                      <span>{proj.focus_area || "General"}</span>
                      <span>{progress}% progress</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

