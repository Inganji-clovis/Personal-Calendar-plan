import React, { useState } from "react";
import {
  GraduationCap,
  BookOpen,
  Plus,
  Trash2,
  ExternalLink,
  Code2,
  Shield,
  Server,
  Database,
  CheckCircle2,
  Clock
} from "lucide-react";
import type { LearningRecord } from "@/lib/supabase";

interface LearningViewProps {
  learning: LearningRecord[];
  searchQuery: string;
  onOpenCreateModal: () => void;
  onDeleteRecord: (id: string) => void;
}

export const LearningView: React.FC<LearningViewProps> = ({
  learning,
  searchQuery,
  onOpenCreateModal,
  onDeleteRecord
}) => {
  const [selectedTrack, setSelectedTrack] = useState<string>("all");

  const totalHours = learning.reduce((sum, l) => sum + Number(l.hours || 0), 0);
  const labsCount = learning.filter(l => l.evidence_url || l.activity?.toLowerCase().includes("lab")).length;

  const filteredRecords = learning.filter(l => {
    const matchesSearch =
      l.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (l.activity && l.activity.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (l.notes && l.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    if (!matchesSearch) return false;

    if (selectedTrack !== "all") {
      const text = `${l.subject} ${l.activity || ""} ${l.notes || ""}`.toLowerCase();
      if (!text.includes(selectedTrack.toLowerCase())) return false;
    }

    return true;
  });

  const itRoadmap = [
    {
      title: "Full-Stack Web Engineering",
      icon: Code2,
      desc: "Next.js 15, TypeScript, React 19, Supabase RLS, Tailwind CSS, API architecture",
      status: "Active Focus"
    },
    {
      title: "Database Administration & SQL",
      icon: Database,
      desc: "PostgreSQL, schema design, security policies (RLS), indexes, joins, migrations",
      status: "Core Competency"
    },
    {
      title: "Cloud & DevOps",
      icon: Server,
      desc: "Vercel deployments, CI/CD pipelines, Git version control, environment security",
      status: "In Progress"
    },
    {
      title: "Cybersecurity & Systems",
      icon: Shield,
      desc: "Auth protocols, row level security, secret hygiene, encrypted storage, secure APIs",
      status: "Planned"
    }
  ];

  return (
    <div>
      <div className="page-heading">
        <div>
          <p className="eyebrow">CONTINUOUS TECHNICAL MASTERY</p>
          <h2>IT Learning & Practical Labs</h2>
          <p className="muted">
            Track your study hours, IT engineering roadmaps, code exercises, and practical labs evidence.
          </p>
        </div>
        <button className="primary" onClick={onOpenCreateModal}>
          <Plus size={16} /> Log Study Session
        </button>
      </div>

      {/* KPI Stats */}
      <div className="stats-grid three">
        <div className="stat-card">
          <div className="stat-icon amber">
            <Clock size={20} />
          </div>
          <p>Total Study Hours</p>
          <h3>{totalHours.toFixed(1)} hrs</h3>
          <small>{learning.length} recorded learning sessions</small>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Code2 size={20} />
          </div>
          <p>Practical Labs Logged</p>
          <h3>{labsCount}</h3>
          <small>Hands-on projects and implementation exercises</small>
        </div>

        <div className="stat-card">
          <div className="stat-icon blue">
            <GraduationCap size={20} />
          </div>
          <p>Active IT Tracks</p>
          <h3>4 Domains</h3>
          <small>Full-Stack, Databases, Cloud & Cybersecurity</small>
        </div>
      </div>

      {/* IT Roadmap Tracks */}
      <div className="panel">
        <div className="panel-head">
          <div>
            <h3>Strategic IT Roadmap</h3>
            <p className="muted">Curriculum milestones and engineering competencies</p>
          </div>
        </div>

        <div className="project-grid">
          {itRoadmap.map((track, idx) => {
            const Icon = track.icon;
            return (
              <div
                key={idx}
                className="project-card"
                style={{ cursor: "pointer" }}
                onClick={() => setSelectedTrack(selectedTrack === track.title ? "all" : track.title)}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                    <div className="focus-icon" style={{ width: 34, height: 34 }}>
                      <Icon size={18} />
                    </div>
                    <span className="badge focus">{track.status}</span>
                  </div>
                  <b style={{ fontSize: 13 }}>{track.title}</b>
                  <p className="muted" style={{ fontSize: 11.5, marginTop: 6, lineHeight: 1.4 }}>
                    {track.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sessions and Labs List */}
      <section className="panel">
        <div className="panel-head">
          <div>
            <h3>Learning Log & Lab Records ({filteredRecords.length})</h3>
            <p className="muted">Chronological history of topics studied and hands-on lab output</p>
          </div>
          {selectedTrack !== "all" && (
            <button className="text-btn" onClick={() => setSelectedTrack("all")}>
              Show All Tracks
            </button>
          )}
        </div>

        {filteredRecords.length === 0 ? (
          <div className="empty">
            <BookOpen size={32} />
            <b>No study sessions found</b>
            <p className="muted">
              {learning.length === 0
                ? "Start recording your daily learning sessions and practical lab hours."
                : "No records match your search or track filter."}
            </p>
            <button className="primary" onClick={onOpenCreateModal} style={{ marginTop: 10 }}>
              <Plus size={15} /> Log First Session
            </button>
          </div>
        ) : (
          filteredRecords.map(item => (
            <div className="task-row" key={item.id}>
              <div className="focus-icon amber" style={{ width: 36, height: 36 }}>
                <GraduationCap size={18} />
              </div>

              <div className="row-main">
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <b>{item.subject}</b>
                  {item.activity && (
                    <span className="badge" style={{ background: "#1a2533", color: "#93c5fd" }}>
                      {item.activity}
                    </span>
                  )}
                  {item.evidence_url && (
                    <a
                      href={item.evidence_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-btn"
                      style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11 }}
                    >
                      <ExternalLink size={12} />
                      <span>Lab Artifact / Repo</span>
                    </a>
                  )}
                </div>

                <small>
                  {item.notes && <span>{item.notes} · </span>}
                  {item.completed_at ? `Completed on ${item.completed_at}` : "Ongoing"}
                </small>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "var(--accent-light)" }}>
                  {Number(item.hours || 0).toFixed(1)} hrs
                </span>
                <button
                  className="icon-btn danger"
                  onClick={() => onDeleteRecord(item.id)}
                  title="Delete record"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
};

