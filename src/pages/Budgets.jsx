import { useState } from "react";
import Field from "../components/Field.jsx";
import { useToast } from "../context/ToastContext.jsx";
import useStats from "../hooks/useStats.js";
import { useStore } from "../store/useStore.js";
import { formatMoney } from "../utils/helpers.js";

export default function Budgets() {
  const toast = useToast();
  const budget = useStore((s) => s.budget);
  const setBudget = useStore((s) => s.setBudget);
  const { monthExpenses } = useStats();

  const [value, setValue] = useState(String(budget));
  const [error, setError] = useState("");

  const percentage = budget ? Math.min((monthExpenses / budget) * 100, 100) : 0;
  const overBudget = monthExpenses > budget;

  function handleSubmit(event) {
    event.preventDefault();
    const amount = Number(value);
    if (value === "" || Number.isNaN(amount) || amount < 0) {
      setError("Enter an amount of 0 or more.");
      return;
    }
    setError("");
    setBudget(amount);
    toast("Budget saved");
  }

  return (
    <section className="content-card budget-page">
      <div className="section-heading">
        <div>
          <h2>Monthly budget</h2>
          <p>Keep this month&rsquo;s spending within your target.</p>
        </div>
      </div>

      <form className="budget-form" onSubmit={handleSubmit} noValidate>
        <Field label="Budget amount (₹)" id="monthly-budget" type="number" inputMode="decimal" min="0" step="1"
          value={value} onChange={(e) => { setValue(e.target.value); setError(""); }} error={error} />
        <button className="primary-btn" type="submit">Save budget</button>
      </form>

      <div className="budget-stats">
        <div><span>Spent this month</span><strong>{formatMoney(monthExpenses)}</strong></div>
        <div><span>Budget</span><strong>{formatMoney(budget)}</strong></div>
        <div>
          <span>Remaining</span>
          <strong className={overBudget ? "expense-text" : ""}>{formatMoney(budget - monthExpenses)}</strong>
        </div>
      </div>

      <div className="budget-progress-heading">
        <span>Budget used</span>
        <strong>{percentage.toFixed(0)}%</strong>
      </div>
      <div className="progress-track">
        <div className={`progress-fill ${overBudget ? "expense-fill" : "income-fill"}`} style={{ width: `${percentage}%` }} />
      </div>

      <p className="muted-text">
        {budget === 0
          ? "Enter a budget above zero to track your spending."
          : overBudget
          ? "You have exceeded your budget for this month."
          : `${Math.max(0, 100 - percentage).toFixed(1)}% of your budget remains.`}
      </p>
    </section>
  );
}
