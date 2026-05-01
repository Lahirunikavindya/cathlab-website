function formatDate(dateValue) {
  if (!dateValue) return "—";
  return new Date(dateValue).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function isExpired(dateValue) {
  if (!dateValue) return false;
  return new Date(dateValue) < new Date();
}

function isNearExpiry(dateValue) {
  if (!dateValue) return false;
  const d = new Date(dateValue);
  const now = new Date();
  const diff = (d - now) / (1000 * 60 * 60 * 24);
  return diff >= 0 && diff <= 7;
}

function ProductTable({
  items,
  loading,
  emptyMessage = "No items found",
  showLowStockBadge = false,
  badgeType,
}) {
  if (loading) {
    return (
      <div className="loading-box">
        <div className="spinner" />
        <p>Loading items…</p>
      </div>
    );
  }

  if (!items || !items.length) {
    return (
      <div className="empty-box">
        <span className="empty-box-icon">📦</span>
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <table className="product-table">
        <thead>
          <tr>
            <th>Item Name</th>
            <th>Category</th>
            <th>Quantity</th>
            <th>Batch Number</th>
            <th>Expiry Date</th>
            <th>Note</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const expired   = isExpired(item.expiryDate);
            const nearExpiry = isNearExpiry(item.expiryDate);
            const lowStock  = item.quantity < 3;

            return (
              <tr key={item._id}>
                <td style={{ fontWeight: 500 }}>{item.itemName}</td>
                <td>
                  <span className="badge badge-blue">{item.category}</span>
                </td>
                <td className={lowStock || showLowStockBadge ? "danger-text" : ""}>
                  {item.quantity}
                  {(showLowStockBadge || lowStock) && (
                    <span className="badge badge-red">LOW</span>
                  )}
                </td>
                <td style={{ fontFamily: "monospace", fontSize: "0.85rem" }}>
                  {item.batchNumber}
                </td>
                <td>
                  <span style={expired ? { color: "var(--danger)", fontWeight: 600 } : nearExpiry ? { color: "var(--warning)", fontWeight: 600 } : {}}>
                    {formatDate(item.expiryDate)}
                  </span>
                  {badgeType === "expired"   && <span className="badge badge-red">EXPIRED</span>}
                  {(badgeType === "nearExpiry" || nearExpiry) && !expired && (
                    <span className="badge badge-orange">SOON</span>
                  )}
                </td>
                <td style={{ color: "var(--text-secondary)", fontSize: "0.88rem" }}>
                  {item.note || "—"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default ProductTable;
