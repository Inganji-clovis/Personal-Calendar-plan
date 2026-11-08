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
  DailyScheduleItem,
  PracticalLab,
  ResourceItem,
  SessionType
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
  sessionsSchedule: DailyScheduleItem[];
  practicalLabs: PracticalLab[];
  resourceLibrary: ResourceItem[];
  extendedTablesAvailable: boolean;
}

/**
 * Generates default recurring schedule blocks for a given date based on Inganji's known commitments:
 * - Mon-Fri:
 *   - 08:30 - 09:00: Morning Commute to Studio
 *   - 09:00 - 17:00: Iwacu Studio Session (Graphic design, printing & UV/Laser, video/photo)
 *   - 17:00 - 21:00: University of Kigali Session (IT Degree courses & academic labs)
 *   - 21:00 - 22:20: Commute Home
 *   - 22:20 - 00:00: Home Session (Personal IT Roadmap & Practical Labs)
 * - Saturday:
 *   - 09:00 - 17:00: Work commitment
 *   - 18:00 - 22:00: Home Session (Coding & self-development)
 * - Sunday:
 *   - 09:00 - 17:00: Iwacu Studio Session
 *   - 18:00 - 22:00: Home Session (Weekly review & revision)
 */
export function generateDefaultScheduleForDate(dateStr: string): DailyScheduleItem[] {
  const dateObj = new Date(dateStr);
  const dayOfWeek = dateObj.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat

  if (dayOfWeek >= 1 && dayOfWeek <= 5) {
    // Weekday: Mon-Fri
    return [
      {
        id: `default-${dateStr}-studio`,
        session_type: "studio",
        title: "Iwacu Studio: Graphic Design & Production Operations",
        start_time: "09:00",
        end_time: "17:00",
        scheduled_date: dateStr,
        why_it_matters: "Client deliverables, UV/Laser machine operation, graphic printing & visual production.",
        status: "scheduled",
        priority: "high",
        notes: "Departure from home ~08:30 depending on traffic."
      },
      {
        id: `default-${dateStr}-uok`,
        session_type: "university",
        title: "University of Kigali: Lectures & Academic Timetable",
        start_time: "17:00",
        end_time: "21:00",
        scheduled_date: dateStr,
        why_it_matters: "IT Degree curriculum, course lectures, assignments & exam preparation.",
        status: "scheduled",
        priority: "urgent",
        notes: "Direct transit from Studio to campus."
      },
      {
        id: `default-${dateStr}-home`,
        session_type: "home",
        title: "Home Session: Personal IT Roadmap & Practical Lab",
        start_time: "22:20",
        end_time: "23:59",
        scheduled_date: dateStr,
        why_it_matters: "Intensive 6-month IT skills mastery, code exercises, technical labs & revision.",
        status: "scheduled",
        priority: "high",
        notes: "Arrival home ~22:20. Focused learning session."
      }
    ];
  } else if (dayOfWeek === 6) {
    // Saturday: Separate work commitment
    return [
      {
        id: `default-${dateStr}-sat-work`,
        session_type: "studio",
        title: "Saturday Work Commitment",
        start_time: "09:00",
        end_time: "17:00",
        scheduled_date: dateStr,
        why_it_matters: "Professional work obligations and field assignments.",
        status: "scheduled",
        priority: "high"
      },
      {
        id: `default-${dateStr}-sat-home`,
        session_type: "home",
        title: "Home Session: Software Projects & IT Labs",
        start_time: "18:30",
        end_time: "22:30",
        scheduled_date: dateStr,
        why_it_matters: "Full-stack development, server configuration & portfolio projects.",
        status: "scheduled",
        priority: "medium"
      }
    ];
  } else {
    // Sunday: Iwacu Studio + Home Review
    return [
      {
        id: `default-${dateStr}-sun-studio`,
        session_type: "studio",
        title: "Iwacu Studio: Production & Creative Work",
        start_time: "09:00",
        end_time: "17:00",
        scheduled_date: dateStr,
        why_it_matters: "Weekend creative projects, photography/video editing and equipment prep.",
        status: "scheduled",
        priority: "high"
      },
      {
        id: `default-${dateStr}-sun-home`,
        session_type: "home",
        title: "Home Session: Weekly Review, Budget & Pacing",
        start_time: "18:30",
        end_time: "21:30",
        scheduled_date: dateStr,
        why_it_matters: "Weekly audit, financial ledger review, study planning for upcoming week.",
        status: "scheduled",
        priority: "medium"
      }
    ];
  }
}

