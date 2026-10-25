import { Link, useOutletContext } from "react-router-dom";
import { CategoryBars, SummaryCard } from "../components/Charts.jsx";
import TransactionTable from "../components/TransactionTable.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import useStats from "../hooks/useStats.js";

export default function Dashboard() {
  const { user } = useAuth();
  const { openForm, handleDelete } = useOutletContext();
  const { sorted, totalIncome, totalExpenses, balance, savingsRate, categoryTotals } = useStats();
  const firstName = user.name.split(" ")[0];

  return (
    <>
      <section className="welcome-card">
        <div className="welcome-content">
          <p className="welcome-hello">Welcome back, {firstName}</p>
          <h2>Let&rsquo;s keep your <span>finances healthy.</span></h2>
          <p>Track your income, expenses and savings all in one place.</p>
        </div>
        <div className="welcome-art" aria-hidden="true">
          <span className="art-rupee">₹</span>
          <span className="art-tile">📈</span>
        </div>
      </section>

      <section className="summary-grid">
        <SummaryCard title="Total balance" amount={balance} icon="💰" tone="balance" description="Available balance" />
        <SummaryCard title="Total income" amount={totalIncome} icon="↗" tone="income" description="Money received" />
        <SummaryCard title="Total expenses" amount={totalExpenses} icon="↘" tone="expense" description="Money spent" />
        <SummaryCard title="Savings rate" amount={savingsRate} icon="🌱" tone="savings" description="Share of income you keep" isPercent />
      </section>

      <div className="dashboard-grid">
        <section className="content-card">
          <div className="section-heading">
            <div>
              <h2>Recent transactions</h2>
              <p>Your latest money activity</p>
            </div>
            <Link className="text-btn" to="/transactions">View all →</Link>
          </div>
          <TransactionTable
            items={sorted.slice(0, 6)}
            onEdit={openForm}
            onDelete={handleDelete}
            emptyMessage="No transactions yet. Add your first one."
          />
        </section>

        <section className="content-card spending-card">
          <div className="section-heading">
            <div>
              <h2>Spending overview</h2>
              <p>Where your money goes</p>
            </div>
          </div>

          {categoryTotals.length === 0 ? (
            <div className="empty-block">
              <span aria-hidden="true">🌱</span>
              <p>Add expenses to see your spending overview.</p>
            </div>
          ) : (
            <CategoryBars items={categoryTotals.slice(0, 4)} total={totalExpenses} />
          )}

          <Link className="wide-secondary-btn" to="/analytics">
            <span>View analytics</span>
            <span aria-hidden="true">›</span>
          </Link>
        </section>
      </div>
    </>
  );
}
