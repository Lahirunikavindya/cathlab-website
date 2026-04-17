function formatDate(dateValue) {
  if (!dateValue) return "-";
  return new Date(dateValue).toLocaleDateString();
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
        <p>Loading...</p>
      </div>
    );
  }

  if (!items.length) {
    return <div className="empty-box">{emptyMessage}</div>;
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
          {items.map((item) => (
            <tr key={item._id}>
              <td>{item.itemName}</td>
              <td>{item.category}</td>
              <td className={showLowStockBadge ? "danger-text" : ""}>
                {item.quantity}
                {showLowStockBadge && <span className="badge badge-red">LOW STOCK</span>}
                {badgeType === "expired" && <span className="badge badge-red">EXPIRED</span>}
                {badgeType === "nearExpiry" && (
                  <span className="badge badge-orange">EXPIRING SOON</span>
                )}
              </td>
              <td>{item.batchNumber}</td>
              <td>{formatDate(item.expiryDate)}</td>
              <td>{item.note || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProductTable;