export async function fetchAllUserData(): Promise<AppStateData> {
  const todayStr = new Date().toISOString().slice(0, 10);
  const defaultSchedule = generateDefaultScheduleForDate(todayStr);

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
    sessionsSchedule: defaultSchedule,
    practicalLabs: [],
    resourceLibrary: [],
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
      sessionsSchedule: getLocal("sessionsSchedule", defaultSchedule),
      practicalLabs: getLocal("practicalLabs", []),
      resourceLibrary: getLocal("resourceLibrary", []),
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
    const [mRes, bRes, sRes, hRes, hlRes, gRes, cRes, aRes, schRes, labRes, resRes] = await Promise.all([
      supabase.from("milestones").select("*").order("created_at", { ascending: true }),
      supabase.from("budgets").select("*"),
      supabase.from("savings_goals").select("*").order("created_at", { ascending: false }),
      supabase.from("habits").select("*").order("created_at", { ascending: true }),
      supabase.from("habit_logs").select("*"),
      supabase.from("goals").select("*").order("created_at", { ascending: false }),
      supabase.from("calendar_events").select("*").order("event_date", { ascending: true }),
      supabase.from("academic_modules").select("*").order("created_at", { ascending: true }),
      supabase.from("sessions_schedule").select("*").order("start_time", { ascending: true }),
      supabase.from("practical_labs").select("*").order("created_at", { ascending: false }),
      supabase.from("resource_library").select("*").order("created_at", { ascending: false })
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
      result.sessionsSchedule = (schRes.data && schRes.data.length > 0) ? schRes.data : defaultSchedule;
      result.practicalLabs = labRes.data || [];
      result.resourceLibrary = resRes.data || [];
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
      result.sessionsSchedule = getLocal("sessionsSchedule", defaultSchedule);
      result.practicalLabs = getLocal("practicalLabs", []);
      result.resourceLibrary = getLocal("resourceLibrary", []);
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
    result.sessionsSchedule = getLocal("sessionsSchedule", defaultSchedule);
    result.practicalLabs = getLocal("practicalLabs", []);
    result.resourceLibrary = getLocal("resourceLibrary", []);
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
      const client = supabase.from(table as any) as any;
      const { data, error } = await client.insert(record).select();
      if (!error) {
        return { success: true, data: data?.[0] };
      }
      // If column focus_area/project_id not found in core tables, retry clean core
      if (error.code === "42703") {
        const cleanRecord = { ...record };
        delete cleanRecord.focus_area;
        delete cleanRecord.session_type;
        delete cleanRecord.project_id;
        delete cleanRecord.progress;
        delete cleanRecord.category;
        delete cleanRecord.lab_status;
        const retry = await client.insert(cleanRecord).select();
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
      const client = supabase.from(table as any) as any;
      const { error } = await client.update(updates).eq("id", id);
      if (error) {
        if (error.code === "42703") {
          const cleanUpdates = { ...updates };
          delete cleanUpdates.focus_area;
          delete cleanUpdates.session_type;
          delete cleanUpdates.project_id;
          delete cleanUpdates.progress;
          const retry = await client.update(cleanUpdates).eq("id", id);
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
      const client = supabase.from(table as any) as any;
      const { error } = await client.delete().eq("id", id);
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
