import { NavLink, Outlet, useOutletContext } from "react-router-dom";
import { CategoryBars, ComparisonBar } from "../components/Charts.jsx";
import useStats from "../hooks/useStats.js";
import { formatMoney } from "../utils/helpers.js";

// Parent of the nested routes /analytics/overview and /analytics/categories
export default function Analytics() {
  const stats = useStats();

  return (
    <section className="content-card analytics-page">
      <div className="section-heading">
        <div>
          <h2>Financial analytics</h2>
          <p>Your income and expense breakdown.</p>
        </div>
      </div>

      <div className="analytics-total-grid">
        <div className="analytics-total income-panel"><span>Income</span><strong>{formatMoney(stats.totalIncome)}</strong></div>
        <div className="analytics-total expense-panel"><span>Expenses</span><strong>{formatMoney(stats.totalExpenses)}</strong></div>
        <div className="analytics-total balance-panel"><span>Balance</span><strong>{formatMoney(stats.balance)}</strong></div>
      </div>

      <nav className="tabs" aria-label="Analytics views">
        <NavLink to="overview" className="tab">Income vs expenses</NavLink>
        <NavLink to="categories" className="tab">By category</NavLink>
      </nav>

      <Outlet context={stats} />
    </section>
  );
}

export function Overview() {
  const { totalIncome, totalExpenses } = useOutletContext();
  const total = totalIncome + totalExpenses;
  return (
    <div className="bar-comparison">
      <ComparisonBar label="Income" value={totalIncome} total={total} fill="income-fill" />
      <ComparisonBar label="Expenses" value={totalExpenses} total={total} fill="expense-fill" />
    </div>
  );
}

export function Categories() {
  const { categoryTotals, totalExpenses } = useOutletContext();
  if (categoryTotals.length === 0) return <p className="muted-text">No expenses recorded yet.</p>;
  return <CategoryBars items={categoryTotals} total={totalExpenses} />;
}
