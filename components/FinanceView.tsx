import React, { useState, useMemo } from "react";
import {
  Wallet,
  CircleDollarSign,
  Plus,
  Trash2,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  AlertTriangle,
  ArrowDownLeft,
  ArrowUpRight,
  Filter
} from "lucide-react";
import type { Transaction, Budget, SavingsGoal } from "@/lib/supabase";
import { formatRWF } from "@/lib/dataService";

interface FinanceViewProps {
  transactions: Transaction[];
  budgets: Budget[];
  savingsGoals: SavingsGoal[];
  searchQuery: string;
  onOpenCreateTransaction: () => void;
  onOpenCreateBudget: () => void;
  onOpenCreateSavingsGoal: () => void;
  onDeleteTransaction: (id: string) => void;
  onDeleteBudget: (id: string) => void;
  onDeleteSavingsGoal: (id: string) => void;
  onUpdateSavingsAmount: (goal: SavingsGoal, delta: number) => void;
}

export const FinanceView: React.FC<FinanceViewProps> = ({
  transactions,
  budgets,
  savingsGoals,
  searchQuery,
  onOpenCreateTransaction,
  onOpenCreateBudget,
  onOpenCreateSavingsGoal,
  onDeleteTransaction,
  onDeleteBudget,
  onDeleteSavingsGoal,
  onUpdateSavingsAmount
}) => {
  const [typeFilter, setTypeFilter] = useState<"all" | "income" | "expense">("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const todayStr = new Date().toISOString().slice(0, 10);
  const currentMonthStr = todayStr.slice(0, 7); // YYYY-MM

  // Totals
  const totalIncome = useMemo(
    () => transactions.filter(t => t.type === "income").reduce((s, t) => s + Number(t.amount || 0), 0),
    [transactions]
  );
  const totalExpense = useMemo(
    () => transactions.filter(t => t.type === "expense").reduce((s, t) => s + Number(t.amount || 0), 0),
    [transactions]
  );
  const netBalance = totalIncome - totalExpense;

  // Current month expenses by category
  const currentMonthTransactions = useMemo(
    () => transactions.filter(t => t.transaction_date.startsWith(currentMonthStr)),
    [transactions, currentMonthStr]
  );

  const monthExpense = useMemo(
    () => currentMonthTransactions.filter(t => t.type === "expense").reduce((s, t) => s + Number(t.amount || 0), 0),
    [currentMonthTransactions]
  );
  const monthIncome = useMemo(
    () => currentMonthTransactions.filter(t => t.type === "income").reduce((s, t) => s + Number(t.amount || 0), 0),
    [currentMonthTransactions]
  );

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      if (typeFilter !== "all" && t.type !== typeFilter) return false;
      if (selectedCategory !== "all" && t.category !== selectedCategory) return false;
      if (searchQuery) {
        const text = `${t.category} ${t.description || ""}`.toLowerCase();
        if (!text.includes(searchQuery.toLowerCase())) return false;
      }
      return true;
    });
  }, [transactions, typeFilter, selectedCategory, searchQuery]);

  // Unique categories
  const categories = useMemo(() => {
    const set = new Set(transactions.map(t => t.category));
    return Array.from(set);
  }, [transactions]);

  return (
    <div>
      <div className="page-heading">
        <div>
          <p className="eyebrow">FINANCIAL ASSETS & DISCIPLINE (RWF)</p>
          <h2>Finance & Cashflow</h2>
          <p className="muted">
            Track income, operating expenses, monthly category budgets, and savings reserves in Rwandan Francs (RWF).
          </p>
        </div>
        <div className="header-actions">
          <button className="secondary" onClick={onOpenCreateBudget}>
            <Plus size={15} /> Set Budget
          </button>
          <button className="secondary" onClick={onOpenCreateSavingsGoal}>
            <PiggyBank size={15} /> Savings Goal
          </button>
          <button className="primary" onClick={onOpenCreateTransaction}>
            <Plus size={15} /> Record Transaction
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <Wallet size={20} />
          </div>
          <p>Net Available Balance</p>
          <h3 style={{ color: netBalance >= 0 ? "#34d399" : "#fb7185" }}>
            {formatRWF(netBalance)}
          </h3>
          <small>Cumulative cashflow balance</small>
        </div>

        <div className="stat-card">
          <div className="stat-icon blue">
            <ArrowDownLeft size={20} />
          </div>
          <p>Total Recorded Income</p>
          <h3 style={{ color: "#34d399" }}>{formatRWF(totalIncome)}</h3>
          <small>This month: + {formatRWF(monthIncome)}</small>
        </div>

        <div className="stat-card">
          <div className="stat-icon red">
            <ArrowUpRight size={20} />
          </div>
          <p>Total Expenses</p>
          <h3 style={{ color: "#fb7185" }}>{formatRWF(totalExpense)}</h3>
          <small>This month: - {formatRWF(monthExpense)}</small>
        </div>

        <div className="stat-card">
          <div className="stat-icon amber">
            <PiggyBank size={20} />
          </div>
          <p>Savings Reserves</p>
          <h3>
            {formatRWF(savingsGoals.reduce((s, g) => s + Number(g.current_amount || 0), 0))}
          </h3>
          <small>{savingsGoals.length} designated savings funds</small>
        </div>
      </div>

      {/* Budgets & Savings Goals Grid */}
      <div className="dashboard-grid">
        {/* Monthly Budgets */}
        <section className="panel">
          <div className="panel-head">
            <div>
              <h3>Monthly Category Budgets</h3>
              <p className="muted">Spend limits vs actual outlays for {currentMonthStr}</p>
            </div>
            <button className="secondary" onClick={onOpenCreateBudget} style={{ fontSize: 11 }}>
              <Plus size={13} /> Add Budget
            </button>
          </div>

          {budgets.length === 0 ? (
            <div className="empty">
              <CircleDollarSign size={28} />
              <b>No category budgets set</b>
              <p className="muted">Set limits for Transport, Tech/Cloud, Food, Tuition, or Studio operations.</p>
              <button className="secondary" onClick={onOpenCreateBudget} style={{ marginTop: 8 }}>
                <Plus size={13} /> Define Budget
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {budgets.map(b => {
                const spent = currentMonthTransactions
                  .filter(t => t.type === "expense" && t.category.toLowerCase() === b.category.toLowerCase())
                  .reduce((sum, t) => sum + Number(t.amount || 0), 0);
                const limit = Number(b.monthly_limit) || 1;
                const pct = Math.min(100, Math.round((spent / limit) * 100));
                const isOver = spent >= limit;
                const isWarning = spent >= limit * 0.85 && !isOver;

                return (
                  <div key={b.id} style={{ background: "var(--panel-alt)", padding: 14, borderRadius: 10, border: "1px solid var(--line)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <b>{b.category}</b>
                        {isOver && (
                          <span className="badge priority-urgent" style={{ fontSize: 9 }}>
                            Exceeded
                          </span>
                        )}
                        {isWarning && (
                          <span className="badge priority-medium" style={{ fontSize: 9 }}>
                            85%+ Limit
                          </span>
                        )}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: isOver ? "#fb7185" : "inherit" }}>
                          {formatRWF(spent)} / {formatRWF(limit)}
                        </span>
                        <button className="icon-btn danger" onClick={() => onDeleteBudget(b.id)} style={{ padding: 2 }}>
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                    <div className="progress-bar-bg" style={{ margin: "8px 0 0", height: 6 }}>
                      <div
                        className="progress-bar-fill"
                        style={{
                          width: `${pct}%`,
                          background: isOver
                            ? "linear-gradient(90deg, #f43f5e, #fb7185)"
                            : isWarning
                            ? "linear-gradient(90deg, #f59e0b, #fbbf24)"
                            : "linear-gradient(90deg, #10b981, #34d399)"
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Savings Goals */}
        <section className="panel">
          <div className="panel-head">
            <div>
              <h3>Savings Funds & Reserves</h3>
              <p className="muted">Capital accumulation for equipment, emergencies & investments</p>
            </div>
            <button className="secondary" onClick={onOpenCreateSavingsGoal} style={{ fontSize: 11 }}>
              <Plus size={13} /> New Fund
            </button>
          </div>

          {savingsGoals.length === 0 ? (
            <div className="empty">
              <PiggyBank size={28} />
              <b>No savings funds configured</b>
              <p className="muted">Create funds for "Studio Audio Gear", "Tuition Reserve", or "Emergency Buffer".</p>
              <button className="secondary" onClick={onOpenCreateSavingsGoal} style={{ marginTop: 8 }}>
                <Plus size={13} /> Create Savings Fund
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {savingsGoals.map(sg => {
                const target = Number(sg.target_amount) || 1;
                const current = Number(sg.current_amount) || 0;
                const pct = Math.min(100, Math.round((current / target) * 100));

                return (
                  <div key={sg.id} style={{ background: "var(--panel-alt)", padding: 14, borderRadius: 10, border: "1px solid var(--line)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <b>{sg.title}</b>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: "var(--accent-light)" }}>
                          {formatRWF(current)} / {formatRWF(target)} ({pct}%)
                        </span>
                        <button className="icon-btn danger" onClick={() => onDeleteSavingsGoal(sg.id)} style={{ padding: 2 }}>
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>

                    <div className="progress-bar-bg" style={{ margin: "8px 0 8px", height: 6 }}>
                      <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
                      <span className="muted" style={{ fontSize: 10.5 }}>
                        {sg.target_date ? `Target: ${sg.target_date}` : "Ongoing reserve"}
                      </span>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button
                          className="secondary"
                          onClick={() => onUpdateSavingsAmount(sg, 10000)}
                          style={{ padding: "3px 8px", fontSize: 10.5 }}
                        >
                          + 10,000 RWF
                        </button>
                        <button
                          className="secondary"
                          onClick={() => onUpdateSavingsAmount(sg, 50000)}
                          style={{ padding: "3px 8px", fontSize: 10.5 }}
                        >
                          + 50,000 RWF
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* Transactions Ledger */}
      <section className="panel">
        <div className="panel-head">
          <div>
            <h3>Transactions Ledger ({filteredTransactions.length})</h3>
            <p className="muted">Detailed chronological record of revenues and disbursements in RWF</p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value as any)}
              style={{
                background: "#0d131a",
                border: "1px solid var(--line)",
                borderRadius: 6,
                padding: "6px 10px",
                fontSize: 12,
                color: "var(--text)"
              }}
            >
              <option value="all">All Types</option>
              <option value="income">Income Only</option>
              <option value="expense">Expense Only</option>
            </select>

            {categories.length > 0 && (
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                style={{
                  background: "#0d131a",
                  border: "1px solid var(--line)",
                  borderRadius: 6,
                  padding: "6px 10px",
                  fontSize: 12,
                  color: "var(--text)"
                }}
              >
                <option value="all">All Categories</option>
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            )}
          </div>
        </div>

        {filteredTransactions.length === 0 ? (
          <div className="empty">
            <Wallet size={30} />
            <b>No transactions found</b>
            <p className="muted">
              {transactions.length === 0
                ? "Record your first income or expense transaction."
                : "No transactions match your current filters."}
            </p>
            <button className="primary" onClick={onOpenCreateTransaction} style={{ marginTop: 10 }}>
              <Plus size={15} /> Record Transaction
            </button>
          </div>
        ) : (
          filteredTransactions.map(tx => {
            const isIncome = tx.type === "income";
            return (
              <div className="task-row" key={tx.id}>
                <div className={`money-icon ${tx.type}`}>
                  {isIncome ? "+" : "−"}
                </div>
                <div className="row-main">
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <b>{tx.category}</b>
                    <span className="badge" style={{ fontSize: 9.5 }}>
                      {tx.type}
                    </span>
                  </div>
                  <small>
                    {tx.description && `${tx.description} · `}
                    {tx.transaction_date}
                  </small>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <strong className={isIncome ? "positive" : "negative"} style={{ fontSize: 14 }}>
                    {isIncome ? "+" : "−"} {formatRWF(Number(tx.amount))}
                  </strong>
                  <button className="icon-btn danger" onClick={() => onDeleteTransaction(tx.id)} title="Delete transaction">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </section>
    </div>
  );
};

