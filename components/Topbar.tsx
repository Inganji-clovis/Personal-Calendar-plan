import React from "react";
import type { User } from "@supabase/supabase-js";
import { Menu, Search, Bell, Plus } from "lucide-react";
import type { NavSection } from "./Sidebar";

interface TopbarProps {
  currentSection: NavSection;
  onOpenMobile: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  unreadAlertsCount: number;
  onOpenNotifications: () => void;
  onQuickAdd: () => void;
  user: User | null;
}

export const Topbar: React.FC<TopbarProps> = ({
  currentSection,
  onOpenMobile,
  searchQuery,
  onSearchChange,
  unreadAlertsCount,
  onOpenNotifications,
  onQuickAdd,
  user
}) => {
  return (
    <header className="topbar">
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <button className="menu-btn" onClick={onOpenMobile} aria-label="Open menu">
          <Menu size={22} />
        </button>
        <div className="crumb">
          Workspace <span>/</span> <b>{currentSection}</b>
        </div>
      </div>

      <div className="top-actions">
        <div className="searchbox">
          <Search size={15} />
          <input
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            placeholder={`Search in ${currentSection}...`}
          />
        </div>

        <button className="primary" onClick={onQuickAdd} style={{ padding: "8px 14px", fontSize: "12px" }}>
          <Plus size={16} />
          <span>Quick Add</span>
        </button>

        <button
          className="notification-btn"
          onClick={onOpenNotifications}
          aria-label="Notifications"
          title="System Alerts & Notifications"
        >
          <Bell size={18} />
          {unreadAlertsCount > 0 && <span className="badge-dot" />}
        </button>

        <div className="avatar" title={user?.email || "User"}>
          {(user?.email || "U")[0].toUpperCase()}
        </div>
      </div>
    </header>
  );
};

