function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString();
}

function ItemsTable({
  items,
  loading,
  lowStockThreshold,
  onSell,
  emptyMessage = "No items found.",
}) {
  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Item Name</th>
            <th>Category</th>
            <th>Quantity</th>
            <th>Batch Number</th>
            <th>Expiry Date</th>
            <th>Note</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr>
              <td colSpan="7" style={{ textAlign: "center", color: "#5e788f" }}>
                Loading…
              </td>
            </tr>
          )}

          {!loading && items.length === 0 && (
            <tr>
              <td colSpan="7" style={{ textAlign: "center", color: "#5e788f" }}>
                {emptyMessage}
              </td>
            </tr>
          )}

          {!loading &&
            items.map((item) => {
              const isLowStock = Number(item.quantity) < lowStockThreshold;

              return (
                <tr key={item._id} className={isLowStock ? "row-low-stock" : ""}>
                  <td>
                    <div className="item-name-cell">
                      <span>{item.itemName}</span>
                      {isLowStock && (
                        <span className="low-stock-badge small">LOW STOCK</span>
                      )}
                    </div>
                  </td>
                  <td>{item.category || "—"}</td>
                  <td>
                    <span className={isLowStock ? "qty-danger" : ""}>
                      {item.quantity}
                    </span>
                  </td>
                  <td>{item.batchNumber || "—"}</td>
                  <td>{formatDate(item.expiryDate)}</td>
                  <td className="note-cell">{item.note || <span className="muted">—</span>}</td>
                  <td>
                    <button
                      type="button"
                      className="sell-btn"
                      onClick={() => onSell(item)}
                      disabled={item.quantity === 0}
                      title={item.quantity === 0 ? "Out of stock" : "Sell this product"}
                    >
                      Sell
                    </button>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}

export default ItemsTable;
