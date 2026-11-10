/**
 * studySupport
 *
 * The application-provided study library: the practical lab curriculum, curated
 * study notes, the course catalogue and the equipment/setup requirements that
 * support the 45-day career sprint.
 *
 * These are the *material and templates* the app hands to the learner — not
 * fabricated personal results. Every seeded lab starts at "not_started" and is
 * meant to be performed and evidenced by the learner.
 */

import type { PracticalLab, ResourceItem, SessionType } from "./supabase";
import { COURSE_RESOURCES } from "./careerRoadmap";

export const STARTER_SEED_KEY_PREFIX = "inganji_starter_seed_v1";

export type LabSeed = Omit<PracticalLab, "user_id" | "created_at">;
export type ResourceSeed = Omit<ResourceItem, "user_id" | "created_at">;

// ---------------------------------------------------------------------------
// Practical labs — the hands-on curriculum behind every roadmap day
// ---------------------------------------------------------------------------

export const LAB_CATALOG: Omit<LabSeed, "id">[] = [
  {
    title: "Illustrator: print-ready business card",
    discipline: "Design & Production",
    topic: "Vector layout, artboards, typography, export",
    difficulty: "beginner",
    learning_objectives:
      "Set up a document with correct artboard size and 3 mm bleed; build a clean business-card layout; export a print-ready PDF.",
    required_tools: "Adobe Illustrator (studio workstation), fonts approved by the studio.",
    prerequisites: "Basic computer use and file management.",
    step_by_step:
      "1. Create a 90×50 mm document with 3 mm bleed.\n2. Add safe margins and a 3 mm grid.\n3. Place logo and set typography (name, role, contacts).\n4. Convert text to outlines for the final export only.\n5. Export as PDF/X with crop marks and check the preflight panel.",
    commands_snippets: "File ▸ Export ▸ Save for Print (PDF) — preset: [PDF/X-4]\nBleed: 3 mm · Color: CMYK · Resolution: 300 ppi",
    status: "not_started",
  },
  {
    title: "Photoshop: non-destructive photo edit",
    discipline: "Design & Production",
    topic: "Layers, masks, resolution, colour modes",
    difficulty: "beginner",
    learning_objectives:
      "Edit a photo using adjustment layers and masks without destroying the original pixels; export web and print variants.",
    required_tools: "Adobe Photoshop, a sample raw/JPEG image.",
    prerequisites: "Basic understanding of image resolution.",
    step_by_step:
      "1. Duplicate the background layer.\n2. Add a Curves adjustment layer for contrast.\n3. Use a soft mask to correct a distracting background.\n4. Save the master as PSD/TIFF.\n5. Export JPEG (web, sRGB) and PDF (print, CMYK).",
    commands_snippets: "Layer ▸ New Adjustment Layer ▸ Curves\nExport As: JPEG · sRGB · 72 ppi (web) / PDF · CMYK · 300 ppi (print)",
    status: "not_started",
  },
  {
    title: "Prepress checklist on a real job",
    discipline: "Design & Production",
    topic: "Bleed, trim, safe area, colour space, fonts",
    difficulty: "intermediate",
    learning_objectives:
      "Inspect a live job for bleed, trim, safe margins, CMYK/RGB correctness, font embedding and image resolution before printing.",
    required_tools: "A sample job file, Acrobat Pro or Illustrator preflight, studio QC checklist.",
    prerequisites: "Complete the Illustrator business-card lab.",
    step_by_step:
      "1. Open the job and the studio QC checklist.\n2. Verify bleed, trim marks and safe margins.\n3. Confirm colour mode matches the output process (CMYK for print).\n4. Check images ≥ 300 ppi and fonts embedded/outlined.\n5. Record pass/fail per item and hand to the operator.",
    commands_snippets: "Preflight profile: PDF/X-4\nChecks: bleed · resolution · colour space · fonts embedded",
    status: "not_started",
  },
  {
    title: "Laser: file preparation with supervisor sign-off",
    discipline: "Design & Production",
    topic: "Vector prep, line colours, closed paths, scale",
    difficulty: "advanced",
    learning_objectives:
      "Prepare an approved laser test file (closed paths, correct stroke colours, true scale) and verify it with the operator before any machine run.",
    required_tools: "RDWorks/LaserWork, an approved sample material, supervisor present.",
    prerequisites: "Studio safety induction. Never operate the laser unsupervised.",
    step_by_step:
      "1. Confirm the approved material list and machine limits with the supervisor.\n2. Draw the design at true scale with closed vector paths.\n3. Assign cut/engrave line colours per the studio's machine SOP.\n4. Run a small test grid on scrap material under supervision.\n5. Record focus, power and speed settings used and get sign-off.",
    commands_snippets: "Cut = red (0.01 mm) · Engrave = black · Scale = 1:1\n⚠ Follow the studio SOP — no unsupervised operation",
    status: "not_started",
  },
  {
    title: "UV printing: artwork + substrate check",
    discipline: "Design & Production",
    topic: "Artwork prep, alignment, curing/handling",
    difficulty: "advanced",
    learning_objectives:
      "Prepare UV artwork, verify the substrate is approved, align a test print and record the curing/handling instructions.",
    required_tools: "UV RIP software, approved substrate, supervisor present.",
    prerequisites: "Read the UV printer SOP; supervisor supervision.",
    step_by_step:
      "1. Confirm the substrate is on the approved list.\n2. Set artwork size, alignment and white/gloss layers per SOP.\n3. Print a small test coupon under supervision.\n4. Inspect alignment, colour and adhesion.\n5. Record curing time and handling notes.",
    commands_snippets: "RIP preset: [studio UV profile]\nLayers: CMYK + White + Gloss\n⚠ Follow the studio SOP — no unsupervised operation",
    status: "not_started",
  },
  {
    title: "Large-format banner design & proof",
    discipline: "Design & Production",
    topic: "Scale, viewing distance, readability, export",
    difficulty: "intermediate",
    learning_objectives:
      "Design a banner sized correctly for its viewing distance, with readable text and a print-ready file plus a scaled proof.",
    required_tools: "Illustrator, banner media specifications.",
    prerequisites: "Complete the Illustrator business-card lab.",
    step_by_step:
      "1. Ask for the finished size and where the banner will hang.\n2. Set the document at 1:10 scale if very large.\n3. Choose stock/bleed and keep text ≥ 25 mm effective height.\n4. Export a print-ready PDF and a scaled-down proof.\n5. Get proof approval before production.",
    commands_snippets: "Document scale 1:10 · Resolution ≥ 100 ppi at final size · Bleed per media spec",
    status: "not_started",
  },
  {
    title: "Photography: 10-shot product set",
    discipline: "Design & Production",
    topic: "Exposure triangle, lighting, framing",
    difficulty: "beginner",
    learning_objectives:
      "Shoot ten consistent product photos controlling exposure, white balance and framing.",
    required_tools: "Camera (DSLR/mirrorless), tripod, consistent lighting.",
    prerequisites: "Basic understanding of aperture/shutter/ISO.",
    step_by_step:
      "1. Set a fixed white balance and a low ISO.\n2. Use the tripod and a plain background.\n3. Vary the framing (wide, medium, close).\n4. Keep the lighting consistent across all ten shots.\n5. Review focus and exposure before editing.",
    commands_snippets: "Manual mode · f/8 · 1/125 s · ISO 100 · WB fixed (K)",
    status: "not_started",
  },
  {
    title: "Photo editing & export variants",
    discipline: "Design & Production",
    topic: "Colour correction, retouch, export sizes",
    difficulty: "beginner",
    learning_objectives:
      "Deliver a consistent edited photo set with web and print export variants.",
    required_tools: "Photoshop or Lightroom.",
    prerequisites: "Complete the 10-shot product lab.",
    step_by_step:
      "1. Apply a consistent crop and colour profile to the set.\n2. Retouch only what is needed.\n3. Export web variants (JPEG, sRGB).\n4. Export print variants (TIFF/PDF, CMYK).\n5. Name files with a clear convention.",
    commands_snippets: "Naming: project_item_variant_YYYYMMDD.jpg",
    status: "not_started",
  },
  {
    title: "Video: 30–45s promo (plan → export)",
    discipline: "Design & Production",
    topic: "Hook, shot list, timeline, captions",
    difficulty: "intermediate",
    learning_objectives:
      "Plan and export a 30–45s vertical promo with a hook, clear sequence and captions.",
    required_tools: "Premiere Pro (or equivalent), the camera used for photography.",
    prerequisites: "Basic photography experience.",
    step_by_step:
      "1. Write the hook (first 3 seconds) and the call to action.\n2. Build a shot list and record clips.\n3. Assemble the timeline with clean cuts.\n4. Balance audio and add captions.\n5. Export a vertical 1080×1920 MP4.",
    commands_snippets: "Sequence: 1080×1920 · 30 fps · H.264 · AAC audio",
    status: "not_started",
  },
  {
    title: "Social asset pack (post, story, thumbnail)",
    discipline: "Design & Production",
    topic: "Multi-format content, brand consistency",
    difficulty: "intermediate",
    learning_objectives:
      "Produce a consistent three-format content set for one message.",
    required_tools: "Illustrator/Photoshop, brand colours and fonts.",
    prerequisites: "Complete one design and one video lab.",
    step_by_step:
      "1. Define one core message and the brand rules.\n2. Design the square post.\n3. Adapt to a 9:16 story.\n4. Adapt to a 16:9 thumbnail.\n5. Export each at its platform size.",
    commands_snippets: "Post 1080×1080 · Story 1080×1920 · Thumbnail 1280×720",
    status: "not_started",
  },
  {
    title: "Windows troubleshooting method",
    discipline: "IT Support",
    topic: "Diagnostics, Event Viewer, safe recovery",
    difficulty: "beginner",
    learning_objectives:
      "Diagnose a Windows startup/performance issue using a repeatable method and document the fix.",
    required_tools: "Windows PC (or VM), Task Manager, Device Manager, Event Viewer.",
    prerequisites: "Ability to navigate Windows Settings.",
    step_by_step:
      "1. Gather the symptom and when it started.\n2. Check Task Manager for resource pressure.\n3. Inspect Device Manager for driver faults.\n4. Read relevant Event Viewer entries.\n5. Apply the smallest safe fix and verify.",
    commands_snippets:
      "taskmgr\ndevmgmt.msc\neventvwr.msc\nsfc /scannow\nchkdsk C: /scan",
    status: "not_started",
  },
  {
    title: "Network diagnostics report",
    discipline: "IT Support / Networking",
    topic: "IP config, DNS, routing, latency",
    difficulty: "beginner",
    learning_objectives:
      "Diagnose connectivity with standard tools and write an annotated report.",
    required_tools: "Windows/macOS/Linux command line, access to a network.",
    prerequisites: "None — foundational lab.",
    step_by_step:
      "1. Show the IP configuration.\n2. Test the gateway.\n3. Test DNS resolution.\n4. Trace the route to a public host.\n5. Write the findings and the likely cause.",
    commands_snippets:
      "ipconfig /all\nping 8.8.8.8\nnslookup example.com\ntracert example.com",
    status: "not_started",
  },
  {
    title: "Cybersecurity hygiene checklist",
    discipline: "Cybersecurity",
    topic: "MFA, updates, backups, least privilege",
    difficulty: "beginner",
    learning_objectives:
      "Apply a personal/organisational security baseline and record the state of each control.",
    required_tools: "A computer and accounts you own.",
    prerequisites: "None.",
    step_by_step:
      "1. Enable MFA on primary accounts.\n2. Confirm automatic updates are on.\n3. Verify a working backup and restore point.\n4. Remove unused accounts and permissions.\n5. Record each control's status.",
    commands_snippets: "Controls: MFA · updates · backup · least privilege · phishing awareness",
    status: "not_started",
  },
  {
    title: "Linux command-line fundamentals",
    discipline: "Linux",
    topic: "Filesystem, navigation, file operations",
    difficulty: "beginner",
    learning_objectives:
      "Navigate the filesystem and manage files/packages from the terminal.",
    required_tools: "Ubuntu VM (VirtualBox) or WSL.",
    prerequisites: "None.",
    step_by_step:
      "1. Print the working directory and list contents.\n2. Create, copy, move and remove files/directories.\n3. Read files and check permissions.\n4. Update packages.\n5. Save a command log as evidence.",
    commands_snippets:
      "pwd\nls -la\ncd /var/log\nmkdir lab && cd lab\ntouch notes.txt\ncp notes.txt backup.txt\nmv backup.txt archive.txt\nrm archive.txt\ncat /etc/os-release\nsudo apt update && sudo apt upgrade -y",
    status: "not_started",
  },
  {
    title: "Linux users, permissions & processes",
    discipline: "Linux",
    topic: "chmod, chown, ps, systemctl",
    difficulty: "intermediate",
    learning_objectives:
      "Create a user, set file permissions and inspect running services safely in a lab.",
    required_tools: "Ubuntu VM.",
    prerequisites: "Complete the Linux command-line lab.",
    step_by_step:
      "1. Create a test user.\n2. Set read/write/execute permissions with chmod.\n3. Change ownership with chown.\n4. List processes and inspect a service status.\n5. Document each change and how to revert it.",
    commands_snippets:
      "sudo adduser labuser\nchmod 750 script.sh\nchown labuser:labuser script.sh\nps aux | head\nsystemctl status ssh",
    status: "not_started",
  },
  {
    title: "SQL: build a small schema",
    discipline: "Databases",
    topic: "Tables, keys, relationships",
    difficulty: "beginner",
    learning_objectives:
      "Model a small business database with primary/foreign keys and create it in PostgreSQL.",
    required_tools: "PostgreSQL (local or Supabase SQL editor).",
    prerequisites: "None.",
    step_by_step:
      "1. Identify three entities and their relationships.\n2. Draw the model with keys.\n3. Write CREATE TABLE statements with constraints.\n4. Insert sample rows.\n5. Save the SQL file as evidence.",
    commands_snippets:
      "CREATE TABLE customers (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name text NOT NULL);\nCREATE TABLE jobs (id uuid PRIMARY KEY, customer_id uuid REFERENCES customers(id), title text NOT NULL);",
    status: "not_started",
  },
  {
    title: "SQL: query practice file",
    discipline: "Databases",
    topic: "SELECT, WHERE, ORDER BY, JOIN, UPDATE",
    difficulty: "intermediate",
    learning_objectives:
      "Write and explain a set of read/write queries against the practice database.",
    required_tools: "PostgreSQL.",
    prerequisites: "Complete the SQL schema lab.",
    step_by_step:
      "1. Select and filter rows.\n2. Sort and limit results.\n3. Join two tables.\n4. Update a row safely.\n5. Save every query with a one-line explanation.",
    commands_snippets:
      "SELECT * FROM customers ORDER BY name LIMIT 10;\nSELECT j.title, c.name FROM jobs j JOIN customers c ON c.id = j.customer_id;\nUPDATE jobs SET title = 'Updated' WHERE id = '...';",
    status: "not_started",
  },
  {
    title: "HTML: semantic landing page",
    discipline: "Web Development",
    topic: "Semantic structure, forms, links",
    difficulty: "beginner",
    learning_objectives:
      "Build a valid semantic HTML page with a clear offer, portfolio and contact call to action.",
    required_tools: "VS Code, a browser.",
    prerequisites: "None.",
    step_by_step:
      "1. Structure with header, main, sections, footer.\n2. Add headings, text and a service list.\n3. Add an image and internal/external links.\n4. Add a contact form.\n5. Validate the markup and commit the file.",
    commands_snippets:
      "<header>…</header>\n<main>\n  <section id=\"services\">…</section>\n  <form action=\"#\"><input type=\"email\" required /></form>\n</main>\n<footer>…</footer>",
    status: "not_started",
  },
  {
    title: "CSS: responsive layout",
    discipline: "Web Development",
    topic: "Flexbox/Grid, spacing, breakpoints",
    difficulty: "beginner",
    learning_objectives:
      "Style the landing page into a responsive layout that works on phone and desktop.",
    required_tools: "VS Code, a browser with device toolbar.",
    prerequisites: "Complete the HTML landing-page lab.",
    step_by_step:
      "1. Apply a spacing and typography scale.\n2. Lay out the cards with Grid.\n3. Add a mobile breakpoint.\n4. Test at 375 px and 1440 px.\n5. Capture screenshots as evidence.",
    commands_snippets:
      ".grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px; }\n@media (max-width: 600px) { .nav { flex-direction: column; } }",
    status: "not_started",
  },
  {
    title: "JavaScript: FAQ toggle & form validation",
    discipline: "Web Development",
    topic: "DOM, events, validation",
    difficulty: "intermediate",
    learning_objectives:
      "Add an interactive FAQ toggle and client-side form validation with plain JavaScript.",
    required_tools: "VS Code, a browser.",
    prerequisites: "Complete the CSS layout lab.",
    step_by_step:
      "1. Select the FAQ and form elements.\n2. Add a click handler that toggles a class.\n3. Validate the email field on submit.\n4. Show clear success/error messages.\n5. Commit the script file.",
    commands_snippets:
      "document.querySelectorAll('.faq').forEach(el => el.addEventListener('click', () => el.classList.toggle('open')));\nform.addEventListener('submit', e => { if (!email.checkValidity()) { e.preventDefault(); } });",
    status: "not_started",
  },
  {
    title: "Excel/Sheets: studio job tracker",
    discipline: "Digital Operations",
    topic: "Tables, filters, formulas, validation",
    difficulty: "beginner",
    learning_objectives:
      "Build a job tracker with status, deadlines and formulas that surface outstanding work.",
    required_tools: "Microsoft Excel or Google Sheets.",
    prerequisites: "None.",
    step_by_step:
      "1. Create columns: customer, service, deadline, status, approval, delivery.\n2. Add data validation for status.\n3. Add conditional formatting for overdue jobs.\n4. Add COUNTIF/SUMIF summary formulas.\n5. Save the workbook as evidence.",
    commands_snippets:
      "=COUNTIF(D:D,\"In progress\")\n=SUMIF(E:E,\"Pending\",F:F)\nConditional format: deadline < TODAY() → red",
    status: "not_started",
  },
  {
    title: "Git & GitHub: version control workflow",
    discipline: "DevOps",
    topic: "Repo, commits, branches, secrets",
    difficulty: "beginner",
    learning_objectives:
      "Create a repository, commit with clear messages and keep secrets out of the code.",
    required_tools: "Git, a GitHub account.",
    prerequisites: "None.",
    step_by_step:
      "1. Initialise a repository and add a README.\n2. Commit in small, described steps.\n3. Create a branch and merge it.\n4. Add a .gitignore for secrets.\n5. Push to GitHub.",
    commands_snippets:
      "git init\ngit add .\ngit commit -m \"feat: initial landing page\"\ngit branch feature/faq\ngit checkout main && git merge feature/faq\ngit remote add origin <url> && git push -u origin main",
    status: "not_started",
  },
  {
    title: "AI productivity: reusable prompt library",
    discipline: "AI Productivity",
    topic: "Prompt structure, verification, privacy",
    difficulty: "beginner",
    learning_objectives:
      "Build a reusable prompt library for drafting, summarising and checking work responsibly.",
    required_tools: "An LLM assistant (Gemini/OpenAI), a notes document.",
    prerequisites: "None.",
    step_by_step:
      "1. Write a structured prompt template (role, task, context, constraints).\n2. Test it on a real admin task.\n3. Verify every factual claim before use.\n4. Remove any private data from prompts.\n5. Save the library as evidence.",
    commands_snippets:
      "Template: Act as <role>. Task: <task>. Context: <context>. Constraints: <rules>. Output: <format>.\nRule: verify all facts · never paste confidential data",
    status: "not_started",
  },
  {
    title: "Marketing brief for a real business",
    discipline: "Digital Marketing",
    topic: "Audience, offer, objective, CTA",
    difficulty: "beginner",
    learning_objectives:
      "Write a one-page campaign brief defining audience, problem, offer, objective and call to action.",
    required_tools: "A document editor.",
    prerequisites: "None.",
    step_by_step:
      "1. Name the audience and their problem.\n2. State the offer and the objective (awareness/leads/sales).\n3. Define the key message and the CTA.\n4. Choose the channels.\n5. Define how success will be measured.",
    commands_snippets: "Brief: audience · problem · offer · objective · message · CTA · channels · KPI",
    status: "not_started",
  },
  {
    title: "Google Ads: sample Search campaign structure",
    discipline: "Digital Marketing",
    topic: "Keywords, match types, ad groups",
    difficulty: "intermediate",
    learning_objectives:
      "Design (without spending) a Search campaign structure with tight ad groups and match types.",
    required_tools: "Google Skillshop access, a document.",
    prerequisites: "Complete the marketing brief lab.",
    step_by_step:
      "1. Group keywords by intent.\n2. Build 2–3 tight ad groups.\n3. Assign match types deliberately.\n4. Write 2 responsive ad variants.\n5. Define negative keywords and conversion tracking. Do not spend real budget without approval.",
    commands_snippets:
      "Ad group: [emergency plumbing]\nKeywords: [emergency plumber kigali] · \"plumber near me\"\nNegatives: jobs · free · salary",
    status: "not_started",
  },
  {
    title: "Email campaign draft + segmentation",
    discipline: "Digital Marketing",
    topic: "Consent, segmentation, subject lines",
    difficulty: "beginner",
    learning_objectives:
      "Draft a compliant email campaign with a segmented audience and a clear unsubscribe path.",
    required_tools: "A document editor or an email platform.",
    prerequisites: "Complete the marketing brief lab.",
    step_by_step:
      "1. Define the audience segment and confirm consent basis.\n2. Write three subject-line options.\n3. Write the useful body content.\n4. Add the call to action and unsubscribe link.\n5. Plan the send schedule.",
    commands_snippets: "Include: sender identity · physical address · unsubscribe link · consent source",
    status: "not_started",
  },
];

