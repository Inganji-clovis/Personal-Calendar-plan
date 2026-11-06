import React from "react";
import { X, AlertTriangle, AlertCircle, Info, CheckCircle2, ArrowRight, Settings } from "lucide-react";
import type { ComputedAlert } from "@/lib/notifications";
import type { NavSection } from "./Sidebar";

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  alerts: ComputedAlert[];
  onNavigate: (section: NavSection) => void;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({
  isOpen,
  onClose,
  alerts,
  onNavigate
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal" style={{ width: "min(100%, 500px)" }}>
        <div className="modal-head">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div className="stat-icon red" style={{ width: 34, height: 34, margin: 0 }}>
              <AlertTriangle size={18} />
            </div>
            <div>
              <h3 style={{ margin: 0 }}>Notification Center</h3>
              <p className="muted" style={{ margin: 0, fontSize: 11 }}>
                Real-time alerts from your active workspace data
              </p>
            </div>
          </div>
          <button className="icon-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {alerts.length === 0 ? (
          <div className="empty">
            <CheckCircle2 size={32} color="#34d399" />
            <b>All systems clear!</b>
            <p className="muted">No overdue tasks, budget alerts, or pending notifications.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: 380, overflowY: "auto" }}>
            {alerts.map(alert => {
              const isUrgent = alert.severity === "urgent";
              const isWarning = alert.severity === "warning";
              return (
                <div
                  key={alert.id}
                  style={{
                    padding: 14,
                    borderRadius: 10,
                    border: `1px solid ${isUrgent ? "rgba(244,63,94,0.3)" : isWarning ? "rgba(245,158,11,0.3)" : "rgba(56,189,248,0.2)"}`,
                    background: isUrgent ? "rgba(244,63,94,0.08)" : isWarning ? "rgba(245,158,11,0.08)" : "rgba(56,189,248,0.06)",
                    display: "flex",
                    flexDirection: "column",
                    gap: 6
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      {isUrgent ? (
                        <AlertTriangle size={15} color="#fb7185" />
                      ) : isWarning ? (
                        <AlertCircle size={15} color="#fbbf24" />
                      ) : (
                        <Info size={15} color="#38bdf8" />
                      )}
                      <b style={{ fontSize: 13, color: isUrgent ? "#fb7185" : isWarning ? "#fbbf24" : "#e2e8f0" }}>
                        {alert.title}
                      </b>
                    </div>
                    <span className="badge" style={{ fontSize: 9, padding: "2px 6px" }}>
                      {alert.category}
                    </span>
                  </div>
                  <p style={{ fontSize: 12, color: "#cbd5e1", lineHeight: 1.4 }}>
                    {alert.message}
                  </p>
                  <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 4 }}>
                    <button
                      className="text-btn"
                      onClick={() => {
                        onNavigate(alert.linkSection as NavSection);
                        onClose();
                      }}
                      style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11 }}
                    >
                      <span>Go to {alert.linkSection}</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid var(--line)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button
            className="secondary"
            onClick={() => {
              onNavigate("Notifications & Reminders");
              onClose();
            }}
            style={{ fontSize: 11, padding: "6px 12px" }}
          >
            <Settings size={14} />
            <span>SMS & Email Architecture</span>
          </button>
          <button className="primary" onClick={onClose} style={{ padding: "6px 14px", fontSize: 11 }}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

