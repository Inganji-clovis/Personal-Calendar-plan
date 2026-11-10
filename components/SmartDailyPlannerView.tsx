import React, { useState } from "react";
import {
  Clock,
  Play,
  Pause,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Plus,
  RefreshCw,
  Sparkles,
  ArrowRight,
  Briefcase,
  GraduationCap,
  Home,
  Check,
  ChevronRight
} from "lucide-react";
import type { DailyScheduleItem, SessionType } from "@/lib/supabase";
import { ROADMAP_TOTAL_DAYS, clampRoadmapDay, getRoadmapWeek } from "@/lib/careerRoadmap";

interface SmartDailyPlannerViewProps {
  schedule: DailyScheduleItem[];
  activeSession: SessionType;
  onSelectSession: (s: SessionType) => void;
  onOpenCreateScheduleModal: () => void;
  onUpdateScheduleStatus: (id: string, status: DailyScheduleItem["status"]) => void;
  onRescheduleItem: (item: DailyScheduleItem) => void;
  onAskAI: (prompt: string) => void;
  roadmapDay: number;
  onSelectRoadmapDay: (day: number) => void;
}

export const SmartDailyPlannerView: React.FC<SmartDailyPlannerViewProps> = ({
  schedule,
  activeSession,
  onSelectSession,
  onOpenCreateScheduleModal,
  onUpdateScheduleStatus,
  onRescheduleItem,
  onAskAI,
  roadmapDay,
  onSelectRoadmapDay
}) => {
  const [filterSession, setFilterSession] = useState<SessionType | "all">("all");
  const todayStr = new Date().toISOString().slice(0, 10);

  // Current time representation "HH:mm"
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  // Helper to convert "HH:mm" to minutes
  const toMinutes = (timeStr: string) => {
    const [h, m] = timeStr.split(":").map(Number);
    return (h || 0) * 60 + (m || 0);
  };

  // Identify "What should I do now?"
  const currentItem = schedule.find(item => {
    const start = toMinutes(item.start_time);
    const end = toMinutes(item.end_time);
    return currentMinutes >= start && currentMinutes < end;
  }) || schedule.find(item => item.status === "in_progress") || schedule[0];

  // Identify "What comes next?" (Next 3 upcoming or scheduled activities)
  const upcomingItems = schedule
    .filter(item => {
      if (currentItem && item.id === currentItem.id) return false;
      const start = toMinutes(item.start_time);
      return start >= currentMinutes || item.status === "scheduled";
    })
    .slice(0, 3);

  // Filtered timeline
  const displaySchedule = schedule.filter(item => {
    if (filterSession === "all") return true;
    return item.session_type === filterSession;
  });

  const getSessionBadge = (st: SessionType) => {
    if (st === "studio") {
      return (
        <span className="badge" style={{ background: "#1c2b22", color: "#6ee7b7" }}>
          🎨 Iwacu Studio
        </span>
      );
    }
    if (st === "university") {
      return (
        <span className="badge" style={{ background: "#261b36", color: "#c084fc" }}>
          🎓 University of Kigali
        </span>
      );
    }
    return (
      <span className="badge" style={{ background: "#142533", color: "#7dd3fc" }}>
        🏠 Home Session
      </span>
    );
  };

  return (
    <div>
      {/* Page Heading */}
      <div className="page-heading">
        <div>
          <p className="eyebrow">PERSONAL EXECUTION ENGINE</p>
          <h2>Smart Daily Planner</h2>
          <p className="muted">
            Your day is generated automatically from your live tasks, deadlines and labs — review, execute, and fine-tune as needed.
          </p>
        </div>
        <div className="header-actions">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "var(--panel-alt)",
              border: "1px solid var(--line)",
              borderRadius: 10,
              padding: "6px 10px"
            }}
            title="Career Roadmap day — drives your Studio & Home focus"
          >
            <span className="eyebrow" style={{ margin: 0, fontSize: 10 }}>ROADMAP DAY</span>
            <button
              className="icon-btn"
              onClick={() => onSelectRoadmapDay(clampRoadmapDay(roadmapDay - 1))}
              disabled={roadmapDay <= 1}
              title="Previous day"
            >
              <ChevronRight size={14} style={{ transform: "rotate(180deg)" }} />
            </button>
            <input
              type="number"
              min={1}
              max={ROADMAP_TOTAL_DAYS}
              value={roadmapDay}
              onChange={(e) => onSelectRoadmapDay(clampRoadmapDay(Number(e.target.value)))}
              style={{
                width: 52,
                textAlign: "center",
                background: "var(--panel)",
                border: "1px solid var(--line-strong)",
                borderRadius: 8,
                padding: "4px 6px",
                fontWeight: 700,
                color: "var(--accent-light)"
              }}
            />
            <button
              className="icon-btn"
              onClick={() => onSelectRoadmapDay(clampRoadmapDay(roadmapDay + 1))}
              disabled={roadmapDay >= ROADMAP_TOTAL_DAYS}
              title="Next day"
            >
              <ChevronRight size={14} />
            </button>
            <span className="muted" style={{ fontSize: 11, whiteSpace: "nowrap" }}>
              {getRoadmapWeek(roadmapDay).title}
            </span>
          </div>
          <button className="secondary" onClick={() => onAskAI("Analyze my schedule for today. What should I prioritize right now and where are my bottleneck risks?")}>
            <Sparkles size={15} /> AI Schedule Analysis
          </button>
          <button className="primary" onClick={onOpenCreateScheduleModal}>
            <Plus size={16} /> Add Time Block
          </button>
        </div>
      </div>

      {/* Prominent "What should I do now?" Component */}
      <section
        className="panel"
        style={{
          background: "radial-gradient(ellipse at top left, #122c20 0%, #0c141c 70%)",
          border: "1px solid #1e3a2b",
          padding: 24,
          marginBottom: 24
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 14 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <span className="eyebrow" style={{ color: "var(--accent-light)", margin: 0 }}>
                CURRENT EXECUTION TARGET
              </span>
              {currentItem && getSessionBadge(currentItem.session_type)}
            </div>
            <h3 style={{ fontSize: 24, margin: "4px 0 6px" }}>
              {currentItem ? currentItem.title : "No Active Time Block"}
            </h3>
            <p className="muted" style={{ fontSize: 13, maxWidth: 640 }}>
              {currentItem?.why_it_matters || "Keep focus on scheduled priorities and log your progress when done."}
            </p>
          </div>

          {/* Time & Duration */}
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: "var(--accent-light)", display: "flex", alignItems: "center", gap: 6, justifyContent: "flex-end" }}>
              <Clock size={18} />
              <span>{currentItem ? `${currentItem.start_time} - ${currentItem.end_time}` : "--:--"}</span>
            </div>
            <small className="muted" style={{ display: "block", marginTop: 4 }}>
              Status: <b style={{ textTransform: "capitalize", color: "var(--text)" }}>{currentItem?.status || "Free Time"}</b>
            </small>
          </div>
        </div>

        {/* Action Controls for Current Item */}
        {currentItem && (
          <div style={{ display: "flex", gap: 10, marginTop: 18, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.08)", flexWrap: "wrap" }}>
            <button
              className="primary"
              onClick={() => onUpdateScheduleStatus(currentItem.id, "in_progress")}
              disabled={currentItem.status === "in_progress"}
            >
              <Play size={14} /> Start Execution
            </button>
            <button
              className="secondary"
              onClick={() => onUpdateScheduleStatus(currentItem.id, "completed")}
              disabled={currentItem.status === "completed"}
            >
              <CheckCircle2 size={14} /> Mark Completed
            </button>
            <button
              className="secondary"
              onClick={() => onRescheduleItem(currentItem)}
            >
              <RefreshCw size={14} /> Reschedule Missed Block
            </button>
            <button
              className="text-btn"
              onClick={() => onAskAI(`I am currently in my ${currentItem.session_type} session working on: "${currentItem.title}". Give me a structured 3-step action plan to execute this efficiently.`)}
              style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 4 }}
            >
              <Sparkles size={14} /> 3-Step Execution Plan
            </button>
          </div>
        )}
      </section>

      {/* "What comes next?" Display */}
      <section className="panel" style={{ marginBottom: 24 }}>
        <div className="panel-head">
          <div>
            <h3>What Comes Next?</h3>
            <p className="muted">Upcoming planned activities and fixed commitments</p>
          </div>
        </div>

        {upcomingItems.length === 0 ? (
          <div className="empty" style={{ padding: 20 }}>
            <p className="muted">No further activities scheduled for today. Enjoy your rest or review study notes.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
            {upcomingItems.map((item, idx) => (
              <div
                key={item.id}
                style={{
                  background: "var(--panel-alt)",
                  border: "1px solid var(--line)",
                  borderRadius: 10,
                  padding: 16,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between"
                }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)" }}>#{idx + 1} NEXT</span>
                    {getSessionBadge(item.session_type)}
                  </div>
                  <b style={{ fontSize: 14, display: "block" }}>{item.title}</b>
                  <p className="muted" style={{ fontSize: 11.5, margin: "6px 0 10px" }}>
                    {item.why_it_matters || "Scheduled daily commitment"}
                  </p>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 8, borderTop: "1px solid var(--line)", fontSize: 11.5 }}>
                  <span style={{ color: "var(--accent-light)", fontWeight: 600 }}>
                    {item.start_time} - {item.end_time}
                  </span>
                  <span className={`badge priority-${item.priority}`}>{item.priority}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Hour-by-Hour Timeline with Session Filter */}
      <section className="panel">
        <div className="panel-head">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <h3 style={{ margin: 0 }}>Daily Schedule & Time Blocks ({todayStr})</h3>
              <span className="badge status-completed" style={{ fontSize: 10 }}>Auto-generated</span>
            </div>
            <p className="muted" style={{ marginTop: 4 }}>Built for you from Home, Iwacu Studio, and University of Kigali commitments</p>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <button
              className={`tab-btn ${filterSession === "all" ? "active" : ""}`}
              onClick={() => setFilterSession("all")}
              style={{ padding: "4px 10px", fontSize: 11 }}
            >
              All Sessions
            </button>
            <button
              className={`tab-btn ${filterSession === "home" ? "active" : ""}`}
              onClick={() => setFilterSession("home")}
              style={{ padding: "4px 10px", fontSize: 11 }}
            >
              🏠 Home
            </button>
            <button
              className={`tab-btn ${filterSession === "studio" ? "active" : ""}`}
              onClick={() => setFilterSession("studio")}
              style={{ padding: "4px 10px", fontSize: 11 }}
            >
              🎨 Studio
            </button>
            <button
              className={`tab-btn ${filterSession === "university" ? "active" : ""}`}
              onClick={() => setFilterSession("university")}
              style={{ padding: "4px 10px", fontSize: 11 }}
            >
              🎓 University
            </button>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {displaySchedule.map(item => {
            const isCompleted = item.status === "completed";
            const isInProgress = item.status === "in_progress";
            const isMissed = item.status === "missed";

            return (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  padding: 14,
                  background: isInProgress ? "#0f2219" : "var(--panel-alt)",
                  border: `1px solid ${isInProgress ? "var(--accent)" : "var(--line)"}`,
                  borderRadius: 10
                }}
              >
                {/* Time column */}
                <div style={{ width: 110, flexShrink: 0 }}>
                  <b style={{ fontSize: 13, color: isInProgress ? "var(--accent-light)" : "var(--text)" }}>
                    {item.start_time} - {item.end_time}
                  </b>
                  <small className="muted" style={{ display: "block" }}>
                    {item.scheduled_date}
                  </small>
                </div>

                {/* Main info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <b style={{ fontSize: 13.5, textDecoration: isCompleted ? "line-through" : "none" }}>
                      {item.title}
                    </b>
                    {getSessionBadge(item.session_type)}
                    <span className={`badge priority-${item.priority}`}>{item.priority}</span>
                    <span className={`badge status-${item.status}`}>{item.status.replace("_", " ")}</span>
                  </div>
                  <p className="muted" style={{ fontSize: 11.5, margin: "4px 0 0" }}>
                    {item.why_it_matters || item.notes || "Scheduled time block"}
                  </p>
                </div>

                {/* Quick actions */}
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  <button
                    className={`check ${isCompleted ? "checked" : ""}`}
                    onClick={() => onUpdateScheduleStatus(item.id, isCompleted ? "scheduled" : "completed")}
                    title={isCompleted ? "Mark scheduled" : "Mark completed"}
                  >
                    <CheckCircle2 size={18} />
                  </button>
                  <button
                    className="icon-btn"
                    onClick={() => onRescheduleItem(item)}
                    title="Reschedule block"
                  >
                    <RefreshCw size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

