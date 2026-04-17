import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getExpiryItems } from "../api/items";

function ExpiryItemsPage() {
  const navigate = useNavigate();
  const [expired, setExpired] = useState([]);
  const [nearExpiry, setNearExpiry] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchExpiry = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getExpiryItems();
        setExpired(data.expired || []);
        setNearExpiry(data.nearExpiry || []);
      } catch (err) {
        setError(err.message || "Failed to load expiry data.");
      } finally {
        setLoading(false);
      }
    };
    fetchExpiry();
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    return isNaN(d) ? dateStr : d.toLocaleDateString();
  };

  const ExpiryTable = ({ items, emptyMessage, rowClass, badgeClass, badgeLabel }) => (
    <>
      {items.length === 0 ? (
        <p className="muted empty-msg">✅ {emptyMessage}</p>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Category</th>
                <th>Quantity</th>
                <th>Batch Number</th>
                <th>Expiry Date</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item._id} className={rowClass}>
                  <td>
                    <div className="item-name-cell">
                      {item.itemName}
                      <span className={`low-stock-badge ${badgeClass}`}>{badgeLabel}</span>
                    </div>
                  </td>
                  <td>{item.category || "—"}</td>
                  <td>{item.quantity ?? "—"}</td>
                  <td>{item.batchNumber || "—"}</td>
                  <td>{formatDate(item.expiryDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );

  return (
    <main className="page">
      <div className="container">
        {/* Header */}
        <header className="page-header">
          <div>
            <h1>Expiry Items</h1>
          </div>
          <button type="button" className="secondary" onClick={() => navigate("/")}>
            ← Back to Dashboard
          </button>
        </header>

        {/* Error */}
        {error && <div className="alert error">{error}</div>}

        {loading ? (
          <p className="muted" style={{ padding: "32px 0" }}>Loading…</p>
        ) : (
          <>
            {/* ── Expired Section ─────────────────────────────────────── */}
            <section className="card">
              <div className="section-heading">
                <div>
                  <h2 className="expiry-title-red">Expired Items</h2>
                  <p className="section-subtitle">
                    Items whose expiry date has already passed.
                  </p>
                </div>
                <span className="count-badge badge-red">{expired.length} item{expired.length !== 1 ? "s" : ""}</span>
              </div>
              <ExpiryTable
                items={expired}
                emptyMessage="No expired items found."
                rowClass="row-expired"
                badgeClass="badge-expired"
                badgeLabel="EXPIRED"
              />
            </section>

            {/* ── Near Expiry Section ──────────────────────────────────── */}
            <section className="card">
              <div className="section-heading">
                <div>
                  <h2 className="expiry-title-orange">Expiring Soon</h2>
                  <p className="section-subtitle">
                    Items expiring within the next 7 days.
                  </p>
                </div>
                <span className="count-badge badge-orange">{nearExpiry.length} item{nearExpiry.length !== 1 ? "s" : ""}</span>
              </div>
              <ExpiryTable
                items={nearExpiry}
                emptyMessage="No items expiring within 7 days."
                rowClass="row-near-expiry"
                badgeClass="badge-near-expiry"
                badgeLabel="EXPIRING SOON"
              />
            </section>
          </>
        )}
      </div>
    </main>
  );
}

export default ExpiryItemsPage;
