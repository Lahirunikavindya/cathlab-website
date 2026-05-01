import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createItem } from "../api/items";

const initialForm = {
  itemName: "",
  category: "",
  quantity: "",
  batchNumber: "",
  expiryDate: "",
  note: "",
};

function AddItem() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "quantity" ? (value === "" ? "" : Number(value)) : value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (!form.itemName || !form.category || !form.batchNumber || !form.expiryDate) {
      setMessage({ type: "error", text: "Please fill all required fields." });
      return;
    }
    if (form.quantity === "" || Number(form.quantity) < 0) {
      setMessage({ type: "error", text: "Quantity must be 0 or more." });
      return;
    }

    try {
      setLoading(true);
      await createItem({ ...form, quantity: Number(form.quantity) });
      navigate("/");
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-header-text">
          <h1>Add Inventory Item</h1>
          <p>Fill in the details below to add a new medical supply item.</p>
        </div>
        <button className="btn-secondary" onClick={() => navigate("/")}>
          ← Back to Dashboard
        </button>
      </div>

      <div className="form-card">
        {message.text && (
          <div className={`message ${message.type === "error" ? "msg-error" : "msg-success"}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={onSubmit} className="form-grid">
          <div className="form-group">
            <label htmlFor="itemName">Item Name *</label>
            <input
              id="itemName"
              name="itemName"
              placeholder="e.g. Coronary Guide Wire"
              value={form.itemName}
              onChange={onChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category *</label>
            <input
              id="category"
              name="category"
              placeholder="e.g. Catheter, Stent, Balloon"
              value={form.category}
              onChange={onChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="quantity">Initial Quantity *</label>
            <input
              id="quantity"
              type="number"
              min="0"
              name="quantity"
              placeholder="0"
              value={form.quantity}
              onChange={onChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="batchNumber">Batch Number *</label>
            <input
              id="batchNumber"
              name="batchNumber"
              placeholder="e.g. BT-2024-001"
              value={form.batchNumber}
              onChange={onChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="expiryDate">Expiry Date *</label>
            <input
              id="expiryDate"
              type="date"
              name="expiryDate"
              value={form.expiryDate}
              onChange={onChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="note">Note (optional)</label>
            <input
              id="note"
              name="note"
              placeholder="Any additional notes…"
              value={form.note}
              onChange={onChange}
            />
          </div>

          <div className="button-row">
            <button type="submit" disabled={loading}>
              {loading ? "Saving…" : "✔ Save Item"}
            </button>
            <button type="button" className="btn-secondary" onClick={() => navigate("/")}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddItem;
