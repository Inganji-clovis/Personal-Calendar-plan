import React from "react";
import type { User } from "@supabase/supabase-js";
import {
  LayoutDashboard,
  CheckCircle2,
  FolderKanban,
  GraduationCap,
  BriefcaseBusiness,
  CalendarDays,
  Target,
  Wallet,
  FileSpreadsheet,
  Bell,
  LogOut,
  X,
  Sparkles
} from "lucide-react";

export type NavSection =
  | "Dashboard"
  | "Tasks"
  | "Projects"
  | "Learning"
  | "Work & University"
  | "Calendar"
  | "Goals & Habits"
  | "Finance"
  | "Reports"
  | "Notifications & Reminders";

interface SidebarProps {
  currentSection: NavSection;
  onSelectSection: (section: NavSection) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  user: User | null;
  onSignOut: () => void;
  tasksCount: { open: number; overdue: number };
  notificationsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentSection,
  onSelectSection,
  mobileOpen,
  onCloseMobile,
  user,
  onSignOut,
  tasksCount,
  notificationsCount
}) => {
  const mainNav: { label: NavSection; icon: any; badge?: number; badgeType?: "normal" | "danger" }[] = [
    { label: "Dashboard", icon: LayoutDashboard },
    {
      label: "Tasks",
      icon: CheckCircle2,
      badge: tasksCount.overdue > 0 ? tasksCount.overdue : tasksCount.open > 0 ? tasksCount.open : undefined,
      badgeType: tasksCount.overdue > 0 ? "danger" : "normal"
    },
    { label: "Projects", icon: FolderKanban },
    { label: "Learning", icon: GraduationCap },
    { label: "Work & University", icon: BriefcaseBusiness },
    { label: "Calendar", icon: CalendarDays },
    { label: "Goals & Habits", icon: Target },
    { label: "Finance", icon: Wallet },
    { label: "Reports", icon: FileSpreadsheet },
    {
      label: "Notifications & Reminders",
      icon: Bell,
      badge: notificationsCount > 0 ? notificationsCount : undefined,
      badgeType: "danger"
    }
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

      <p className="nav-caption">WORKSPACE</p>
      {mainNav.slice(0, 5).map(item => {
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

      <p className="nav-caption">PRODUCTIVITY & FINANCE</p>
      {mainNav.slice(5).map(item => {
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
          <div className="avatar">
            {(user?.email || "U")[0].toUpperCase()}
          </div>
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

