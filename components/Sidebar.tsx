import React from "react";
import type { User } from "@supabase/supabase-js";
import {
  LayoutDashboard,
  CalendarClock,
  CheckCircle2,
  FolderKanban,
  GraduationCap,
  Terminal,
  BookOpen,
  BriefcaseBusiness,
  CalendarDays,
  Target,
  Wallet,
  Bot,
  FileSpreadsheet,
  Bell,
  LogOut,
  X,
  Home,
  Building2,
  School,
} from "lucide-react";
import { SessionType } from "@/lib/supabase";

export type NavSection =
  | "Dashboard"
  | "Smart Planner"
  | "Tasks"
  | "Projects"
  | "IT Learning Hub"
  | "Practical Labs"
  | "Resource Library"
  | "Work & University"
  | "Calendar"
  | "Goals & Habits"
  | "Finance"
  | "AI Assistant"
  | "Reports"
  | "Notifications & Reminders"
  | "Learning"; // backward compat

interface SidebarProps {
  currentSection: NavSection;
  onSelectSection: (section: NavSection) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  user: User | null;
  onSignOut: () => void;
  tasksCount: { open: number; overdue: number };
  notificationsCount: number;
  activeSession?: SessionType;
  onSelectSession?: (session: SessionType) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentSection,
  onSelectSection,
  mobileOpen,
  onCloseMobile,
  user,
  onSignOut,
  tasksCount,
  notificationsCount,
  activeSession = "home",
  onSelectSession,
}) => {
  const mainNav: { label: NavSection; icon: any; badge?: number; badgeType?: "normal" | "danger" }[] = [
    { label: "Dashboard", icon: LayoutDashboard },
    { label: "Smart Planner", icon: CalendarClock },
    {
      label: "Tasks",
      icon: CheckCircle2,
      badge: tasksCount.overdue > 0 ? tasksCount.overdue : tasksCount.open > 0 ? tasksCount.open : undefined,
      badgeType: tasksCount.overdue > 0 ? "danger" : "normal",
    },
    { label: "Projects", icon: FolderKanban },
    { label: "IT Learning Hub", icon: GraduationCap },
    { label: "Practical Labs", icon: Terminal },
    { label: "Resource Library", icon: BookOpen },
    { label: "Work & University", icon: BriefcaseBusiness },
    { label: "Calendar", icon: CalendarDays },
    { label: "Goals & Habits", icon: Target },
    { label: "Finance", icon: Wallet },
    { label: "AI Assistant", icon: Bot },
    { label: "Reports", icon: FileSpreadsheet },
    {
      label: "Notifications & Reminders",
      icon: Bell,
      badge: notificationsCount > 0 ? notificationsCount : undefined,
      badgeType: "danger",
    },
  ];

  const sessions: { id: SessionType; label: string; icon: any; color: string }[] = [
    { id: "home", label: "Home", icon: Home, color: "text-emerald-400 border-emerald-500/30" },
    { id: "studio", label: "Studio", icon: Building2, color: "text-blue-400 border-blue-500/30" },
    { id: "university", label: "UoK", icon: School, color: "text-purple-400 border-purple-500/30" },
  ];

  return (
    <aside className={`sidebar ${mobileOpen ? "open" : ""}`}>
      <div className="side-brand">
        <div className="brand-mark small">I</div>
        <div>
          <b>INGANJI</b>
          <small>LIFE OS</small>
        </div>
        <button className="mobile-close" onClick={onCloseMobile} aria-label="Close menu">
          <X size={18} />
        </button>
      </div>

      {/* Session Switcher Pill Header */}
      {onSelectSession ? (
        <div className="px-3 pt-2 pb-3 border-b border-slate-800/80 mb-2">
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold tracking-wider uppercase mb-1.5 px-1">
            <span>Life Environment</span>
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
              {activeSession.toUpperCase()}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1 bg-slate-950/70 p-1 rounded-xl border border-slate-800/80">
            {sessions.map((sess) => {
              const Icon = sess.icon;
              const isSelected = activeSession === sess.id;
              return (
                <button
                  key={sess.id}
                  onClick={() => onSelectSession(sess.id)}
                  className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-lg text-[11px] font-medium transition-all ${
                    isSelected
                      ? "bg-slate-800 text-white shadow-sm " + sess.color
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                  }`}
                  title={`${sess.label} Session`}
                >
                  <Icon size={14} className="mb-0.5" />
                  <span>{sess.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      <p className="nav-caption">WORKSPACE & PLANNING</p>
      {mainNav.slice(0, 7).map((item) => {
        const Icon = item.icon;
        const isActive = currentSection === item.label || (item.label === "IT Learning Hub" && currentSection === "Learning");
        return (
          <button
            key={item.label}
            className={`nav-item ${isActive ? "active" : ""}`}
            onClick={() => {
              onSelectSection(item.label);
              onCloseMobile();
            }}
          >
            <Icon size={18} />
            <span>{item.label}</span>
            {item.badge !== undefined && (
              <span className={`nav-badge ${item.badgeType === "danger" ? "danger" : ""}`}>
                {item.badge}
              </span>
            )}
          </button>
        );
      })}

      <p className="nav-caption">OPERATIONS & FINANCE</p>
      {mainNav.slice(7).map((item) => {
        const Icon = item.icon;
        const isActive = currentSection === item.label;
        return (
          <button
            key={item.label}
            className={`nav-item ${isActive ? "active" : ""}`}
            onClick={() => {
              onSelectSection(item.label);
              onCloseMobile();
            }}
          >
            <Icon size={18} />
            <span>{item.label}</span>
            {item.badge !== undefined && (
              <span className={`nav-badge ${item.badgeType === "danger" ? "danger" : ""}`}>
                {item.badge}
              </span>
            )}
          </button>
        );
      })}

      <div className="side-bottom">
        <div className="user-chip">
          <div className="avatar">{(user?.email || "U")[0].toUpperCase()}</div>
          <div className="user-info">
            <b>{user?.email || "Signed In"}</b>
            <small>Personal Cloud RLS</small>
          </div>
        </div>
        <button className="nav-item" onClick={onSignOut}>
          <LogOut size={17} />
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  );
};
