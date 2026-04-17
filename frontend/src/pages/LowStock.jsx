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
      } catch (err) {
        setError("Failed to load low stock items.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="page">
      <div className="page-header">
        <h1>Low Stock Items</h1>
        <button className="btn-secondary" onClick={() => navigate("/")}>
          Back to Dashboard
        </button>
      </div>

      {error && <div className="message msg-error">{error}</div>}
      <ProductTable
        items={items}
        loading={loading}
        emptyMessage="No low stock items"
        showLowStockBadge
      />
    </div>
  );
}

export default LowStock;
