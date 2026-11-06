import { supabase, isSupabaseConfigured } from "./supabase";
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
  NotificationItem
} from "./supabase";

export const formatRWF = (amount: number): string => {
  return new Intl.NumberFormat("en-RW", {
    style: "currency",
    currency: "RWF",
    maximumFractionDigits: 0
  }).format(amount || 0);
};

// Safe local storage helpers for extended offline-first models
function getLocal<T>(key: string, defaultVal: T): T {
  if (typeof window === "undefined") return defaultVal;
  try {
    const raw = localStorage.getItem(`inganji_${key}`);
    return raw ? JSON.parse(raw) : defaultVal;
  } catch {
    return defaultVal;
  }
}

function setLocal<T>(key: string, data: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(`inganji_${key}`, JSON.stringify(data));
  } catch (err) {
    console.warn("localStorage write error", err);
  }
}

export interface AppStateData {
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
  extendedTablesAvailable: boolean;
}

export async function fetchAllUserData(): Promise<AppStateData> {
  const result: AppStateData = {
    tasks: [],
    projects: [],
    milestones: [],
    learning: [],
    transactions: [],
    budgets: [],
    savingsGoals: [],
    habits: [],
    habitLogs: [],
    goals: [],
    calendarEvents: [],
    academicModules: [],
    extendedTablesAvailable: false
  };

  if (!isSupabaseConfigured()) {
    // Return local storage data if any
    return {
      tasks: getLocal("tasks", []),
      projects: getLocal("projects", []),
      milestones: getLocal("milestones", []),
      learning: getLocal("learning", []),
      transactions: getLocal("transactions", []),
      budgets: getLocal("budgets", []),
      savingsGoals: getLocal("savingsGoals", []),
      habits: getLocal("habits", []),
      habitLogs: getLocal("habitLogs", []),
      goals: getLocal("goals", []),
      calendarEvents: getLocal("calendarEvents", []),
      academicModules: getLocal("academicModules", []),
      extendedTablesAvailable: false
    };
  }

  // 1. Core 4 tables guaranteed in Supabase
  const [tRes, pRes, lRes, fRes] = await Promise.all([
    supabase.from("tasks").select("*").order("created_at", { ascending: false }),
    supabase.from("projects").select("*").order("created_at", { ascending: false }),
    supabase.from("learning_records").select("*").order("created_at", { ascending: false }),
    supabase.from("transactions").select("*").order("transaction_date", { ascending: false })
  ]);

  if (tRes.data) result.tasks = tRes.data;
  if (pRes.data) result.projects = pRes.data;
  if (lRes.data) result.learning = lRes.data;
  if (fRes.data) result.transactions = fRes.data;

  // 2. Extended tables (check if available in Supabase)
  try {
    const [mRes, bRes, sRes, hRes, hlRes, gRes, cRes, aRes] = await Promise.all([
      supabase.from("milestones").select("*").order("created_at", { ascending: true }),
      supabase.from("budgets").select("*"),
      supabase.from("savings_goals").select("*").order("created_at", { ascending: false }),
      supabase.from("habits").select("*").order("created_at", { ascending: true }),
      supabase.from("habit_logs").select("*"),
      supabase.from("goals").select("*").order("created_at", { ascending: false }),
      supabase.from("calendar_events").select("*").order("event_date", { ascending: true }),
      supabase.from("academic_modules").select("*").order("created_at", { ascending: true })
    ]);

    const hasError = [mRes, bRes, sRes, hRes, hlRes, gRes, cRes, aRes].some(
      r => r.error && (r.error.code === "42P01" || r.error.message?.includes("does not exist"))
    );

    if (!hasError) {
      result.extendedTablesAvailable = true;
      result.milestones = mRes.data || [];
      result.budgets = bRes.data || [];
      result.savingsGoals = sRes.data || [];
      result.habits = hRes.data || [];
      result.habitLogs = hlRes.data || [];
      result.goals = gRes.data || [];
      result.calendarEvents = cRes.data || [];
      result.academicModules = aRes.data || [];
    } else {
      // Fallback to local storage
      result.extendedTablesAvailable = false;
      result.milestones = getLocal("milestones", []);
      result.budgets = getLocal("budgets", []);
      result.savingsGoals = getLocal("savingsGoals", []);
      result.habits = getLocal("habits", []);
      result.habitLogs = getLocal("habitLogs", []);
      result.goals = getLocal("goals", []);
      result.calendarEvents = getLocal("calendarEvents", []);
      result.academicModules = getLocal("academicModules", []);
    }
  } catch (err) {
    result.extendedTablesAvailable = false;
    result.milestones = getLocal("milestones", []);
    result.budgets = getLocal("budgets", []);
    result.savingsGoals = getLocal("savingsGoals", []);
    result.habits = getLocal("habits", []);
    result.habitLogs = getLocal("habitLogs", []);
    result.goals = getLocal("goals", []);
    result.calendarEvents = getLocal("calendarEvents", []);
    result.academicModules = getLocal("academicModules", []);
  }

  return result;
}

