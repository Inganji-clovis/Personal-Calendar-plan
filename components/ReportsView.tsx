import React, { useState } from "react";
import {
  FileSpreadsheet,
  Printer,
  Download,
  Calendar,
  CheckCircle2,
  TrendingUp,
  Clock,
  Wallet,
  Sparkles,
  Award
} from "lucide-react";
import type { Task, Project, LearningRecord, Transaction, Habit, HabitLog } from "@/lib/supabase";
import { formatRWF } from "@/lib/dataService";
import { downloadCSV, printPDFReport } from "@/lib/export";

interface ReportsViewProps {
  tasks: Task[];
  projects: Project[];
  learning: LearningRecord[];
  transactions: Transaction[];
  habits: Habit[];
  habitLogs: HabitLog[];
  userEmail: string;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  tasks,
  projects,
  learning,
  transactions,
  habits,
  habitLogs,
  userEmail
}) => {
  const [reportPeriod, setReportPeriod] = useState<"weekly" | "monthly">("weekly");

  const todayStr = new Date().toISOString().slice(0, 10);
  const now = new Date();

  // Filter window: weekly (last 7 days) or monthly (last 30 days)
  const daysAgo = reportPeriod === "weekly" ? 7 : 30;
  const cutoffDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

  // Period-specific metrics
  const periodLearning = learning.filter(l => (l.completed_at || l.created_at || "") >= cutoffDate);
  const periodHours = periodLearning.reduce((sum, l) => sum + Number(l.hours || 0), 0);

  const completedTasks = tasks.filter(t => t.status === "completed").length;
  const openTasks = tasks.filter(t => t.status !== "completed" && t.status !== "cancelled").length;

  const periodTransactions = transactions.filter(t => t.transaction_date >= cutoffDate);
  const periodIncome = periodTransactions.filter(t => t.type === "income").reduce((s, t) => s + Number(t.amount || 0), 0);
  const periodExpense = periodTransactions.filter(t => t.type === "expense").reduce((s, t) => s + Number(t.amount || 0), 0);
  const periodNet = periodIncome - periodExpense;

  // Habit adherence %
  const totalHabitOpportunities = habits.length * daysAgo;
  const periodHabitLogs = habitLogs.filter(l => l.log_date >= cutoffDate && l.completed).length;
  const habitAdherence = totalHabitOpportunities > 0
    ? Math.min(100, Math.round((periodHabitLogs / totalHabitOpportunities) * 100))
    : 100;

  // Export handlers
  const handleExportTasksCSV = () => {
    const headers = ["ID", "Title", "Description", "Status", "Priority", "Due Date", "Focus Area", "Created At"];
    const rows = tasks.map(t => [
      t.id,
      t.title,
      t.description || "",
      t.status,
      t.priority,
      t.due_date || "",
      t.focus_area || "General",
      t.created_at || ""
    ]);
    downloadCSV(`inganji_tasks_${todayStr}.csv`, headers, rows);
  };

  const handleExportTransactionsCSV = () => {
    const headers = ["ID", "Date", "Type", "Amount (RWF)", "Category", "Description", "Created At"];
    const rows = transactions.map(t => [
      t.id,
      t.transaction_date,
      t.type,
      t.amount,
      t.category,
      t.description || "",
      t.created_at || ""
    ]);
    downloadCSV(`inganji_transactions_${todayStr}.csv`, headers, rows);
  };

  const handleExportLearningCSV = () => {
    const headers = ["ID", "Subject", "Activity", "Hours", "Completed Date", "Evidence URL", "Notes"];
    const rows = learning.map(l => [
      l.id,
      l.subject,
      l.activity || "",
      l.hours,
      l.completed_at || "",
      l.evidence_url || "",
      l.notes || ""
    ]);
    downloadCSV(`inganji_learning_${todayStr}.csv`, headers, rows);
  };

  const handleExportProjectsCSV = () => {
    const headers = ["ID", "Project Name", "Status", "Focus Area", "Progress %", "Start Date", "End Date", "Description"];
    const rows = projects.map(p => [
      p.id,
      p.name,
      p.status,
      p.focus_area || "General",
      p.progress || (p.status === "completed" ? 100 : 0),
      p.start_date || "",
      p.end_date || "",
      p.description || ""
    ]);
    downloadCSV(`inganji_projects_${todayStr}.csv`, headers, rows);
  };

  return (
    <div>
      <div className="page-heading">
        <div>
          <p className="eyebrow">ANALYTICS & EXECUTIVE PERFORMANCE</p>
          <h2>Weekly & Monthly Reports</h2>
          <p className="muted">
            Holistic reviews of your technical productivity, academic pacing, projects, and cashflow in RWF.
          </p>
        </div>
        <div className="header-actions">
          <button className="secondary" onClick={printPDFReport} title="Print or Save as clean PDF">
            <Printer size={15} /> Print / Export PDF
          </button>
        </div>
      </div>

      {/* Period Selector & CSV Export Bar */}
      <div
        className="panel"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-dim)" }}>Report Horizon:</span>
          <div style={{ display: "flex", background: "#080c10", padding: 3, borderRadius: 8, border: "1px solid var(--line)" }}>
            <button
              className={`tab-btn ${reportPeriod === "weekly" ? "active" : ""}`}
              onClick={() => setReportPeriod("weekly")}
              style={{ padding: "6px 14px", border: 0, borderRadius: 6 }}
            >
              Weekly (7 Days)
            </button>
            <button
              className={`tab-btn ${reportPeriod === "monthly" ? "active" : ""}`}
              onClick={() => setReportPeriod("monthly")}
              style={{ padding: "6px 14px", border: 0, borderRadius: 6 }}
            >
              Monthly (30 Days)
            </button>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button className="secondary" onClick={handleExportTasksCSV} style={{ fontSize: 11 }}>
            <Download size={13} /> Tasks CSV
          </button>
          <button className="secondary" onClick={handleExportTransactionsCSV} style={{ fontSize: 11 }}>
            <Download size={13} /> Finance CSV
          </button>
          <button className="secondary" onClick={handleExportLearningCSV} style={{ fontSize: 11 }}>
            <Download size={13} /> Learning CSV
          </button>
          <button className="secondary" onClick={handleExportProjectsCSV} style={{ fontSize: 11 }}>
            <Download size={13} /> Projects CSV
          </button>
        </div>
      </div>

      {/* Printable Report Document Card */}
      <div
        className="panel"
        style={{
          border: "1px solid var(--line)",
          background: "var(--panel)",
          padding: 32,
          position: "relative"
        }}
      >
        {/* Report Branded Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "1px solid var(--line)", paddingBottom: 20, marginBottom: 24 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <div className="brand-mark small">I</div>
              <div>
                <b style={{ fontSize: 16 }}>INGANJI LIFE OS</b>
                <small className="muted" style={{ display: "block" }}>EXECUTIVE PERFORMANCE AUDIT</small>
              </div>
            </div>
            <h3 style={{ fontSize: 22, margin: "6px 0 2px" }}>
              {reportPeriod === "weekly" ? "Weekly Executive Brief" : "Monthly Operational Review"}
            </h3>
            <p className="muted" style={{ fontSize: 12 }}>
              Prepared for: <b>{userEmail}</b> · Generated on {todayStr}
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <span className="badge focus" style={{ fontSize: 11, padding: "4px 10px" }}>
              Period: {cutoffDate} to {todayStr}
            </span>
          </div>
        </div>

        {/* Executive Scorecards */}
        <div className="stats-grid" style={{ marginBottom: 28 }}>
          <div className="stat-card">
            <div className="stat-icon">
              <CheckCircle2 size={18} />
            </div>
            <p>Task Delivery</p>
            <h3>{completedTasks} Done</h3>
            <small>{openTasks} remaining tasks</small>
          </div>

          <div className="stat-card">
            <div className="stat-icon amber">
              <Clock size={18} />
            </div>
            <p>IT Lab Hours</p>
            <h3>{periodHours.toFixed(1)} hrs</h3>
            <small>{periodLearning.length} sessions logged</small>
          </div>

          <div className="stat-card">
            <div className="stat-icon purple">
              <Wallet size={18} />
            </div>
            <p>Net Cashflow (RWF)</p>
            <h3 style={{ color: periodNet >= 0 ? "#34d399" : "#fb7185" }}>
              {formatRWF(periodNet)}
            </h3>
            <small>In: {formatRWF(periodIncome)} · Out: {formatRWF(periodExpense)}</small>
          </div>

          <div className="stat-card">
            <div className="stat-icon blue">
              <Award size={18} />
            </div>
            <p>Habit Adherence</p>
            <h3>{habitAdherence}%</h3>
            <small>{habits.length} daily active routines</small>
          </div>
        </div>

        {/* Detailed Sections Breakdown */}
        <div className="dashboard-grid">
          {/* Projects Snapshot */}
          <div style={{ background: "var(--panel-alt)", padding: 20, borderRadius: 10, border: "1px solid var(--line)" }}>
            <h4 style={{ fontSize: 14, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
              <span>Strategic Projects Status</span>
              <span className="badge focus">{projects.length} Total</span>
            </h4>
            {projects.length === 0 ? (
              <p className="muted" style={{ fontSize: 12 }}>No projects recorded.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {projects.slice(0, 5).map(p => (
                  <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12 }}>
                    <div>
                      <b>{p.name}</b>
                      <small className="muted" style={{ display: "block" }}>{p.focus_area || "General"}</small>
                    </div>
                    <span className={`badge status-${p.status}`}>{p.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* IT Learning Highlights */}
          <div style={{ background: "var(--panel-alt)", padding: 20, borderRadius: 10, border: "1px solid var(--line)" }}>
            <h4 style={{ fontSize: 14, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
              <span>Recent Technical Sessions</span>
              <span className="badge focus">{periodLearning.length} Recorded</span>
            </h4>
            {periodLearning.length === 0 ? (
              <p className="muted" style={{ fontSize: 12 }}>No learning sessions recorded during this period.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {periodLearning.slice(0, 5).map(l => (
                  <div key={l.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12 }}>
                    <div>
                      <b>{l.subject}</b>
                      <small className="muted" style={{ display: "block" }}>{l.activity || "Session"}</small>
                    </div>
                    <span style={{ fontWeight: 700, color: "var(--accent-light)" }}>
                      {Number(l.hours || 0).toFixed(1)} hrs
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Report Footer */}
        <div style={{ marginTop: 32, paddingTop: 16, borderTop: "1px solid var(--line)", display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--muted)" }}>
          <span>INGANJI LIFE OS · Private & Confidential Data Architecture</span>
          <span>Verified Supabase RLS Protected</span>
        </div>
      </div>
    </div>
  );
};

