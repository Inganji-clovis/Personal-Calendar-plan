import React, { useState } from "react";
import {
  Target,
  Plus,
  Trash2,
  CheckCircle2,
  Award,
  Zap,
  TrendingUp,
  Clock3
} from "lucide-react";
import type { Habit, HabitLog, Goal } from "@/lib/supabase";

interface GoalsHabitsViewProps {
  habits: Habit[];
  habitLogs: HabitLog[];
  goals: Goal[];
  onOpenCreateHabit: () => void;
  onOpenCreateGoal: () => void;
  onToggleHabitDay: (habitId: string, dateStr: string) => void;
  onDeleteHabit: (id: string) => void;
  onUpdateGoalProgress: (goal: Goal, newVal: number) => void;
  onDeleteGoal: (id: string) => void;
}

export const GoalsHabitsView: React.FC<GoalsHabitsViewProps> = ({
  habits,
  habitLogs,
  goals,
  onOpenCreateHabit,
  onOpenCreateGoal,
  onToggleHabitDay,
  onDeleteHabit,
  onUpdateGoalProgress,
  onDeleteGoal
}) => {
  // Generate current week dates (Mon to Sun)
  const now = new Date();
  const currentDayOfWeek = (now.getDay() + 6) % 7; // 0 is Mon, 6 is Sun
  const monday = new Date(now);
  monday.setDate(now.getDate() - currentDayOfWeek);

  const weekDays = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const dateStr = d.toISOString().slice(0, 10);
    const names = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    return {
      dayName: names[i],
      dateNum: d.getDate(),
      dateStr,
      isToday: dateStr === now.toISOString().slice(0, 10)
    };
  });

  return (
    <div>
      <div className="page-heading">
        <div>
          <p className="eyebrow">DISCIPLINE & ASPIRATIONS</p>
          <h2>Goals & Daily Habits</h2>
          <p className="muted">
            Build unshakeable daily routines and track progress toward your highest personal and technical ambitions.
          </p>
        </div>
        <div className="header-actions">
          <button className="secondary" onClick={onOpenCreateHabit}>
            <Plus size={15} /> Add Habit
          </button>
          <button className="primary" onClick={onOpenCreateGoal}>
            <Plus size={15} /> Set Strategic Goal
          </button>
        </div>
      </div>

      {/* Habits Section */}
      <section className="panel">
        <div className="panel-head">
          <div>
            <h3>Weekly Habit Consistency Tracker</h3>
            <p className="muted">Click any day circle to toggle completion</p>
          </div>
          <button className="secondary" onClick={onOpenCreateHabit} style={{ fontSize: 11 }}>
            <Plus size={13} /> New Habit
          </button>
        </div>

        {habits.length === 0 ? (
          <div className="empty">
            <Zap size={28} />
            <b>No daily habits configured</b>
            <p className="muted">Build consistency by adding habits like "2h Coding Lab", "Morning Workout", or "Read Tech Docs".</p>
            <button className="primary" onClick={onOpenCreateHabit} style={{ marginTop: 10 }}>
              <Plus size={14} /> Add First Habit
            </button>
          </div>
        ) : (
          <div>
            {/* Header row with day labels */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "8px 0 14px",
                borderBottom: "1px solid var(--line)"
              }}
            >
              <div style={{ flex: 1 }}>
                <b style={{ fontSize: 12, color: "var(--muted)" }}>HABIT & ROUTINE</b>
              </div>
              <div className="habit-days" style={{ marginRight: 40 }}>
                {weekDays.map(d => (
                  <div
                    key={d.dateStr}
                    style={{
                      width: 30,
                      textAlign: "center",
                      fontSize: 10,
                      fontWeight: 700,
                      color: d.isToday ? "var(--accent-light)" : "var(--muted)"
                    }}
                  >
                    {d.dayName}
                  </div>
                ))}
              </div>
            </div>

            {/* Habit Rows */}
            {habits.map(habit => {
              // Calculate weekly completed count
              const completedThisWeek = weekDays.filter(d =>
                habitLogs.some(l => l.habit_id === habit.id && l.log_date === d.dateStr && l.completed)
              ).length;

              return (
                <div className="habit-row" key={habit.id}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <b style={{ fontSize: 13 }}>{habit.title}</b>
                    <small className="muted" style={{ display: "block" }}>
                      {habit.category} · {completedThisWeek}/7 this week
                    </small>
                  </div>

                  <div className="habit-days">
                    {weekDays.map(d => {
                      const isDone = habitLogs.some(
                        l => l.habit_id === habit.id && l.log_date === d.dateStr && l.completed
                      );
                      return (
                        <button
                          key={d.dateStr}
                          className={`day-circle ${isDone ? "done" : ""}`}
                          onClick={() => onToggleHabitDay(habit.id, d.dateStr)}
                          title={`${habit.title} - ${d.dateStr}: ${isDone ? "Completed" : "Not completed"}`}
                        >
                          {isDone ? "✓" : d.dateNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    className="icon-btn danger"
                    onClick={() => onDeleteHabit(habit.id)}
                    title="Delete habit"
                    style={{ marginLeft: 8 }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Strategic Goals Section */}
      <section className="panel">
        <div className="panel-head">
          <div>
            <h3>Strategic Milestones & Long-Term Goals</h3>
            <p className="muted">Measurable targets across career, university, projects, and personal health</p>
          </div>
          <button className="secondary" onClick={onOpenCreateGoal} style={{ fontSize: 11 }}>
            <Plus size={13} /> New Goal
          </button>
        </div>

        {goals.length === 0 ? (
          <div className="empty">
            <Target size={28} />
            <b>No goals established yet</b>
            <p className="muted">Define target milestones like "Deploy Home Session v1", "Achieve 3.8 GPA at UoK", or "Save 1,000,000 RWF".</p>
            <button className="primary" onClick={onOpenCreateGoal} style={{ marginTop: 10 }}>
              <Plus size={14} /> Define First Goal
            </button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
            {goals.map(goal => {
              const target = Number(goal.target_value) || 100;
              const current = Number(goal.current_value) || 0;
              const pct = Math.min(100, Math.round((current / target) * 100));

              return (
                <div
                  key={goal.id}
                  style={{
                    background: "var(--panel-alt)",
                    border: "1px solid var(--line)",
                    borderRadius: 12,
                    padding: 18,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between"
                  }}
                >
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <span className="badge focus">{goal.category}</span>
                      <button className="icon-btn danger" onClick={() => onDeleteGoal(goal.id)}>
                        <Trash2 size={13} />
                      </button>
                    </div>

                    <h4 style={{ fontSize: 15, margin: "10px 0 6px" }}>{goal.title}</h4>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--muted)", margin: "8px 0 4px" }}>
                      <span>Target: {target} {goal.unit}</span>
                      <b style={{ color: "var(--accent-light)" }}>{current} / {target} ({pct}%)</b>
                    </div>

                    <div className="progress-bar-bg" style={{ margin: "6px 0 12px" }}>
                      <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
                    </div>

                    {goal.deadline && (
                      <p className="muted" style={{ fontSize: 11 }}>
                        Target Date: {goal.deadline}
                      </p>
                    )}
                  </div>

                  {/* Progress quick buttons */}
                  <div style={{ display: "flex", gap: 8, marginTop: 12, paddingTop: 10, borderTop: "1px solid var(--line)" }}>
                    <button
                      className="secondary"
                      onClick={() => onUpdateGoalProgress(goal, Math.max(0, current - 5))}
                      style={{ padding: "4px 8px", fontSize: 11 }}
                    >
                      - 5
                    </button>
                    <button
                      className="secondary"
                      onClick={() => onUpdateGoalProgress(goal, current + 5)}
                      style={{ padding: "4px 8px", fontSize: 11 }}
                    >
                      + 5
                    </button>
                    <button
                      className="primary"
                      onClick={() => onUpdateGoalProgress(goal, target)}
                      style={{ padding: "4px 10px", fontSize: 11, marginLeft: "auto" }}
                    >
                      Achieved ✓
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

