import React, { useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  MapPin,
  Trash2,
  CheckCircle2
} from "lucide-react";
import type { Task, CalendarEvent } from "@/lib/supabase";

interface CalendarViewProps {
  tasks: Task[];
  events: CalendarEvent[];
  onOpenCreateEvent: (dateStr?: string) => void;
  onDeleteEvent: (id: string) => void;
  onToggleTaskStatus: (task: Task) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  tasks,
  events,
  onOpenCreateEvent,
  onDeleteEvent,
  onToggleTaskStatus
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState<string>(
    new Date().toISOString().slice(0, 10)
  );

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Adjust for Monday as first day of week: (firstDayIndex + 6) % 7
  const startOffset = (firstDayIndex + 6) % 7;

  const todayStr = new Date().toISOString().slice(0, 10);

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Selected date agenda
  const selectedDayTasks = tasks.filter(t => t.due_date === selectedDateStr);
  const selectedDayEvents = events.filter(e => e.event_date === selectedDateStr);

  return (
    <div>
      <div className="page-heading">
        <div>
          <p className="eyebrow">TIME & SCHEDULE ARCHITECTURE</p>
          <h2>Calendar & Deadlines</h2>
          <p className="muted">
            Visualize all scheduled commitments, exam milestones, project deadlines and personal events.
          </p>
        </div>
        <button className="primary" onClick={() => onOpenCreateEvent(selectedDateStr)}>
          <Plus size={16} /> Schedule Event
        </button>
      </div>

      <div className="dashboard-grid">
        {/* Month Calendar Grid */}
        <section className="panel">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ fontSize: 18 }}>
              {monthNames[month]} {year}
            </h3>
            <div style={{ display: "flex", gap: 6 }}>
              <button className="secondary" onClick={prevMonth} style={{ padding: "6px 10px" }}>
                <ChevronLeft size={16} />
              </button>
              <button
                className="secondary"
                onClick={() => {
                  setCurrentDate(new Date());
                  setSelectedDateStr(todayStr);
                }}
                style={{ padding: "6px 12px", fontSize: 12 }}
              >
                Today
              </button>
              <button className="secondary" onClick={nextMonth} style={{ padding: "6px 10px" }}>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          <div className="calendar-grid">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(d => (
              <div key={d} className="cal-header-cell">
                {d}
              </div>
            ))}

            {/* Leading empty cells */}
            {Array.from({ length: startOffset }).map((_, i) => (
              <div key={`empty-${i}`} style={{ minHeight: 74, opacity: 0.2 }} />
            ))}

            {/* Days in Month */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
              const isToday = dateStr === todayStr;
              const isSelected = dateStr === selectedDateStr;

              const dayTasks = tasks.filter(t => t.due_date === dateStr);
              const dayEvents = events.filter(e => e.event_date === dateStr);
              const totalItems = dayTasks.length + dayEvents.length;

              return (
                <div
                  key={dateStr}
                  className={`cal-cell ${isToday ? "today" : ""}`}
                  style={{
                    borderColor: isSelected ? "var(--accent)" : undefined,
                    boxShadow: isSelected ? "0 0 10px var(--accent-glow)" : undefined
                  }}
                  onClick={() => setSelectedDateStr(dateStr)}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span className="cal-date-num">{day}</span>
                    {totalItems > 0 && (
                      <span className="badge" style={{ padding: "1px 5px", fontSize: 9 }}>
                        {totalItems}
                      </span>
                    )}
                  </div>

                  {/* Badges preview */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 2, overflow: "hidden" }}>
                    {dayEvents.slice(0, 2).map(e => (
                      <div key={e.id} className="cal-event-pill">
                        {e.title}
                      </div>
                    ))}
                    {dayTasks.slice(0, 2).map(t => (
                      <div
                        key={t.id}
                        className="cal-event-pill"
                        style={{
                          background: t.status === "completed" ? "#11281e" : "#361a1f",
                          color: t.status === "completed" ? "#6ee7b7" : "#fca5a5"
                        }}
                      >
                        {t.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Selected Day Agenda Drilldown */}
        <section className="panel">
          <div className="panel-head">
            <div>
              <h3>Agenda for {selectedDateStr}</h3>
              <p className="muted">
                {selectedDateStr === todayStr ? "Today's commitments" : "Scheduled items for this date"}
              </p>
            </div>
            <button
              className="secondary"
              onClick={() => onOpenCreateEvent(selectedDateStr)}
              style={{ fontSize: 11, padding: "5px 10px" }}
            >
              <Plus size={13} /> Add
            </button>
          </div>

          {/* Events */}
          <div style={{ marginBottom: 20 }}>
            <h4 style={{ fontSize: 13, color: "var(--accent-light)", marginBottom: 10 }}>
              Calendar Events ({selectedDayEvents.length})
            </h4>
            {selectedDayEvents.length === 0 ? (
              <p className="muted" style={{ fontSize: 12 }}>No events scheduled.</p>
            ) : (
              selectedDayEvents.map(ev => (
                <div
                  key={ev.id}
                  style={{
                    padding: 10,
                    borderRadius: 8,
                    background: "var(--panel-alt)",
                    border: "1px solid var(--line)",
                    marginBottom: 8,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                >
                  <div>
                    <b style={{ fontSize: 13 }}>{ev.title}</b>
                    <div style={{ display: "flex", gap: 10, fontSize: 11, color: "var(--muted)", marginTop: 4 }}>
                      {ev.start_time && (
                        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <Clock size={12} /> {ev.start_time} {ev.end_time ? `- ${ev.end_time}` : ""}
                        </span>
                      )}
                      {ev.location && (
                        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <MapPin size={12} /> {ev.location}
                        </span>
                      )}
                      <span className="badge focus">{ev.category}</span>
                    </div>
                  </div>
                  <button className="icon-btn danger" onClick={() => onDeleteEvent(ev.id)}>
                    <Trash2 size={13} />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Tasks due */}
          <div>
            <h4 style={{ fontSize: 13, color: "var(--blue)", marginBottom: 10 }}>
              Tasks Due on this Date ({selectedDayTasks.length})
            </h4>
            {selectedDayTasks.length === 0 ? (
              <p className="muted" style={{ fontSize: 12 }}>No task deadlines on this day.</p>
            ) : (
              selectedDayTasks.map(t => (
                <div className="task-row" key={t.id}>
                  <button
                    className={`check ${t.status === "completed" ? "checked" : ""}`}
                    onClick={() => onToggleTaskStatus(t)}
                  >
                    <CheckCircle2 size={18} />
                  </button>
                  <div className="row-main">
                    <b className={t.status === "completed" ? "done" : ""}>{t.title}</b>
                    <small>{t.focus_area || "General"}</small>
                  </div>
                  <span className={`badge priority-${t.priority}`}>{t.priority}</span>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

