/**
 * INGANJI LIFE OS — 45-Day Professional Career Roadmap
 *
 * Static, source-of-truth data for the career sprint (IT Support + Digital
 * Operations/Assistant + Digital Marketing, supported by creative production).
 * Kept as pure data so both the Smart Planner (automation) and the Career
 * Roadmap view (reference) read from one place.
 *
 * Source: "INGANJI 45-Day Professional Career Roadmap" document.
 */

export const ROADMAP_TOTAL_DAYS = 45;

export interface RoadmapDay {
  day: number;
  week: number;
  /** Supervised practice during Iwacu Studio work hours. */
  studio: string;
  /** Evening professional learning (Home session). */
  evening: string;
  /** Expected evidence / output for the day. */
  evidence: string;
}

export interface RoadmapWeek {
  week: number;
  title: string;
  fromDay: number;
  toDay: number;
  label: string;
}

export interface TimetablePhase {
  time: string;
  activity: string;
  evidence: string;
}

export interface CourseResource {
  category: string;
  provider: string;
  summary: string;
  url: string;
  /** "free" | "paid" | "mixed" — guidance on cost, not a guarantee. */
  cost: string;
}

export const ROADMAP_WEEKS: RoadmapWeek[] = [
  { week: 1, title: "Professional Work Habits, IT Support & Studio Workflow", fromDay: 1, toDay: 7, label: "WEEK 1" },
  { week: 2, title: "Print Production, Networking & Digital Assistance", fromDay: 8, toDay: 14, label: "WEEK 2" },
  { week: 3, title: "Photography, Video, Digital Content & Cybersecurity", fromDay: 15, toDay: 21, label: "WEEK 3" },
  { week: 4, title: "Digital Marketing & Business Operations", fromDay: 22, toDay: 28, label: "WEEK 4" },
  { week: 5, title: "Web, Automation, AI & Business Systems", fromDay: 29, toDay: 35, label: "WEEK 5" },
  { week: 6, title: "Cloud, Service Delivery, Portfolio & Job Readiness", fromDay: 36, toDay: 42, label: "WEEK 6" },
  { week: 7, title: "Delivery & Assessment", fromDay: 43, toDay: 45, label: "FINAL 3 DAYS" }
];

