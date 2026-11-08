import React, { useState } from "react";
import {
  BriefcaseBusiness,
  Activity,
  GraduationCap,
  Plus,
  CheckCircle2,
  Calendar,
  Award,
  BookOpen,
  FolderKanban,
  Trash2,
  User
} from "lucide-react";
import type { Task, Project, AcademicModule } from "@/lib/supabase";

interface WorkUniversityViewProps {
  tasks: Task[];
  projects: Project[];
  academicModules: AcademicModule[];
  onOpenCreateTask: (focusArea: string) => void;
  onOpenCreateProject: (focusArea: string) => void;
  onOpenCreateModule: () => void;
  onDeleteModule: (id: string) => void;
  onToggleTaskStatus: (task: Task) => void;
}

export const WorkUniversityView: React.FC<WorkUniversityViewProps> = ({
  tasks,
  projects,
  academicModules,
  onOpenCreateTask,
  onOpenCreateProject,
  onOpenCreateModule,
  onDeleteModule,
  onToggleTaskStatus
}) => {
  const [activeTab, setActiveTab] = useState<"Iwacu Studio" | "Home Session" | "University of Kigali">("Iwacu Studio");

  // Filter tasks and projects by focus area
  const currentTasks = tasks.filter(
    t => t.focus_area === activeTab || t.title.toLowerCase().includes(activeTab.toLowerCase().split(" ")[0])
  );
  const currentProjects = projects.filter(
    p => p.focus_area === activeTab || p.name.toLowerCase().includes(activeTab.toLowerCase().split(" ")[0])
  );

  return (
    <div>
      <div className="page-heading">
        <div>
          <p className="eyebrow">STRATEGIC DOMAINS & INSTITUTIONS</p>
          <h2>Work & University Command</h2>
          <p className="muted">
            Specialized tracking for Iwacu Studio production, Home Session software engineering, and University of Kigali academics.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="tab-bar">
        <button
          className={`tab-btn ${activeTab === "Iwacu Studio" ? "active" : ""}`}
          onClick={() => setActiveTab("Iwacu Studio")}
        >
          <BriefcaseBusiness size={16} />
          <span>Iwacu Studio</span>
        </button>
        <button
          className={`tab-btn ${activeTab === "Home Session" ? "active" : ""}`}
          onClick={() => setActiveTab("Home Session")}
        >
          <Activity size={16} />
          <span>Home Session</span>
        </button>
        <button
          className={`tab-btn ${activeTab === "University of Kigali" ? "active" : ""}`}
          onClick={() => setActiveTab("University of Kigali")}
        >
          <GraduationCap size={16} />
          <span>University of Kigali</span>
        </button>
      </div>

      {/* Tab 1: Iwacu Studio */}
      {activeTab === "Iwacu Studio" && (
        <div>
          <div className="panel" style={{ background: "radial-gradient(ellipse at top left, #12281d 0%, #0e141b 70%)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 14 }}>
              <div>
                <span className="badge focus" style={{ marginBottom: 8 }}>CREATIVE & PRODUCTION STUDIO</span>
                <h3 style={{ fontSize: 22, marginTop: 4 }}>Iwacu Studio</h3>
                <p className="muted" style={{ maxWidth: 600, marginTop: 4 }}>
                  Media creation, audio & video production, visual design deliverables, branding, and client creative milestones.
                </p>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="secondary" onClick={() => onOpenCreateProject("Iwacu Studio")}>
                  <Plus size={14} /> New Production
                </button>
                <button className="primary" onClick={() => onOpenCreateTask("Iwacu Studio")}>
                  <Plus size={14} /> Add Deliverable
                </button>
              </div>
            </div>
          </div>

          <div className="dashboard-grid">
            {/* Active deliverables */}
            <div className="panel">
              <div className="panel-head">
                <div>
                  <h3>Deliverables & Tasks ({currentTasks.length})</h3>
                  <p className="muted">Pending production tasks for Iwacu Studio</p>
                </div>
              </div>
              {currentTasks.length === 0 ? (
                <div className="empty">
                  <CheckCircle2 size={24} />
                  <p>No open deliverables for Iwacu Studio.</p>
                  <button className="secondary" onClick={() => onOpenCreateTask("Iwacu Studio")} style={{ marginTop: 8 }}>
                    <Plus size={13} /> Add Deliverable
                  </button>
                </div>
              ) : (
                currentTasks.map(t => (
                  <div className="task-row" key={t.id}>
                    <button
                      className={`check ${t.status === "completed" ? "checked" : ""}`}
                      onClick={() => onToggleTaskStatus(t)}
                    >
                      <CheckCircle2 size={18} />
                    </button>
                    <div className="row-main">
                      <b className={t.status === "completed" ? "done" : ""}>{t.title}</b>
                      <small>{t.description || "Production task"} {t.due_date ? `· Due ${t.due_date}` : ""}</small>
                    </div>
                    <span className={`badge priority-${t.priority}`}>{t.priority}</span>
                  </div>
                ))
              )}
            </div>

            {/* Studio Projects */}
            <div className="panel">
              <div className="panel-head">
                <div>
                  <h3>Studio Projects ({currentProjects.length})</h3>
                  <p className="muted">Major campaigns and creative releases</p>
                </div>
              </div>
              {currentProjects.length === 0 ? (
                <div className="empty">
                  <FolderKanban size={24} />
                  <p>No studio projects yet.</p>
                  <button className="secondary" onClick={() => onOpenCreateProject("Iwacu Studio")} style={{ marginTop: 8 }}>
                    <Plus size={13} /> New Production
                  </button>
                </div>
              ) : (
                currentProjects.map(p => (
                  <div key={p.id} style={{ padding: 12, border: "1px solid var(--line)", borderRadius: 8, marginBottom: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <b>{p.name}</b>
                      <span className={`badge status-${p.status}`}>{p.status}</span>
                    </div>
                    <p className="muted" style={{ fontSize: 11, margin: "4px 0" }}>{p.description || "No notes"}</p>
                    <div className="progress-bar-bg" style={{ height: 4, margin: "6px 0 0" }}>
                      <div className="progress-bar-fill" style={{ width: `${p.progress || 30}%` }} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Home Session */}
      {activeTab === "Home Session" && (
        <div>
          <div className="panel" style={{ background: "radial-gradient(ellipse at top left, #0e273a 0%, #0e141b 70%)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 14 }}>
              <div>
                <span className="badge focus" style={{ marginBottom: 8, background: "#13283c", color: "#38bdf8" }}>
                  SOFTWARE ENGINEERING & INNOVATION
                </span>
                <h3 style={{ fontSize: 22, marginTop: 4 }}>Home Session</h3>
                <p className="muted" style={{ maxWidth: 600, marginTop: 4 }}>
                  System architecture, software product development, technical roadmap, API services, and sprint execution.
                </p>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="secondary" onClick={() => onOpenCreateProject("Home Session")}>
                  <Plus size={14} /> New Epic / Repo
                </button>
                <button className="primary" onClick={() => onOpenCreateTask("Home Session")}>
                  <Plus size={14} /> Add Sprint Task
                </button>
              </div>
            </div>
          </div>

          <div className="dashboard-grid">
            <div className="panel">
              <div className="panel-head">
                <div>
                  <h3>Sprint Backlog ({currentTasks.length})</h3>
                  <p className="muted">Engineering tasks and feature tickets</p>
                </div>
              </div>
              {currentTasks.length === 0 ? (
                <div className="empty">
                  <CheckCircle2 size={24} />
                  <p>No active tasks in Home Session sprint backlog.</p>
                  <button className="secondary" onClick={() => onOpenCreateTask("Home Session")} style={{ marginTop: 8 }}>
                    <Plus size={13} /> Add Sprint Task
                  </button>
                </div>
              ) : (
                currentTasks.map(t => (
                  <div className="task-row" key={t.id}>
                    <button
                      className={`check ${t.status === "completed" ? "checked" : ""}`}
                      onClick={() => onToggleTaskStatus(t)}
                    >
                      <CheckCircle2 size={18} />
                    </button>
                    <div className="row-main">
                      <b className={t.status === "completed" ? "done" : ""}>{t.title}</b>
                      <small>{t.description || "Software module"} {t.due_date ? `· Sprint Due: ${t.due_date}` : ""}</small>
                    </div>
                    <span className={`badge priority-${t.priority}`}>{t.priority}</span>
                  </div>
                ))
              )}
            </div>

            <div className="panel">
              <div className="panel-head">
                <div>
                  <h3>Epics & Repositories ({currentProjects.length})</h3>
                  <p className="muted">Major engineering initiatives</p>
                </div>
              </div>
              {currentProjects.length === 0 ? (
                <div className="empty">
                  <FolderKanban size={24} />
                  <p>No active epics in Home Session.</p>
                  <button className="secondary" onClick={() => onOpenCreateProject("Home Session")} style={{ marginTop: 8 }}>
                    <Plus size={13} /> Create Epic
                  </button>
                </div>
              ) : (
                currentProjects.map(p => (
                  <div key={p.id} style={{ padding: 12, border: "1px solid var(--line)", borderRadius: 8, marginBottom: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <b>{p.name}</b>
                      <span className={`badge status-${p.status}`}>{p.status}</span>
                    </div>
                    <p className="muted" style={{ fontSize: 11, margin: "4px 0" }}>{p.description || "Core repository"}</p>
                    <div className="progress-bar-bg" style={{ height: 4, margin: "6px 0 0" }}>
                      <div className="progress-bar-fill" style={{ width: `${p.progress || 40}%` }} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: University of Kigali */}
      {activeTab === "University of Kigali" && (
        <div>
          <div className="panel" style={{ background: "radial-gradient(ellipse at top left, #231536 0%, #0e141b 70%)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 14 }}>
              <div>
                <span className="badge focus" style={{ marginBottom: 8, background: "#2d1645", color: "#c084fc" }}>
                  HIGHER EDUCATION & ACADEMIC DEGREE
                </span>
                <h3 style={{ fontSize: 22, marginTop: 4 }}>University of Kigali (UoK)</h3>
                <p className="muted" style={{ maxWidth: 600, marginTop: 4 }}>
                  Information Technology degree curriculum, course modules, assignments, examinations schedule, and GPA excellence.
                </p>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="secondary" onClick={() => onOpenCreateTask("University of Kigali")}>
                  <Plus size={14} /> Add Assignment / Exam
                </button>
                <button className="primary" onClick={onOpenCreateModule}>
                  <Plus size={14} /> Enroll Course Module
                </button>
              </div>
            </div>
          </div>

          {/* Academic Modules / Courses */}
          <div className="panel">
            <div className="panel-head">
              <div>
                <h3>Academic Course Modules ({academicModules.length})</h3>
                <p className="muted">Enrolled subjects, credit weights, lecturers and grade milestones</p>
              </div>
              <button className="secondary" onClick={onOpenCreateModule} style={{ fontSize: 11 }}>
                <Plus size={13} /> Add Module
              </button>
            </div>

            {academicModules.length === 0 ? (
              <div className="empty">
                <BookOpen size={28} />
                <b>No academic modules enrolled yet</b>
                <p className="muted">Add your semester courses (e.g. Database Systems, Web Tech, Operating Systems) to track performance.</p>
                <button className="primary" onClick={onOpenCreateModule} style={{ marginTop: 10 }}>
                  <Plus size={14} /> Add First Course
                </button>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
                {academicModules.map(mod => (
                  <div
                    key={mod.id}
                    style={{
                      background: "var(--panel-alt)",
                      border: "1px solid var(--line)",
                      borderRadius: 10,
                      padding: 16,
                      position: "relative"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <span className="badge" style={{ background: "#211634", color: "#c084fc", fontSize: 10 }}>
                          {mod.code}
                        </span>
                        <h4 style={{ margin: "8px 0 4px", fontSize: 14 }}>{mod.name}</h4>
                        <p className="muted" style={{ fontSize: 11, display: "flex", alignItems: "center", gap: 6 }}>
                          <User size={12} />
                          {mod.lecturer || "Instructor TBA"}
                        </p>
                      </div>
                      <button
                        className="icon-btn danger"
                        onClick={() => onDeleteModule(mod.id)}
                        title="Delete course"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 14, paddingTop: 10, borderTop: "1px solid var(--line)", fontSize: 11 }}>
                      <span className="muted">{mod.credits} Credits · {mod.semester}</span>
                      <span style={{ fontWeight: 700, color: "var(--accent-light)" }}>
                        Target: {mod.target_grade || "A"} {mod.current_grade ? `(Current: ${mod.current_grade})` : ""}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Academic Deadlines / Exams */}
          <div className="panel">
            <div className="panel-head">
              <div>
                <h3>Assignments & Exam Deadlines ({currentTasks.length})</h3>
                <p className="muted">Upcoming academic submissions for University of Kigali</p>
              </div>
            </div>

            {currentTasks.length === 0 ? (
              <div className="empty">
                <CheckCircle2 size={24} />
                <p>No upcoming assignments or exams registered.</p>
                <button className="secondary" onClick={() => onOpenCreateTask("University of Kigali")} style={{ marginTop: 8 }}>
                  <Plus size={13} /> Add Assignment / Exam
                </button>
              </div>
            ) : (
              currentTasks.map(t => (
                <div className="task-row" key={t.id}>
                  <button
                    className={`check ${t.status === "completed" ? "checked" : ""}`}
                    onClick={() => onToggleTaskStatus(t)}
                  >
                    <CheckCircle2 size={18} />
                  </button>
                  <div className="row-main">
                    <b className={t.status === "completed" ? "done" : ""}>{t.title}</b>
                    <small>{t.description || "Academic deliverable"} {t.due_date ? `· Due: ${t.due_date}` : ""}</small>
                  </div>
                  <span className={`badge priority-${t.priority}`}>{t.priority}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

