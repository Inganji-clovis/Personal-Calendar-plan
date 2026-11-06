import React, { useState, useMemo } from "react";
import {
  CheckCircle2,
  Plus,
  Trash2,
  Edit2,
  Calendar,
  AlertTriangle,
  Clock,
  Filter,
  Check
} from "lucide-react";
import type { Task, FocusArea } from "@/lib/supabase";

interface TasksViewProps {
  tasks: Task[];
  searchQuery: string;
  onOpenCreateModal: () => void;
  onOpenEditModal: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onToggleStatus: (task: Task) => void;
}

export const TasksView: React.FC<TasksViewProps> = ({
  tasks,
  searchQuery,
  onOpenCreateModal,
  onOpenEditModal,
  onDeleteTask,
  onToggleStatus
}) => {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [focusFilter, setFocusFilter] = useState<string>("all");

  const todayStr = new Date().toISOString().slice(0, 10);

  const filteredTasks = useMemo(() => {
    return tasks.filter(t => {
      // Search
      const matchesSearch =
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()));
      if (!matchesSearch) return false;

      // Status
      if (statusFilter === "pending" && t.status !== "pending") return false;
      if (statusFilter === "in_progress" && t.status !== "in_progress") return false;
      if (statusFilter === "completed" && t.status !== "completed") return false;
      if (statusFilter === "overdue") {
        const isOverdue = t.status !== "completed" && t.status !== "cancelled" && t.due_date && t.due_date < todayStr;
        if (!isOverdue) return false;
      }

      // Priority
      if (priorityFilter !== "all" && t.priority !== priorityFilter) return false;

      // Focus Area
      if (focusFilter !== "all" && t.focus_area !== focusFilter) return false;

      return true;
    });
  }, [tasks, searchQuery, statusFilter, priorityFilter, focusFilter, todayStr]);

  const overdueCount = tasks.filter(
    t => t.status !== "completed" && t.status !== "cancelled" && t.due_date && t.due_date < todayStr
  ).length;

  return (
    <div>
      <div className="page-heading">
        <div>
          <p className="eyebrow">TASK MANAGEMENT & DELIVERABLES</p>
          <h2>All Tasks ({tasks.length})</h2>
          <p className="muted">
            Track, prioritize, and complete your responsibilities across all projects and commitments.
          </p>
        </div>
        <button className="primary" onClick={onOpenCreateModal}>
          <Plus size={16} /> Create New Task
        </button>
      </div>

      {/* Tabs */}
      <div className="tab-bar">
        <button
          className={`tab-btn ${statusFilter === "all" ? "active" : ""}`}
          onClick={() => setStatusFilter("all")}
        >
          All ({tasks.length})
        </button>
        <button
          className={`tab-btn ${statusFilter === "pending" ? "active" : ""}`}
          onClick={() => setStatusFilter("pending")}
        >
          Pending ({tasks.filter(t => t.status === "pending").length})
        </button>
        <button
          className={`tab-btn ${statusFilter === "in_progress" ? "active" : ""}`}
          onClick={() => setStatusFilter("in_progress")}
        >
          In Progress ({tasks.filter(t => t.status === "in_progress").length})
        </button>
        <button
          className={`tab-btn ${statusFilter === "completed" ? "active" : ""}`}
          onClick={() => setStatusFilter("completed")}
        >
          Completed ({tasks.filter(t => t.status === "completed").length})
        </button>
        <button
          className={`tab-btn ${statusFilter === "overdue" ? "active" : ""}`}
          onClick={() => setStatusFilter("overdue")}
          style={{ color: overdueCount > 0 ? "#fb7185" : "inherit" }}
        >
          Overdue ({overdueCount})
        </button>
      </div>

      {/* Filter Row */}
      <div
        style={{
          display: "flex",
          gap: 12,
          marginBottom: 20,
          flexWrap: "wrap",
          alignItems: "center"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--muted)" }}>
          <Filter size={14} />
          <span>Filters:</span>
        </div>

        <select
          value={priorityFilter}
          onChange={e => setPriorityFilter(e.target.value)}
          style={{
            background: "#0d131a",
            border: "1px solid var(--line)",
            borderRadius: 6,
            padding: "6px 10px",
            fontSize: 12,
            color: "var(--text)"
          }}
        >
          <option value="all">All Priorities</option>
          <option value="urgent">Urgent</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        <select
          value={focusFilter}
          onChange={e => setFocusFilter(e.target.value)}
          style={{
            background: "#0d131a",
            border: "1px solid var(--line)",
            borderRadius: 6,
            padding: "6px 10px",
            fontSize: 12,
            color: "var(--text)"
          }}
        >
          <option value="all">All Focus Areas</option>
          <option value="Iwacu Studio">Iwacu Studio</option>
          <option value="VAX2040">VAX2040</option>
          <option value="University of Kigali">University of Kigali</option>
          <option value="General">General</option>
        </select>

        {(statusFilter !== "all" || priorityFilter !== "all" || focusFilter !== "all" || searchQuery) && (
          <button
            className="text-btn"
            onClick={() => {
              setStatusFilter("all");
              setPriorityFilter("all");
              setFocusFilter("all");
            }}
            style={{ fontSize: 11 }}
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Task List Panel */}
      <section className="panel">
        {filteredTasks.length === 0 ? (
          <div className="empty">
            <CheckCircle2 size={32} />
            <b>No tasks found</b>
            <p className="muted">
              {tasks.length === 0
                ? "You haven't created any tasks yet."
                : "No tasks match your active filters or search."}
            </p>
            <button className="primary" onClick={onOpenCreateModal} style={{ marginTop: 10 }}>
              <Plus size={15} /> Create Task
            </button>
          </div>
        ) : (
          filteredTasks.map(task => {
            const isCompleted = task.status === "completed";
            const isOverdue = !isCompleted && task.due_date && task.due_date < todayStr;

            return (
              <div className="task-row" key={task.id}>
                <button
                  className={`check ${isCompleted ? "checked" : ""}`}
                  onClick={() => onToggleStatus(task)}
                  title={isCompleted ? "Mark pending" : "Mark completed"}
                >
                  <CheckCircle2 size={20} />
                </button>

                <div className="row-main">
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <b className={isCompleted ? "done" : ""}>{task.title}</b>
                    <span className={`badge priority-${task.priority}`}>
                      {task.priority}
                    </span>
                    <span className={`badge status-${task.status}`}>
                      {task.status.replace("_", " ")}
                    </span>
                    {task.focus_area && (
                      <span className="badge focus">{task.focus_area}</span>
                    )}
                  </div>
                  <small>
                    {task.description && <span>{task.description} · </span>}
                    {task.due_date ? (
                      <span style={{ color: isOverdue ? "#fb7185" : "inherit", fontWeight: isOverdue ? 700 : 400 }}>
                        {isOverdue ? `⚠️ Overdue (${task.due_date})` : `Due ${task.due_date}`}
                      </span>
                    ) : (
                      "No due date"
                    )}
                  </small>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <button
                    className="icon-btn"
                    onClick={() => onOpenEditModal(task)}
                    title="Edit task"
                  >
                    <Edit2 size={15} />
                  </button>
                  <button
                    className="icon-btn danger"
                    onClick={() => onDeleteTask(task.id)}
                    title="Delete task"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </section>
    </div>
  );
};

