import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getLowStockItems } from "../api/items";
import ProductTable from "../components/ProductTable";

function LowStock() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await getLowStockItems();
        setItems(data);
      } catch {
        setError("Failed to load low stock items. Please check the server.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-header-text">
          <h1>⚠️ Low Stock Items</h1>
          <p>Items with fewer than 3 units remaining in stock.</p>
        </div>
        <button className="btn-secondary" onClick={() => navigate("/")}>
          ← Back to Dashboard
        </button>
      </div>

      {error && <div className="message msg-error">{error}</div>}

      {!loading && !error && items.length > 0 && (
        <div
          className="message msg-error"
          style={{ marginBottom: 16 }}
        >
          ⚠️ {items.length} item{items.length > 1 ? "s" : ""} need restocking.
        </div>
      )}

      <ProductTable
        items={items}
        loading={loading}
        emptyMessage="✅ No low stock items — inventory levels look good!"
        showLowStockBadge
      />
    </div>
  );
}

export default LowStock;
