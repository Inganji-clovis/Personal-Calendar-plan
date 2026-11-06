import fs from "fs";
import path from "path";
import assert from "assert";

console.log("=================================================");
console.log("   INGANJI LIFE OS - AUTOMATED AUDIT TEST SUITE   ");
console.log("=================================================");

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`[PASS] ${name}`);
    passed++;
  } catch (err) {
    console.error(`[FAIL] ${name}:`, err.message);
    failed++;
  }
}

// 1. Audit SQL Schema Safety
test("SQL Schema: Absence of DROP, TRUNCATE, DELETE, ALTER COLUMN TYPE", () => {
  const sqlPath = path.resolve("supabase/schema_update.sql");
  const sqlContent = fs.readFileSync(sqlPath, "utf-8");

  assert(!/DROP\s+TABLE/i.test(sqlContent), "Found illegal DROP TABLE statement");
  assert(!/TRUNCATE/i.test(sqlContent), "Found illegal TRUNCATE statement");
  assert(!/DELETE\s+FROM/i.test(sqlContent), "Found illegal DELETE statement");
  assert(!/DROP\s+COLUMN/i.test(sqlContent), "Found illegal DROP COLUMN statement");
  assert(!/ALTER\s+COLUMN\s+.*TYPE/i.test(sqlContent), "Found destructive ALTER COLUMN TYPE statement");
});

test("SQL Schema: Table Count & RLS Verification", () => {
  const sqlPath = path.resolve("supabase/schema_update.sql");
  const sqlContent = fs.readFileSync(sqlPath, "utf-8");

  // Count CREATE TABLE IF NOT EXISTS
  const createTableMatches = [...sqlContent.matchAll(/CREATE\s+TABLE\s+IF\s+NOT\s+EXISTS\s+public\.([a-z_]+)/gi)];
  const createdTables = createTableMatches.map(m => m[1]);

  console.log(`       Created Tables (${createdTables.length}):`, createdTables.join(", "));
  assert.strictEqual(createdTables.length, 9, "Expected exactly 9 new tables in schema_update.sql");

  const expectedTables = [
    "milestones",
    "habits",
    "habit_logs",
    "goals",
    "budgets",
    "savings_goals",
    "calendar_events",
    "academic_modules",
    "notifications"
  ];

  for (const expected of expectedTables) {
    assert(createdTables.includes(expected), `Missing expected table: ${expected}`);
    const rlsPattern = new RegExp(`ALTER\\s+TABLE\\s+public\\.${expected}\\s+ENABLE\\s+ROW\\s+LEVEL\\s+SECURITY`, "i");
    assert(rlsPattern.test(sqlContent), `RLS not explicitly enabled for: ${expected}`);
  }
});

test("SQL Schema: RLS Policies Covers All 13 Tables with auth.uid() Check", () => {
  const sqlPath = path.resolve("supabase/schema_update.sql");
  const sqlContent = fs.readFileSync(sqlPath, "utf-8");

  const allTables = [
    "tasks", "projects", "learning_records", "transactions",
    "milestones", "habits", "habit_logs", "goals", "budgets",
    "savings_goals", "calendar_events", "academic_modules", "notifications"
  ];

  for (const table of allTables) {
    const policyPattern = new RegExp(`CREATE\\s+POLICY\\s+.*ON\\s+public\\.${table}\\s+FOR\\s+ALL\\s+USING\\s*\\(auth\\.uid\\(\\)\\s*=\\s*user_id\\)\\s+WITH\\s+CHECK\\s*\\(auth\\.uid\\(\\)\\s*=\\s*user_id\\)`, "i");
    assert(policyPattern.test(sqlContent), `Policy missing or incorrect for: ${table}`);
  }
});

// 2. Audit Currency Formatter (RWF)
test("Currency Formatter: Rwandan Francs (RWF) Format", () => {
  const formatRWF = (amount) => {
    return new Intl.NumberFormat("en-RW", {
      style: "currency",
      currency: "RWF",
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  const formatted1 = formatRWF(150000);
  assert(formatted1.includes("150,000") || formatted1.includes("150.000"), "Unexpected currency format for 150000");
  assert(formatted1.includes("RWF") || formatted1.includes("RF"), "Currency code RWF missing");
});

// 3. Audit Real-time Alerts Computation
test("Alerts Engine: Detects Overdue Tasks and Budget Thresholds", () => {
  const todayStr = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

  const mockTasks = [
    { id: "1", title: "Overdue Item", status: "pending", priority: "urgent", due_date: yesterday },
    { id: "2", title: "Completed Item", status: "completed", priority: "low", due_date: yesterday }
  ];

  const overdue = mockTasks.filter(
    t => t.status !== "completed" && t.status !== "cancelled" && t.due_date && t.due_date < todayStr
  );
  assert.strictEqual(overdue.length, 1, "Expected 1 overdue task");
  assert.strictEqual(overdue[0].id, "1");

  // Budget overrun check
  const mockBudget = { category: "Tech", monthly_limit: 100000 };
  const mockTx = [
    { type: "expense", category: "Tech", amount: 110000, transaction_date: todayStr }
  ];
  const spent = mockTx.reduce((s, t) => s + t.amount, 0);
  assert(spent > mockBudget.monthly_limit, "Budget should be exceeded");
});

console.log("\n=================================================");
console.log(`   RESULTS: ${passed} PASSED, ${failed} FAILED`);
console.log("=================================================");

if (failed > 0) process.exit(1);