export const ROADMAP_DAYS: RoadmapDay[] = [
  // Week 1
  { day: 1, week: 1, studio: "Studio workflow audit: follow one job from customer brief to final delivery; note equipment, file formats and hand-off steps.", evening: "IT support foundations: hardware, Windows, users, files, printers and troubleshooting method.", evidence: "Create Studio workflow map + IT asset checklist." },
  { day: 2, week: 1, studio: "Illustrator: document setup, artboards, grids, typography and vector shapes; recreate a clean business-card layout.", evening: "Windows support: Task Manager, Device Manager, Settings, Event Viewer basics; safe troubleshooting.", evidence: "Export print-ready business card PDF + explain PC troubleshooting steps." },
  { day: 3, week: 1, studio: "Photoshop: layers, selections, masks, resolution, color modes and non-destructive editing.", evening: "Networking basics: LAN/WAN, router, switch, IP, gateway, DNS.", evidence: "Edited image with before/after evidence + draw a simple studio network." },
  { day: 4, week: 1, studio: "Prepress: bleed, trim, safe margins, CMYK/RGB, PDF export and font handling; inspect a sample job.", evening: "Command-line support: ipconfig, ping, tracert, nslookup, systeminfo, whoami.", evidence: "Preflight checklist + saved command outputs and explanations." },
  { day: 5, week: 1, studio: "Printing workflow: identify printer/media settings, scale, orientation, resolution and test-print procedure under supervision.", evening: "Microsoft 365 / Google Workspace: professional email, calendar, Docs/Word, Sheets/Excel, Drive/OneDrive file discipline.", evidence: "Document a supervised print job + create a clean work-tracking spreadsheet." },
  { day: 6, week: 1, studio: "Customer service: receive a brief, clarify dimensions/material/deadline, confirm proof and record approval.", evening: "IT support ticketing: issue, impact, priority, steps tried, resolution, escalation and closure.", evidence: "Create reusable job intake form + IT support ticket template." },
  { day: 7, week: 1, studio: "Weekly review: repeat one design task and one production workflow without step-by-step help.", evening: "Review IT support and networking; complete a 15-question self-test.", evidence: "Week 1 portfolio folder with 2 design outputs, 1 workflow map and 1 support ticket." },

  // Week 2
  { day: 8, week: 2, studio: "Laser workflow: understand approved material list, machine limits, ventilation, focus, test grid and operator sign-off. No unsupervised operation.", evening: "Networking: IPv4, private/public addresses, subnet mask, DHCP and DNS.", evidence: "Machine setup checklist approved by supervisor + IP configuration notes." },
  { day: 9, week: 2, studio: "RDWorks/vector preparation: layers, line colors, stroke widths, closed paths, scale and file handoff; verify before sending.", evening: "Network diagnostics: ping, tracert, nslookup, ipconfig /all; interpret results.", evidence: "One clean test vector + annotated network diagnostic report." },
  { day: 10, week: 2, studio: "UV printing workflow: artwork preparation, substrate checks, alignment, test print and curing/handling instructions from machine SOP.", evening: "Microsoft Excel: tables, sorting, filters, formulas, SUM, COUNTIF, IF and data validation.", evidence: "Production tracker spreadsheet with formulas." },
  { day: 11, week: 2, studio: "Stamp/key-holder/engraving project: prepare a test design, check size, polarity/engraving logic and material suitability with operator.", evening: "Google Workspace: Drive structure, Docs, Sheets, Forms, Calendar and sharing permissions.", evidence: "One documented sample job + a Google Form for job requests." },
  { day: 12, week: 2, studio: "Banner and large-format design: scale, readability, viewing distance, resolution, bleed and print-ready export.", evening: "Digital assistant skills: inbox triage, calendar scheduling, meeting notes, task tracking and professional communication.", evidence: "Banner proof + sample weekly calendar and meeting minutes." },
  { day: 13, week: 2, studio: "Quality control: compare approved proof with final print, inspect alignment, color, cutting, finish and defects.", evening: "Customer support: clear writing, service recovery, FAQs, CRM concepts and record keeping.", evidence: "QC checklist + customer response templates." },
  { day: 14, week: 2, studio: "Weekly review: complete a small supervised production job from brief to finished item.", evening: "Review networking and office productivity; practise explaining a technical issue to a non-technical user.", evidence: "Week 2 evidence pack: laser vector, print files, tracker, QC checklist." },

  // Week 3
  { day: 15, week: 3, studio: "Photography: exposure triangle, focal length, focus, white balance, composition and lighting.", evening: "Cybersecurity foundations: CIA triad, phishing, malware, MFA, updates, backups and least privilege.", evidence: "10-photo practice set + personal security checklist." },
  { day: 16, week: 3, studio: "Studio shoot: product/person/place setup, shot list, background, lighting and consistent framing.", evening: "File management: naming conventions, folders, versioning, backup and cloud collaboration.", evidence: "Organized photo delivery folder + documented backup workflow." },
  { day: 17, week: 3, studio: "Photo editing: crop, color correction, retouching, export sizes and web/print variants.", evening: "Linux introduction: terminal, filesystem, pwd, ls, cd, mkdir, cp, mv, cat.", evidence: "Edited photo set + Linux command log." },
  { day: 18, week: 3, studio: "Video: plan a 30–45 second promo, write a hook, shot list, sequence and call to action.", evening: "Linux: users, permissions, processes and package concepts in a safe lab.", evidence: "Storyboard + short Linux lab report." },
  { day: 19, week: 3, studio: "Video editing: timeline, cuts, audio levels, captions, transitions and export settings.", evening: "SQL/database basics: tables, records, primary/foreign keys and relationships.", evidence: "Export a short vertical video + draw a simple database model." },
  { day: 20, week: 3, studio: "Create social media assets: post, story, thumbnail and short-form video using consistent brand rules.", evening: "SQL practice: SELECT, WHERE, ORDER BY, INSERT and UPDATE in a test database.", evidence: "A 3-format content set + SQL query file." },
  { day: 21, week: 3, studio: "Weekly review: deliver a mini content package for a real or practice brief.", evening: "Cybersecurity and Linux review; explain safe handling of customer files.", evidence: "Week 3 portfolio: photo set, video, social assets and technical lab." },

  // Week 4
  { day: 22, week: 4, studio: "Marketing brief: audience, customer problem, offer, objective, message and CTA for a real business.", evening: "Digital marketing fundamentals: funnel, customer journey, positioning and campaign objectives.", evidence: "One-page campaign brief." },
  { day: 23, week: 4, studio: "Content strategy: content pillars, weekly calendar, platform formats and brand consistency.", evening: "SEO basics: search intent, keywords, titles, meta descriptions, local SEO and Google Business Profile.", evidence: "7-day content calendar + optimized sample page." },
  { day: 24, week: 4, studio: "Social media operations: scheduling, community management, moderation and response standards.", evening: "Google Skillshop: start Google Ads Search learning; understand keywords, match types and ad groups.", evidence: "Scheduled-content mockup + sample Search campaign structure." },
  { day: 25, week: 4, studio: "Campaign creative: make 2 ad variations and define audience/message/CTA; do not spend real ad budget without approval.", evening: "Google Ads: campaign objectives, budgets, bidding, ad quality and conversion tracking concepts.", evidence: "Two ad creatives + campaign setup plan." },
  { day: 26, week: 4, studio: "Analytics reporting: collect reach, impressions, engagement, clicks, leads and conversions where available.", evening: "Google Analytics 4: events, traffic sources, acquisition and conversion concepts through Skillshop.", evidence: "Simple KPI report with actual/sample data clearly labelled." },
  { day: 27, week: 4, studio: "Email marketing: audience consent, segmentation, subject lines, useful content and unsubscribe compliance.", evening: "HubSpot Academy: Digital Marketing or Email Marketing course modules.", evidence: "Email campaign draft + audience segmentation plan." },
  { day: 28, week: 4, studio: "Weekly review: present a mini marketing plan for a Studio or local-business style client.", evening: "Review marketing funnel, SEO, Google Ads and analytics; explain how results guide decisions.", evidence: "Week 4 campaign pack: brief, calendar, ads, email and KPI report." },

  // Week 5
  { day: 29, week: 5, studio: "Build a simple landing page for a Studio service: clear offer, portfolio, contact and CTA.", evening: "HTML fundamentals: semantic structure, links, images, forms and accessibility basics.", evidence: "Working HTML landing page." },
  { day: 30, week: 5, studio: "Add visual polish and responsive layout; check phone and desktop rendering.", evening: "CSS: layout, spacing, typography, responsive design and basic accessibility.", evidence: "Responsive landing page with screenshots." },
  { day: 31, week: 5, studio: "Add a useful interactive feature such as FAQ toggle or quote-request validation.", evening: "JavaScript basics: variables, functions, events, DOM and validation.", evidence: "Working interactive feature + code notes." },
  { day: 32, week: 5, studio: "Studio operations: build a job register with customer, service, deadline, status, proof approval and delivery.", evening: "Excel/Sheets intermediate: lookup concepts, pivot tables, charts and conditional formatting.", evidence: "Job-tracking workbook/dashboard." },
  { day: 33, week: 5, studio: "Digital assistant workflow: organize inbox, appointments, tasks, files and follow-ups using sample data.", evening: "AI productivity: prompt structure, verification, privacy, summarization and document drafting.", evidence: "Reusable AI prompt library + documented admin workflow." },
  { day: 34, week: 5, studio: "Business process improvement: identify one repeated Studio task and propose a simpler workflow.", evening: "Automation concepts: triggers, actions, forms, notifications and spreadsheet workflows; prototype only with approved tools.", evidence: "Process map + small automation prototype or documented design." },
  { day: 35, week: 5, studio: "Weekly review: publish the landing page to an approved free host or present locally if credentials unavailable.", evening: "Git/GitHub: repository, commits, branches, README and safe secret handling.", evidence: "Live/demo landing page + GitHub repo + Week 5 evidence pack." },

  // Week 6
  { day: 36, week: 6, studio: "Studio production simulation: handle a complete brief, design proof, approval, production and QC with supervision.", evening: "Cloud fundamentals: SaaS/PaaS/IaaS, regions, storage, compute and shared responsibility.", evidence: "End-to-end job case study." },
  { day: 37, week: 6, studio: "Photography/video delivery: create a consistent small brand package and export web/print variants.", evening: "Microsoft Learn: Azure fundamentals learning path; cloud identity, compute, networking and storage concepts.", evidence: "Brand content pack + cloud notes." },
  { day: 38, week: 6, studio: "Client support: explain a technical/design issue simply, set expectations, log changes and close the job professionally.", evening: "IT service management: incident vs request, SLA, priority, escalation, knowledge base and documentation.", evidence: "Customer case log + support knowledge-base article." },
  { day: 39, week: 6, studio: "Studio portfolio curation: select best work, remove weak drafts, document your exact contribution and tools.", evening: "Professional communication: CV bullet writing, LinkedIn profile, interview STAR examples and remote-work etiquette.", evidence: "Portfolio case-study drafts + 5 achievement bullets." },
  { day: 40, week: 6, studio: "Create a short portfolio presentation showing design, production, photography and marketing outputs.", evening: "Project management basics: scope, tasks, milestones, risk, time estimates and status reporting.", evidence: "Portfolio presentation + project plan." },
  { day: 41, week: 6, studio: "Capstone: plan a Digital Operations & IT Support portfolio project for a small business.", evening: "Combine IT support, web, spreadsheet, digital marketing and customer workflow requirements.", evidence: "Capstone brief, requirements and test checklist." },
  { day: 42, week: 6, studio: "Capstone: build the business landing page and job/issue tracker; use only dummy data.", evening: "Build and document the technical components; use Git commits and test each feature.", evidence: "Working capstone prototype." },

  // Final 3 days
  { day: 43, week: 7, studio: "Capstone: create a sample marketing campaign and visual content package for the same business.", evening: "Test the website, spreadsheet, forms and workflow; fix issues and document limitations.", evidence: "Integrated demo: website + tracker + campaign assets." },
  { day: 44, week: 7, studio: "Practical assessment: complete one design-to-production workflow and one photo/video/content task under supervision.", evening: "Technical assessment: troubleshoot a Windows/network scenario, run basic SQL, explain web architecture and security basics.", evidence: "Evidence folder with screenshots, files, test results and supervisor feedback." },
  { day: 45, week: 7, studio: "Present your Studio portfolio and explain your workflow, quality checks and contribution.", evening: "Present your capstone, complete a skills gap review and choose the next 90-day specialization.", evidence: "Final portfolio, CV evidence, certificate plan and next 90-day roadmap." }
];

