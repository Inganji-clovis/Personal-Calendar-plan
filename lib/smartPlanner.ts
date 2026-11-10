/**
 * Smart Daily Planner engine for INGANJI LIFE OS
 *
 * Instead of asking the user to manually create study sessions or time blocks,
 * the application derives the whole day automatically:
 *   1. Fixed real-life commitments (Studio / University / Home) act as anchors.
 *   2. The user's live data (tasks, deadlines, projects, academic modules,
 *      practical labs) is scored and folded into the right anchor.
 *   3. The result is a ready-to-execute daily plan the user never had to build.
 *
 * The engine is a pure function of its inputs (apart from optional local
 * status overrides), which keeps it deterministic and easy to test.
 */

import type {
  Task,
  Project,
  AcademicModule,
  Goal,
  PracticalLab,
  DailyScheduleItem,
  SessionType,
  TaskPriority
} from "./supabase";
import { getRoadmapDay, getRoadmapWeek, type RoadmapDay } from "./careerRoadmap";

export const GENERATED_BLOCK_PREFIX = "auto-";

export interface SmartPlanInput {
  dateStr: string;
  tasks?: Task[];
  projects?: Project[];
  academicModules?: AcademicModule[];
  goals?: Goal[];
  practicalLabs?: Pick<PracticalLab, "id" | "title" | "status" | "discipline" | "topic">[];
  /** Manually selected day of the 45-day career roadmap (1–45). */
  roadmapDay?: number;
  /** Injectable clock so plans are deterministic in tests. */
  now?: Date;
}

/** User-driven tweaks (status, reschedule, removal) applied to generated blocks. */
export interface ScheduleOverride {
  status?: DailyScheduleItem["status"];
  scheduled_date?: string;
  start_time?: string;
  end_time?: string;
  title?: string;
  removed?: boolean;
}

export function isGeneratedBlock(id: string): boolean {
  return typeof id === "string" && id.startsWith(GENERATED_BLOCK_PREFIX);
}

// ---------------------------------------------------------------------------
// Override persistence (localStorage) — lets status changes survive reloads
// even though auto-generated blocks are never written to the database.
// ---------------------------------------------------------------------------

const OVERRIDE_KEY = "inganji_schedule_overrides";

export function loadScheduleOverrides(): Record<string, ScheduleOverride> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(OVERRIDE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, ScheduleOverride>) : {};
  } catch {
    return {};
  }
}

