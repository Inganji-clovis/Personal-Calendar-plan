import React from "react";
import { X } from "lucide-react";
import type { Task, Project, Milestone, ResourceItem } from "@/lib/supabase";

interface ModalsProps {
  modalType: string | null;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  editingTask: Task | null;
  editingProject: Project | null;
  activeProjectIdForMilestone: string | null;
  calendarSelectedDate: string | null;
  preselectedFocusArea: string | null;
  editingResource?: ResourceItem | null;
}

export const Modals: React.FC<ModalsProps> = ({
  modalType,
  onClose,
  onSubmit,
  editingTask,
  editingProject,
  activeProjectIdForMilestone,
  calendarSelectedDate,
  preselectedFocusArea,
  editingResource
}) => {
  if (!modalType) return null;

  const todayStr = new Date().toISOString().slice(0, 10);

  return (
    <div
      className="modal-backdrop"
      onMouseDown={e => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal">
        {/* Task Modal (Create or Edit) */}
        {(modalType === "task" || modalType === "edit_task") && (
          <form onSubmit={onSubmit}>
            <div className="modal-head">
              <h3>{modalType === "edit_task" ? "Edit Task" : "Create New Task"}</h3>
              <button type="button" className="icon-btn" onClick={onClose}>
                <X size={18} />
              </button>
            </div>

            <label>
              Task Title *
              <input
                name="title"
                defaultValue={editingTask?.title || ""}
                placeholder="e.g. Implement Supabase RLS policies"
                required
              />
            </label>

            <label>
              Description & Notes
              <textarea
                name="description"
                defaultValue={editingTask?.description || ""}
                placeholder="Detailed deliverables, reference links or instructions..."
              />
            </label>

            <div className="form-row">
              <label>
                Priority
                <select name="priority" defaultValue={editingTask?.priority || "medium"}>
                  <option value="urgent">Urgent</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </label>

              <label>
                Status
                <select name="status" defaultValue={editingTask?.status || "pending"}>
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </label>
            </div>

            <div className="form-row">
              <label>
                Due Date
                <input
                  type="date"
                  name="due_date"
                  defaultValue={editingTask?.due_date || calendarSelectedDate || ""}
                />
              </label>

              <label>
                Focus Area
                <select
                  name="focus_area"
                  defaultValue={editingTask?.focus_area || preselectedFocusArea || "General"}
                >
                  <option value="General">General</option>
                  <option value="Iwacu Studio">Iwacu Studio</option>
                  <option value="Home Session">Home Session</option>
                  <option value="University of Kigali">University of Kigali</option>
                </select>
              </label>
            </div>

            <button className="primary full" type="submit" style={{ marginTop: 18 }}>
              {modalType === "edit_task" ? "Save Changes" : "Create Task"}
            </button>
          </form>
        )}

        {/* Project Modal (Create or Edit) */}
        {(modalType === "project" || modalType === "edit_project") && (
          <form onSubmit={onSubmit}>
            <div className="modal-head">
              <h3>{modalType === "edit_project" ? "Edit Project" : "Create New Project"}</h3>
              <button type="button" className="icon-btn" onClick={onClose}>
                <X size={18} />
              </button>
            </div>

            <label>
              Project Name *
              <input
                name="name"
                defaultValue={editingProject?.name || ""}
                placeholder="e.g. Home Session Core Architecture v1"
                required
              />
            </label>

            <label>
              Description & Objectives
              <textarea
                name="description"
                defaultValue={editingProject?.description || ""}
                placeholder="Scope, technical specs, and target outcomes..."
              />
            </label>

            <div className="form-row">
              <label>
                Status
                <select name="status" defaultValue={editingProject?.status || "planned"}>
                  <option value="planned">Planned</option>
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="completed">Completed</option>
                </select>
              </label>

              <label>
                Focus Area
                <select
                  name="focus_area"
                  defaultValue={editingProject?.focus_area || preselectedFocusArea || "General"}
                >
                  <option value="General">General</option>
                  <option value="Iwacu Studio">Iwacu Studio</option>
                  <option value="Home Session">Home Session</option>
                  <option value="University of Kigali">University of Kigali</option>
                </select>
              </label>
            </div>

            <div className="form-row">
              <label>
                Start Date
                <input
                  type="date"
                  name="start_date"
                  defaultValue={editingProject?.start_date || todayStr}
                />
              </label>

              <label>
                Target End Date
                <input
                  type="date"
                  name="end_date"
                  defaultValue={editingProject?.end_date || ""}
                />
              </label>
            </div>

            <button className="primary full" type="submit" style={{ marginTop: 18 }}>
              {modalType === "edit_project" ? "Update Project" : "Save Project"}
            </button>
          </form>
        )}

        {/* Milestone Modal */}
        {modalType === "milestone" && (
          <form onSubmit={onSubmit}>
            <div className="modal-head">
              <h3>Add Project Milestone</h3>
              <button type="button" className="icon-btn" onClick={onClose}>
                <X size={18} />
              </button>
            </div>

            <label>
              Milestone Title *
              <input name="title" placeholder="e.g. Database Schema Freeze" required />
            </label>

            <label>
              Target Due Date
              <input type="date" name="due_date" defaultValue={todayStr} />
            </label>

            <input type="hidden" name="project_id" value={activeProjectIdForMilestone || ""} />

            <button className="primary full" type="submit" style={{ marginTop: 18 }}>
              Add Milestone
            </button>
          </form>
        )}

        {/* Learning Session Modal */}
        {modalType === "learning" && (
          <form onSubmit={onSubmit}>
            <div className="modal-head">
              <h3>Log IT Study / Practical Lab</h3>
              <button type="button" className="icon-btn" onClick={onClose}>
                <X size={18} />
              </button>
            </div>

            <label>
              Subject / Topic *
              <input
                name="subject"
                placeholder="e.g. Next.js App Router & SSR"
                required
              />
            </label>

            <label>
              Activity / Lab Details
              <input
                name="activity"
                placeholder="e.g. Practical lab building authenticated API routes"
              />
            </label>

            <div className="form-row">
              <label>
                Study Hours *
                <input
                  type="number"
                  name="hours"
                  min="0.25"
                  step="0.25"
                  defaultValue="2"
                  required
                />
              </label>

              <label>
                Date *
                <input
                  type="date"
                  name="completed_at"
                  defaultValue={todayStr}
                  required
                />
              </label>
            </div>

            <label>
              Evidence URL (GitHub / Demo / Documentation)
              <input
                type="url"
                name="evidence_url"
                placeholder="https://github.com/your-username/repo"
              />
            </label>

            <label>
              Notes & Key Learnings
              <textarea
                name="notes"
                placeholder="Key concepts grasped, syntax patterns, problems solved..."
              />
            </label>

            <button className="primary full" type="submit" style={{ marginTop: 18 }}>
              Save Learning Session
            </button>
          </form>
        )}

        {/* Transaction Modal */}
        {modalType === "transaction" && (
          <form onSubmit={onSubmit}>
            <div className="modal-head">
              <h3>Record Transaction (RWF)</h3>
              <button type="button" className="icon-btn" onClick={onClose}>
                <X size={18} />
              </button>
            </div>

            <div className="form-row">
              <label>
                Type *
                <select name="type" defaultValue="expense">
                  <option value="expense">Expense (Disbursement)</option>
                  <option value="income">Income (Revenue)</option>
                </select>
              </label>

              <label>
                Amount (RWF) *
                <input
                  type="number"
                  name="amount"
                  min="1"
                  step="1"
                  placeholder="e.g. 50000"
                  required
                />
              </label>
            </div>

            <label>
              Category *
              <input
                name="category"
                placeholder="e.g. Studio Gear, Transport, Food, Tuition, Freelance"
                required
              />
            </label>

            <label>
              Description / Memo
              <input name="description" placeholder="e.g. Audio cable replacement for Iwacu Studio" />
            </label>

            <label>
              Date *
              <input type="date" name="transaction_date" defaultValue={todayStr} required />
            </label>

            <button className="primary full" type="submit" style={{ marginTop: 18 }}>
              Save Transaction
            </button>
          </form>
        )}

        {/* Budget Modal */}
        {modalType === "budget" && (
          <form onSubmit={onSubmit}>
            <div className="modal-head">
              <h3>Set Monthly Category Budget</h3>
              <button type="button" className="icon-btn" onClick={onClose}>
                <X size={18} />
              </button>
            </div>

            <label>
              Category Name *
              <input name="category" placeholder="e.g. Transport, Food, Cloud Tech" required />
            </label>

            <label>
              Monthly Limit (RWF) *
              <input
                type="number"
                name="monthly_limit"
                min="1000"
                step="1000"
                placeholder="e.g. 150000"
                required
              />
            </label>

            <button className="primary full" type="submit" style={{ marginTop: 18 }}>
              Set Budget
            </button>
          </form>
        )}

        {/* Savings Goal Modal */}
        {modalType === "savings" && (
          <form onSubmit={onSubmit}>
            <div className="modal-head">
              <h3>Create Savings Fund / Goal</h3>
              <button type="button" className="icon-btn" onClick={onClose}>
                <X size={18} />
              </button>
            </div>

            <label>
              Fund / Goal Name *
              <input name="title" placeholder="e.g. Studio Audio Interface" required />
            </label>

            <div className="form-row">
              <label>
                Target Amount (RWF) *
                <input
                  type="number"
                  name="target_amount"
                  min="5000"
                  step="1000"
                  placeholder="e.g. 350000"
                  required
                />
              </label>

              <label>
                Initial Saved (RWF)
                <input
                  type="number"
                  name="current_amount"
                  min="0"
                  step="1000"
                  defaultValue="0"
                />
              </label>
            </div>

            <label>
              Target Date
              <input type="date" name="target_date" />
            </label>

            <button className="primary full" type="submit" style={{ marginTop: 18 }}>
              Create Savings Fund
            </button>
          </form>
        )}

        {/* Habit Modal */}
        {modalType === "habit" && (
          <form onSubmit={onSubmit}>
            <div className="modal-head">
              <h3>Add Daily Habit</h3>
              <button type="button" className="icon-btn" onClick={onClose}>
                <X size={18} />
              </button>
            </div>

            <label>
              Habit Name *
              <input name="title" placeholder="e.g. 2 Hours Coding Lab" required />
            </label>

            <div className="form-row">
              <label>
                Category
                <select name="category" defaultValue="Coding">
                  <option value="Coding">Coding & Labs</option>
                  <option value="Academics">UoK Academics</option>
                  <option value="Studio">Iwacu Studio</option>
                  <option value="Health">Health & Fitness</option>
                  <option value="Productivity">Personal Discipline</option>
                </select>
              </label>

              <label>
                Frequency
                <select name="frequency" defaultValue="daily">
                  <option value="daily">Daily</option>
                  <option value="weekdays">Weekdays</option>
                  <option value="weekly">Weekly</option>
                </select>
              </label>
            </div>

            <button className="primary full" type="submit" style={{ marginTop: 18 }}>
              Add Habit
            </button>
          </form>
        )}

        {/* Goal Modal */}
        {modalType === "goal" && (
          <form onSubmit={onSubmit}>
            <div className="modal-head">
              <h3>Define Strategic Goal</h3>
              <button type="button" className="icon-btn" onClick={onClose}>
                <X size={18} />
              </button>
            </div>

            <label>
              Goal Title *
              <input name="title" placeholder="e.g. Deploy Home Session v1 Production" required />
            </label>

            <label>
              Category
              <select name="category" defaultValue="Engineering">
                <option value="Engineering">Engineering / Tech</option>
                <option value="Academics">University Degree</option>
                <option value="Business">Iwacu Studio Business</option>
                <option value="Finance">Financial Net Worth</option>
                <option value="Personal">Personal Growth</option>
              </select>
            </label>

            <div className="form-row">
              <label>
                Target Value *
                <input type="number" name="target_value" defaultValue="100" required />
              </label>

              <label>
                Measurement Unit *
                <input name="unit" placeholder="e.g. %, features, RWF, GPA" defaultValue="%" required />
              </label>
            </div>

            <label>
              Target Deadline
              <input type="date" name="deadline" />
            </label>

            <button className="primary full" type="submit" style={{ marginTop: 18 }}>
              Establish Goal
            </button>
          </form>
        )}

        {/* Calendar Event Modal */}
        {modalType === "event" && (
          <form onSubmit={onSubmit}>
            <div className="modal-head">
              <h3>Schedule Calendar Event</h3>
              <button type="button" className="icon-btn" onClick={onClose}>
                <X size={18} />
              </button>
            </div>

            <label>
              Event Title *
              <input name="title" placeholder="e.g. Database Systems Midterm Exam" required />
            </label>

            <label>
              Event Date *
              <input
                type="date"
                name="event_date"
                defaultValue={calendarSelectedDate || todayStr}
                required
              />
            </label>

            <div className="form-row">
              <label>
                Start Time
                <input type="time" name="start_time" defaultValue="09:00" />
              </label>

              <label>
                End Time
                <input type="time" name="end_time" defaultValue="11:00" />
              </label>
            </div>

            <div className="form-row">
              <label>
                Category
                <select name="category" defaultValue="University">
                  <option value="University">University Exam/Class</option>
                  <option value="Iwacu Studio">Iwacu Studio Shoot</option>
                  <option value="Home Session">Home Session Sprint Sync</option>
                  <option value="Learning">IT Lab Block</option>
                  <option value="General">Personal General</option>
                </select>
              </label>

              <label>
                Location / Video Link
                <input name="location" placeholder="e.g. UoK Main Campus / Zoom" />
              </label>
            </div>

            <button className="primary full" type="submit" style={{ marginTop: 18 }}>
              Schedule Event
            </button>
          </form>
        )}

        {/* Academic Course Module Modal */}
        {modalType === "academic_module" && (
          <form onSubmit={onSubmit}>
            <div className="modal-head">
              <h3>Enroll University of Kigali Course</h3>
              <button type="button" className="icon-btn" onClick={onClose}>
                <X size={18} />
              </button>
            </div>

            <div className="form-row">
              <label>
                Course Code *
                <input name="code" placeholder="e.g. BIT3201" required />
              </label>

              <label>
                Credits *
                <input type="number" name="credits" min="1" max="12" defaultValue="3" required />
              </label>
            </div>

            <label>
              Course Name *
              <input name="name" placeholder="e.g. Advanced Database Management Systems" required />
            </label>

            <div className="form-row">
              <label>
                Semester *
                <input name="semester" placeholder="e.g. Year 3 Semester 1" defaultValue="Year 3 Sem 1" required />
              </label>

              <label>
                Lecturer Name
                <input name="lecturer" placeholder="e.g. Dr. Mugabo" />
              </label>
            </div>

            <div className="form-row">
              <label>
                Target Grade
                <input name="target_grade" placeholder="e.g. A" defaultValue="A" />
              </label>

              <label>
                Current Grade (if known)
                <input name="current_grade" placeholder="e.g. In Progress" />
              </label>
            </div>

            <button className="primary full" type="submit" style={{ marginTop: 18 }}>
              Enroll Course Module
            </button>
          </form>
        )}

        {/* Schedule Time Block Modal */}
        {modalType === "schedule_block" && (
          <form onSubmit={onSubmit}>
            <div className="modal-head">
              <h3>Schedule Time Block</h3>
              <button type="button" className="icon-btn" onClick={onClose}>
                <X size={18} />
              </button>
            </div>

            <label>
              Activity / Block Title *
              <input name="title" placeholder="e.g. UV Machine Print Batch #1 or Linux Networking Lab" required />
            </label>

            <div className="form-row">
              <label>
                Session Environment *
                <select name="session_type" defaultValue="home">
                  <option value="home">Home Session (IT / Dev)</option>
                  <option value="studio">Iwacu Studio (Production)</option>
                  <option value="university">University of Kigali</option>
                  <option value="general">General Life</option>
                </select>
              </label>

              <label>
                Date *
                <input type="date" name="scheduled_date" defaultValue={todayStr} required />
              </label>
            </div>

            <div className="form-row">
              <label>
                Start Time *
                <input type="time" name="start_time" defaultValue="09:00" required />
              </label>

              <label>
                End Time *
                <input type="time" name="end_time" defaultValue="11:00" required />
              </label>
            </div>

            <label>
              Description & Specific Goals
              <textarea name="description" placeholder="Objectives, checklist, tools needed..." rows={3} />
            </label>

            <button className="primary full" type="submit" style={{ marginTop: 18 }}>
              Add Scheduled Block
            </button>
          </form>
        )}

        {/* Resource Item Modal (Create or Edit) */}
        {(modalType === "resource" || modalType === "edit_resource") && (
          <form onSubmit={onSubmit}>
            <div className="modal-head">
              <h3>{modalType === "edit_resource" ? "Edit Resource" : "Add Resource to Library"}</h3>
              <button type="button" className="icon-btn" onClick={onClose}>
                <X size={18} />
              </button>
            </div>

            <label>
              Resource Title *
              <input
                name="title"
                defaultValue={editingResource?.title || ""}
                placeholder="e.g. Debian Administrator's Handbook or UV Printer Calibration"
                required
              />
            </label>

            <div className="form-row">
              <label>
                Format / Type *
                <select name="resource_type" defaultValue={editingResource?.resource_type || "documentation"}>
                  <option value="documentation">Documentation</option>
                  <option value="pdf">PDF Document</option>
                  <option value="tutorial">Tutorial</option>
                  <option value="video_link">Video Link</option>
                  <option value="snippet">Code Snippet</option>
                  <option value="ebook">E-Book</option>
                  <option value="website">Website</option>
                  <option value="note">Note / Summary</option>
                  <option value="tool">Tool / Utility</option>
                </select>
              </label>

              <label>
                Related Session *
                <select name="related_session" defaultValue={editingResource?.related_session || "home"}>
                  <option value="home">Home Session (IT / Dev)</option>
                  <option value="studio">Iwacu Studio (Production / Print)</option>
                  <option value="university">University of Kigali (Academics)</option>
                  <option value="general">General</option>
                </select>
              </label>
            </div>

            <div className="form-row">
              <label>
                Category
                <input
                  name="category"
                  defaultValue={editingResource?.category || "IT & Engineering"}
                  placeholder="e.g. Linux, Graphic Design, Cloud, Networking"
                />
              </label>

              <label>
                Resource URL (optional)
                <input
                  type="url"
                  name="url"
                  defaultValue={editingResource?.url || ""}
                  placeholder="https://example.com/docs"
                />
              </label>
            </div>

            <label>
              Tags (comma-separated)
              <input
                name="tags"
                defaultValue={editingResource?.tags || ""}
                placeholder="e.g. debian, bash, server, cli"
              />
            </label>

            <label>
              Notes & Description
              <textarea
                name="description"
                defaultValue={editingResource?.description || ""}
                placeholder="Key takeaways, purpose, or reference snippets..."
                rows={3}
              />
            </label>

            <button className="primary full" type="submit" style={{ marginTop: 18 }}>
              {modalType === "edit_resource" ? "Save Changes" : "Save to Resource Library"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

