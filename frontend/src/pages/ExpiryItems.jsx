import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getExpiryItems } from "../api/items";
import ProductTable from "../components/ProductTable";

function ExpiryItems() {
  const navigate = useNavigate();
  const [expired, setExpired] = useState([]);
  const [nearExpiry, setNearExpiry] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await getExpiryItems();
        setExpired(data.expired || []);
        setNearExpiry(data.nearExpiry || []);
      } catch {
        setError("Failed to load expiry items. Please check the server.");
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
          <h1>📅 Expiry Tracking</h1>
          <p>Review expired items and items expiring within the next 7 days.</p>
        </div>
        <button className="btn-secondary" onClick={() => navigate("/")}>
          ← Back to Dashboard
        </button>
      </div>

      {error && <div className="message msg-error">{error}</div>}

      <div className="section-card">
        <h2>🔴 Expired Items</h2>
        <ProductTable
          items={expired}
          loading={loading}
          emptyMessage="✅ No expired items found."
          badgeType="expired"
        />
      </div>

      <div className="section-card">
        <h2>🟡 Expiring Within 7 Days</h2>
        <ProductTable
          items={nearExpiry}
          loading={loading}
          emptyMessage="✅ No items expiring within 7 days."
          badgeType="nearExpiry"
        />
      </div>
    </div>
  );
}

export default ExpiryItems;
