export const USERS_KEY = "spendly-users";
export const SESSION_KEY = "spendly-session";

export const CATEGORIES = [
  "Food", "Shopping", "Transport", "Bills", "Education",
  "Health", "Entertainment", "Salary", "Freelance", "Other",
];

export const NAVIGATION = [
  { label: "Dashboard", icon: "🏠", to: "/", end: true },
  { label: "Transactions", icon: "💸", to: "/transactions" },
  { label: "Analytics", icon: "📊", to: "/analytics" },
  { label: "Budgets", icon: "🎯", to: "/budgets" },
  { label: "Rates", icon: "🌍", to: "/rates" },
  { label: "Settings", icon: "⚙️", to: "/settings" },
];

export const SAMPLE_TRANSACTIONS = [
  { id: 1, title: "Monthly Salary", category: "Salary", amount: 45000, type: "income", date: "2026-10-01" },
  { id: 2, title: "Grocery Shopping", category: "Food", amount: 1800, type: "expense", date: "2026-10-03" },
  { id: 3, title: "Internet Bill", category: "Bills", amount: 799, type: "expense", date: "2026-10-05" },
  { id: 4, title: "Freelance Work", category: "Freelance", amount: 5000, type: "income", date: "2026-10-10" },
];

export const formatMoney = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);

export const formatDate = (iso) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

// Local date (not UTC) so the default date is right in every timezone
export function todayISO() {
  const d = new Date();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
}

/* ---------- Browser storage + JSON ---------- */

export function readJSON(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

export function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable */
  }
}

export function readString(key, fallback) {
  try {
    return localStorage.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
}

export async function hashPassword(password, salt) {
  const data = new TextEncoder().encode(`${salt}:${password}`);
  const buffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

/* ---------- Form validation ---------- */

export function validateTransaction(values) {
  const errors = {};
  const amount = Number(values.amount);

  if (!values.title.trim()) errors.title = "Enter a title.";
  else if (values.title.trim().length > 60) errors.title = "Keep the title under 60 characters.";

  if (!values.amount) errors.amount = "Enter an amount.";
  else if (!(amount > 0)) errors.amount = "Amount must be greater than zero.";

  if (!values.date) errors.date = "Pick a date.";
  return errors;
}

export function validateAuth(mode, values) {
  const errors = {};
  const isRegister = mode === "register";

  if (isRegister && !values.name.trim()) errors.name = "Enter your name.";

  if (!values.email.trim()) errors.email = "Enter your email.";
  else if (!/^\S+@\S+\.\S+$/.test(values.email.trim())) errors.email = "Enter a valid email address.";

  if (!values.password) errors.password = "Enter your password.";
  else if (isRegister && values.password.length < 6) errors.password = "Use at least 6 characters.";

  if (isRegister && values.confirm !== values.password) errors.confirm = "The passwords do not match.";
  return errors;
}

/* ---------- CSV export ---------- */

export function downloadCSV(transactions) {
  const headings = ["Title", "Category", "Type", "Amount", "Date"];
  const rows = transactions.map((t) => [t.title, t.category, t.type, t.amount, t.date]);

  const csv = [headings, ...rows]
    .map((row) => row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
    .join("\n");

  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "spendly-transactions.csv";
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
