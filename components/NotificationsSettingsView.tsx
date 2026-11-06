import React, { useState } from "react";
import {
  Bell,
  MessageSquare,
  Mail,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Send,
  Info,
  Server
} from "lucide-react";
import { NOTIFICATION_PROVIDERS_INFO } from "@/lib/notifications";

export const NotificationsSettingsView: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState("+250 788 000 000");
  const [testMessage, setTestMessage] = useState("Reminder: INGANJI LIFE OS - 2 priority tasks due today.");
  const [simulationResult, setSimulationResult] = useState<string | null>(null);

  const handleSimulateDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    setSimulationResult(
      `[SIMULATION DISPATCH]: External SMS Gateway endpoint would deliver to ${phoneNumber}: "${testMessage}". Status: Paused. Reason: Live SMS requires active Africa's Talking API key and funded telco airtime credit in Rwanda.`
    );
  };

  return (
    <div>
      <div className="page-heading">
        <div>
          <p className="eyebrow">COMMUNICATION ARCHITECTURE & GATEWAYS</p>
          <h2>Notifications & Reminders Architecture</h2>
          <p className="muted">
            Secure configuration specifications for automated email summaries and SMS alerts in Rwanda.
          </p>
        </div>
      </div>

      {/* In-App Notification Status */}
      <div className="panel" style={{ background: "radial-gradient(ellipse at top left, #12281d 0%, #0e141b 70%)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div className="focus-icon" style={{ width: 44, height: 44 }}>
            <CheckCircle2 size={24} />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <h3 style={{ margin: 0, fontSize: 16 }}>In-App Notification Engine: ACTIVE</h3>
              <span className="badge status-completed">Operating Live</span>
            </div>
            <p className="muted" style={{ margin: "4px 0 0", fontSize: 12 }}>
              Intelligent real-time alerts automatically evaluate your overdue tasks, budget thresholds, daily habits, and scheduled calendar events directly within the app.
            </p>
          </div>
        </div>
      </div>

      {/* Gateway Architecture: SMS & Email */}
      <div className="dashboard-grid">
        {/* SMS Gateway (Rwanda) */}
        <section className="panel">
          <div className="panel-head">
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div className="stat-icon amber" style={{ width: 34, height: 34, margin: 0 }}>
                <MessageSquare size={17} />
              </div>
              <div>
                <h3>SMS Reminders Architecture</h3>
                <p className="muted">Mobile SMS delivery to Rwanda (+250) phones</p>
              </div>
            </div>
            <span className="badge priority-urgent">API Key Required</span>
          </div>

          <div style={{ fontSize: 12, lineHeight: 1.6, color: "var(--text-dim)" }}>
            <p>
              <b>Recommended Provider:</b> {NOTIFICATION_PROVIDERS_INFO.sms.recommended}
            </p>
            <p style={{ marginTop: 6 }}>
              <b>Technical Requirements & Pricing:</b>
            </p>
            <ul style={{ paddingLeft: 18, marginTop: 4, display: "flex", flexDirection: "column", gap: 4 }}>
              {NOTIFICATION_PROVIDERS_INFO.sms.requirements.map((req, i) => (
                <li key={i}>{req}</li>
              ))}
            </ul>

            <div
              style={{
                marginTop: 14,
                padding: 12,
                borderRadius: 8,
                background: "rgba(245, 158, 11, 0.08)",
                border: "1px solid rgba(245, 158, 11, 0.25)",
                color: "#fde68a"
              }}
            >
              <b style={{ display: "block", marginBottom: 2 }}>⚠️ Strict Transparency Notice:</b>
              SMS cannot be claimed as active until an Africa's Talking or Twilio API account is provisioned with prepaid Rwanda telco credit. The architecture is prepared to connect as soon as you enter server credentials in <code>.env.local</code>.
            </div>
          </div>

          {/* Simulation tool */}
          <form onSubmit={handleSimulateDispatch} style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid var(--line)" }}>
            <h4 style={{ fontSize: 13, marginBottom: 8 }}>Test SMS Payload Simulator</h4>
            <label style={{ fontSize: 11, color: "var(--muted)" }}>
              Rwanda Phone (+250)
              <input
                value={phoneNumber}
                onChange={e => setPhoneNumber(e.target.value)}
                placeholder="+250 788 123 456"
                style={{
                  width: "100%",
                  marginTop: 4,
                  padding: "8px 12px",
                  background: "#080c10",
                  border: "1px solid var(--line)",
                  borderRadius: 6,
                  color: "var(--text)",
                  fontSize: 12
                }}
              />
            </label>
            <label style={{ fontSize: 11, color: "var(--muted)", display: "block", marginTop: 8 }}>
              Payload Message
              <input
                value={testMessage}
                onChange={e => setTestMessage(e.target.value)}
                style={{
                  width: "100%",
                  marginTop: 4,
                  padding: "8px 12px",
                  background: "#080c10",
                  border: "1px solid var(--line)",
                  borderRadius: 6,
                  color: "var(--text)",
                  fontSize: 12
                }}
              />
            </label>
            <button className="secondary" type="submit" style={{ marginTop: 10, fontSize: 11 }}>
              <Send size={13} /> Test Payload Pipeline
            </button>
            {simulationResult && (
              <p style={{ marginTop: 10, fontSize: 11, color: "#93c5fd", background: "#0e1e2d", padding: 10, borderRadius: 6 }}>
                {simulationResult}
              </p>
            )}
          </form>
        </section>

        {/* Email Gateway */}
        <section className="panel">
          <div className="panel-head">
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div className="stat-icon blue" style={{ width: 34, height: 34, margin: 0 }}>
                <Mail size={17} />
              </div>
              <div>
                <h3>Email Delivery Architecture</h3>
                <p className="muted">Weekly briefs & urgent task alerts via SMTP / API</p>
              </div>
            </div>
            <span className="badge priority-medium">Ready for Key</span>
          </div>

          <div style={{ fontSize: 12, lineHeight: 1.6, color: "var(--text-dim)" }}>
            <p>
              <b>Recommended Provider:</b> {NOTIFICATION_PROVIDERS_INFO.email.recommended}
            </p>
            <p style={{ marginTop: 6 }}>
              <b>Technical Requirements & Pricing:</b>
            </p>
            <ul style={{ paddingLeft: 18, marginTop: 4, display: "flex", flexDirection: "column", gap: 4 }}>
              {NOTIFICATION_PROVIDERS_INFO.email.requirements.map((req, i) => (
                <li key={i}>{req}</li>
              ))}
            </ul>

            <div
              style={{
                marginTop: 14,
                padding: 12,
                borderRadius: 8,
                background: "rgba(56, 189, 248, 0.08)",
                border: "1px solid rgba(56, 189, 248, 0.25)",
                color: "#bae6fd"
              }}
            >
              <b style={{ display: "block", marginBottom: 2 }}>ℹ️ Free Tier Advantage:</b>
              Resend provides 3,000 free transactional emails per month (100 per day), perfectly sufficient for personal productivity digests and overdue reminders.
            </div>

            <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid var(--line)" }}>
              <h4 style={{ fontSize: 13, marginBottom: 8 }}>Server Environment Variable Keys</h4>
              <pre
                style={{
                  background: "#080c10",
                  padding: 12,
                  borderRadius: 6,
                  border: "1px solid var(--line)",
                  fontSize: 11,
                  color: "#a7f3d0",
                  overflowX: "auto"
                }}
              >
{`# External Notification Gateways (Optional)
RESEND_API_KEY=re_123456789
AFRICASTALKING_USERNAME=sandbox
AFRICASTALKING_API_KEY=atsk_...
NOTIFICATIONS_PHONE=+250788XXXXXX`}
              </pre>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

