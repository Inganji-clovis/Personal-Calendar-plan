import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  generateSmartDailyPlan,
  scheduleAnchorsForDate,
  scoreTask,
  isGeneratedBlock,
  mergeWithStoredBlocks,
  saveScheduleOverride,
  GENERATED_BLOCK_PREFIX
} from "../smartPlanner";
import type { Task, DailyScheduleItem } from "../supabase";

function task(partial: Partial<Task> & { title: string }): Task {
  return {
    id: partial.id ?? partial.title,
    title: partial.title,
    description: null,
    status: partial.status ?? "pending",
    priority: partial.priority ?? "medium",
    due_date: partial.due_date ?? null,
    focus_area: partial.focus_area,
    session_type: partial.session_type
  };
}

// 2026-11-09 is a Monday, 2026-11-14 a Saturday, 2026-11-15 a Sunday.
const MONDAY = "2026-11-09";
const SATURDAY = "2026-11-14";
const SUNDAY = "2026-11-15";

describe("scheduleAnchorsForDate", () => {
  it("returns three anchors on weekdays", () => {
    const anchors = scheduleAnchorsForDate(MONDAY);
    expect(anchors.map((a) => a.session_type)).toEqual(["studio", "university", "home"]);
  });

  it("returns two anchors on Saturday and Sunday", () => {
    expect(scheduleAnchorsForDate(SATURDAY)).toHaveLength(2);
    expect(scheduleAnchorsForDate(SUNDAY)).toHaveLength(2);
  });
});

describe("scoreTask", () => {
  it("ranks overdue above due-today above future", () => {
    const overdue = scoreTask(task({ title: "a", due_date: "2026-11-01" }), MONDAY);
    const today = scoreTask(task({ title: "b", due_date: MONDAY }), MONDAY);
    const future = scoreTask(task({ title: "c", due_date: "2026-11-20" }), MONDAY);
    expect(overdue).toBeGreaterThan(today);
    expect(today).toBeGreaterThan(future);
  });

  it("returns -1 for completed and cancelled tasks", () => {
    expect(scoreTask(task({ title: "x", status: "completed" }), MONDAY)).toBe(-1);
    expect(scoreTask(task({ title: "y", status: "cancelled" }), MONDAY)).toBe(-1);
  });
});

describe("isGeneratedBlock", () => {
  it("detects generated ids", () => {
    expect(isGeneratedBlock(`${GENERATED_BLOCK_PREFIX}${MONDAY}-home`)).toBe(true);
    expect(isGeneratedBlock("3f9a-uuid")).toBe(false);
  });
});

describe("generateSmartDailyPlan", () => {
  // Freeze "now" to the start of the day so no block is auto-marked missed.
  const earlyMorning = new Date(`${MONDAY}T00:00:30`);

  it("always returns a ready plan without any manual input", () => {
    const plan = generateSmartDailyPlan({ dateStr: MONDAY, now: earlyMorning });
    expect(plan.length).toBe(3);
    expect(plan.every((b) => b.id.startsWith(GENERATED_BLOCK_PREFIX))).toBe(true);
    expect(plan.map((b) => b.start_time)).toEqual(["09:00", "17:00", "22:20"]);
  });

  it("folds an overdue task into the matching session block", () => {
    const plan = generateSmartDailyPlan({
      dateStr: MONDAY,
      now: earlyMorning,
      tasks: [
        task({
          title: "Finish DHCP lab report",
          due_date: "2026-11-01",
          session_type: "home",
          priority: "high"
        })
      ]
    });
    const home = plan.find((b) => b.session_type === "home")!;
    expect(home.priority).toBe("urgent");
    expect(home.why_it_matters).toContain("Finish DHCP lab report");
  });

  it("routes a studio-labelled task to the studio block only", () => {
    const plan = generateSmartDailyPlan({
      dateStr: MONDAY,
      now: earlyMorning,
      tasks: [task({ title: "Print banners", focus_area: "Iwacu Studio" })]
    });
    const studio = plan.find((b) => b.session_type === "studio")!;
    const home = plan.find((b) => b.session_type === "home")!;
    expect(studio.why_it_matters).toContain("Print banners");
    expect(home.why_it_matters).not.toContain("Print banners");
  });

  it("marks a finished block as missed when the day has moved on", () => {
    const lateEvening = new Date(`${MONDAY}T23:00:00`);
    const plan = generateSmartDailyPlan({ dateStr: MONDAY, now: lateEvening });
    const studio = plan.find((b) => b.session_type === "studio")!;
    expect(studio.status).toBe("missed");
  });

  it("notes an in-progress practical lab on the home block", () => {
    const plan = generateSmartDailyPlan({
      dateStr: MONDAY,
      now: earlyMorning,
      practicalLabs: [
        { id: "l1", title: "Linux permissions lab", discipline: "Linux", topic: "chmod", status: "in_progress" }
      ]
    });
    const home = plan.find((b) => b.session_type === "home")!;
    expect(home.notes).toContain("Linux permissions lab");
  });
});

describe("mergeWithStoredBlocks", () => {
  it("keeps generated plus same-day manual blocks and drops other dates", () => {
    const generated = generateSmartDailyPlan({
      dateStr: MONDAY,
      now: new Date(`${MONDAY}T00:00:30`)
    });
    const manual: DailyScheduleItem = {
      id: "manual-1",
      session_type: "home",
      title: "Manual block",
      start_time: "12:00",
      end_time: "13:00",
      scheduled_date: MONDAY,
      status: "scheduled",
      priority: "low"
    };
    const otherDay: DailyScheduleItem = { ...manual, id: "manual-2", scheduled_date: SUNDAY };
    const merged = mergeWithStoredBlocks(generated, [manual, otherDay], MONDAY);
    expect(merged).toHaveLength(generated.length + 1);
    expect(merged.some((b) => b.id === "manual-1")).toBe(true);
    expect(merged.some((b) => b.id === "manual-2")).toBe(false);
  });
});

describe("schedule overrides", () => {
  let store: Record<string, string>;

  beforeEach(() => {
    store = {};
    (globalThis as unknown as { window: unknown }).window = {
      localStorage: {
        getItem: (k: string) => store[k] ?? null,
        setItem: (k: string, v: string) => {
          store[k] = v;
        }
      }
    };
  });

  afterEach(() => {
    delete (globalThis as unknown as { window?: unknown }).window;
  });

  it("applies a persisted status override to the generated block", () => {
    const id = `${GENERATED_BLOCK_PREFIX}${MONDAY}-studio`;
    saveScheduleOverride(id, { status: "completed" });
    const plan = generateSmartDailyPlan({
      dateStr: MONDAY,
      now: new Date(`${MONDAY}T00:00:30`)
    });
    expect(plan.find((b) => b.id === id)!.status).toBe("completed");
  });

  it("drops a removed block from the plan", () => {
    const id = `${GENERATED_BLOCK_PREFIX}${MONDAY}-university`;
    saveScheduleOverride(id, { removed: true });
    const plan = generateSmartDailyPlan({
      dateStr: MONDAY,
      now: new Date(`${MONDAY}T00:00:30`)
    });
    expect(plan.some((b) => b.id === id)).toBe(false);
  });
});
