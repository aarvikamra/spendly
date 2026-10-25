import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import useStats from "../hooks/useStats.js";
import { useStore } from "../store/useStore.js";
import { downloadCSV } from "../utils/helpers.js";

export default function Settings() {
  const { user, logout } = useAuth();
  const toast = useToast();
  const { sorted } = useStats();
  const clearTransactions = useStore((s) => s.clearTransactions);

  function handleClear() {
    if (window.confirm("Delete ALL your transactions? This cannot be undone.")) {
      clearTransactions();
      toast("All transactions deleted", "info");
    }
  }

  return (
    <section className="content-card settings-page">
      <div className="section-heading">
        <div>
          <h2>Settings</h2>
          <p>Manage your Spendly data and account.</p>
        </div>
      </div>

      <div className="settings-row">
        <div><strong>Export your data</strong><p>Download all your transactions as a CSV file.</p></div>
        <button type="button" className="secondary-btn" onClick={() => downloadCSV(sorted)}>Export CSV</button>
      </div>

      <div className="settings-row">
        <div><strong>Financial report</strong><p>Print or save the financial report as a PDF.</p></div>
        <button type="button" className="secondary-btn" onClick={() => window.print()}>Print report</button>
      </div>

      <div className="settings-row">
        <div><strong>Delete all transactions</strong><p>Start again with an empty list.</p></div>
        <button type="button" className="danger-btn" onClick={handleClear}>Delete all</button>
      </div>

      <div className="settings-row">
        <div><strong>Signed in as {user.email}</strong><p>Sign out to switch accounts.</p></div>
        <button type="button" className="danger-btn" onClick={logout}>Sign out</button>
      </div>
    </section>
  );
}