export const DAILY_TIMETABLE: TimetablePhase[] = [
  { time: "22:20–22:40", activity: "Arrive home, eat/refresh, prepare desk and open the exact course/lab for the day.", evidence: "No rushed study while commuting." },
  { time: "22:40–23:00", activity: "Professional course lesson: watch/read one focused module and take 3–5 notes.", evidence: "Concept notes and key terms." },
  { time: "23:00–23:55", activity: "Hands-on lab/project: build, troubleshoot, analyze or create something yourself.", evidence: "Screenshot, file, code, report or campaign artifact." },
  { time: "23:55–00:10", activity: "Review: explain what you did, record blockers and define the next action.", evidence: "Update learning log and portfolio." }
];

export const TIMETABLE_NOTES = {
  studioWork:
    "Do assigned customer work first. Choose one skill practice from the daily Studio plan only when there is a suitable job, free time and supervisor approval. Never interrupt production or operate machines without authorization.",
  lateDay:
    "On a very late or exhausting day use the 20-minute minimum: 5 minutes review, 10 minutes one small practical task, 5 minutes log. Move unfinished work forward. Do not sacrifice sleep to keep a streak. University deadlines and essential rest take priority.",
  sessionSeparation:
    "Home: professional courses, personal IT labs and roadmap projects in the evening. Iwacu Studio: workplace tasks and supervised creative/production practice during work. University: lectures, assignments and exams remain in their own schedule. Never count a Studio production task as a completed University assignment or personal IT lab."
};

