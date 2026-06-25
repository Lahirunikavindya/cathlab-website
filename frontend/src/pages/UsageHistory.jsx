import { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getAllUsageHistory, getMonthlyUsageSummary } from "../api/usage";
import InventorySelect from "../components/InventorySelect";
import {
  filterUsageRecords,
  formatInventoryPath,
  getCategories,
  getInventoryGroups,
  getItems,
  getSubCategories,
} from "../utils/inventoryHelpers";
import "../styles/usage.css";

const MONTH_NAMES = [
  "", "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const initialFilter = {
  inventoryGroup: "",
  category: "",
  subCategory: "",
  itemName: "",
};

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
  const [filter, setFilter] = useState(initialFilter);
  const [filterMonth, setFilterMonth] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const inventoryGroups = useMemo(() => getInventoryGroups(), []);
  const categories = useMemo(
    () => (filter.inventoryGroup ? getCategories(filter.inventoryGroup) : []),
    [filter.inventoryGroup]
  );
  const subCategories = useMemo(
    () =>
      filter.inventoryGroup && filter.category
        ? getSubCategories(filter.inventoryGroup, filter.category)
        : [],
    [filter.inventoryGroup, filter.category]
  );
  const itemNames = useMemo(
    () =>
      filter.inventoryGroup && filter.category && filter.subCategory
        ? getItems(filter.inventoryGroup, filter.category, filter.subCategory)
        : [],
    [filter.inventoryGroup, filter.category, filter.subCategory]
  );

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const [rec, mon] = await Promise.all([
        getAllUsageHistory(),
        getMonthlyUsageSummary(),
      ]);
      setRecords(rec);
      setMonthly(mon);
    } catch {
      setError("Failed to load usage history. Please check the server.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => {
      const next = { ...prev, [name]: value };
      if (name === "inventoryGroup") {
        next.category = "";
        next.subCategory = "";
        next.itemName = "";
      } else if (name === "category") {
        next.subCategory = "";
        next.itemName = "";
      } else if (name === "subCategory") {
        next.itemName = "";
      }
      return next;
    });
  };

  const catalogFiltered = useMemo(
    () => filterUsageRecords(records, filter),
    [records, filter]
  );

  const filteredRecords = useMemo(() => {
    if (!filterMonth) return catalogFiltered;
    return catalogFiltered.filter((record) => {
      const d = new Date(record.usageDate);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}` === filterMonth;
    });
  }, [catalogFiltered, filterMonth]);

  const hasActiveFilter =
    filter.inventoryGroup || filter.category || filter.subCategory || filter.itemName || filterMonth;

  const clearFilters = () => {
    setFilter(initialFilter);
    setFilterMonth("");
  };

  return (
    <div className="page">
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

      <div className="section-title">Usage Records</div>
      <div className="usage-filter-card">
        <p className="usage-filter-hint">Select from the inventory catalog to find used items.</p>
        <div className="usage-filter-grid">
          <InventorySelect
            id="inventoryGroup"
            label="Inventory Group"
            value={filter.inventoryGroup}
            onChange={onFilterChange}
            options={inventoryGroups}
            disabled={false}
            placeholder="— All groups —"
            required={false}
          />

          <InventorySelect
            id="category"
            label="Category"
            value={filter.category}
            onChange={onFilterChange}
            options={categories}
            disabled={!filter.inventoryGroup}
            placeholder="— All categories —"
            required={false}
          />

          <InventorySelect
            id="subCategory"
            label="Sub Category"
            value={filter.subCategory}
            onChange={onFilterChange}
            options={subCategories}
            disabled={!filter.category}
            placeholder="— All sub categories —"
            required={false}
          />

          <InventorySelect
            id="itemName"
            label="Item Name"
            value={filter.itemName}
            onChange={onFilterChange}
            options={itemNames}
            disabled={!filter.subCategory}
            placeholder="— All items —"
            required={false}
          />

          <div className="form-group">
            <label htmlFor="filter-month">Month</label>
            <input
              id="filter-month"
              type="month"
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
              title="Filter by month"
            />
          </div>
        </div>

        {hasActiveFilter && (
          <button type="button" className="btn-secondary btn-sm usage-clear-btn" onClick={clearFilters}>
            ✕ Clear filters
          </button>
        )}
      </div>

      {loading ? (
        <div className="loading-box">
          <div className="spinner" />
          <p>Loading usage records…</p>
        </div>
      ) : filteredRecords.length === 0 ? (
        <div className="empty-box">
          <span className="empty-box-icon">📋</span>
          <p>No usage records found{hasActiveFilter ? " for the current filter" : ""}.</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="product-table">
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Inventory Path</th>
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
                  <td>
                    <span className="badge badge-blue">{formatInventoryPath(rec)}</span>
                  </td>
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
