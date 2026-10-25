import { formatDate, formatMoney } from "../utils/helpers.js";

// Hidden on screen; App.css shows only this when printing
export default function PrintReport({ user, stats }) {
  const { sorted, totalIncome, totalExpenses, balance, categoryTotals } = stats;
  const generated = new Date().toLocaleString("en-IN", {
    day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
  });

  return (
    <section className="print-report" aria-hidden="true">
      <header className="report-header">
        <h1>Spendly financial report</h1>
        <p>Prepared for {user.name} ({user.email})</p>
        <p>Generated on {generated}</p>
      </header>

      <div className="report-summary">
        <div><span>Total income</span><strong>{formatMoney(totalIncome)}</strong></div>
        <div><span>Total expenses</span><strong>{formatMoney(totalExpenses)}</strong></div>
        <div><span>Net balance</span><strong>{formatMoney(balance)}</strong></div>
      </div>

      <h2>Expenses by category</h2>
      {categoryTotals.length === 0 ? (
        <p>No expenses recorded.</p>
      ) : (
        <table className="report-table">
          <thead>
            <tr><th>Category</th><th className="num">Amount</th><th className="num">Share</th></tr>
          </thead>
          <tbody>
            {categoryTotals.map((item) => (
              <tr key={item.category}>
                <td>{item.category}</td>
                <td className="num">{formatMoney(item.total)}</td>
                <td className="num">{totalExpenses ? ((item.total / totalExpenses) * 100).toFixed(1) : "0.0"}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2>All transactions</h2>
      {sorted.length === 0 ? (
        <p>No transactions recorded.</p>
      ) : (
        <table className="report-table">
          <thead>
            <tr><th>Date</th><th>Description</th><th>Category</th><th>Type</th><th className="num">Amount</th></tr>
          </thead>
          <tbody>
            {sorted.map((item) => (
              <tr key={item.id}>
                <td>{formatDate(item.date)}</td>
                <td>{item.title}</td>
                <td>{item.category}</td>
                <td>{item.type === "income" ? "Income" : "Expense"}</td>
                <td className="num">{item.type === "income" ? "+" : "−"}{formatMoney(item.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