export const COURSE_RESOURCES: CourseResource[] = [
  {
    category: "IT Support — primary technical foundation",
    provider: "Google IT Support Professional Certificate",
    summary: "Structured professional certificate. Focus: troubleshooting, networking, operating systems, system administration and security.",
    url: "https://grow.google/certificates/it-support/",
    cost: "Typically paid (financial aid / offers sometimes available)"
  },
  {
    category: "Networking & Cybersecurity — free hands-on foundations",
    provider: "Cisco Networking Academy",
    summary: "Networking Basics and Introduction to Cybersecurity. Start with free self-paced learning; build labs and notes. CCST/CCNA exams are separate paid credentials.",
    url: "https://www.netacad.com/",
    cost: "Learning free; exams paid"
  },
  {
    category: "Microsoft 365 / Windows / Cloud",
    provider: "Microsoft Learn",
    summary: "Windows, Microsoft 365 productivity, security and Azure fundamentals learning paths. AZ-900 is an optional later exam, not a 45-day requirement.",
    url: "https://learn.microsoft.com/training/",
    cost: "Learning free; exams may cost money"
  },
  {
    category: "Digital Marketing & E-commerce",
    provider: "Google Digital Marketing & E-commerce Professional Certificate",
    summary: "Structured career course. Use the sprint to start modules and build practical campaign work, not to claim the full certificate prematurely.",
    url: "https://grow.google/certificates/digital-marketing-ecommerce/",
    cost: "Generally paid"
  },
  {
    category: "Google Ads & Analytics",
    provider: "Google Skillshop",
    summary: "Free, self-paced Google Ads training and certifications (Search, Display, Video, measurement). Add Google Analytics for reporting and measurement.",
    url: "https://skillshop.withgoogle.com/",
    cost: "Free"
  },
  {
    category: "Content, SEO, Email & Social Media",
    provider: "HubSpot Academy",
    summary: "Free online courses/certifications including Digital Marketing, Social Media, Content Marketing, SEO and Email Marketing. Apply to a real campaign brief.",
    url: "https://academy.hubspot.com/",
    cost: "Free"
  },
  {
    category: "Digital Assistant / Virtual Assistant",
    provider: "Microsoft Learn & Google Workspace Learning Center",
    summary: "Outlook/Gmail, Calendar, Word/Docs, Excel/Sheets, PowerPoint/Slides, Drive/OneDrive, meeting notes, inbox management, CRM basics, customer service, scheduling and follow-up.",
    url: "https://support.google.com/a/users/",
    cost: "Free"
  },
  {
    category: "AI Productivity",
    provider: "Google AI learning portal & Microsoft Learn AI paths",
    summary: "Prompt design, summarization, research verification, data privacy and productivity workflows. Treat AI output as a draft that must be checked.",
    url: "https://skillingafrica.withgoogle.com/",
    cost: "Free"
  },
  {
    category: "Rwanda-relevant digital learning",
    provider: "INGAZI",
    summary: "Free digital, professional and business courses designed for learners in Rwanda. Check the current catalogue for suitable short courses and language options.",
    url: "https://www.ingazi.rw/",
    cost: "Free"
  },
  {
    category: "Design & Creative Production",
    provider: "Adobe Learn",
    summary: "Official tutorials for Illustrator, Photoshop and Premiere Pro. The strongest proof is a well-documented portfolio; software tutorials are learning resources, not automatically professional certifications.",
    url: "https://creativecloud.adobe.com/learn",
    cost: "Free tutorials"
  }
];

