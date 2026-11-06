# INGANJI LIFE OS — Personal Management Web Application

A professional, full-stack personal management system built for **Inganji** with **Next.js 15 (App Router)**, **TypeScript**, and **Supabase (PostgreSQL with Row Level Security)**.

---

## 🌟 Modules & Features Completed

1. **Executive Dashboard**:
   - Live KPI scorecards: Tasks completed vs overdue, active projects, total IT study hours, and available balance in Rwandan Francs (RWF).
   - Monthly cashflow overview (Income vs Expenses in RWF).
   - Priority and urgent deliverables with 1-click status completion toggle.
   - Dedicated focus area shortcuts (Iwacu Studio, VAX2040, University of Kigali).
   - Daily habits check-in tracker.

2. **Tasks Management**:
   - Full CRUD: Create, View, Edit, and Delete tasks.
   - Statuses: `Pending`, `In Progress`, `Completed`.
   - Priorities: `Urgent`, `High`, `Medium`, `Low`.
   - Due date indicators with automated overdue warnings.
   - Filters by status, priority, and focus area with instant search.

3. **Projects & Milestones**:
   - Portfolio grid with status indicators (`Planned`, `Active`, `Paused`, `Completed`).
   - Dynamic progress tracking calculated from completed milestones or manual progress percentage.
   - Project milestones checklist (add milestone, toggle completion, delete).
   - Focus area tags, start dates, and target completion deadlines.

4. **IT Learning & Practical Labs**:
   - IT Roadmap covering Full-Stack Web Development, Database Administration & SQL, Cloud & DevOps, and Cybersecurity.
   - Study sessions logging with decimal hour precision, topics, and completion dates.
   - Practical lab repository and evidence URL linking (GitHub, documentation, lab reports).
   - Total study hours aggregator.

5. **Work & University Dedicated Command**:
   - **Iwacu Studio**: Creative production pipeline, video/audio shoots, media deliverables, campaigns.
   - **VAX2040**: Software engineering roadmap, architecture specs, sprint backlog, epics.
   - **University of Kigali (UoK)**: Enrolled academic course modules, course codes, credit weights, lecturers, target vs current grades, assignments, and exam deadlines.

6. **Calendar & Scheduling**:
   - Interactive monthly calendar with previous/next navigation and "Today" quick-jump.
   - Visual date tags for task due dates, exam milestones, and calendar events.
   - Single-day drilldown agenda view.
   - Event scheduling modal (title, date, start/end times, category, location/video link).

7. **Goals & Daily Habits**:
   - 7-day Monday–Sunday visual consistency tracker with interactive check-in circles.
   - Current streak counter and weekly adherence metrics.
   - Strategic long-term and short-term goals with target values, measurement units, target dates, and progress meters.

8. **Finance & Cashflow (RWF)**:
   - Full transactions ledger for Income and Expenses in Rwandan Francs (RWF).
   - Monthly category budgets with spend-vs-limit progress bars and automated threshold warnings (>85% and >100% exceeded).
   - Savings goals & reserve funds with target amounts and progress increments.
   - Net cashflow calculation and categorized filtering.

9. **Notifications & Reminders Engine**:
   - Intelligent in-app notification center evaluating overdue tasks, tasks due today, budget breaches, pending daily habits, and upcoming calendar events.
   - Technical architecture documentation for SMS (Africa's Talking / Twilio in Rwanda) and Email (Resend / SendGrid / Supabase SMTP).
   - Interactive SMS payload simulator.

10. **Weekly & Monthly Executive Reports**:
    - Period-selectable executive summary (7-day Weekly brief or 30-day Monthly review).
    - Task delivery rates, IT lab hours logged, net cashflow in RWF, and habit adherence rate.

11. **Export to CSV & PDF**:
    - One-click CSV export for Tasks, Financial Transactions, Learning Records, and Projects.
    - Print-ready and PDF-ready formatting using browser native print/PDF engine (`@media print` stylesheet optimized for executive reports).

12. **Authentication & Security**:
    - Supabase email/password authentication (Sign In & Sign Up).
    - Session persistence and secure token auto-refresh.
    - PostgreSQL Row Level Security (RLS) ensuring strict isolation (`auth.uid() = user_id`).
    - No secret keys or database passwords in frontend code.

---

## 🚀 Quick Setup & Local Development

### 1. Requirements
- Node.js 20.9+
- A Supabase project

### 2. Configure Environment Variables
Create `.env.local` in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

> **Security Note:** Never put `service_role` or database passwords into `.env.local`. Only use the public/anon key.

### 3. Database Schema Setup
Your Supabase project already contains the 4 core tables (`tasks`, `projects`, `learning_records`, `transactions`).

To enable persistent cloud sync for the supplementary modules (milestones, habits, goals, budgets, savings goals, calendar events, academic modules), open your **Supabase Dashboard -> SQL Editor -> New Query**, copy the contents of `supabase/schema_update.sql`, and click **Run**.

*(Note: The application has built-in resilient offline-first storage and will run smoothly even before you run the update script).*

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

---

## 🚢 GitHub & Vercel Deployment

1. Initialize Git and commit the codebase:
   ```bash
   git init
   git add .
   git commit -m "Complete INGANJI LIFE OS production build"
   ```
2. Create a private GitHub repository and push your branch:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/INGANJI_LIFE_OS.git
   git branch -M main
   git push -u origin main
   ```
3. Import the repository in [Vercel](https://vercel.com):
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
   - **Environment Variables**:
     - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase URL
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon public key
4. Click **Deploy**. Vercel will build and deploy the production web app.
