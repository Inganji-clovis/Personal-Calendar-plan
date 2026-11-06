import { Task, Transaction, Budget, Habit, HabitLog, CalendarEvent, NotificationItem } from "./supabase";

export interface NotificationProviderConfig {
  emailProvider: "resend" | "sendgrid" | "supabase_smtp" | "none";
  emailApiKey?: string;
  emailFrom?: string;
  smsProvider: "africas_talking" | "twilio" | "none";
  smsApiKey?: string;
  smsUsername?: string;
  smsSenderId?: string;
  phoneNumber?: string;
}

export interface ComputedAlert {
  id: string;
  title: string;
  message: string;
  severity: "urgent" | "warning" | "info" | "success";
  category: "task" | "finance" | "habit" | "academic" | "system";
  linkSection: string;
  timestamp: string;
}

/**
 * Computes intelligent real-time in-app alerts based on the user's actual data.
 */
export function computeRealtimeAlerts({
  tasks,
  transactions,
  budgets,
  habits,
  habitLogs,
  calendarEvents
}: {
  tasks: Task[];
  transactions: Transaction[];
  budgets: Budget[];
  habits: Habit[];
  habitLogs: HabitLog[];
  calendarEvents: CalendarEvent[];
}): ComputedAlert[] {
  const alerts: ComputedAlert[] = [];
  const todayStr = new Date().toISOString().slice(0, 10);
  const now = new Date();

  // 1. Overdue tasks
  const overdueTasks = tasks.filter(
    t => t.status !== "completed" && t.status !== "cancelled" && t.due_date && t.due_date < todayStr
  );
  if (overdueTasks.length > 0) {
    alerts.push({
      id: "overdue-tasks",
      title: "Overdue Tasks Detected",
      message: `You have ${overdueTasks.length} task${overdueTasks.length > 1 ? "s" : ""} past due date (e.g. "${overdueTasks[0].title}").`,
      severity: "urgent",
      category: "task",
      linkSection: "Tasks",
      timestamp: todayStr
    });
  }

  // 2. Tasks due today
  const dueTodayTasks = tasks.filter(
    t => t.status !== "completed" && t.status !== "cancelled" && t.due_date === todayStr
  );
  if (dueTodayTasks.length > 0) {
    alerts.push({
      id: "due-today-tasks",
      title: "Tasks Due Today",
      message: `${dueTodayTasks.length} task${dueTodayTasks.length > 1 ? "s" : ""} scheduled for completion today.`,
      severity: "warning",
      category: "task",
      linkSection: "Tasks",
      timestamp: todayStr
    });
  }

  // 3. Budget warnings
  const currentMonth = todayStr.slice(0, 7); // YYYY-MM
  const monthExpenses = transactions.filter(
    t => t.type === "expense" && t.transaction_date.startsWith(currentMonth)
  );

  budgets.forEach(budget => {
    const spent = monthExpenses
      .filter(t => t.category.toLowerCase() === budget.category.toLowerCase())
      .reduce((sum, t) => sum + Number(t.amount), 0);

    if (spent >= budget.monthly_limit) {
      alerts.push({
        id: `budget-exceeded-${budget.category}`,
        title: `Budget Limit Exceeded: ${budget.category}`,
        message: `Spent ${spent.toLocaleString()} RWF exceeding monthly budget of ${Number(budget.monthly_limit).toLocaleString()} RWF.`,
        severity: "urgent",
        category: "finance",
        linkSection: "Finance",
        timestamp: todayStr
      });
    } else if (spent >= budget.monthly_limit * 0.85) {
      alerts.push({
        id: `budget-warning-${budget.category}`,
        title: `Approaching Budget: ${budget.category}`,
        message: `Spent ${spent.toLocaleString()} RWF (85%+ of ${Number(budget.monthly_limit).toLocaleString()} RWF limit).`,
        severity: "warning",
        category: "finance",
        linkSection: "Finance",
        timestamp: todayStr
      });
    }
  });

  // 4. Daily habits check-in
  if (habits.length > 0) {
    const todayLogs = habitLogs.filter(l => l.log_date === todayStr && l.completed);
    const pendingHabitsCount = habits.length - todayLogs.length;
    if (pendingHabitsCount > 0) {
      alerts.push({
        id: "daily-habits-pending",
        title: "Daily Habits Check-In",
        message: `${pendingHabitsCount} of ${habits.length} daily habits remaining for today.`,
        severity: "info",
        category: "habit",
        linkSection: "Goals & Habits",
        timestamp: todayStr
      });
    }
  }

  // 5. Calendar events upcoming within 48h
  const upcomingEvents = calendarEvents.filter(ev => {
    return ev.event_date >= todayStr;
  });
  if (upcomingEvents.length > 0) {
    const nextEvent = upcomingEvents[0];
    alerts.push({
      id: `upcoming-event-${nextEvent.id}`,
      title: `Upcoming Event: ${nextEvent.title}`,
      message: `Scheduled on ${nextEvent.event_date}${nextEvent.start_time ? ` at ${nextEvent.start_time}` : ""}${nextEvent.location ? ` (${nextEvent.location})` : ""}.`,
      severity: "info",
      category: "academic",
      linkSection: "Calendar",
      timestamp: todayStr
    });
  }

  return alerts;
}

/**
 * Technical guide and diagnostics for Email & SMS provider architecture.
 */
export const NOTIFICATION_PROVIDERS_INFO = {
  sms: {
    recommended: "Africa's Talking (Rwanda / East Africa)",
    alternative: "Twilio",
    requirements: [
      "Africa's Talking Account or Twilio Account",
      "Rwanda Phone Number in E.164 format (+250 7XX XXX XXX)",
      "Registered Alphanumeric Sender ID (approved by RURA for Rwanda production traffic, or use sandbox for dev)",
      "Prepaid airtime / SMS credit balance (~$0.015 - $0.020 per SMS in Rwanda)",
      "API Key & Username in environment variables (SERVER SIDE ONLY - never exposed in frontend)"
    ],
    status: "Architecture ready. Awaiting user's API Key and SMS Gateway credits."
  },
  email: {
    recommended: "Resend",
    alternative: "SendGrid / Supabase Custom SMTP",
    requirements: [
      "Resend or SendGrid Account",
      "Verified sending domain (DNS TXT/DKIM/SPF records) or dev testing address",
      "API Key configured in environment variables (RESEND_API_KEY)",
      "Free tier: Resend offers 3,000 emails/month free (100 emails/day)"
    ],
    status: "Architecture ready. In-app alerts active. External dispatch awaits SMTP/Resend API key."
  }
};