export function saveScheduleOverride(id: string, patch: ScheduleOverride): void {
  if (typeof window === "undefined") return;
  try {
    const all = loadScheduleOverrides();
    all[id] = { ...all[id], ...patch };
    window.localStorage.setItem(OVERRIDE_KEY, JSON.stringify(all));
  } catch {
    /* storage unavailable — changes are simply not persisted */
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function toMinutes(timeStr: string): number {
  const [h, m] = (timeStr || "0:0").split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
}

function daysBetween(fromISO: string, toISO: string): number {
  const from = new Date(`${fromISO}T00:00:00`);
  const to = new Date(`${toISO}T00:00:00`);
  return Math.round((to.getTime() - from.getTime()) / 86_400_000);
}

function sessionForTask(t: Task): SessionType {
  const s = (t.session_type || "").toLowerCase();
  if (s === "home" || s === "studio" || s === "university") return s as SessionType;
  const fa = (t.focus_area || "").toLowerCase();
  if (fa.includes("iwacu") || fa.includes("studio")) return "studio";
  if (fa.includes("university") || fa.includes("uok") || fa.includes("kigali")) return "university";
  return "home";
}

/** Higher score = more urgent to work on today. */
export function scoreTask(task: Task, todayStr: string): number {
  if (task.status === "completed" || task.status === "cancelled") return -1;
  let score = 10;
  if (task.due_date) {
    if (task.due_date < todayStr) score += 100;
    else if (task.due_date === todayStr) score += 60;
    else score += Math.max(0, 40 - Math.min(daysBetween(todayStr, task.due_date), 20) * 2);
  }
  switch (task.priority) {
    case "urgent":
      score += 40;
      break;
    case "high":
      score += 25;
      break;
    case "medium":
      score += 10;
      break;
    default:
      break;
  }
  return score;
}

interface Anchor {
  key: string;
  session_type: SessionType;
  title: string;
  start_time: string;
  end_time: string;
  why_it_matters: string;
  priority: TaskPriority;
  notes?: string | null;
}

/**
 * Fixed real-life commitments that structure every week.
 * These are intents, not a to-do list — the smart engine fills them with work.
 */
export function scheduleAnchorsForDate(dateStr: string): Anchor[] {
  const day = new Date(`${dateStr}T00:00:00`).getDay(); // 0=Sun … 6=Sat

  if (day >= 1 && day <= 5) {
    return [
      {
        key: "studio",
        session_type: "studio",
        title: "Iwacu Studio: Design & Production Operations",
        start_time: "09:00",
        end_time: "17:00",
        why_it_matters:
          "Client deliverables, UV/laser machine operation and print production",
        priority: "high",
        notes: "Departure from home ~08:30 depending on traffic."
      },
      {
        key: "university",
        session_type: "university",
        title: "University of Kigali: Lectures & Study",
        start_time: "17:00",
        end_time: "21:00",
        why_it_matters: "IT degree curriculum, lectures, assignments and exam preparation",
        priority: "urgent",
        notes: "Direct transit from Studio to campus."
      },
      {
        key: "home",
        session_type: "home",
        title: "Home Session: IT Roadmap & Practical Lab",
        start_time: "22:20",
        end_time: "23:59",
        why_it_matters: "Intensive IT skills mastery, code exercises and hands-on labs",
        priority: "high",
        notes: "Arrival home ~22:20. Focused learning session."
      }
    ];
  }

  if (day === 6) {
    return [
      {
        key: "sat-work",
        session_type: "studio",
        title: "Saturday Work Commitment",
        start_time: "09:00",
        end_time: "17:00",
        why_it_matters: "Professional work obligations and field assignments",
        priority: "high"
      },
      {
        key: "sat-home",
        session_type: "home",
        title: "Home Session: Software Projects & IT Labs",
        start_time: "18:30",
        end_time: "22:30",
        why_it_matters: "Full-stack development, server configuration and portfolio projects",
        priority: "medium"
      }
    ];
  }

  return [
    {
      key: "sun-studio",
      session_type: "studio",
      title: "Iwacu Studio: Production & Creative Work",
      start_time: "09:00",
      end_time: "17:00",
      why_it_matters: "Weekend creative projects, editing and equipment preparation",
      priority: "high"
    },
    {
      key: "sun-home",
      session_type: "home",
      title: "Home Session: Weekly Review & Planning",
      start_time: "18:30",
      end_time: "21:30",
      why_it_matters: "Weekly audit, budget review and study planning for the coming week",
      priority: "medium"
    }
  ];
}

function buildFocusNarrative(anchor: Anchor, focus: Task[], todayStr: string): string {
  const top = focus[0];
  const overdue = focus.filter((t) => t.due_date && t.due_date < todayStr).length;
  const parts = [`Auto-planned focus: ${top.title}`];
  if (focus[1]) parts.push(`next: ${focus[1].title}`);
  if (overdue > 0) {
    parts.push(`${overdue} overdue item${overdue > 1 ? "s" : ""} need catch-up`);
  }
  const base = anchor.why_it_matters.replace(/\.\s*$/, "");
  return `${base} · ${parts.join(" · ")}.`;
}

function mergeBlock(base: DailyScheduleItem, override?: ScheduleOverride): DailyScheduleItem {
  if (!override) return base;
  const { removed, ...patch } = override;
  void removed;
  return { ...base, ...patch };
}

/**
 * When a roadmap day is active, the Studio and Home anchors are filled with the
 * day's supervised practice and evening learning instead of generic intents —
 * this is what makes the career plan appear automatically in the schedule.
 */
function roadmapFocusForSession(
  anchor: Anchor,
  roadmap: RoadmapDay
): { title: string; why: string; notes: string } | null {
  if (anchor.session_type === "studio") {
    return {
      title: `Iwacu Studio · Day ${roadmap.day}: Supervised Practice`,
      why: roadmap.studio,
      notes: `Studio practice: ${roadmap.studio}`
    };
  }
  if (anchor.session_type === "home") {
    return {
      title: `Home Session · Day ${roadmap.day}: ${getRoadmapWeek(roadmap.day).title}`,
      why: roadmap.evening,
      notes: `Evening learning: ${roadmap.evening} • Evidence: ${roadmap.evidence}`
    };
  }
  return null;
}

// ---------------------------------------------------------------------------
// Main entry point
// ---------------------------------------------------------------------------

export function generateSmartDailyPlan(input: SmartPlanInput): DailyScheduleItem[] {
  const { dateStr } = input;
  const now = input.now ?? new Date();
  const todayStr = now.toISOString().slice(0, 10);
  const overrides = loadScheduleOverrides();

  const pendingTasks = (input.tasks ?? []).filter(
    (t) => t.status !== "completed" && t.status !== "cancelled"
  );

  // Group pending work by the session it belongs to, most urgent first.
  const pools: Record<SessionType, Task[]> = { home: [], studio: [], university: [] };
  for (const task of pendingTasks) pools[sessionForTask(task)].push(task);
  (Object.keys(pools) as SessionType[]).forEach((k) =>
    pools[k].sort((a, b) => scoreTask(b, todayStr) - scoreTask(a, todayStr))
  );

  const activeLabs = (input.practicalLabs ?? []).filter((l) => l.status === "in_progress");
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const roadmap = input.roadmapDay ? getRoadmapDay(input.roadmapDay) : undefined;

  const blocks: DailyScheduleItem[] = scheduleAnchorsForDate(dateStr).map((anchor) => {
    const focus = pools[anchor.session_type].slice(0, 3);
    const block: DailyScheduleItem = {
      id: `${GENERATED_BLOCK_PREFIX}${dateStr}-${anchor.key}`,
      session_type: anchor.session_type,
      title: anchor.title,
      start_time: anchor.start_time,
      end_time: anchor.end_time,
      scheduled_date: dateStr,
      why_it_matters: anchor.why_it_matters,
      status: "scheduled",
      priority: anchor.priority,
      notes: anchor.notes ?? null
    };

    const roadmapFocus = roadmap ? roadmapFocusForSession(anchor, roadmap) : null;
    if (roadmapFocus) {
      block.title = roadmapFocus.title;
      block.why_it_matters = roadmapFocus.why;
      block.notes = roadmapFocus.notes;
    }

    if (focus.length > 0) {
      const taskList = focus.map((t) => t.title).join(" • ");
      block.notes = block.notes ? `${block.notes} • Priority tasks: ${taskList}` : taskList;
      block.why_it_matters = roadmapFocus
        ? `${block.why_it_matters} · Top priority task: ${focus[0].title}`
        : buildFocusNarrative(anchor, focus, todayStr);
      if (
        focus.some(
          (t) => t.priority === "urgent" || (t.due_date != null && t.due_date < todayStr)
        )
      ) {
        block.priority = "urgent";
      }
    }

    if (anchor.session_type === "home" && activeLabs.length > 0) {
      const lab = activeLabs[0];
      const labNote = `Lab in progress: ${lab.title}`;
      block.notes = block.notes ? `${block.notes} • ${labNote}` : labNote;
    }

    // Self-heal: a past block that was never executed is surfaced as "missed".
    const isPast =
      dateStr < todayStr || (dateStr === todayStr && nowMinutes > toMinutes(anchor.end_time));
    if (isPast) block.status = "missed";

    return mergeBlock(block, overrides[block.id]);
  });

  return blocks
    .filter((b) => !overrides[b.id]?.removed && b.scheduled_date === dateStr)
    .sort((a, b) => toMinutes(a.start_time) - toMinutes(b.start_time));
}

/**
 * Combines the auto-generated plan with any blocks the user created manually
 * for the same day, so automation stays the default without blocking control.
 */
export function mergeWithStoredBlocks(
  generated: DailyScheduleItem[],
  stored: DailyScheduleItem[],
  dateStr: string
): DailyScheduleItem[] {
  const manualToday = (stored || []).filter(
    (b) => b.scheduled_date === dateStr && !isGeneratedBlock(b.id)
  );
  return [...generated, ...manualToday].sort(
    (a, b) => toMinutes(a.start_time) - toMinutes(b.start_time)
  );
}
