import { useEffect, useMemo, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import Dropdown from "../components/Dropdown.jsx";
import Tabs from "../components/Tabs.jsx";
import TransactionTable from "../components/TransactionTable.jsx";
import useDebounce from "../hooks/useDebounce.js";
import useStats from "../hooks/useStats.js";
import { CATEGORIES } from "../utils/helpers.js";

const PAGE_SIZE = 5;

const TYPE_OPTIONS = [
  { value: "all", label: "All types" },
  { value: "income", label: "Income only" },
  { value: "expense", label: "Expenses only" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "highest", label: "Highest amount" },
  { value: "lowest", label: "Lowest amount" },
];

const CATEGORY_OPTIONS = [
  { value: "all", label: "All categories" },
  ...CATEGORIES.map((c) => ({ value: c, label: c })),
];

const VIEW_TABS = [
  { id: "pages", label: "Pages" },
  { id: "scroll", label: "Infinite scroll" },
];

export default function Transactions() {
  const { openForm, handleDelete } = useOutletContext();
  const { sorted } = useStats();

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300); // filter runs 300 ms after typing stops
  const [type, setType] = useState("all");
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [view, setView] = useState("pages");
  const [page, setPage] = useState(1);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const sentinelRef = useRef(null);

  const filtered = useMemo(() => {
    const query = debouncedSearch.trim().toLowerCase();
    const list = sorted.filter(
      (item) =>
        (type === "all" || item.type === type) &&
        (category === "all" || item.category === category) &&
        (item.title.toLowerCase().includes(query) || item.category.toLowerCase().includes(query))
    );
    if (sortBy === "oldest") list.sort((a, b) => new Date(a.date) - new Date(b.date) || a.id - b.id);
    if (sortBy === "highest") list.sort((a, b) => b.amount - a.amount);
    if (sortBy === "lowest") list.sort((a, b) => a.amount - b.amount);
    return list;
  }, [sorted, debouncedSearch, type, category, sortBy]);

  // go back to the first page whenever the filters change
  useEffect(() => {
    setPage(1);
    setVisibleCount(PAGE_SIZE);
  }, [debouncedSearch, type, category, sortBy, view]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const visible =
    view === "pages"
      ? filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)
      : filtered.slice(0, visibleCount);
  const hasMore = view === "scroll" && visibleCount < filtered.length;

  // Infinite scroll: load more when the sentinel element scrolls into view
  useEffect(() => {
    if (!hasMore || !sentinelRef.current) return undefined;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setVisibleCount((count) => count + PAGE_SIZE);
    });
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasMore, visibleCount]);

  return (
    <section className="content-card">
      <div className="section-heading">
        <div>
          <h2>All transactions</h2>
          <p>Search, filter, sort, edit, or delete any record.</p>
        </div>
        <button type="button" className="text-btn" onClick={() => openForm()}>+ Add new</button>
      </div>

      <div className="transaction-tools">
        <label className="search-box">
          <span aria-hidden="true">⌕</span>
          <input
            type="search"
            placeholder="Search transactions..."
            aria-label="Search transactions"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>
        <Dropdown label="Filter by type" options={TYPE_OPTIONS} value={type} onChange={setType} />
        <Dropdown label="Filter by category" options={CATEGORY_OPTIONS} value={category} onChange={setCategory} />
        <Dropdown label="Sort transactions" options={SORT_OPTIONS} value={sortBy} onChange={setSortBy} />
      </div>

      <Tabs tabs={VIEW_TABS} active={view} onChange={setView} label="List style" />

      <TransactionTable
        items={visible}
        onEdit={openForm}
        onDelete={handleDelete}
        emptyMessage={sorted.length === 0 ? "No transactions yet." : "No transactions match your search or filters."}
      />

      {hasMore && (
        <div ref={sentinelRef} className="load-more">
          <button type="button" className="secondary-btn" onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}>
            Load more
          </button>
        </div>
      )}

      {filtered.length > 0 && (
        <div className="table-footer">
          <span>Showing <strong>{visible.length}</strong> of <strong>{filtered.length}</strong></span>

          {view === "pages" && (
            <div className="pagination">
              <button type="button" className="secondary-btn" disabled={safePage === 1} onClick={() => setPage(safePage - 1)}>Previous</button>
              <span>Page {safePage} of {totalPages}</span>
              <button type="button" className="secondary-btn" disabled={safePage === totalPages} onClick={() => setPage(safePage + 1)}>Next</button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
