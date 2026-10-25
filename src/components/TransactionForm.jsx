import { useEffect, useRef, useState } from "react";
import Field from "./Field.jsx";
import { CATEGORIES, todayISO, validateTransaction } from "../utils/helpers.js";

// Controlled form + validation + autofocus with useRef
export default function TransactionForm({ initial, onSubmit, onCancel }) {
  const [values, setValues] = useState(() =>
    initial
      ? {
          title: initial.title,
          category: initial.category,
          amount: String(initial.amount),
          type: initial.type,
          date: initial.date,
        }
      : { title: "", category: "Food", amount: "", type: "expense", date: todayISO() }
  );
  const [errors, setErrors] = useState({});
  const formRef = useRef(null);

  useEffect(() => {
    formRef.current?.querySelector("input")?.focus();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((previous) => ({ ...previous, [name]: value }));
    setErrors((previous) => ({ ...previous, [name]: undefined }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const found = validateTransaction(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    onSubmit({ ...values, title: values.title.trim(), amount: Number(values.amount) });
  }

  return (
    <form ref={formRef} className="transaction-form" onSubmit={handleSubmit} noValidate>
      <Field
        label="Transaction title"
        id="title"
        name="title"
        type="text"
        placeholder="e.g. Grocery shopping"
        value={values.title}
        onChange={handleChange}
        error={errors.title}
      />

      <div className="form-two-columns">
        <Field
          label="Amount (₹)"
          id="amount"
          name="amount"
          type="number"
          inputMode="decimal"
          step="0.01"
          placeholder="0.00"
          value={values.amount}
          onChange={handleChange}
          error={errors.amount}
        />
        <Field label="Transaction type" id="type" name="type" as="select" value={values.type} onChange={handleChange}>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </Field>
      </div>

      <div className="form-two-columns">
        <Field label="Category" id="category" name="category" as="select" value={values.category} onChange={handleChange}>
          {CATEGORIES.map((category) => (
            <option key={category}>{category}</option>
          ))}
        </Field>
        <Field
          label="Date"
          id="date"
          name="date"
          type="date"
          value={values.date}
          onChange={handleChange}
          error={errors.date}
        />
      </div>

      <div className="modal-actions">
        <button type="button" className="secondary-btn" onClick={onCancel}>Cancel</button>
        <button type="submit" className="primary-btn">
          {initial ? "Save changes" : "Add transaction"}
        </button>
      </div>
    </form>
  );
}