export const EMPLOYABILITY_TRACKS = [
  {
    track: "Track A",
    title: "IT Support / Junior IT Operations",
    detail:
      "Windows troubleshooting, hardware, printers, networking, Microsoft 365/Google Workspace, ticketing, basic Linux, security hygiene and clear documentation. Build 3–5 support case studies."
  },
  {
    track: "Track B",
    title: "Digital Assistant / Digital Operations",
    detail:
      "Professional email, calendars, scheduling, spreadsheets, documents, presentations, file organization, customer service, CRM basics, meeting notes, follow-up and responsible AI use. Build reusable admin workflows."
  },
  {
    track: "Track C",
    title: "Digital Marketing Assistant",
    detail:
      "Content planning, copywriting, social publishing, SEO basics, Google Ads foundations, analytics, email marketing and monthly reporting. Build a campaign portfolio with clearly labelled real vs sample data."
  },
  {
    track: "Advantage",
    title: "Creative Production",
    detail:
      "Illustrator, Photoshop, print prepress, laser/UV file preparation, photography and short-form video. Show finished work, process, specifications and your exact contribution."
  }
];

export const PORTFOLIO_DELIVERABLES = [
  { area: "IT support portfolio", detail: "At least 3 documented troubleshooting cases (Windows, printer/peripheral, network)." },
  { area: "Studio portfolio", detail: "2–3 design/print-ready files, 1 documented production workflow, 1 QC checklist, 1 photography set and 1 short video." },
  { area: "Digital assistant portfolio", detail: "Sample inbox/calendar workflow, meeting minutes, task tracker, spreadsheet report and customer response templates using dummy data." },
  { area: "Digital marketing portfolio", detail: "Campaign brief, 7-day content calendar, 2 ad creatives, SEO sample, email draft and KPI report." },
  { area: "Technical portfolio", detail: "Responsive landing page, GitHub repository, SQL practice file and basic Linux/networking lab notes." },
  { area: "Career pack", detail: "Updated CV, LinkedIn headline/about, project descriptions and 5 evidence-based achievement bullets." }
];

