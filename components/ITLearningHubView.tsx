import React, { useState } from "react";
import {
  GraduationCap,
  BookOpen,
  Code2,
  Database,
  Server,
  Shield,
  Network,
  Cpu,
  Terminal,
  Cloud,
  Wrench,
  Bot,
  Laptop,
  CheckCircle2,
  Plus,
  ExternalLink,
  ChevronRight,
  Flame,
  Clock,
  Sparkles
} from "lucide-react";
import type { LearningRecord } from "@/lib/supabase";

interface ITLearningHubViewProps {
  learning: LearningRecord[];
  onOpenLogHoursModal: (subject?: string) => void;
  onOpenCreateLabModal: (discipline?: string) => void;
  onAskAI: (prompt: string) => void;
}

export const ITLearningHubView: React.FC<ITLearningHubViewProps> = ({
  learning,
  onOpenLogHoursModal,
  onOpenCreateLabModal,
  onAskAI
}) => {
  const [selectedDisciplineId, setSelectedDisciplineId] = useState<string>("web-dev");

  const totalHours = learning.reduce((sum, l) => sum + Number(l.hours || 0), 0);

  const IT_DISCIPLINES = [
    {
      id: "programming",
      name: "Programming & Algorithms",
      icon: Code2,
      duration: "Month 1-6",
      level: "Intermediate",
      topics: ["Data structures & algorithms", "Object-oriented design", "TypeScript mastery", "Async programming"],
      milestone: "Build 5 core algorithmic utilities and complex state machines."
    },
    {
      id: "web-dev",
      name: "Web Development (Full-Stack)",
      icon: Laptop,
      duration: "Month 1-3",
      level: "Active Core",
      topics: ["Next.js 15 App Router", "React 19 & Server Components", "Tailwind CSS & Responsive UI", "REST & Serverless APIs"],
      milestone: "Ship INGANJI LIFE OS with real-time Supabase sync."
    },
    {
      id: "software-eng",
      name: "Software Engineering & Architecture",
      icon: Server,
      duration: "Month 2-5",
      level: "Intermediate",
      topics: ["Clean architecture", "Design patterns", "Test-driven development", "API contracts & modular code"],
      milestone: "Architect resilient multi-tenant systems with automated CI."
    },
    {
      id: "databases",
      name: "Databases & SQL (PostgreSQL)",
      icon: Database,
      duration: "Month 1-4",
      level: "Core Competency",
      topics: ["PostgreSQL schema design", "Row Level Security (RLS) policies", "Indexes & query optimization", "Foreign key cascades & constraints"],
      milestone: "Design safe idempotent migrations and zero-data-loss RLS architectures."
    },
    {
      id: "networking",
      name: "Computer Networking",
      icon: Network,
      duration: "Month 2-4",
      level: "Foundational",
      topics: ["OSI 7-Layer model & TCP/IP", "Subnetting (IPv4/IPv6)", "Routing, switching & VLANs", "DNS, DHCP, NAT & Firewalls"],
      milestone: "Configure virtual networks, subnet plans, and troubleshoot packet flow."
    },
    {
      id: "cybersecurity",
      name: "Cybersecurity & Hardening",
      icon: Shield,
      duration: "Month 3-6",
      level: "Specialization",
      topics: ["Authentication & JWT security", "Secret hygiene & zero client leaks", "Web vulnerabilities (OWASP Top 10)", "Encryption at rest and in transit"],
      milestone: "Conduct full security audits and harden cloud endpoints."
    },
    {
      id: "linux",
      name: "Linux System Administration",
      icon: Terminal,
      duration: "Month 1-5",
      level: "Core Competency",
      topics: ["Linux filesystem & permissions", "Systemd services & daemon control", "Bash shell scripting & cron jobs", "Package managers & SSH hardening"],
      milestone: "Manage headless Ubuntu/Debian servers with automated scripts."
    },
    {
      id: "windows-admin",
      name: "Windows Administration & AD",
      icon: Server,
      duration: "Month 3-5",
      level: "Applied",
      topics: ["Windows Server roles & features", "Active Directory Domain Services", "Group Policy Objects (GPO)", "PowerShell automation & diagnostics"],
      milestone: "Deploy domain controller and manage user policies."
    },
    {
      id: "sysadmin",
      name: "System Administration & Scripting",
      icon: Terminal,
      duration: "Month 2-6",
      level: "Intermediate",
      topics: ["Automated backups & recovery", "Log analysis & system monitoring", "Resource quota & memory diagnostics", "Multi-system maintenance"],
      milestone: "Set up resilient monitoring and automated incident scripts."
    },
    {
      id: "cloud",
      name: "Cloud Computing & Serverless",
      icon: Cloud,
      duration: "Month 3-6",
      level: "Advanced",
      topics: ["Vercel edge functions & deployments", "Supabase PostgreSQL backend", "AWS/GCP foundational services", "Storage buckets & access policies"],
      milestone: "Deploy scalable full-stack applications with serverless backend."
    },
    {
      id: "it-support",
      name: "IT Support & Troubleshooting",
      icon: Wrench,
      duration: "Month 1-3",
      level: "Practical",
      topics: ["Hardware diagnostics & POST errors", "OS recovery & reinstallations", "Driver & peripheral troubleshooting", "Network connectivity resolution"],
      milestone: "Rapid root-cause analysis for workplace & studio hardware."
    },
    {
      id: "devops",
      name: "DevOps & CI/CD Pipelines",
      icon: Server,
      duration: "Month 4-6",
      level: "Advanced",
      topics: ["Git version control workflows", "GitHub Actions CI/CD", "Docker containerization", "Automated deployment checks"],
      milestone: "Automate build, test, and production deployment pipelines."
    },
    {
      id: "ai",
      name: "Artificial Intelligence & LLMs",
      icon: Bot,
      duration: "Month 4-6",
      level: "Cutting-Edge",
      topics: ["LLM API integration (Gemini/OpenAI)", "Context engineering & system prompts", "RAG concepts & vector databases", "Agentic task execution"],
      milestone: "Build real-time context-aware personal intelligence assistant."
    },
    {
      id: "hardware",
      name: "Computer Hardware & Infrastructure",
      icon: Cpu,
      duration: "Month 1-4",
      level: "Practical",
      topics: ["CPU architectures & chipsets", "Motherboard components & PCIe lanes", "RAM technologies & timings", "Storage (NVMe, SSD, RAID configurations)"],
      milestone: "Assemble, upgrade, and benchmark high-performance workstations."
    }
  ];

  const activeDiscipline = IT_DISCIPLINES.find(d => d.id === selectedDisciplineId) || IT_DISCIPLINES[0];

  // Learning records matching active discipline
  const relatedRecords = learning.filter(l =>
    l.subject.toLowerCase().includes(activeDiscipline.name.toLowerCase().split(" ")[0]) ||
    (l.category && l.category.toLowerCase().includes(activeDiscipline.name.toLowerCase().split(" ")[0]))
  );

  return (
    <div>
      <div className="page-heading">
        <div>
          <p className="eyebrow">SIX-MONTH INTENSIVE ROADMAP</p>
          <h2>IT Learning Hub</h2>
          <p className="muted">
            Structured mastery across 14 core IT disciplines. Concrete learning objectives, verified practical labs, and daily targets.
          </p>
        </div>
        <div className="header-actions">
          <button className="secondary" onClick={() => onAskAI(`I am studying ${activeDiscipline.name}. Explain the most important architectural concepts I must master this week and give me a practice quiz question.`)}>
            <Sparkles size={15} /> AI Quiz & Study Guide
          </button>
          <button className="primary" onClick={() => onOpenLogHoursModal(activeDiscipline.name)}>
            <Clock size={15} /> Log Study Hours
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon amber">
            <Clock size={20} />
          </div>
          <p>Total Study Hours</p>
          <h3>{totalHours.toFixed(1)} hrs</h3>
          <small>{learning.length} study sessions logged</small>
        </div>

        <div className="stat-card">
          <div className="stat-icon blue">
            <BookOpen size={20} />
          </div>
          <p>Disciplines in Roadmap</p>
          <h3>14 Tracks</h3>
          <small>Software, Cloud, Systems & Hardware</small>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <CheckCircle2 size={20} />
          </div>
          <p>Active Discipline</p>
          <h3 style={{ fontSize: 18, color: "var(--accent-light)" }}>{activeDiscipline.name.split(" ")[0]}</h3>
          <small>{activeDiscipline.level}</small>
        </div>

        <div className="stat-card">
          <div className="stat-icon purple">
            <Flame size={20} />
          </div>
          <p>6-Month Target</p>
          <h3>Production Mastery</h3>
          <small>Verified practical labs & code artifacts</small>
        </div>
      </div>

      {/* Main Grid: Discipline Selector + Details */}
      <div className="dashboard-grid">
        {/* Left Column: 14 Disciplines List */}
        <section className="panel" style={{ maxHeight: 620, overflowY: "auto" }}>
          <div className="panel-head">
            <div>
              <h3>14 IT Curriculum Tracks</h3>
              <p className="muted">Select a discipline to inspect topics</p>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {IT_DISCIPLINES.map(disc => {
              const Icon = disc.icon;
              const isSelected = disc.id === selectedDisciplineId;

              return (
                <div
                  key={disc.id}
                  onClick={() => setSelectedDisciplineId(disc.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 12px",
                    borderRadius: 8,
                    cursor: "pointer",
                    background: isSelected ? "#0f2218" : "var(--panel-alt)",
                    border: `1px solid ${isSelected ? "var(--accent)" : "var(--line)"}`,
                    transition: "all 0.15s"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div className="focus-icon" style={{ width: 32, height: 32, fontSize: 13 }}>
                      <Icon size={16} />
                    </div>
                    <div>
                      <b style={{ fontSize: 13, color: isSelected ? "var(--accent-light)" : "var(--text)" }}>
                        {disc.name}
                      </b>
                      <small className="muted" style={{ display: "block", fontSize: 10.5 }}>
                        {disc.duration} · {disc.level}
                      </small>
                    </div>
                  </div>
                  <ChevronRight size={14} color={isSelected ? "var(--accent)" : "var(--muted)"} />
                </div>
              );
            })}
          </div>
        </section>

        {/* Right Column: Active Discipline Deep Dive */}
        <section className="panel">
          <div className="panel-head">
            <div>
              <span className="badge focus" style={{ marginBottom: 6 }}>CURRICULUM SPECIFICATION</span>
              <h3 style={{ fontSize: 20 }}>{activeDiscipline.name}</h3>
              <p className="muted">{activeDiscipline.duration} · Target Level: {activeDiscipline.level}</p>
            </div>
            <button className="secondary" onClick={() => onOpenCreateLabModal(activeDiscipline.name)} style={{ fontSize: 11 }}>
              <Plus size={13} /> Create Practical Lab
            </button>
          </div>

          {/* Topics List */}
          <div style={{ marginBottom: 20 }}>
            <h4 style={{ fontSize: 13, color: "var(--accent-light)", marginBottom: 10 }}>
              Core Learning Topics
            </h4>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {activeDiscipline.topics.map((top, idx) => (
                <div
                  key={idx}
                  style={{
                    background: "var(--panel-alt)",
                    border: "1px solid var(--line)",
                    borderRadius: 8,
                    padding: "10px 12px",
                    fontSize: 12
                  }}
                >
                  <b style={{ display: "block", color: "var(--text)" }}>{top}</b>
                </div>
              ))}
            </div>
          </div>

          {/* Milestone Target */}
          <div
            style={{
              padding: 14,
              borderRadius: 8,
              background: "rgba(16, 185, 129, 0.08)",
              border: "1px solid rgba(16, 185, 129, 0.2)",
              marginBottom: 20
            }}
          >
            <b style={{ fontSize: 12, color: "var(--accent-light)", display: "block", marginBottom: 4 }}>
              🏆 Hands-On Milestone Target:
            </b>
            <p style={{ fontSize: 12.5, color: "#d1fae5", margin: 0, lineHeight: 1.5 }}>
              {activeDiscipline.milestone}
            </p>
          </div>

          {/* Related Logged Study Records */}
          <div>
            <h4 style={{ fontSize: 13, marginBottom: 10 }}>
              Logged Study Sessions ({relatedRecords.length})
            </h4>
            {relatedRecords.length === 0 ? (
              <div className="empty" style={{ padding: 18 }}>
                <p className="muted">No study sessions recorded for this track yet.</p>
                <button
                  className="secondary"
                  onClick={() => onOpenLogHoursModal(activeDiscipline.name)}
                  style={{ marginTop: 8, fontSize: 11 }}
                >
                  <Clock size={13} /> Log First Session
                </button>
              </div>
            ) : (
              relatedRecords.slice(0, 3).map(rec => (
                <div key={rec.id} className="task-row">
                  <div className="row-main">
                    <b>{rec.subject}</b>
                    <small>{rec.activity || "Study session"} {rec.completed_at ? `· ${rec.completed_at}` : ""}</small>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "var(--accent-light)" }}>
                    {Number(rec.hours || 0).toFixed(1)} hrs
                  </span>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