// Data persistence helpers for both Supabase & resilient local mode
export async function persistInsert<T extends Record<string, any>>(
  table: string,
  record: T,
  extendedInCloud: boolean
): Promise<{ success: boolean; data?: any; error?: string }> {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await (supabase.from(table as any) as any).insert(record).select();
      if (!error) {
        return { success: true, data: data?.[0] };
      }
      // If column focus_area/project_id not found in core tables, retry clean core
      if (error.code === "42703") {
        const cleanRecord = { ...record };
        delete cleanRecord.focus_area;
        delete cleanRecord.project_id;
        delete cleanRecord.progress;
        delete cleanRecord.category;
        delete cleanRecord.lab_status;
        const retry = await (supabase.from(table as any) as any).insert(cleanRecord).select();
        if (!retry.error) return { success: true, data: retry.data?.[0] };
      }
      if (error.code === "42P01") {
        // Table does not exist in Supabase yet, save locally
        const current = getLocal<any[]>(table, []);
        const newRecord = { ...record, id: record.id || `local-${Date.now()}` };
        setLocal(table, [newRecord, ...current]);
        return { success: true, data: newRecord };
      }
      return { success: false, error: error.message };
    } catch (err: any) {
      return { success: false, error: err.message || "Failed to insert" };
    }
  } else {
    // Local mode
    const current = getLocal<any[]>(table, []);
    const newRecord = { ...record, id: record.id || `local-${Date.now()}` };
    setLocal(table, [newRecord, ...current]);
    return { success: true, data: newRecord };
  }
}

export async function persistUpdate<T extends Record<string, any>>(
  table: string,
  id: string,
  updates: T
): Promise<{ success: boolean; error?: string }> {
  if (isSupabaseConfigured() && !id.startsWith("local-")) {
    try {
      const { error } = await (supabase.from(table as any) as any).update(updates).eq("id", id);
      if (error) {
        if (error.code === "42703") {
          const cleanUpdates = { ...updates };
          delete cleanUpdates.focus_area;
          delete cleanUpdates.project_id;
          delete cleanUpdates.progress;
          const retry = await (supabase.from(table as any) as any).update(cleanUpdates).eq("id", id);
          if (!retry.error) return { success: true };
        }
        if (error.code === "42P01") {
          const current = getLocal<any[]>(table, []);
          setLocal(table, current.map(item => item.id === id ? { ...item, ...updates } : item));
          return { success: true };
        }
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  } else {
    const current = getLocal<any[]>(table, []);
    setLocal(table, current.map(item => item.id === id ? { ...item, ...updates } : item));
    return { success: true };
  }
}

export async function persistDelete(
  table: string,
  id: string
): Promise<{ success: boolean; error?: string }> {
  if (isSupabaseConfigured() && !id.startsWith("local-")) {
    try {
      const { error } = await (supabase.from(table as any) as any).delete().eq("id", id);
      if (error && error.code !== "42P01") {
        return { success: false, error: error.message };
      }
    } catch (err: any) {
      console.warn("Delete error on Supabase, removing locally", err);
    }
  }
  const current = getLocal<any[]>(table, []);
  setLocal(table, current.filter(item => item.id !== id));
  return { success: true };
}