// ---------------------------------------------------------------------------
// Curated study notes (Reference material, seeded into the Resource Library)
// ---------------------------------------------------------------------------

export const STUDY_NOTES: { title: string; category: string; session: SessionType; body: string }[] = [
  {
    title: "Illustrator essentials",
    category: "Design & Production",
    session: "studio",
    body:
      "Artboards define your output size. Always set 3 mm bleed for print. Keep text as text until the final export, then outline for the printer. Use CMYK for print and RGB for screen. Grids and guides keep layouts consistent; place images as links and check that they are ≥ 300 ppi at final size.",
  },
  {
    title: "Photoshop essentials",
    category: "Design & Production",
    session: "studio",
    body:
      "Work non-destructively: adjustment layers + masks instead of erasing pixels. Resolution drives print quality (300 ppi at final size). Use sRGB for web and CMYK for print. Save the layered master (PSD/TIFF) and export flattened variants from it.",
  },
  {
    title: "Prepress QC checklist",
    category: "Design & Production",
    session: "studio",
    body:
      "Check: bleed (3 mm), trim marks, safe margins, colour space (CMYK for print), image resolution (≥ 300 ppi), fonts embedded or outlined, correct page count/order, and a visual proof approval before production.",
  },
  {
    title: "Camera exposure quick reference",
    category: "Design & Production",
    session: "studio",
    body:
      "Exposure triangle: aperture (depth of field), shutter (motion), ISO (brightness/noise). Lower ISO = cleaner images. For products use f/8 for sharpness, a tripod, and a fixed white balance so the set stays consistent.",
  },
  {
    title: "Video editing basics",
    category: "Design & Production",
    session: "studio",
    body:
      "The first 3 seconds decide retention — lead with the hook. Keep cuts clean, keep audio around -12 dB, burn in captions, and export vertical 1080×1920 H.264 for social. Plan with a shot list before recording.",
  },
  {
    title: "Windows troubleshooting method",
    category: "IT Support",
    session: "home",
    body:
      "1) Gather symptom + timing. 2) Reproduce. 3) Check Task Manager / Device Manager / Event Viewer. 4) Apply the smallest safe fix. 5) Verify and document. Useful: sfc /scannow, chkdsk, System Restore.",
  },
  {
    title: "Networking essentials",
    category: "IT Support / Networking",
    session: "home",
    body:
      "IP = device address, subnet mask = network boundary, gateway = router, DNS = name→IP. Private ranges: 10.x, 172.16–31.x, 192.168.x. Tools: ipconfig/all, ping, tracert, nslookup. DHCP hands out addresses; NAT shares one public IP.",
  },
  {
    title: "Cybersecurity hygiene",
    category: "Cybersecurity",
    session: "home",
    body:
      "CIA triad (confidentiality, integrity, availability). Baseline: MFA everywhere, patched software, tested backups, least privilege, phishing awareness, and never reusing passwords. Treat email links and attachments as untrusted until verified.",
  },
  {
    title: "Linux command reference",
    category: "Linux",
    session: "home",
    body:
      "pwd, ls -la, cd, mkdir, touch, cp, mv, rm, cat, less. Permissions: rwx = 4/2/1; chmod 750, chown user:group. Processes: ps aux, top, kill. Services: systemctl status/start/enable. Packages: apt update && apt upgrade.",
  },
  {
    title: "SQL quick reference",
    category: "Databases",
    session: "home",
    body:
      "SELECT cols FROM table WHERE condition ORDER BY col LIMIT n; JOIN connects tables on keys; GROUP BY aggregates. PRIMARY KEY uniquely identifies rows; FOREIGN KEY links tables. INSERT/UPDATE/DELETE modify data — always filter UPDATE/DELETE with WHERE.",
  },
  {
    title: "HTML & CSS layout notes",
    category: "Web Development",
    session: "home",
    body:
      "Use semantic tags (header/main/section/footer). Layout with Grid/Flex. Set a spacing + type scale for consistency. Add breakpoints (test 375 px and 1440 px). Keep forms accessible with labels and validation attributes.",
  },
  {
    title: "JavaScript DOM notes",
    category: "Web Development",
    session: "home",
    body:
      "Select elements with querySelector/querySelectorAll. Attach behaviour with addEventListener. Toggle UI state with classList. Validate forms with checkValidity() and preventDefault() on invalid submit. Keep logic out of the markup.",
  },
  {
    title: "Spreadsheet formulas",
    category: "Digital Operations",
    session: "home",
    body:
      "Tables + filters organise data. SUM totals, COUNTIF/SUMIF aggregate by condition, IF branches, VLOOKUP/XLOOKUP joins. Conditional formatting highlights deadlines. Validate inputs with data validation lists.",
  },
  {
    title: "AI prompting & responsible use",
    category: "AI Productivity",
    session: "home",
    body:
      "Structure prompts: role, task, context, constraints, output format. Always verify facts against a source. Never paste confidential or personal data. Use AI to draft and summarise, not to decide — you remain accountable for the output.",
  },
  {
    title: "SEO & local visibility",
    category: "Digital Marketing",
    session: "home",
    body:
      "Search intent drives keywords. Optimise titles, meta descriptions and headings. Write for people first. For local business, complete the Google Business Profile, use consistent name/address/phone, and gather reviews.",
  },
  {
    title: "Marketing metrics",
    category: "Digital Marketing",
    session: "home",
    body:
      "Track reach, impressions, engagement, clicks, leads and conversions. Know the funnel: awareness → interest → desire → action. Always label sample vs real data. Report KPIs against the campaign objective, not vanity numbers.",
  },
];

