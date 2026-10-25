import { useCallback, useEffect, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import Brand from "./Brand.jsx";
import Modal from "./Modal.jsx";
import PrintReport from "./PrintReport.jsx";
import TransactionForm from "./TransactionForm.jsx";
import { Spinner } from "./Feedback.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { useStore } from "../store/useStore.js";
import useStats from "../hooks/useStats.js";
import { NAVIGATION, downloadCSV } from "../utils/helpers.js";

// Shared page layout: sidebar + top bar + <Outlet /> for the active page
export default function Layout() {
  const { user, logout } = useAuth();
  const toast = useToast();
  const { pathname } = useLocation();

  const storeEmail = useStore((s) => s.email);
  const loadUser = useStore((s) => s.loadUser);
  const addTransaction = useStore((s) => s.addTransaction);
  const updateTransaction = useStore((s) => s.updateTransaction);
  const deleteTransaction = useStore((s) => s.deleteTransaction);
  const stats = useStats();

  const [form, setForm] = useState({ open: false, editing: null });

  useEffect(() => {
    loadUser(user.email);
  }, [user.email, loadUser]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);

  const openForm = useCallback((transaction = null) => setForm({ open: true, editing: transaction }), []);
  const closeForm = useCallback(() => setForm({ open: false, editing: null }), []);

  const handleSave = useCallback(
    (data) => {
      if (form.editing) {
        updateTransaction(form.editing.id, data);
        toast("Transaction updated");
      } else {
        addTransaction(data);
        toast("Transaction added");
      }
      closeForm();
    },
    [form.editing, addTransaction, updateTransaction, toast, closeForm]
  );

  const handleDelete = useCallback(
    (id) => {
      if (!window.confirm("Are you sure you want to delete this transaction?")) return false;
      deleteTransaction(id);
      toast("Transaction deleted", "info");
      return true;
    },
    [deleteTransaction, toast]
  );

  // wait until this user's data is loaded
  if (storeEmail !== user.email) return <Spinner label="Loading your data…" />;

  const current = NAVIGATION.find((n) => (n.end ? pathname === n.to : pathname.startsWith(n.to)));
  const firstName = user.name.split(" ")[0];

  return (
    <div className="spendly-app">
      <aside className="sidebar">
        <Brand />
        <p className="sidebar-label">MENU</p>

        <nav className="sidebar-nav" aria-label="Main">
          {NAVIGATION.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className="nav-item">
              <span className="nav-icon" aria-hidden="true">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="money-tip">
          <span aria-hidden="true">💡</span>
          <div>
            <strong>Money tip</strong>
            <p>Track small expenses. They add up!</p>
          </div>
        </div>

        <div className="sidebar-bottom">
          <div className="profile-avatar">{user.name.charAt(0).toUpperCase()}</div>
          <div className="profile-info">
            <strong>{user.name}</strong>
            <p>{user.email}</p>
          </div>
          <button type="button" className="logout-btn" title="Sign out" aria-label="Sign out" onClick={logout}>⎋</button>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="page-heading">
            <p className="eyebrow">Personal finance</p>
            <h1>{current ? current.label : "Spendly"}</h1>
          </div>

          <div className="topbar-actions">
            <div className="user-chip">
              <span className="user-chip-avatar" aria-hidden="true">{user.name.charAt(0).toUpperCase()}</span>
              <span>{firstName}</span>
            </div>
            <button type="button" className="secondary-btn" onClick={() => downloadCSV(stats.sorted)}>Export CSV</button>
            <button type="button" className="secondary-btn" onClick={() => window.print()}>Print report</button>
            <button type="button" className="primary-btn" onClick={() => openForm()}>+ Add transaction</button>
          </div>
        </header>

        <Outlet context={{ openForm, handleDelete }} />

        <footer className="app-footer">
          <span>Spendly © 2026</span>
          <span>Make every rupee count.</span>
        </footer>
      </main>

      {form.open && (
        <Modal title={form.editing ? "Edit transaction" : "Add transaction"} onClose={closeForm}>
          <TransactionForm initial={form.editing} onSubmit={handleSave} onCancel={closeForm} />
        </Modal>
      )}

      <PrintReport user={user} stats={stats} />
    </div>
  );
}