export const DAY45_ASSESSMENT = [
  "Demonstrate a safe, supervised design-to-production workflow and explain prepress checks.",
  "Show a small design, photography and video portfolio with your own contribution identified.",
  "Troubleshoot a basic Windows, printer or network issue using a repeatable method.",
  "Explain IP, DNS, DHCP, basic Linux commands, SQL queries and web request/response.",
  "Demonstrate a simple responsive webpage and a spreadsheet tracker.",
  "Present a sample digital marketing campaign and explain its KPIs.",
  "Demonstrate a digital assistant workflow for calendar, email, meeting notes and follow-ups.",
  "List completed courses, certificates actually earned, portfolio links and remaining skill gaps."
];

export const EVIDENCE_LOG_FIELDS = [
  "Date / day",
  "Session (Studio / Home / University)",
  "Objective",
  "Exact steps",
  "Tools used",
  "File or screenshot",
  "Result",
  "Error / fix",
  "Supervisor feedback (if relevant)",
  "Status (Not Started / In Progress / Completed / Needs Improvement)",
  "Next action"
];

export const SAFETY_RULES =
  "Machine operation, laser, UV, electrical equipment, solvents/chemicals, ventilation, material selection and maintenance must follow Iwacu Studio's SOPs and the supervisor's instructions. Do not test unknown materials, bypass guards/interlocks, change machine power/speed settings, or operate equipment alone unless authorized and trained. Your learning task is to understand the workflow and document approved practice — not to take production risks.";

export const ROADMAP_DISCLAIMER =
  "45 days cannot honestly make someone an expert in all these fields or complete every professional certificate. This plan builds job-relevant foundations, evidence and a portfolio. Continue with a focused 90-day specialization after the sprint.";

export const OPERATING_PRINCIPLE =
  "At Studio: practise safely and document real work. At night: study one professional topic and build one practical result. Every week: turn your evidence into a portfolio.";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function clampRoadmapDay(day: number): number {
  if (!Number.isFinite(day)) return 1;
  return Math.min(ROADMAP_TOTAL_DAYS, Math.max(1, Math.round(day)));
}

export function getRoadmapDay(day: number): RoadmapDay {
  const d = clampRoadmapDay(day);
  return ROADMAP_DAYS[d - 1];
}

export function getRoadmapWeek(day: number): RoadmapWeek {
  const d = clampRoadmapDay(day);
  return ROADMAP_WEEKS.find((w) => d >= w.fromDay && d <= w.toDay) ?? ROADMAP_WEEKS[0];
}

export const ROADMAP_DAY_KEY = "inganji_roadmap_day";

/** Reads the user-selected roadmap day (manual day selector). Defaults to Day 1. */
export function loadRoadmapDay(): number {
  if (typeof window === "undefined") return 1;
  try {
    const raw = window.localStorage.getItem(ROADMAP_DAY_KEY);
    return raw ? clampRoadmapDay(Number(raw)) : 1;
  } catch {
    return 1;
  }
}

export function saveRoadmapDay(day: number): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(ROADMAP_DAY_KEY, String(clampRoadmapDay(day)));
  } catch {
    /* storage unavailable — selection simply not persisted */
  }
}