// ---------------------------------------------------------------------------
// Equipment & setup requirements
// ---------------------------------------------------------------------------

export interface EquipmentItem {
  name: string;
  category: string;
  session: SessionType;
  requirement: "Required" | "Recommended" | "Studio-provided";
  purpose: string;
  cost: string;
  notes?: string;
}

export const EQUIPMENT_CATALOG: EquipmentItem[] = [
  // Software — Home / IT
  { name: "Windows 10/11 workstation", category: "Operating System", session: "home", requirement: "Required", purpose: "All Windows troubleshooting, Microsoft 365 and IT support practice.", cost: "Existing device (or VM, free)" },
  { name: "Ubuntu Linux VM (VirtualBox) or WSL", category: "Operating System", session: "home", requirement: "Required", purpose: "Linux command-line and permissions labs.", cost: "Free" },
  { name: "Visual Studio Code", category: "Development Tool", session: "home", requirement: "Required", purpose: "HTML, CSS and JavaScript labs.", cost: "Free" },
  { name: "Git + GitHub account", category: "Development Tool", session: "home", requirement: "Required", purpose: "Version control and portfolio hosting.", cost: "Free" },
  { name: "PostgreSQL (local) or Supabase project", category: "Database", session: "home", requirement: "Required", purpose: "SQL schema and query practice.", cost: "Free tier" },
  { name: "Microsoft 365 or Google Workspace account", category: "Productivity Suite", session: "home", requirement: "Required", purpose: "Email, docs, spreadsheets, calendar and Digital Assistant practice.", cost: "Free web tier" },
  { name: "Google Skillshop & Analytics access", category: "Marketing Tool", session: "home", requirement: "Required", purpose: "Google Ads and Analytics learning.", cost: "Free" },
  { name: "HubSpot Academy account", category: "Marketing Tool", session: "home", requirement: "Recommended", purpose: "Free marketing/SEO/email certifications.", cost: "Free" },
  { name: "Adobe Illustrator", category: "Design Software", session: "studio", requirement: "Required", purpose: "Vector design and print-ready artwork.", cost: "Studio workstation / subscription" },
  { name: "Adobe Photoshop", category: "Design Software", session: "studio", requirement: "Required", purpose: "Photo editing and raster artwork.", cost: "Studio workstation / subscription" },
  { name: "Adobe Premiere Pro (or equivalent)", category: "Video Software", session: "studio", requirement: "Required", purpose: "Short-form video editing.", cost: "Studio workstation / subscription" },
  { name: "RDWorks / LaserWork", category: "Production Software", session: "studio", requirement: "Studio-provided", purpose: "Laser file preparation.", cost: "Studio-provided", notes: "Operator supervision required." },
  { name: "UV RIP software", category: "Production Software", session: "studio", requirement: "Studio-provided", purpose: "UV print artwork preparation.", cost: "Studio-provided", notes: "Operator supervision required." },

  // Hardware — Home / IT
  { name: "Laptop/PC (8 GB RAM min, 16 GB recommended)", category: "Hardware", session: "home", requirement: "Required", purpose: "Runs VMs, Adobe apps and development tools.", cost: "Owned device" },
  { name: "External SSD/HDD for backups", category: "Hardware", session: "home", requirement: "Required", purpose: "Backup and evidence storage.", cost: "Low" },
  { name: "Networking lab (router + switch, or VM)", category: "Hardware", session: "home", requirement: "Recommended", purpose: "Hands-on networking and diagnostics practice.", cost: "Low (second-hand) or free via VM" },

  // Studio equipment
  { name: "Camera (DSLR/mirrorless) + lens", category: "Studio Equipment", session: "studio", requirement: "Studio-provided", purpose: "Photography and video labs.", cost: "Studio-provided" },
  { name: "Tripod and lighting kit", category: "Studio Equipment", session: "studio", requirement: "Studio-provided", purpose: "Consistent product/person photography.", cost: "Studio-provided" },
  { name: "Laser cutter", category: "Production Machine", session: "studio", requirement: "Studio-provided", purpose: "Cut/engrave practice under supervision.", cost: "Studio-provided", notes: "⚠ Never operate unsupervised." },
  { name: "UV printer", category: "Production Machine", session: "studio", requirement: "Studio-provided", purpose: "UV print practice under supervision.", cost: "Studio-provided", notes: "⚠ Never operate unsupervised." },
  { name: "Large-format printer", category: "Production Machine", session: "studio", requirement: "Studio-provided", purpose: "Banner/wide-format output.", cost: "Studio-provided" },
  { name: "Colour calibration / CMYK swatch book", category: "Studio Consumable", session: "studio", requirement: "Recommended", purpose: "Accurate colour checking against print output.", cost: "Low" },
  { name: "Approved consumables (acrylic, plywood, banner media, ink)", category: "Studio Consumable", session: "studio", requirement: "Studio-provided", purpose: "Approved materials for production labs.", cost: "Studio-provided", notes: "Only use materials on the studio's approved list." },
];

