import React, { useState } from "react";
import {
  FolderKanban,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Calendar,
  Clock,
  ListTodo
} from "lucide-react";
import type { Project, Milestone } from "@/lib/supabase";

interface ProjectsViewProps {
  projects: Project[];
  milestones: Milestone[];
  searchQuery: string;
  onOpenCreateModal: () => void;
  onOpenEditModal: (project: Project) => void;
  onDeleteProject: (id: string) => void;
  onAddMilestone: (projectId: string) => void;
  onToggleMilestone: (milestone: Milestone) => void;
  onDeleteMilestone: (id: string) => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  projects,
  milestones,
  searchQuery,
  onOpenCreateModal,
  onOpenEditModal,
  onDeleteProject,
  onAddMilestone,
  onToggleMilestone,
  onDeleteMilestone
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const filteredProjects = projects.filter(
    p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div>
      <div className="page-heading">
        <div>
          <p className="eyebrow">PORTFOLIO & INITIATIVES</p>
          <h2>Projects Portfolio ({projects.length})</h2>
          <p className="muted">
            Manage your long-term initiatives, tracking deliverables, milestones and overall completion.
          </p>
        </div>
        <button className="primary" onClick={onOpenCreateModal}>
          <Plus size={16} /> New Project
        </button>
      </div>

      {filteredProjects.length === 0 ? (
        <div className="panel">
          <div className="empty">
            <FolderKanban size={34} />
            <b>No projects found</b>
            <p className="muted">
              {projects.length === 0
                ? "Start by creating your first project for Iwacu Studio, VAX2040 or University of Kigali."
                : "No projects match your search."}
            </p>
            <button className="primary" onClick={onOpenCreateModal} style={{ marginTop: 12 }}>
              <Plus size={15} /> Create Project
            </button>
          </div>
        </div>
      ) : (
        <div className="project-grid">
          {filteredProjects.map(project => {
            const projectMilestones = milestones.filter(m => m.project_id === project.id);
            const completedCount = projectMilestones.filter(m => m.completed).length;
            const calculatedProgress =
              projectMilestones.length > 0
                ? Math.round((completedCount / projectMilestones.length) * 100)
                : project.progress || (project.status === "completed" ? 100 : project.status === "active" ? 50 : 10);

            const isExpanded = selectedProjectId === project.id;

            return (
              <div className="project-card" key={project.id}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div className="focus-icon blue" style={{ width: 34, height: 34 }}>
                        <FolderKanban size={17} />
                      </div>
                      <div>
                        <b style={{ fontSize: 14 }}>{project.name}</b>
                        {project.focus_area && (
                          <div style={{ fontSize: 10.5, color: "var(--accent-light)", fontWeight: 600 }}>
                            {project.focus_area}
                          </div>
                        )}
                      </div>
                    </div>
                    <span className={`badge status-${project.status}`}>
                      {project.status}
                    </span>
                  </div>

                  <p className="muted" style={{ fontSize: 12, lineHeight: 1.5, minHeight: 36 }}>
                    {project.description || "No description provided."}
                  </p>

                  <div style={{ marginTop: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 4 }}>
                      <span className="muted">Progress</span>
                      <b style={{ color: "var(--accent-light)" }}>{calculatedProgress}%</b>
                    </div>
                    <div className="progress-bar-bg" style={{ margin: 0 }}>
                      <div className="progress-bar-fill" style={{ width: `${calculatedProgress}%` }} />
                    </div>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--muted)", marginTop: 12 }}>
                    <span>
                      {project.start_date ? `Started: ${project.start_date}` : "No start date"}
                    </span>
                    <span>
                      {project.end_date ? `Target: ${project.end_date}` : "Ongoing"}
                    </span>
                  </div>

                  {/* Milestones toggle */}
                  <div style={{ marginTop: 16, paddingTop: 12, borderTop: "1px solid var(--line)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                      <button
                        className="text-btn"
                        onClick={() => setSelectedProjectId(isExpanded ? null : project.id)}
                        style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11.5 }}
                      >
                        <ListTodo size={13} />
                        <span>
                          Milestones ({completedCount}/{projectMilestones.length})
                        </span>
                      </button>
                      <button
                        className="icon-btn"
                        onClick={() => onAddMilestone(project.id)}
                        title="Add Milestone"
                        style={{ padding: 4 }}
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    {isExpanded && (
                      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
                        {projectMilestones.length === 0 ? (
                          <p className="muted" style={{ fontSize: 11, fontStyle: "italic" }}>
                            No milestones yet. Click + to add one.
                          </p>
                        ) : (
                          projectMilestones.map(m => (
                            <div
                              key={m.id}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                background: "#0a1017",
                                padding: "6px 8px",
                                borderRadius: 6,
                                fontSize: 11.5
                              }}
                            >
                              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <button
                                  className={`check ${m.completed ? "checked" : ""}`}
                                  onClick={() => onToggleMilestone(m)}
                                  style={{ padding: 0 }}
                                >
                                  <CheckCircle2 size={14} />
                                </button>
                                <span style={{ textDecoration: m.completed ? "line-through" : "none", color: m.completed ? "var(--muted)" : "var(--text)" }}>
                                  {m.title}
                                </span>
                              </div>
                              <button
                                className="icon-btn danger"
                                onClick={() => onDeleteMilestone(m.id)}
                                style={{ padding: 2 }}
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 8,
                    marginTop: 14,
                    paddingTop: 12,
                    borderTop: "1px solid var(--line)"
                  }}
                >
                  <button className="icon-btn" onClick={() => onOpenEditModal(project)} title="Edit project">
                    <Edit2 size={14} />
                  </button>
                  <button className="icon-btn danger" onClick={() => onDeleteProject(project.id)} title="Delete project">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

