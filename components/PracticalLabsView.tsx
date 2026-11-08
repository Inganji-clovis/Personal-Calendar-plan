import React, { useState } from "react";
import {
  Code2,
  Plus,
  Trash2,
  ExternalLink,
  CheckCircle2,
  Clock,
  Terminal,
  FileCode,
  AlertTriangle,
  Lightbulb,
  Search,
  Filter,
  Eye,
  X
} from "lucide-react";
import type { PracticalLab } from "@/lib/supabase";

interface PracticalLabsViewProps {
  labs: PracticalLab[];
  searchQuery: string;
  onOpenCreateLabModal: () => void;
  onUpdateLabStatus: (id: string, status: PracticalLab["status"]) => void;
  onDeleteLab: (id: string) => void;
}

export const PracticalLabsView: React.FC<PracticalLabsViewProps> = ({
  labs,
  searchQuery,
  onOpenCreateLabModal,
  onUpdateLabStatus,
  onDeleteLab
}) => {
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [inspectingLab, setInspectingLab] = useState<PracticalLab | null>(null);

  const filteredLabs = labs.filter(lab => {
    const matchesSearch =
      lab.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lab.discipline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lab.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lab.commands_snippets && lab.commands_snippets.toLowerCase().includes(searchQuery.toLowerCase()));
    if (!matchesSearch) return false;

    if (selectedDiscipline !== "all" && lab.discipline !== selectedDiscipline) return false;
    if (statusFilter !== "all" && lab.status !== statusFilter) return false;

    return true;
  });

  const completedCount = labs.filter(l => l.status === "completed").length;
  const inProgressCount = labs.filter(l => l.status === "in_progress").length;

  const disciplines = Array.from(new Set(labs.map(l => l.discipline)));

  const getStatusBadge = (st: PracticalLab["status"]) => {
    switch (st) {
      case "completed":
        return <span className="badge status-completed">Completed ✓</span>;
      case "in_progress":
        return <span className="badge status-active">In Progress</span>;
      case "needs_improvement":
        return <span className="badge priority-urgent">Needs Improvement</span>;
      default:
        return <span className="badge status-planned">Not Started</span>;
    }
  };

  return (
    <div>
      <div className="page-heading">
        <div>
          <p className="eyebrow">HANDS-ON TECHNICAL PORTFOLIO</p>
          <h2>Practical Lab Management</h2>
          <p className="muted">
            Document, troubleshoot, and catalog your real technical exercises, configuration scripts, and lab artifacts.
          </p>
        </div>
        <button className="primary" onClick={onOpenCreateLabModal}>
          <Plus size={16} /> New Practical Lab
        </button>
      </div>

      {/* KPI Stats */}
      <div className="stats-grid three">
        <div className="stat-card">
          <div className="stat-icon">
            <CheckCircle2 size={20} />
          </div>
          <p>Completed Labs</p>
          <h3>{completedCount}</h3>
          <small>Verified technical artifacts</small>
        </div>

        <div className="stat-card">
          <div className="stat-icon blue">
            <Clock size={20} />
          </div>
          <p>Labs In Progress</p>
          <h3>{inProgressCount}</h3>
          <small>Active hands-on exercises</small>
        </div>

        <div className="stat-card">
          <div className="stat-icon amber">
            <Terminal size={20} />
          </div>
          <p>Total Lab Portfolio</p>
          <h3>{labs.length}</h3>
          <small>Across software, networking, cloud & Linux</small>
        </div>
      </div>

      {/* Filters Bar */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--muted)" }}>
          <Filter size={14} />
          <span>Filter:</span>
        </div>

        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          style={{
            background: "#0d131a",
            border: "1px solid var(--line)",
            borderRadius: 6,
            padding: "6px 10px",
            fontSize: 12,
            color: "var(--text)"
          }}
        >
          <option value="all">All Statuses</option>
          <option value="completed">Completed</option>
          <option value="in_progress">In Progress</option>
          <option value="needs_improvement">Needs Improvement</option>
          <option value="not_started">Not Started</option>
        </select>

        {disciplines.length > 0 && (
          <select
            value={selectedDiscipline}
            onChange={e => setSelectedDiscipline(e.target.value)}
            style={{
              background: "#0d131a",
              border: "1px solid var(--line)",
              borderRadius: 6,
              padding: "6px 10px",
              fontSize: 12,
              color: "var(--text)"
            }}
          >
            <option value="all">All Disciplines</option>
            {disciplines.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        )}
      </div>

      {/* Labs Grid */}
      {filteredLabs.length === 0 ? (
        <div className="panel">
          <div className="empty">
            <Terminal size={32} />
            <b>No practical labs found</b>
            <p className="muted">
              {labs.length === 0
                ? "Start building your technical portfolio by documenting your first lab (e.g. Linux SSH Hardening, PostgreSQL Join Tuning, or Next.js Auth API)."
                : "No labs match your active search or filters."}
            </p>
            <button className="primary" onClick={onOpenCreateLabModal} style={{ marginTop: 10 }}>
              <Plus size={15} /> Document First Lab
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 16 }}>
          {filteredLabs.map(lab => (
            <div
              key={lab.id}
              style={{
                background: "var(--panel)",
                border: "1px solid var(--line)",
                borderRadius: 12,
                padding: 18,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between"
              }}
            >
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                  <span className="badge focus">{lab.discipline}</span>
                  {getStatusBadge(lab.status)}
                </div>

                <h4 style={{ fontSize: 15, margin: "8px 0 4px" }}>{lab.title}</h4>
                <p className="muted" style={{ fontSize: 11, marginBottom: 8 }}>
                  Topic: <b>{lab.topic}</b> · Difficulty: <b style={{ textTransform: "capitalize" }}>{lab.difficulty}</b>
                </p>

                {lab.learning_objectives && (
                  <p style={{ fontSize: 12, color: "#cbd5e1", lineHeight: 1.4, margin: "8px 0" }}>
                    🎯 {lab.learning_objectives}
                  </p>
                )}

                {lab.commands_snippets && (
                  <pre
                    style={{
                      background: "#080c10",
                      padding: 10,
                      borderRadius: 6,
                      border: "1px solid var(--line)",
                      fontSize: 11,
                      color: "#6ee7b7",
                      overflowX: "auto",
                      margin: "8px 0"
                    }}
                  >
                    {lab.commands_snippets.slice(0, 160)}
                    {lab.commands_snippets.length > 160 ? "..." : ""}
                  </pre>
                )}
              </div>

              {/* Footer controls */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14, paddingTop: 12, borderTop: "1px solid var(--line)" }}>
                <div style={{ display: "flex", gap: 6 }}>
                  <button
                    className="secondary"
                    onClick={() => setInspectingLab(lab)}
                    style={{ padding: "4px 10px", fontSize: 11 }}
                  >
                    <Eye size={12} /> Inspect Lab
                  </button>
                  {lab.evidence_url && (
                    <a
                      href={lab.evidence_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="icon-btn"
                      title="View Lab Evidence / Repo"
                    >
                      <ExternalLink size={13} />
                    </a>
                  )}
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <select
                    value={lab.status}
                    onChange={e => onUpdateLabStatus(lab.id, e.target.value as any)}
                    style={{
                      background: "#080c10",
                      border: "1px solid var(--line)",
                      borderRadius: 6,
                      padding: "4px 8px",
                      fontSize: 11,
                      color: "var(--text)"
                    }}
                  >
                    <option value="not_started">Not Started</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="needs_improvement">Needs Improvement</option>
                  </select>
                  <button className="icon-btn danger" onClick={() => onDeleteLab(lab.id)} title="Delete Lab">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lab Detailed Inspection Modal */}
      {inspectingLab && (
        <div className="modal-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) setInspectingLab(null); }}>
          <div className="modal large">
            <div className="modal-head">
              <div>
                <span className="badge focus">{inspectingLab.discipline}</span>
                <h3 style={{ fontSize: 20, margin: "6px 0 2px" }}>{inspectingLab.title}</h3>
                <p className="muted" style={{ fontSize: 11.5 }}>
                  Topic: {inspectingLab.topic} · Difficulty: {inspectingLab.difficulty}
                </p>
              </div>
              <button className="icon-btn" onClick={() => setInspectingLab(null)}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14, maxHeight: "65vh", overflowY: "auto" }}>
              {inspectingLab.learning_objectives && (
                <div>
                  <b style={{ fontSize: 12, color: "var(--accent-light)" }}>Learning Objectives:</b>
                  <p style={{ fontSize: 12.5, color: "#cbd5e1", marginTop: 4 }}>{inspectingLab.learning_objectives}</p>
                </div>
              )}

              {inspectingLab.required_tools && (
                <div>
                  <b style={{ fontSize: 12, color: "var(--accent-light)" }}>Required Tools & Environment:</b>
                  <p style={{ fontSize: 12.5, color: "#cbd5e1", marginTop: 4 }}>{inspectingLab.required_tools}</p>
                </div>
              )}

              {inspectingLab.step_by_step && (
                <div>
                  <b style={{ fontSize: 12, color: "var(--blue)" }}>Step-by-Step Instructions:</b>
                  <p style={{ fontSize: 12.5, color: "#cbd5e1", marginTop: 4, whiteSpace: "pre-wrap" }}>{inspectingLab.step_by_step}</p>
                </div>
              )}

              {inspectingLab.commands_snippets && (
                <div>
                  <b style={{ fontSize: 12, color: "#6ee7b7" }}>Commands & Code Snippets:</b>
                  <pre style={{ background: "#080c10", padding: 12, borderRadius: 8, border: "1px solid var(--line)", fontSize: 11.5, color: "#6ee7b7", overflowX: "auto", marginTop: 4 }}>
                    {inspectingLab.commands_snippets}
                  </pre>
                </div>
              )}

              {inspectingLab.errors_encountered && (
                <div style={{ background: "rgba(244,63,94,0.06)", border: "1px solid rgba(244,63,94,0.2)", padding: 12, borderRadius: 8 }}>
                  <b style={{ fontSize: 12, color: "#fb7185", display: "flex", alignItems: "center", gap: 6 }}>
                    <AlertTriangle size={14} /> Errors Encountered & Troubleshooting:
                  </b>
                  <p style={{ fontSize: 12, color: "#fecdd3", marginTop: 4, whiteSpace: "pre-wrap" }}>
                    {inspectingLab.errors_encountered}
                  </p>
                  {inspectingLab.solutions && (
                    <div style={{ marginTop: 8, paddingTop: 8, borderTop: "1px solid rgba(244,63,94,0.2)" }}>
                      <b style={{ fontSize: 12, color: "var(--accent-light)" }}>Solution:</b>
                      <p style={{ fontSize: 12, color: "#d1fae5", marginTop: 2 }}>{inspectingLab.solutions}</p>
                    </div>
                  )}
                </div>
              )}

              {inspectingLab.lessons_learned && (
                <div>
                  <b style={{ fontSize: 12, color: "var(--amber)" }}>Lessons Learned & Takeaways:</b>
                  <p style={{ fontSize: 12.5, color: "#cbd5e1", marginTop: 4 }}>{inspectingLab.lessons_learned}</p>
                </div>
              )}

              {inspectingLab.evidence_url && (
                <div style={{ paddingTop: 10, borderTop: "1px solid var(--line)" }}>
                  <a
                    href={inspectingLab.evidence_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="primary"
                    style={{ fontSize: 12 }}
                  >
                    <ExternalLink size={14} /> Open Verified Lab Artifact / Repository
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
