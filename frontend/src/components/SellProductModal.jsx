import { useState } from "react";
import { sellItem } from "../api/items";

function SellProductModal({ open, items, onClose, onSuccess }) {
  const [selectedId, setSelectedId] = useState("");
  const [soldQuantity, setSoldQuantity] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (!selectedId) {
      setMessage({ type: "error", text: "Please select a product." });
      return;
    }

    const qty = Number(soldQuantity);
    if (!qty || qty <= 0) {
      setMessage({ type: "error", text: "Enter a valid sold quantity." });
      return;
    }

    try {
      setLoading(true);
      const data = await sellItem(selectedId, qty);
      setMessage({ type: "success", text: data.message || "Sale completed." });
      setSelectedId("");
      setSoldQuantity("");
      onSuccess();
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-panel">
        <h3>Sell Product</h3>
        <p className="modal-subtitle">Reduce quantity when a product is sold.</p>

        {message.text && (
          <div className={`message ${message.type === "error" ? "msg-error" : "msg-success"}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="form-grid">
          <select value={selectedId} onChange={(e) => setSelectedId(e.target.value)} required>
            <option value="">Select product</option>
            {items.map((item) => (
              <option key={item._id} value={item._id}>
                {item.itemName} ({item.batchNumber}) - Qty: {item.quantity}
              </option>
            ))}
          </select>

          <input
            type="number"
            min="1"
            placeholder="Sold quantity"
            value={soldQuantity}
            onChange={(e) => setSoldQuantity(e.target.value)}
            required
          />

          <div className="button-row">
            <button type="submit" disabled={loading}>
              {loading ? "Processing..." : "Submit Sale"}
            </button>
            <button type="button" className="btn-secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SellProductModal;
