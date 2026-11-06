import { createClient } from "@supabase/supabase-js";

const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const envAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Safe fallback for build time and SSR when environment variables are not yet provided
const fallbackUrl = "https://placeholder-project.supabase.co";
const fallbackKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.placeholder";

const rawUrl = envUrl && envUrl.startsWith("http") ? envUrl.trim() : fallbackUrl;
const url = rawUrl.replace(/\/rest\/v1\/?$/, "").replace(/\/$/, "");
const anonKey = envAnonKey && envAnonKey.length > 20 ? envAnonKey.trim() : fallbackKey;

export const supabase = createClient(url, anonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

export const isSupabaseConfigured = (): boolean => {
  if (typeof window === "undefined") {
    return Boolean(envUrl && envAnonKey && !envUrl.includes("YOUR-PROJECT"));
  }
  return Boolean(
    envUrl &&
    envAnonKey &&
    envUrl.startsWith("http") &&
    !envUrl.includes("YOUR-PROJECT") &&
    !envAnonKey.includes("YOUR_SUPABASE")
  );
};

// Data models
export type TaskPriority = "low" | "medium" | "high" | "urgent";
export type TaskStatus = "pending" | "in_progress" | "completed" | "cancelled";
export type FocusArea = "Iwacu Studio" | "VAX2040" | "University of Kigali" | "General";

export interface Task {
  id: string;
  user_id?: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  due_date: string | null;
  focus_area?: FocusArea | string;
  project_id?: string | null;
  created_at?: string;
}

export type ProjectStatus = "planned" | "active" | "paused" | "completed";

export interface Project {
  id: string;
  user_id?: string;
  name: string;
  description: string | null;
  status: ProjectStatus;
  start_date: string | null;
  end_date: string | null;
  focus_area?: FocusArea | string;
  progress?: number;
  created_at?: string;
}

export interface Milestone {
  id: string;
  project_id: string;
  user_id?: string;
  title: string;
  due_date: string | null;
  completed: boolean;
  created_at?: string;
}

export interface LearningRecord {
  id: string;
  user_id?: string;
  subject: string;
  activity: string | null;
  hours: number;
  notes: string | null;
  evidence_url?: string | null;
  completed_at: string | null;
  category?: string;
  lab_status?: "in_progress" | "completed" | "planned";
  created_at?: string;
}

export interface Transaction {
  id: string;
  user_id?: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  description: string | null;
  transaction_date: string;
  created_at?: string;
}

export interface Budget {
  id: string;
  user_id?: string;
  category: string;
  monthly_limit: number;
  created_at?: string;
}

export interface SavingsGoal {
  id: string;
  user_id?: string;
  title: string;
  target_amount: number;
  current_amount: number;
  target_date: string | null;
  created_at?: string;
}

export interface Habit {
  id: string;
  user_id?: string;
  title: string;
  category: string;
  frequency: "daily" | "weekdays" | "weekly";
  created_at?: string;
}

export interface HabitLog {
  id: string;
  habit_id: string;
  user_id?: string;
  log_date: string; // YYYY-MM-DD
  completed: boolean;
  created_at?: string;
}

export interface Goal {
  id: string;
  user_id?: string;
  title: string;
  category: string;
  target_value: number;
  current_value: number;
  unit: string;
  deadline: string | null;
  status: "in_progress" | "achieved" | "on_hold";
  created_at?: string;
}

export interface CalendarEvent {
  id: string;
  user_id?: string;
  title: string;
  event_date: string; // YYYY-MM-DD
  start_time: string | null; // HH:mm
  end_time: string | null;
  category: "University" | "Iwacu Studio" | "VAX2040" | "Learning" | "General";
  location: string | null;
  created_at?: string;
}

export interface AcademicModule {
  id: string;
  user_id?: string;
  code: string;
  name: string;
  credits: number;
  semester: string;
  lecturer: string | null;
  target_grade: string | null;
  current_grade: string | null;
  created_at?: string;
}

export interface NotificationItem {
  id: string;
  user_id?: string;
  title: string;
  message: string;
  type: "task" | "academic" | "finance" | "habit" | "system";
  is_read: boolean;
  link?: string;
  created_at: string;
}
