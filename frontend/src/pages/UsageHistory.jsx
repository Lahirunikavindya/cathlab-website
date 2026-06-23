import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getAllUsageHistory, getMonthlyUsageSummary } from "../api/usage";
import "../styles/usage.css";

const MONTH_NAMES = [
  "", "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function formatDate(dateValue) {
  if (!dateValue) return "—";
  return new Date(dateValue).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function UsageHistory() {
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [monthly, setMonthly] = useState([]);
  const [search, setSearch] = useState("");
  const [filterMonth, setFilterMonth] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const [rec, mon] = await Promise.all([
        getAllUsageHistory(search),
        getMonthlyUsageSummary(),
      ]);
      setRecords(rec);
      setMonthly(mon);
    } catch {
      setError("Failed to load usage history. Please check the server.");
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const t = setTimeout(() => loadData(), 300);
    return () => clearTimeout(t);
  }, [loadData]);

  // Filter by month if selected
  const filteredRecords = filterMonth
    ? records.filter((r) => {
        const d = new Date(r.usageDate);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}` === filterMonth;
      })
    : records;

  return (
    <div className="page">
      {/* ── Header ── */}
      <div className="page-header">
        <div className="page-header-text">
          <h1>🕒 Used Items History</h1>
          <p>Track all recorded usage events and monthly consumption summaries.</p>
        </div>
        <button className="btn-secondary" onClick={() => navigate("/")}>
          ← Back to Dashboard
        </button>
      </div>

      {error && <div className="message msg-error">{error}</div>}

      {/* ── Monthly breakdown ── */}
      {monthly.length > 0 && (
        <div className="monthly-history-section">
          <h3>Monthly Usage Breakdown</h3>
          <div style={{ overflowX: "auto" }}>
            <table className="product-table">
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Year</th>
                  <th>Total Units Used</th>
                  <th>Number of Records</th>
                </tr>
              </thead>
              <tbody>
                {monthly.map((m) => (
                  <tr key={`${m.year}-${m.month}`}>
                    <td style={{ fontWeight: 500 }}>{MONTH_NAMES[m.month]}</td>
                    <td>{m.year}</td>
                    <td>
                      <span className="badge badge-blue">{m.totalUsedQuantity} units</span>
                    </td>
                    <td>{m.numberOfUsageRecords} records</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Filter row ── */}
      <div className="section-title">Usage Records</div>
      <div className="usage-filter-row">
        <input
          type="text"
          placeholder="Search by item name…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <input
          type="month"
          value={filterMonth}
          onChange={(e) => setFilterMonth(e.target.value)}
          title="Filter by month"
        />
        {(search || filterMonth) && (
          <button
            className="btn-secondary btn-sm"
            onClick={() => { setSearch(""); setFilterMonth(""); }}
          >
            ✕ Clear
          </button>
        )}
      </div>

      {/* ── Usage records table ── */}
      {loading ? (
        <div className="loading-box">
          <div className="spinner" />
          <p>Loading usage records…</p>
        </div>
      ) : filteredRecords.length === 0 ? (
        <div className="empty-box">
          <span className="empty-box-icon">📋</span>
          <p>No usage records found{search || filterMonth ? " for the current filter" : ""}.</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="product-table">
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Batch Number</th>
                <th>Used Quantity</th>
                <th>Usage Date</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((rec) => (
                <tr key={rec._id}>
                  <td style={{ fontWeight: 500 }}>{rec.itemName}</td>
                  <td style={{ fontFamily: "monospace", fontSize: "0.85rem" }}>
                    {rec.batchNumber}
                  </td>
                  <td>
                    <span className="badge badge-blue">{rec.usedQuantity} units</span>
                  </td>
                  <td style={{ fontSize: "0.88rem", color: "var(--text-secondary)" }}>
                    {formatDate(rec.usageDate)}
                  </td>
                  <td style={{ fontSize: "0.88rem", color: "var(--text-muted)" }}>
                    {rec.note || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {filteredRecords.length > 0 && (
        <p className="usage-page-note">
          Showing {filteredRecords.length} record{filteredRecords.length !== 1 ? "s" : ""}.
        </p>
      )}
    </div>
  );
}

export default UsageHistory;
