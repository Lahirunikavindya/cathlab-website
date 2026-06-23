import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllItems } from "../api/items";
import ProductTable from "../components/ProductTable";
import SearchBar from "../components/SearchBar";
import RecordUsageModal from "../components/RecordUsageModal";

function Dashboard() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [displayItems, setDisplayItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [usageOpen, setUsageOpen] = useState(false);

  const loadItems = useCallback(async () => {
    try {
      setLoading(true);
      setMessage({ type: "", text: "" });
      const data = await getAllItems();
      setItems(data);
      setDisplayItems(data);
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message || "Failed to load inventory. Is the server running?",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  // Auto-clear success messages after 4 seconds
  useEffect(() => {
    if (message.type === "success") {
      const t = setTimeout(() => setMessage({ type: "", text: "" }), 4000);
      return () => clearTimeout(t);
    }
  }, [message]);

  const lowStockCount = items.filter((i) => i.quantity < 3).length;

  return (
    <div className="page">
      {/* ── Action buttons ── */}
      <div className="actions-row">
        <button id="btn-add-item" onClick={() => navigate("/add-item")}>
          ＋ Add Item
        </button>
        <button
          id="btn-low-stock"
          className="btn-secondary"
          onClick={() => navigate("/low-stock")}
        >
          ⚠️ Low Stock
          {lowStockCount > 0 && (
            <span
              style={{
                marginLeft: 6,
                background: "var(--danger)",
                color: "#fff",
                borderRadius: 999,
                padding: "1px 7px",
                fontSize: "0.72rem",
              }}
            >
              {lowStockCount}
            </span>
          )}
        </button>
        <button
          id="btn-expiry"
          className="btn-secondary"
          onClick={() => navigate("/expiry-items")}
        >
          📅 Expiry Items
        </button>
        <button
          id="btn-record-usage"
          className="btn-success"
          onClick={() => setUsageOpen(true)}
        >
          📋 Record Usage
        </button>
        <button
          id="btn-usage-history"
          className="btn-secondary"
          onClick={() => navigate("/usage-history")}
        >
          🕒 View Used Items
        </button>
      </div>

      {/* ── Inline message ── */}
      {message.text && (
        <div className={`message ${message.type === "error" ? "msg-error" : "msg-success"}`}>
          {message.text}
        </div>
      )}

      {/* ── Search + table ── */}
      <div className="section-title">All Inventory Items</div>
      <SearchBar
        onSelectItem={(item) => setDisplayItems([item])}
        onClearSelection={() => setDisplayItems(items)}
      />
      <ProductTable items={displayItems} loading={loading} />

      {/* ── Record Usage Modal ── */}
      <RecordUsageModal
        open={usageOpen}
        items={items}
        onClose={() => setUsageOpen(false)}
        onSuccess={async () => {
          setMessage({ type: "success", text: "✔ Usage recorded and inventory updated." });
          await loadItems();
        }}
      />
    </div>
  );
}

export default Dashboard;
