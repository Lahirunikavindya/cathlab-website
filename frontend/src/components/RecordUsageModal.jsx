import { useState } from "react";
import { recordUsage } from "../api/items";

function RecordUsageModal({ open, items, onClose, onSuccess }) {
  const [selectedId, setSelectedId] = useState("");
  const [usedQuantity, setUsedQuantity] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  if (!open) return null;

  const selectedItem = items.find((i) => i._id === selectedId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (!selectedId) {
      setMessage({ type: "error", text: "Please select a product." });
      return;
    }

    const qty = Number(usedQuantity);
    if (!qty || qty <= 0) {
      setMessage({ type: "error", text: "Please enter a valid used quantity." });
      return;
    }

    if (selectedItem && qty > selectedItem.quantity) {
      setMessage({
        type: "error",
        text: `Cannot exceed available stock (${selectedItem.quantity} units).`,
      });
      return;
    }

    try {
      setLoading(true);
      const data = await recordUsage(selectedId, qty, note);
      setMessage({ type: "success", text: data.message || "Usage recorded successfully." });
      setSelectedId("");
      setUsedQuantity("");
      setNote("");
      onSuccess();
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setMessage({ type: "", text: "" });
    setSelectedId("");
    setUsedQuantity("");
    setNote("");
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && handleClose()}>
      <div className="modal-panel">
        <div className="modal-header">
          <div>
            <h3>📋 Record Usage</h3>
            <p className="modal-subtitle">
              Record how many units were used in the procedure.
            </p>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={handleClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {message.text && (
          <div className={`message ${message.type === "error" ? "msg-error" : "msg-success"}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="form-grid">
          {/* Product selector */}
          <div className="form-group form-full">
            <label htmlFor="usage-product">Select Product *</label>
            <select
              id="usage-product"
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              required
            >
              <option value="">— Choose a product —</option>
              {items.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.itemName} &nbsp;|&nbsp; Batch: {item.batchNumber} &nbsp;|&nbsp; Stock: {item.quantity}
                </option>
              ))}
            </select>
          </div>

          {/* Available stock hint */}
          {selectedItem && (
            <div
              className="form-full"
              style={{
                background: "var(--primary-light)",
                borderRadius: "var(--radius)",
                padding: "10px 14px",
                fontSize: "0.85rem",
                color: "var(--primary-dark)",
                display: "flex",
                gap: "16px",
              }}
            >
              <span>📦 Available: <strong>{selectedItem.quantity} units</strong></span>
              <span>🏷 Batch: <strong>{selectedItem.batchNumber}</strong></span>
            </div>
          )}

          {/* Used quantity */}
          <div className="form-group">
            <label htmlFor="usage-qty">Used Quantity *</label>
            <input
              id="usage-qty"
              type="number"
              min="1"
              max={selectedItem ? selectedItem.quantity : undefined}
              placeholder="e.g. 2"
              value={usedQuantity}
              onChange={(e) => setUsedQuantity(e.target.value)}
              required
            />
          </div>

          {/* Note */}
          <div className="form-group">
            <label htmlFor="usage-note">Note / Reason (optional)</label>
            <input
              id="usage-note"
              type="text"
              placeholder="e.g. Procedure: Angioplasty"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          <div className="button-row">
            <button type="submit" className="btn-success" disabled={loading}>
              {loading ? "Recording…" : "✔ Record Usage"}
            </button>
            <button type="button" className="btn-secondary" onClick={handleClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RecordUsageModal;
