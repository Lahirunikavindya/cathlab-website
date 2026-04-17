import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getLowStockItems } from "../api/items";

function LowStockPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLowStock = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getLowStockItems();
        setItems(data);
      } catch (err) {
        setError(err.message || "Failed to load low stock items.");
      } finally {
        setLoading(false);
      }
    };

    fetchLowStock();
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    return isNaN(d) ? dateStr : d.toLocaleDateString();
  };

  return (
    <main className="page">
      <div className="container">
        {/* Header */}
        <header className="page-header">
          <div>
            <h1>Low Stock Items</h1>
          </div>
          <button type="button" className="secondary" onClick={() => navigate("/")}>
            ← Back to Dashboard
          </button>
        </header>

        {/* Error alert */}
        {error && <div className="alert error">{error}</div>}

        {/* Table card */}
        <section className="card">
          <div className="section-heading">
            <div>
              <h2>Items Needing Restock</h2>
              <p className="section-subtitle">
                Showing all items with quantity below 3 units.
              </p>
            </div>
          </div>

          {loading ? (
            <p className="muted">Loading…</p>
          ) : items.length === 0 ? (
            <p className="muted" style={{ textAlign: "center", padding: "32px 0" }}>
              ✅ No low stock items. All inventory levels are sufficient.
            </p>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Item Name</th>
                    <th>Category</th>
                    <th>Quantity</th>
                    <th>Unit Price</th>
                    <th>Batch Number</th>
                    <th>Expiry Date</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item._id} className="row-low-stock">
                      <td>
                        <div className="item-name-cell">
                          {item.itemName}
                          <span className="low-stock-badge">LOW STOCK</span>
                        </div>
                      </td>
                      <td>{item.category || "—"}</td>
                      <td>
                        <strong style={{ color: "#c0392b" }}>{item.quantity}</strong>
                      </td>
                      <td>
                        {item.unitPrice != null
                          ? `$${Number(item.unitPrice).toFixed(2)}`
                          : "—"}
                      </td>
                      <td>{item.batchNumber || "—"}</td>
                      <td>{formatDate(item.expiryDate)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default LowStockPage;
