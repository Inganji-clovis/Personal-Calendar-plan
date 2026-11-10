"use client";

/**
 * useWorkspaceData
 *
 * Owns the entire data + persistence layer of INGANJI LIFE OS (tasks, projects,
 * finances, habits, academics, schedule, labs, resources) plus every mutation
 * handler. This keeps the page component focused on layout and navigation
 * instead of holding ~30 state hooks and 30 handlers inline.
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
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
  AcademicModule,
  DailyScheduleItem,
  PracticalLab,
  ResourceItem
} from "@/lib/supabase";
import {
  fetchAllUserData,
  persistInsert,
  persistUpdate,
  persistDelete
} from "@/lib/dataService";
import { computeRealtimeAlerts, type ComputedAlert } from "@/lib/notifications";
import { isGeneratedBlock, saveScheduleOverride } from "@/lib/smartPlanner";

export interface WorkspaceData {
  // Domain collections
  tasks: Task[];
  projects: Project[];
  milestones: Milestone[];
  learning: LearningRecord[];
  transactions: Transaction[];
  budgets: Budget[];
  savingsGoals: SavingsGoal[];
  habits: Habit[];
  habitLogs: HabitLog[];
  goals: Goal[];
  calendarEvents: CalendarEvent[];
  academicModules: AcademicModule[];
  sessionsSchedule: DailyScheduleItem[];
  practicalLabs: PracticalLab[];
  resourceLibrary: ResourceItem[];
  extendedInCloud: boolean;

  // Core actions
  loadData: () => Promise<void>;
  handleSignOut: () => Promise<void>;

  // Derived
  computedAlerts: ComputedAlert[];
  tasksCount: { open: number; overdue: number };

  // Task actions
  handleToggleTaskStatus: (task: Task) => Promise<void>;
  handleDeleteTask: (id: string) => Promise<void>;

  // Project & milestone actions
  handleToggleMilestone: (milestone: Milestone) => Promise<void>;
  handleDeleteProject: (id: string) => Promise<void>;
  handleDeleteMilestone: (id: string) => Promise<void>;

  // Habit & goal actions
  handleToggleHabitDay: (habitId: string, dateStr: string) => Promise<void>;
  handleToggleHabitToday: (habitId: string) => Promise<void>;
  handleUpdateGoalProgress: (goal: Goal, newVal: number) => Promise<void>;
  handleDeleteHabit: (id: string) => Promise<void>;
  handleDeleteGoal: (id: string) => Promise<void>;

  // Finance actions
  handleUpdateSavingsAmount: (sg: SavingsGoal, delta: number) => Promise<void>;
  handleDeleteTransaction: (id: string) => Promise<void>;
  handleDeleteBudget: (id: string) => Promise<void>;
  handleDeleteSavingsGoal: (id: string) => Promise<void>;

  // Academic, learning & calendar actions
  handleDeleteLearning: (id: string) => Promise<void>;
  handleDeleteAcademicModule: (id: string) => Promise<void>;
  handleDeleteCalendarEvent: (id: string) => Promise<void>;

  // Schedule actions
  handleUpdateBlockStatus: (id: string, status: DailyScheduleItem["status"]) => Promise<void>;
  handleRescheduleBlock: (id: string, newDate: string, newStart: string, newEnd: string) => Promise<void>;
  handleDeleteBlock: (id: string) => Promise<void>;

  // Practical lab actions
  handleAddLab: (newLab: Partial<PracticalLab>) => Promise<void>;
  handleUpdateLab: (lab: PracticalLab) => Promise<void>;
  handleDeleteLab: (id: string) => Promise<void>;

  // Resource library actions
  handleToggleResourceFavorite: (id: string, isFavorite: boolean) => Promise<void>;
  handleDeleteResource: (id: string) => Promise<void>;
}

export function useWorkspaceData(user: User | null): WorkspaceData {
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
    if (user) loadData();
  }, [user, loadData]);

  const handleSignOut = useCallback(async () => {
    await supabase.auth.signOut();
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
    setSessionsSchedule([]);
    setPracticalLabs([]);
    setResourceLibrary([]);
  }, []);

  const computedAlerts = useMemo<ComputedAlert[]>(() => {
    return computeRealtimeAlerts({ tasks, transactions, budgets, habits, habitLogs, calendarEvents });
  }, [tasks, transactions, budgets, habits, habitLogs, calendarEvents]);

  const tasksCount = useMemo(() => {
    const todayStr = new Date().toISOString().slice(0, 10);
    const overdue = tasks.filter(
      t => t.status !== "completed" && t.status !== "cancelled" && t.due_date && t.due_date < todayStr
    ).length;
    const open = tasks.filter(t => t.status !== "completed" && t.status !== "cancelled").length;
    return { open, overdue };
  }, [tasks]);

  // ---- Task ----
  const handleToggleTaskStatus = async (task: Task) => {
    const nextStatus = task.status === "completed" ? "pending" : "completed";
    await persistUpdate("tasks", task.id, { status: nextStatus });
    loadData();
  };

  const handleDeleteTask = async (id: string) => {
    if (confirm("Delete this task?")) {
      await persistDelete("tasks", id);
      loadData();
    }
  };

  // ---- Project & milestone ----
  const handleToggleMilestone = async (milestone: Milestone) => {
    await persistUpdate("milestones", milestone.id, { completed: !milestone.completed });
    loadData();
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

  // ---- Habit & goal ----
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

  // ---- Finance ----
  const handleUpdateSavingsAmount = async (sg: SavingsGoal, delta: number) => {
    const current = Number(sg.current_amount || 0);
    await persistUpdate("savings_goals", sg.id, { current_amount: current + delta });
    loadData();
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

  // ---- Academic, learning & calendar ----
  const handleDeleteLearning = async (id: string) => {
    if (confirm("Delete this learning record?")) {
      await persistDelete("learning_records", id);
      loadData();
    }
  };

  const handleDeleteAcademicModule = async (id: string) => {
    if (confirm("Remove this course module?")) {
      await persistDelete("academic_modules", id);
      loadData();
    }
  };

  const handleDeleteCalendarEvent = async (id: string) => {
    await persistDelete("calendar_events", id);
    loadData();
  };

  // ---- Schedule ----
  // Auto-generated blocks live only in memory, so their status/reschedule
  // changes are captured as local overrides and re-applied on every load.
  const handleUpdateBlockStatus = async (id: string, status: DailyScheduleItem["status"]) => {
    if (isGeneratedBlock(id)) {
      saveScheduleOverride(id, { status });
    } else {
      await persistUpdate("sessions_schedule", id, { status });
    }
    setSessionsSchedule(prev => prev.map(b => (b.id === id ? { ...b, status } : b)));
  };

  const handleRescheduleBlock = async (id: string, newDate: string, newStart: string, newEnd: string) => {
    const patch = {
      scheduled_date: newDate,
      start_time: newStart,
      end_time: newEnd,
      status: "scheduled" as const,
    };
    if (isGeneratedBlock(id)) {
      saveScheduleOverride(id, patch);
    } else {
      await persistUpdate("sessions_schedule", id, patch);
    }
    setSessionsSchedule(prev => prev.map(b => (b.id === id ? { ...b, ...patch } : b)));
  };

  const handleDeleteBlock = async (id: string) => {
    if (confirm("Remove this scheduled time block?")) {
      if (isGeneratedBlock(id)) {
        saveScheduleOverride(id, { removed: true });
      } else {
        await persistDelete("sessions_schedule", id);
      }
      setSessionsSchedule(prev => prev.filter(b => b.id !== id));
    }
  };

  // ---- Practical labs ----
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

  // ---- Resource library ----
  const handleToggleResourceFavorite = async (id: string, isFavorite: boolean) => {
    await persistUpdate("resource_library", id, { is_favorite: isFavorite });
    setResourceLibrary(prev => prev.map(r => (r.id === id ? { ...r, is_favorite: isFavorite } : r)));
  };

  const handleDeleteResource = async (id: string) => {
    if (confirm("Delete this saved resource?")) {
      await persistDelete("resource_library", id);
      setResourceLibrary(prev => prev.filter(r => r.id !== id));
    }
  };

  return {
    tasks, projects, milestones, learning, transactions, budgets, savingsGoals,
    habits, habitLogs, goals, calendarEvents, academicModules, sessionsSchedule,
    practicalLabs, resourceLibrary, extendedInCloud,

    loadData, handleSignOut, computedAlerts, tasksCount,

    handleToggleTaskStatus, handleDeleteTask,
    handleToggleMilestone, handleDeleteProject, handleDeleteMilestone,
    handleToggleHabitDay, handleToggleHabitToday, handleUpdateGoalProgress,
    handleDeleteHabit, handleDeleteGoal,
    handleUpdateSavingsAmount, handleDeleteTransaction, handleDeleteBudget,
    handleDeleteSavingsGoal,
    handleDeleteLearning, handleDeleteAcademicModule, handleDeleteCalendarEvent,
    handleUpdateBlockStatus, handleRescheduleBlock, handleDeleteBlock,
    handleAddLab, handleUpdateLab, handleDeleteLab,
    handleToggleResourceFavorite, handleDeleteResource
  };
}
