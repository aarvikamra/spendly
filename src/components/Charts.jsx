import { formatMoney } from "../utils/helpers.js";

export function SummaryCard({ title, amount, icon, description, tone, isPercent }) {
  return (
    <article className={`summary-card tone-${tone}`}>
      <div className="summary-card-top">
        <span className={`summary-icon ${tone}-icon`} aria-hidden="true">{icon}</span>
        <span className="summary-title">{title}</span>
      </div>
      <strong className="summary-amount">
        {isPercent ? `${amount.toFixed(0)}%` : formatMoney(amount)}
      </strong>
      <p className="summary-description">{description}</p>
    </article>
  );
}

export function ComparisonBar({ label, value, total, fill }) {
  const percentage = total ? (value / total) * 100 : 0;
  return (
    <div>
      <div className="bar-label">
        <span>{label}</span>
        <strong>{formatMoney(value)} · {percentage.toFixed(0)}%</strong>
      </div>
      <div className="progress-track">
        <div className={`progress-fill ${fill}`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}

export function CategoryBars({ items, total }) {
  return (
    <div className="bar-comparison">
      {items.map((item) => (
        <ComparisonBar key={item.category} label={item.category} value={item.total} total={total} fill="expense-fill" />
      ))}
    </div>
  );
}
