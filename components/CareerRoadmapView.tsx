import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  Compass,
  Clock,
  Wrench,
  GraduationCap,
  ListChecks,
  BookOpen,
  ExternalLink,
  Target,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import {
  ROADMAP_DAYS,
  ROADMAP_WEEKS,
  DAILY_TIMETABLE,
  TIMETABLE_NOTES,
  COURSE_RESOURCES,
  EMPLOYABILITY_TRACKS,
  PORTFOLIO_DELIVERABLES,
  DAY45_ASSESSMENT,
  EVIDENCE_LOG_FIELDS,
  SAFETY_RULES,
  ROADMAP_DISCLAIMER,
  OPERATING_PRINCIPLE,
  ROADMAP_TOTAL_DAYS,
  clampRoadmapDay,
  getRoadmapDay,
  getRoadmapWeek
} from "@/lib/careerRoadmap";
import { EQUIPMENT_CATALOG, STARTER_CONTENT_COUNTS } from "@/lib/studySupport";

interface CareerRoadmapViewProps {
  roadmapDay: number;
  onSelectDay: (day: number) => void;
}

export const CareerRoadmapView: React.FC<CareerRoadmapViewProps> = ({ roadmapDay, onSelectDay }) => {
  const day = getRoadmapDay(roadmapDay);
  const week = getRoadmapWeek(roadmapDay);

  const go = (delta: number) => onSelectDay(clampRoadmapDay(roadmapDay + delta));
  const progressPct = Math.round((roadmapDay / ROADMAP_TOTAL_DAYS) * 100);

  return (
    <div>
      {/* Page heading */}
      <div className="page-heading">
        <div>
          <p className="eyebrow">45-DAY PROFESSIONAL CAREER SPRINT</p>
          <h2>Career Roadmap</h2>
          <p className="muted">
            IT Support + Digital Operations/Assistant + Digital Marketing, supported by creative production.
            Select the day you are on — the Smart Planner fills your Studio and Home sessions from it automatically.
          </p>
        </div>
        <div className="header-actions">
          <span className="badge status-active" style={{ fontSize: 12 }}>
            Day {roadmapDay} of {ROADMAP_TOTAL_DAYS} · {progressPct}%
          </span>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="info-banner" style={{ marginBottom: 20 }}>
        <div>
          <b>Realistic scope</b>
          <p style={{ marginTop: 2, fontSize: 12 }}>{ROADMAP_DISCLAIMER}</p>
        </div>
      </div>

      {/* Manual day selector */}
      <section className="panel" style={{ marginBottom: 20 }}>
        <div className="panel-head">
          <div>
            <h3>Manual Day Selector</h3>
            <p className="muted">Choose the roadmap day you are currently on (Day 1–{ROADMAP_TOTAL_DAYS})</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button className="icon-btn" onClick={() => go(-1)} disabled={roadmapDay <= 1} title="Previous day">
              <ChevronLeft size={16} />
            </button>
            <input
              type="number"
              min={1}
              max={ROADMAP_TOTAL_DAYS}
              value={roadmapDay}
              onChange={(e) => onSelectDay(clampRoadmapDay(Number(e.target.value)))}
              style={{ width: 70, textAlign: "center" }}
            />
            <button className="icon-btn" onClick={() => go(1)} disabled={roadmapDay >= ROADMAP_TOTAL_DAYS} title="Next day">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(40px, 1fr))", gap: 6 }}>
          {Array.from({ length: ROADMAP_TOTAL_DAYS }, (_, i) => i + 1).map((d) => {
            const active = d === roadmapDay;
            const w = getRoadmapWeek(d);
            return (
              <button
                key={d}
                onClick={() => onSelectDay(d)}
                title={`${w.label} · Day ${d}`}
                style={{
                  padding: "8px 0",
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 600,
                  border: `1px solid ${active ? "var(--accent)" : "var(--line)"}`,
                  background: active ? "var(--accent)" : "var(--panel-alt)",
                  color: active ? "#04120c" : "var(--text)",
                  cursor: "pointer"
                }}
              >
                {d}
              </button>
            );
          })}
        </div>
      </section>

      {/* Current day detail */}
      <section
        className="panel"
        style={{
          background: "radial-gradient(ellipse at top left, #122c20 0%, #0c141c 70%)",
          border: "1px solid #1e3a2b",
          marginBottom: 20
        }}
      >
        <div className="panel-head" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div>
            <span className="eyebrow" style={{ color: "var(--accent-light)", margin: 0 }}>
              {week.label} · DAY {day.day}
            </span>
            <h3 style={{ marginTop: 4 }}>{week.title}</h3>
          </div>
          <Compass size={22} style={{ color: "var(--accent-light)" }} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14 }}>
          <div style={{ background: "var(--panel-alt)", border: "1px solid var(--line)", borderRadius: 10, padding: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <Wrench size={16} style={{ color: "#6ee7b7" }} />
              <b style={{ fontSize: 13 }}>Studio — Supervised Practice</b>
            </div>
            <p className="muted" style={{ fontSize: 12.5, margin: 0 }}>{day.studio}</p>
          </div>

          <div style={{ background: "var(--panel-alt)", border: "1px solid var(--line)", borderRadius: 10, padding: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <GraduationCap size={16} style={{ color: "#7dd3fc" }} />
              <b style={{ fontSize: 13 }}>Evening — Professional Learning</b>
            </div>
            <p className="muted" style={{ fontSize: 12.5, margin: 0 }}>{day.evening}</p>
          </div>

          <div style={{ background: "var(--panel-alt)", border: "1px solid var(--line)", borderRadius: 10, padding: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <ListChecks size={16} style={{ color: "#fbbf24" }} />
              <b style={{ fontSize: 13 }}>Evidence / Output</b>
            </div>
            <p className="muted" style={{ fontSize: 12.5, margin: 0 }}>{day.evidence}</p>
          </div>
        </div>

        <p className="muted" style={{ fontSize: 12, marginTop: 14 }}>
          <Sparkles size={13} style={{ verticalAlign: -2 }} /> The Smart Planner now carries this day's Studio and
          Home sessions automatically. Nothing to create manually.
        </p>
      </section>

      {/* Daily operating timetable */}
      <section className="panel" style={{ marginBottom: 20 }}>
        <div className="panel-head">
          <div>
            <h3>Daily Operating Timetable</h3>
            <p className="muted">Evening learning target session: 22:40–00:10</p>
          </div>
          <Clock size={20} style={{ color: "var(--accent-light)" }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {DAILY_TIMETABLE.map((phase) => (
            <div
              key={phase.time}
              style={{
                display: "flex",
                gap: 16,
                padding: 14,
                background: "var(--panel-alt)",
                border: "1px solid var(--line)",
                borderRadius: 10
              }}
            >
              <b style={{ width: 120, flexShrink: 0, fontSize: 13, color: "var(--accent-light)" }}>{phase.time}</b>
              <div>
                <b style={{ fontSize: 13 }}>{phase.activity}</b>
                <p className="muted" style={{ fontSize: 11.5, margin: "4px 0 0" }}>Evidence: {phase.evidence}</p>
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12, marginTop: 16 }}>
          {[TIMETABLE_NOTES.studioWork, TIMETABLE_NOTES.lateDay, TIMETABLE_NOTES.sessionSeparation].map((note, i) => (
            <div key={i} style={{ background: "var(--panel-alt)", border: "1px solid var(--line)", borderRadius: 10, padding: 14 }}>
              <p className="muted" style={{ fontSize: 11.5, margin: 0 }}>{note}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Full 45-day plan */}
      <section className="panel" style={{ marginBottom: 20 }}>
        <div className="panel-head">
          <div>
            <h3>The Integrated 45-Day Plan</h3>
            <p className="muted">Each day pairs a Studio skill with an evening course/lab and a concrete evidence output</p>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {ROADMAP_WEEKS.map((w) => (
            <div key={w.week}>
              <p className="eyebrow" style={{ marginBottom: 8 }}>
                {w.label} — {w.title}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {ROADMAP_DAYS.filter((d) => d.week === w.week).map((d) => {
                  const active = d.day === roadmapDay;
                  return (
                    <div
                      key={d.day}
                      onClick={() => onSelectDay(d.day)}
                      style={{
                        display: "flex",
                        gap: 14,
                        padding: 12,
                        borderRadius: 10,
                        cursor: "pointer",
                        background: active ? "#0f2219" : "var(--panel-alt)",
                        border: `1px solid ${active ? "var(--accent)" : "var(--line)"}`
                      }}
                    >
                      <b
                        style={{
                          width: 44,
                          flexShrink: 0,
                          fontSize: 13,
                          color: active ? "var(--accent-light)" : "var(--muted)"
                        }}
                      >
                        Day {d.day}
                      </b>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 12.5, margin: 0 }}>
                          <b>Studio:</b> <span className="muted">{d.studio}</span>
                        </p>
                        <p style={{ fontSize: 12.5, margin: "3px 0 0" }}>
                          <b>Evening:</b> <span className="muted">{d.evening}</span>
                        </p>
                        <p style={{ fontSize: 11.5, margin: "3px 0 0", color: "var(--accent-light)" }}>
                          Evidence: {d.evidence}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Courses & learning resources */}
      <section className="panel" style={{ marginBottom: 20 }}>
        <div className="panel-head">
          <div>
            <h3>Professional Courses &amp; Learning Resources</h3>
            <p className="muted">Official providers where possible. Verify current eligibility, fees and access before enrolling.</p>
          </div>
          <BookOpen size={20} style={{ color: "var(--accent-light)" }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 14 }}>
          {COURSE_RESOURCES.map((c) => (
            <div
              key={c.provider}
              style={{
                background: "var(--panel-alt)",
                border: "1px solid var(--line)",
                borderRadius: 10,
                padding: 16,
                display: "flex",
                flexDirection: "column",
                gap: 8
              }}
            >
              <span className="badge focus" style={{ alignSelf: "flex-start" }}>{c.category}</span>
              <b style={{ fontSize: 13.5 }}>{c.provider}</b>
              <p className="muted" style={{ fontSize: 12, margin: 0, flex: 1 }}>{c.summary}</p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                <span className="muted" style={{ fontSize: 11 }}>{c.cost}</span>
                <a
                  className="text-btn"
                  href={c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12 }}
                >
                  Open <ExternalLink size={13} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Equipment & setup requirements */}
      <section className="panel" style={{ marginBottom: 20 }}>
        <div className="panel-head">
          <div>
            <h3>Equipment &amp; Setup Requirements</h3>
            <p className="muted">
              Everything needed to run the sprint. Software, hardware and studio equipment. Loaded automatically into
              your Resource Library.
            </p>
          </div>
          <Wrench size={20} style={{ color: "var(--accent-light)" }} />
        </div>

        <div className="info-banner" style={{ marginBottom: 14 }}>
          <div>
            <b>Starter study library loaded</b>
            <p style={{ marginTop: 2, fontSize: 12 }}>
              The app provides {STARTER_CONTENT_COUNTS.labs} practical labs, {STARTER_CONTENT_COUNTS.notes} study notes,{" "}
              {STARTER_CONTENT_COUNTS.courses} courses and {STARTER_CONTENT_COUNTS.equipment} equipment items — find them
              in Practical Labs and the Resource Library. Labs start at “Not Started”: you perform and evidence them.
            </p>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
          {EQUIPMENT_CATALOG.map((e) => {
            const reqColor =
              e.requirement === "Required" ? "status-active" : e.requirement === "Studio-provided" ? "status-planned" : "status-completed";
            return (
              <div
                key={e.name}
                style={{
                  background: "var(--panel-alt)",
                  border: "1px solid var(--line)",
                  borderRadius: 10,
                  padding: 16,
                  display: "flex",
                  flexDirection: "column",
                  gap: 8
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                  <span className="badge focus" style={{ alignSelf: "flex-start" }}>{e.category}</span>
                  <span className={`badge ${reqColor}`}>{e.requirement}</span>
                </div>
                <b style={{ fontSize: 13.5 }}>{e.name}</b>
                <p className="muted" style={{ fontSize: 12, margin: 0, flex: 1 }}>{e.purpose}</p>
                {e.notes ? (
                  <p style={{ fontSize: 11.5, margin: 0, color: "#fb7185" }}>{e.notes}</p>
                ) : null}
                <span className="muted" style={{ fontSize: 11, borderTop: "1px solid var(--line)", paddingTop: 8 }}>
                  Cost: {e.cost}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Employability tracks + portfolio */}
      <section className="panel" style={{ marginBottom: 20 }}>
        <div className="panel-head">
          <div>
            <h3>What to Prioritize for Employability</h3>
            <p className="muted">Tracks and creative production advantage</p>
          </div>
          <Target size={20} style={{ color: "var(--accent-light)" }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14 }}>
          {EMPLOYABILITY_TRACKS.map((t) => (
            <div key={t.title} style={{ background: "var(--panel-alt)", border: "1px solid var(--line)", borderRadius: 10, padding: 16 }}>
              <span className="badge status-planned">{t.track}</span>
              <b style={{ fontSize: 13, display: "block", margin: "8px 0 6px" }}>{t.title}</b>
              <p className="muted" style={{ fontSize: 12, margin: 0 }}>{t.detail}</p>
            </div>
          ))}
        </div>

        <p className="eyebrow" style={{ marginTop: 20, marginBottom: 10 }}>PORTFOLIO DELIVERABLES BY DAY 45</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {PORTFOLIO_DELIVERABLES.map((p) => (
            <div key={p.area} style={{ display: "flex", gap: 12, padding: 12, background: "var(--panel-alt)", border: "1px solid var(--line)", borderRadius: 10 }}>
              <b style={{ width: 190, flexShrink: 0, fontSize: 12.5 }}>{p.area}</b>
              <span className="muted" style={{ fontSize: 12.5 }}>{p.detail}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Assessment + evidence log + safety */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
        <section className="panel">
          <div className="panel-head">
            <div>
              <h3>Day 45 Assessment</h3>
              <p className="muted">You should be able to demonstrate each item</p>
            </div>
            <ListChecks size={20} style={{ color: "var(--accent-light)" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {DAY45_ASSESSMENT.map((item) => (
              <div key={item} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <ShieldCheck size={15} style={{ color: "var(--accent-light)", flexShrink: 0, marginTop: 2 }} />
                <span className="muted" style={{ fontSize: 12.5 }}>{item}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="panel">
          <div className="panel-head">
            <div>
              <h3>Evidence Log Template</h3>
              <p className="muted">Record every activity with these fields</p>
            </div>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {EVIDENCE_LOG_FIELDS.map((f) => (
              <span key={f} className="badge status-planned" style={{ fontSize: 11 }}>{f}</span>
            ))}
          </div>
          <p className="muted" style={{ fontSize: 12, marginTop: 14 }}>
            <b style={{ color: "var(--text)" }}>Operating principle:</b> {OPERATING_PRINCIPLE}
          </p>
        </section>
      </div>

      <section className="panel" style={{ marginTop: 20, borderColor: "#3a2a2a" }}>
        <div className="panel-head">
          <div>
            <h3>Studio Safety &amp; Professional Quality</h3>
            <p className="muted">Non-negotiable workshop rules</p>
          </div>
          <ShieldCheck size={20} style={{ color: "#fb7185" }} />
        </div>
        <p className="muted" style={{ fontSize: 12.5, margin: 0 }}>{SAFETY_RULES}</p>
      </section>
    </div>
  );
};