// ---------------------------------------------------------------------------
// Seed builders — produce records the app inserts on first run
// ---------------------------------------------------------------------------

function uuid(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function buildSeedLabs(): LabSeed[] {
  return LAB_CATALOG.map((lab) => ({ id: uuid(), ...lab }));
}

export function buildSeedResources(): ResourceSeed[] {
  const courseResources: ResourceSeed[] = COURSE_RESOURCES.map((c) => ({
    id: uuid(),
    title: c.provider,
    resource_type: "tutorial",
    url: c.url,
    category: c.category,
    tags: `Course · ${c.cost}`,
    description: c.summary,
    related_discipline: c.category,
    related_session: "home",
    is_favorite: false,
  }));

  const noteResources: ResourceSeed[] = STUDY_NOTES.map((n) => ({
    id: uuid(),
    title: n.title,
    resource_type: "note",
    url: null,
    category: n.category,
    tags: `Study note · ${n.session}`,
    description: n.body,
    related_discipline: n.category,
    related_session: n.session,
    is_favorite: true,
  }));

  const equipmentResources: ResourceSeed[] = EQUIPMENT_CATALOG.map((e) => ({
    id: uuid(),
    title: e.name,
    resource_type: "tool",
    url: null,
    category: e.category,
    tags: `Equipment · ${e.requirement} · ${e.cost}`,
    description: `${e.purpose}${e.notes ? ` — ${e.notes}` : ""}`,
    related_discipline: e.category,
    related_session: e.session,
    is_favorite: e.requirement === "Required",
  }));

  return [...noteResources, ...courseResources, ...equipmentResources];
}

/** Totals used for the "starter content" summary in the UI. */
export const STARTER_CONTENT_COUNTS = {
  labs: LAB_CATALOG.length,
  notes: STUDY_NOTES.length,
  courses: COURSE_RESOURCES.length,
  equipment: EQUIPMENT_CATALOG.length,
};
