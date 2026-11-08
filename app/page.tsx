"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import type {
  Task,
  Project,
  Milestone,
  LearningRecord,
  Transaction,
  Budget,
  SavingsGoal,
  Habit,
  HabitLog,
  Goal,
  CalendarEvent,
  AcademicModule
} from "@/lib/supabase";
import {
  fetchAllUserData,
  persistInsert,
  persistUpdate,
  persistDelete
} from "@/lib/dataService";
import { computeRealtimeAlerts, type ComputedAlert } from "@/lib/notifications";

import { Sidebar, type NavSection } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { NotificationsDrawer } from "@/components/NotificationsDrawer";
import { DashboardView } from "@/components/DashboardView";
import { TasksView } from "@/components/TasksView";
import { ProjectsView } from "@/components/ProjectsView";
import { LearningView } from "@/components/LearningView";
import { WorkUniversityView } from "@/components/WorkUniversityView";
import { CalendarView } from "@/components/CalendarView";
import { GoalsHabitsView } from "@/components/GoalsHabitsView";
import { FinanceView } from "@/components/FinanceView";
import { ReportsView } from "@/components/ReportsView";
import { NotificationsSettingsView } from "@/components/NotificationsSettingsView";
import { SmartDailyPlannerView } from "@/components/SmartDailyPlannerView";
import { ITLearningHubView } from "@/components/ITLearningHubView";
import { PracticalLabsView } from "@/components/PracticalLabsView";
import { ResourceLibraryView } from "@/components/ResourceLibraryView";
import { AIAssistantView } from "@/components/AIAssistantView";
import { Modals } from "@/components/Modals";
import type { SessionType, DailyScheduleItem, PracticalLab, ResourceItem } from "@/lib/supabase";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Navigation & UI state
  const [section, setSection] = useState<NavSection>("Dashboard");
  const [mobileNav, setMobileNav] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Modals state
  const [modalType, setModalType] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editingResource, setEditingResource] = useState<ResourceItem | null>(null);
  const [activeProjectIdForMilestone, setActiveProjectIdForMilestone] = useState<string | null>(null);
  const [calendarSelectedDate, setCalendarSelectedDate] = useState<string | null>(null);
  const [preselectedFocusArea, setPreselectedFocusArea] = useState<string | null>(null);

  // Active Life Environment Session
  const [activeSession, setActiveSession] = useState<SessionType>("home");

  // Auth form state
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authBusy, setAuthBusy] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authMessage, setAuthMessage] = useState("");

  // Application Data State
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [learning, setLearning] = useState<LearningRecord[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [habitLogs, setHabitLogs] = useState<HabitLog[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [academicModules, setAcademicModules] = useState<AcademicModule[]>([]);
  const [sessionsSchedule, setSessionsSchedule] = useState<DailyScheduleItem[]>([]);
  const [practicalLabs, setPracticalLabs] = useState<PracticalLab[]>([]);
  const [resourceLibrary, setResourceLibrary] = useState<ResourceItem[]>([]);
  const [extendedInCloud, setExtendedInCloud] = useState(false);

  // Session check
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setCheckingAuth(false);
    });

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Data reload
  const loadData = useCallback(async () => {
    const data = await fetchAllUserData();
    setTasks(data.tasks);
    setProjects(data.projects);
    setMilestones(data.milestones);
    setLearning(data.learning);
    setTransactions(data.transactions);
    setBudgets(data.budgets);
    setSavingsGoals(data.savingsGoals);
    setHabits(data.habits);
    setHabitLogs(data.habitLogs);
    setGoals(data.goals);
    setCalendarEvents(data.calendarEvents);
    setAcademicModules(data.academicModules);
    setSessionsSchedule(data.sessionsSchedule || []);
    setPracticalLabs(data.practicalLabs || []);
    setResourceLibrary(data.resourceLibrary || []);
    setExtendedInCloud(data.extendedTablesAvailable);
  }, []);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user, loadData]);

  // Auth actions
  async function handleAuthenticate(e: React.FormEvent) {
    e.preventDefault();
    setAuthBusy(true);
    setAuthError("");
    setAuthMessage("");

    if (!isSupabaseConfigured()) {
      setAuthError("Supabase credentials not configured in .env.local. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.");
      setAuthBusy(false);
      return;
    }

    if (authMode === "signup") {
      const redirectOrigin = typeof window !== "undefined" ? window.location.origin : undefined;
      const { data, error } = await supabase.auth.signUp({
        email: authEmail,
        password: authPassword,
        options: {
          emailRedirectTo: redirectOrigin
        }
      });
      if (error) {
        setAuthError(error.message);
      } else if (!data.session) {
        setAuthMessage("Account registered successfully! Check your email to confirm, then sign in.");
      } else {
        setAuthMessage("Account created & signed in!");
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email: authEmail,
        password: authPassword
      });
      if (error) {
        setAuthError(error.message);
      } else {
        setAuthMessage("Signed in successfully.");
      }
    }
    setAuthBusy(false);
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    setUser(null);
    setTasks([]);
    setProjects([]);
    setMilestones([]);
    setLearning([]);
    setTransactions([]);
    setBudgets([]);
    setSavingsGoals([]);
    setHabits([]);
    setHabitLogs([]);
    setGoals([]);
    setCalendarEvents([]);
    setAcademicModules([]);
  }

  // Real-time computed alerts
  const computedAlerts = useMemo<ComputedAlert[]>(() => {
    return computeRealtimeAlerts({
      tasks,
      transactions,
      budgets,
      habits,
      habitLogs,
      calendarEvents
    });
  }, [tasks, transactions, budgets, habits, habitLogs, calendarEvents]);

  const tasksCount = useMemo(() => {
    const todayStr = new Date().toISOString().slice(0, 10);
    const overdue = tasks.filter(
      t => t.status !== "completed" && t.status !== "cancelled" && t.due_date && t.due_date < todayStr
    ).length;
    const open = tasks.filter(t => t.status !== "completed" && t.status !== "cancelled").length;
    return { open, overdue };
  }, [tasks]);

  // Modal form submit handler
  async function handleModalSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    if (modalType === "task") {
      const payload: any = {
        title: fd.get("title"),
        description: fd.get("description") || null,
        status: fd.get("status") || "pending",
        priority: fd.get("priority") || "medium",
        due_date: fd.get("due_date") || null,
        focus_area: fd.get("focus_area") || "General"
      };
      await persistInsert("tasks", payload, extendedInCloud);
    } else if (modalType === "edit_task" && editingTask) {
      const updates: any = {
        title: fd.get("title"),
        description: fd.get("description") || null,
        status: fd.get("status") || "pending",
        priority: fd.get("priority") || "medium",
        due_date: fd.get("due_date") || null,
        focus_area: fd.get("focus_area") || "General"
      };
      await persistUpdate("tasks", editingTask.id, updates);
    } else if (modalType === "project") {
      const payload: any = {
        name: fd.get("name"),
        description: fd.get("description") || null,
        status: fd.get("status") || "planned",
        focus_area: fd.get("focus_area") || "General",
        start_date: fd.get("start_date") || null,
        end_date: fd.get("end_date") || null,
        progress: 10
      };
      await persistInsert("projects", payload, extendedInCloud);
    } else if (modalType === "edit_project" && editingProject) {
      const updates: any = {
        name: fd.get("name"),
        description: fd.get("description") || null,
        status: fd.get("status") || "planned",
        focus_area: fd.get("focus_area") || "General",
        start_date: fd.get("start_date") || null,
        end_date: fd.get("end_date") || null
      };
      await persistUpdate("projects", editingProject.id, updates);
    } else if (modalType === "milestone") {
      const payload: any = {
        project_id: fd.get("project_id"),
        title: fd.get("title"),
        due_date: fd.get("due_date") || null,
        completed: false
      };
      await persistInsert("milestones", payload, extendedInCloud);
    } else if (modalType === "learning") {
      const payload: any = {
        subject: fd.get("subject"),
        activity: fd.get("activity") || null,
        hours: Number(fd.get("hours") || 1),
        notes: fd.get("notes") || null,
        evidence_url: fd.get("evidence_url") || null,
        completed_at: fd.get("completed_at") || null
      };
      await persistInsert("learning_records", payload, extendedInCloud);
    } else if (modalType === "transaction") {
      const payload: any = {
        type: fd.get("type"),
        amount: Number(fd.get("amount")),
        category: fd.get("category"),
        description: fd.get("description") || null,
        transaction_date: fd.get("transaction_date")
      };
      await persistInsert("transactions", payload, extendedInCloud);
    } else if (modalType === "budget") {
      const payload: any = {
        category: fd.get("category"),
        monthly_limit: Number(fd.get("monthly_limit"))
      };
      await persistInsert("budgets", payload, extendedInCloud);
    } else if (modalType === "savings") {
      const payload: any = {
        title: fd.get("title"),
        target_amount: Number(fd.get("target_amount")),
        current_amount: Number(fd.get("current_amount") || 0),
        target_date: fd.get("target_date") || null
      };
      await persistInsert("savings_goals", payload, extendedInCloud);
    } else if (modalType === "habit") {
      const payload: any = {
        title: fd.get("title"),
        category: fd.get("category") || "Coding",
        frequency: fd.get("frequency") || "daily"
      };
      await persistInsert("habits", payload, extendedInCloud);
    } else if (modalType === "goal") {
      const payload: any = {
        title: fd.get("title"),
        category: fd.get("category") || "Engineering",
        target_value: Number(fd.get("target_value") || 100),
        current_value: 0,
        unit: fd.get("unit") || "%",
        deadline: fd.get("deadline") || null,
        status: "in_progress"
      };
      await persistInsert("goals", payload, extendedInCloud);
    } else if (modalType === "event") {
      const payload: any = {
        title: fd.get("title"),
        event_date: fd.get("event_date"),
        start_time: fd.get("start_time") || null,
        end_time: fd.get("end_time") || null,
        category: fd.get("category") || "General",
        location: fd.get("location") || null
      };
      await persistInsert("calendar_events", payload, extendedInCloud);
    } else if (modalType === "academic_module") {
      const payload: any = {
        code: fd.get("code"),
        name: fd.get("name"),
        credits: Number(fd.get("credits") || 3),
        semester: fd.get("semester") || "Year 3 Sem 1",
        lecturer: fd.get("lecturer") || null,
        target_grade: fd.get("target_grade") || "A",
        current_grade: fd.get("current_grade") || null
      };
      await persistInsert("academic_modules", payload, extendedInCloud);
    } else if (modalType === "schedule_block") {
      const payload: any = {
        title: fd.get("title"),
        session_type: fd.get("session_type") || activeSession,
        scheduled_date: fd.get("scheduled_date") || fd.get("schedule_date") || new Date().toISOString().slice(0, 10),
        start_time: fd.get("start_time") || "09:00",
        end_time: fd.get("end_time") || "10:00",
        description: fd.get("description") || null,
        status: "scheduled",
        is_recurring: false
      };
      await persistInsert("sessions_schedule", payload, extendedInCloud);
    } else if (modalType === "resource") {
      const payload: any = {
        title: fd.get("title"),
        resource_type: fd.get("resource_type") || "documentation",
        related_session: fd.get("related_session") || activeSession,
        category: fd.get("category") || "IT & Engineering",
        url: fd.get("url") || null,
        tags: fd.get("tags") || null,
        description: fd.get("description") || null,
        is_favorite: false
      };
      await persistInsert("resource_library", payload, extendedInCloud);
    } else if (modalType === "edit_resource" && editingResource) {
      const updates: any = {
        title: fd.get("title"),
        resource_type: fd.get("resource_type") || "documentation",
        related_session: fd.get("related_session") || activeSession,
        category: fd.get("category") || "IT & Engineering",
        url: fd.get("url") || null,
        tags: fd.get("tags") || null,
        description: fd.get("description") || null
      };
      await persistUpdate("resource_library", editingResource.id, updates);
    }

    setModalType(null);
    setEditingTask(null);
    setEditingProject(null);
    setEditingResource(null);
    setActiveProjectIdForMilestone(null);
    loadData();
  }

  // Interactive toggle actions
  const handleToggleTaskStatus = async (task: Task) => {
    const nextStatus = task.status === "completed" ? "pending" : "completed";
    await persistUpdate("tasks", task.id, { status: nextStatus });
    loadData();
  };

  const handleToggleMilestone = async (milestone: Milestone) => {
    await persistUpdate("milestones", milestone.id, { completed: !milestone.completed });
    loadData();
  };

  const handleToggleHabitDay = async (habitId: string, dateStr: string) => {
    const existing = habitLogs.find(l => l.habit_id === habitId && l.log_date === dateStr);
    if (existing) {
      if (existing.completed) {
        await persistDelete("habit_logs", existing.id);
      } else {
        await persistUpdate("habit_logs", existing.id, { completed: true });
      }
    } else {
      await persistInsert("habit_logs", { habit_id: habitId, log_date: dateStr, completed: true }, extendedInCloud);
    }
    loadData();
  };

  const handleToggleHabitToday = async (habitId: string) => {
    const todayStr = new Date().toISOString().slice(0, 10);
    handleToggleHabitDay(habitId, todayStr);
  };

  const handleUpdateGoalProgress = async (goal: Goal, newVal: number) => {
    const target = Number(goal.target_value) || 100;
    const isAchieved = newVal >= target;
    await persistUpdate("goals", goal.id, {
      current_value: newVal,
      status: isAchieved ? "achieved" : "in_progress"
    });
    loadData();
  };

  const handleUpdateSavingsAmount = async (sg: SavingsGoal, delta: number) => {
    const current = Number(sg.current_amount || 0);
    await persistUpdate("savings_goals", sg.id, { current_amount: current + delta });
    loadData();
  };

  // Delete actions
  const handleDeleteTask = async (id: string) => {
    if (confirm("Delete this task?")) {
      await persistDelete("tasks", id);
      loadData();
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (confirm("Delete this project and its milestones?")) {
      await persistDelete("projects", id);
      loadData();
    }
  };

  const handleDeleteMilestone = async (id: string) => {
    await persistDelete("milestones", id);
    loadData();
  };

  const handleDeleteLearning = async (id: string) => {
    if (confirm("Delete this learning record?")) {
      await persistDelete("learning_records", id);
      loadData();
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    if (confirm("Delete this financial transaction?")) {
      await persistDelete("transactions", id);
      loadData();
    }
  };

  const handleDeleteBudget = async (id: string) => {
    if (confirm("Delete this budget limit?")) {
      await persistDelete("budgets", id);
      loadData();
    }
  };

  const handleDeleteSavingsGoal = async (id: string) => {
    if (confirm("Delete this savings fund?")) {
      await persistDelete("savings_goals", id);
      loadData();
    }
  };

  const handleDeleteHabit = async (id: string) => {
    if (confirm("Delete this habit?")) {
      await persistDelete("habits", id);
      loadData();
    }
  };

  const handleDeleteGoal = async (id: string) => {
    if (confirm("Delete this strategic goal?")) {
      await persistDelete("goals", id);
      loadData();
    }
  };

  const handleDeleteCalendarEvent = async (id: string) => {
    await persistDelete("calendar_events", id);
    loadData();
  };

  const handleDeleteAcademicModule = async (id: string) => {
    if (confirm("Remove this course module?")) {
      await persistDelete("academic_modules", id);
      loadData();
    }
  };

  // Schedule handlers
  const handleUpdateBlockStatus = async (
    id: string,
    status: DailyScheduleItem["status"]
  ) => {
    await persistUpdate("sessions_schedule", id, { status });
    setSessionsSchedule((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status } : b))
    );
  };

  const handleRescheduleBlock = async (
    id: string,
    newDate: string,
    newStart: string,
    newEnd: string
  ) => {
    await persistUpdate("sessions_schedule", id, {
      scheduled_date: newDate,
      start_time: newStart,
      end_time: newEnd,
      status: "scheduled",
    });
    setSessionsSchedule((prev) =>
      prev.map((b) =>
        b.id === id
          ? { ...b, scheduled_date: newDate, start_time: newStart, end_time: newEnd, status: "scheduled" }
          : b
      )
    );
  };

  const handleDeleteBlock = async (id: string) => {
    if (confirm("Remove this scheduled time block?")) {
      await persistDelete("sessions_schedule", id);
      setSessionsSchedule((prev) => prev.filter((b) => b.id !== id));
    }
  };

  // Practical Lab handlers
  const handleAddLab = async (newLab: Partial<PracticalLab>) => {
    await persistInsert("practical_labs", newLab, extendedInCloud);
    loadData();
  };

  const handleUpdateLab = async (lab: PracticalLab) => {
    await persistUpdate("practical_labs", lab.id, lab);
    loadData();
  };

  const handleDeleteLab = async (id: string) => {
    if (confirm("Delete this practical lab notebook entry?")) {
      await persistDelete("practical_labs", id);
      loadData();
    }
  };

  // Resource Library handlers
  const handleToggleResourceFavorite = async (id: string, isFavorite: boolean) => {
    await persistUpdate("resource_library", id, { is_favorite: isFavorite });
    setResourceLibrary((prev) =>
      prev.map((r) => (r.id === id ? { ...r, is_favorite: isFavorite } : r))
    );
  };

  const handleDeleteResource = async (id: string) => {
    if (confirm("Delete this saved resource?")) {
      await persistDelete("resource_library", id);
      setResourceLibrary((prev) => prev.filter((r) => r.id !== id));
    }
  };

  // Loading spinner
  if (checkingAuth) {
    return (
      <div className="center">
        <div className="loader" />
        <p>Initializing INGANJI LIFE OS secure workspace...</p>
      </div>
    );
  }

  // Auth Screen (Sign In / Register)
  if (!user) {
    return (
      <main className="auth-wrap">
        <section className="auth-card">
          <div className="brand-mark">I</div>
          <p className="eyebrow">PERSONAL MANAGEMENT WORKSPACE</p>
          <h1>
            INGANJI <span>LIFE OS</span>
          </h1>
          <p className="muted">
            Executive management for your engineering, Iwacu Studio, Home Session, University of Kigali academics, and RWF finances.
          </p>

          {!isSupabaseConfigured() && (
            <div className="info-banner" style={{ marginTop: 16 }}>
              <div>
                <b>Supabase Setup Required:</b>
                <p style={{ marginTop: 2, fontSize: 11 }}>
                  Create <code>.env.local</code> in the project root with your <code>NEXT_PUBLIC_SUPABASE_URL</code> and <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>.
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleAuthenticate} className="auth-form">
            <label>
              Email address
              <input
                type="email"
                value={authEmail}
                onChange={e => setAuthEmail(e.target.value)}
                required
                placeholder="inganji@example.com"
              />
            </label>

            <label>
              Password
              <input
                type="password"
                value={authPassword}
                onChange={e => setAuthPassword(e.target.value)}
                minLength={6}
                required
                placeholder="At least 6 characters"
              />
            </label>

            {authError && <p className="error">{authError}</p>}
            {authMessage && <p className="success">{authMessage}</p>}

            <button className="primary full" disabled={authBusy} style={{ marginTop: 18 }}>
              {authBusy ? "Authenticating..." : authMode === "signin" ? "Sign In to Workspace" : "Create Private Account"}
            </button>
          </form>

          <p className="switch">
            {authMode === "signin" ? "New to INGANJI LIFE OS?" : "Already registered?"}{" "}
            <button
              onClick={() => {
                setAuthMode(authMode === "signin" ? "signup" : "signin");
                setAuthError("");
                setAuthMessage("");
              }}
              style={{ fontWeight: 700 }}
            >
              {authMode === "signin" ? "Create an account" : "Sign in here"}
            </button>
          </p>

          <p className="tiny muted">
            Protected by PostgreSQL Row Level Security (RLS) & encrypted credentials.
          </p>
        </section>
      </main>
    );
  }

  return (
    <div className="shell">
      {/* Sidebar */}
      <Sidebar
        currentSection={section}
        onSelectSection={setSection}
        mobileOpen={mobileNav}
        onCloseMobile={() => setMobileNav(false)}
        user={user}
        onSignOut={handleSignOut}
        tasksCount={tasksCount}
        notificationsCount={computedAlerts.length}
        activeSession={activeSession}
        onSelectSession={setActiveSession}
      />

      {/* Main Workspace Area */}
      <main className="main">
        <Topbar
          currentSection={section}
          onOpenMobile={() => setMobileNav(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          unreadAlertsCount={computedAlerts.length}
          onOpenNotifications={() => setNotificationsOpen(true)}
          onQuickAdd={() => setModalType("task")}
          user={user}
        />

        <div className="content">
          {section === "Dashboard" && (
            <DashboardView
              tasks={tasks}
              projects={projects}
              learning={learning}
              transactions={transactions}
              habits={habits}
              habitLogs={habitLogs}
              schedule={sessionsSchedule}
              activeSession={activeSession}
              onNavigate={setSection}
              onOpenModal={setModalType}
              onToggleTaskStatus={handleToggleTaskStatus}
              onToggleHabitToday={handleToggleHabitToday}
              onSelectSession={setActiveSession}
            />
          )}

          {section === "Smart Planner" && (
            <SmartDailyPlannerView
              schedule={sessionsSchedule}
              activeSession={activeSession}
              onSelectSession={setActiveSession}
              onOpenCreateScheduleModal={() => setModalType("schedule_block")}
              onUpdateScheduleStatus={handleUpdateBlockStatus}
              onRescheduleItem={(item) =>
                handleRescheduleBlock(item.id, item.scheduled_date, item.start_time, item.end_time)
              }
              onAskAI={() => setSection("AI Assistant")}
            />
          )}

          {section === "Tasks" && (
            <TasksView
              tasks={tasks}
              searchQuery={searchQuery}
              onOpenCreateModal={() => {
                setEditingTask(null);
                setModalType("task");
              }}
              onOpenEditModal={t => {
                setEditingTask(t);
                setModalType("edit_task");
              }}
              onDeleteTask={handleDeleteTask}
              onToggleStatus={handleToggleTaskStatus}
            />
          )}

          {section === "Projects" && (
            <ProjectsView
              projects={projects}
              milestones={milestones}
              searchQuery={searchQuery}
              onOpenCreateModal={() => {
                setEditingProject(null);
                setModalType("project");
              }}
              onOpenEditModal={p => {
                setEditingProject(p);
                setModalType("edit_project");
              }}
              onDeleteProject={handleDeleteProject}
              onAddMilestone={pId => {
                setActiveProjectIdForMilestone(pId);
                setModalType("milestone");
              }}
              onToggleMilestone={handleToggleMilestone}
              onDeleteMilestone={handleDeleteMilestone}
            />
          )}

          {(section === "IT Learning Hub" || section === "Learning") && (
            <ITLearningHubView
              learning={learning}
              onOpenLogHoursModal={() => setModalType("learning")}
              onOpenCreateLabModal={() => setSection("Practical Labs")}
              onAskAI={() => setSection("AI Assistant")}
            />
          )}

          {section === "Practical Labs" && (
            <PracticalLabsView
              labs={practicalLabs}
              searchQuery={searchQuery}
              onOpenCreateLabModal={() => setModalType("schedule_block")}
              onUpdateLabStatus={async (id, status) => {
                await persistUpdate("practical_labs", id, { status });
                setPracticalLabs(prev => prev.map(l => l.id === id ? { ...l, status } : l));
              }}
              onDeleteLab={handleDeleteLab}
            />
          )}

          {section === "Resource Library" && (
            <ResourceLibraryView
              resources={resourceLibrary}
              activeSession={activeSession}
              onAddResource={() => {
                setEditingResource(null);
                setModalType("resource");
              }}
              onEditResource={(res) => {
                setEditingResource(res);
                setModalType("edit_resource");
              }}
              onDeleteResource={handleDeleteResource}
              onToggleFavorite={handleToggleResourceFavorite}
            />
          )}

          {section === "AI Assistant" && (
            <AIAssistantView
              activeSession={activeSession}
              tasks={tasks}
              projects={projects}
              schedule={sessionsSchedule}
              transactions={transactions}
            />
          )}

          {section === "Work & University" && (
            <WorkUniversityView
              tasks={tasks}
              projects={projects}
              academicModules={academicModules}
              onOpenCreateTask={fa => {
                setPreselectedFocusArea(fa);
                setEditingTask(null);
                setModalType("task");
              }}
              onOpenCreateProject={fa => {
                setPreselectedFocusArea(fa);
                setEditingProject(null);
                setModalType("project");
              }}
              onOpenCreateModule={() => setModalType("academic_module")}
              onDeleteModule={handleDeleteAcademicModule}
              onToggleTaskStatus={handleToggleTaskStatus}
            />
          )}

          {section === "Calendar" && (
            <CalendarView
              tasks={tasks}
              events={calendarEvents}
              onOpenCreateEvent={dStr => {
                setCalendarSelectedDate(dStr || null);
                setModalType("event");
              }}
              onDeleteEvent={handleDeleteCalendarEvent}
              onToggleTaskStatus={handleToggleTaskStatus}
            />
          )}

          {section === "Goals & Habits" && (
            <GoalsHabitsView
              habits={habits}
              habitLogs={habitLogs}
              goals={goals}
              onOpenCreateHabit={() => setModalType("habit")}
              onOpenCreateGoal={() => setModalType("goal")}
              onToggleHabitDay={handleToggleHabitDay}
              onDeleteHabit={handleDeleteHabit}
              onUpdateGoalProgress={handleUpdateGoalProgress}
              onDeleteGoal={handleDeleteGoal}
            />
          )}

          {section === "Finance" && (
            <FinanceView
              transactions={transactions}
              budgets={budgets}
              savingsGoals={savingsGoals}
              searchQuery={searchQuery}
              onOpenCreateTransaction={() => setModalType("transaction")}
              onOpenCreateBudget={() => setModalType("budget")}
              onOpenCreateSavingsGoal={() => setModalType("savings")}
              onDeleteTransaction={handleDeleteTransaction}
              onDeleteBudget={handleDeleteBudget}
              onDeleteSavingsGoal={handleDeleteSavingsGoal}
              onUpdateSavingsAmount={handleUpdateSavingsAmount}
            />
          )}

          {section === "Reports" && (
            <ReportsView
              tasks={tasks}
              projects={projects}
              learning={learning}
              transactions={transactions}
              habits={habits}
              habitLogs={habitLogs}
              userEmail={user.email || "Inganji"}
            />
          )}

          {section === "Notifications & Reminders" && (
            <NotificationsSettingsView />
          )}
        </div>
      </main>

      {/* Notifications Drawer */}
      <NotificationsDrawer
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        alerts={computedAlerts}
        onNavigate={s => {
          setSection(s);
          setNotificationsOpen(false);
        }}
      />

      {/* Global Modals for Creation & Editing */}
      <Modals
        modalType={modalType}
        onClose={() => {
          setModalType(null);
          setEditingTask(null);
          setEditingProject(null);
          setEditingResource(null);
          setActiveProjectIdForMilestone(null);
          setPreselectedFocusArea(null);
        }}
        onSubmit={handleModalSubmit}
        editingTask={editingTask}
        editingProject={editingProject}
        editingResource={editingResource}
        activeProjectIdForMilestone={activeProjectIdForMilestone}
        calendarSelectedDate={calendarSelectedDate}
        preselectedFocusArea={preselectedFocusArea}
      />
    </div>
  );
}
