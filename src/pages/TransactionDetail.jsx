import { Link, useNavigate, useOutletContext, useParams } from "react-router-dom";
import { useStore } from "../store/useStore.js";
import { formatDate, formatMoney } from "../utils/helpers.js";

// Dynamic route: /transactions/:id
export default function TransactionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { openForm, handleDelete } = useOutletContext();
  const item = useStore((s) => s.transactions.find((t) => String(t.id) === id));

  if (!item) {
    return (
      <section className="content-card">
        <div className="empty-block">
          <span aria-hidden="true">🔍</span>
          <p>We couldn&rsquo;t find that transaction. It may have been deleted.</p>
          <Link className="text-btn" to="/transactions">Back to transactions</Link>
        </div>
      </section>
    );
  }

  const income = item.type === "income";

  return (
    <section className="content-card detail-card">
      <Link className="text-btn" to="/transactions">← Back to transactions</Link>

      <h2 className="detail-title">{item.title}</h2>
      <p className={`detail-amount ${income ? "income-text" : "expense-text"}`}>
        {income ? "+" : "−"}{formatMoney(item.amount)}
      </p>

      <dl className="detail-grid">
        <div><dt>Type</dt><dd>{income ? "Income" : "Expense"}</dd></div>
        <div><dt>Category</dt><dd>{item.category}</dd></div>
        <div><dt>Date</dt><dd>{formatDate(item.date)}</dd></div>
        <div><dt>Reference</dt><dd>#{item.id}</dd></div>
      </dl>

      <div className="detail-actions">
        <button type="button" className="secondary-btn" onClick={() => openForm(item)}>Edit</button>
        <button
          type="button"
          className="danger-btn"
          onClick={() => handleDelete(item.id) && navigate("/transactions")}
        >
          Delete
        </button>
      </div>
    </section>
  );
}
