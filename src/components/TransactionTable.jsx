import { memo } from "react";
import { Link } from "react-router-dom";
import { formatDate, formatMoney } from "../utils/helpers.js";

const Row = memo(function Row({ item, onEdit, onDelete }) {
  const income = item.type === "income";
  return (
    <tr>
      <td>
        <div className="transaction-name">
          <span className={`transaction-type-icon ${item.type}`} aria-hidden="true">
            {income ? "↗" : "↘"}
          </span>
          <div>
            <Link to={`/transactions/${item.id}`}>
              <strong>{item.title}</strong>
            </Link>
            <small className="mobile-meta">{item.category} · {formatDate(item.date)}</small>
          </div>
        </div>
      </td>
      <td className="col-category"><span className="category-pill">{item.category}</span></td>
      <td className="col-date date-cell">{formatDate(item.date)}</td>
      <td className={income ? "income-text" : "expense-text"}>
        {income ? "+" : "−"}{formatMoney(item.amount)}
      </td>
      <td>
        <div className="table-actions">
          <button type="button" className="icon-btn" title="Edit transaction" aria-label={`Edit ${item.title}`} onClick={() => onEdit(item)}>✎</button>
          <button type="button" className="icon-btn delete-btn" title="Delete transaction" aria-label={`Delete ${item.title}`} onClick={() => onDelete(item.id)}>×</button>
        </div>
      </td>
    </tr>
  );
});

export default function TransactionTable({ items, onEdit, onDelete, emptyMessage = "No transactions yet." }) {
  if (items.length === 0) {
    return (
      <div className="empty-block">
        <span aria-hidden="true">🌸</span>
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <table className="transactions-table">
        <thead>
          <tr>
            <th>Transaction</th>
            <th className="col-category">Category</th>
            <th className="col-date">Date</th>
            <th>Amount</th>
            <th><span className="visually-hidden">Actions</span></th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <Row key={item.id} item={item} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
