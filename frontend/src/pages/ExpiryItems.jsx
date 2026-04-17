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
      } catch (err) {
        setError("Failed to load expiry items.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="page">
      <div className="page-header">
        <h1>Expiry Items</h1>
        <button className="btn-secondary" onClick={() => navigate("/")}>
          Back to Dashboard
        </button>
      </div>

      {error && <div className="message msg-error">{error}</div>}

      <section className="section-card">
        <h2>Expired Items</h2>
        <ProductTable
          items={expired}
          loading={loading}
          emptyMessage="No expired items"
          badgeType="expired"
        />
      </section>

      <section className="section-card">
        <h2>Near Expiry Items</h2>
        <ProductTable
          items={nearExpiry}
          loading={loading}
          emptyMessage="No near expiry items"
          badgeType="nearExpiry"
        />
      </section>
    </div>
  );
}

export default ExpiryItems;
