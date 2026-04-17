import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createItem } from "../api/items";

const initialForm = {
  itemName: "",
  category: "",
  quantity: 0,
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
      [name]: name === "quantity" ? Number(value) : value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (!form.itemName || !form.category || !form.batchNumber || !form.expiryDate) {
      setMessage({ type: "error", text: "Please fill all required fields." });
      return;
    }
    if (form.quantity < 0) {
      setMessage({ type: "error", text: "Quantity cannot be negative." });
      return;
    }

    try {
      setLoading(true);
      await createItem(form);
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
        <h1>Add Item</h1>
      </div>

      <div className="form-card">
        {message.text && (
          <div className={`message ${message.type === "error" ? "msg-error" : "msg-success"}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={onSubmit} className="form-grid">
          <input name="itemName" placeholder="Item Name *" value={form.itemName} onChange={onChange} required />
          <input name="category" placeholder="Category *" value={form.category} onChange={onChange} required />
          <input type="number" min="0" name="quantity" placeholder="Quantity *" value={form.quantity} onChange={onChange} required />
          <input name="batchNumber" placeholder="Batch Number *" value={form.batchNumber} onChange={onChange} required />
          <input type="date" name="expiryDate" value={form.expiryDate} onChange={onChange} required />
          <textarea name="note" placeholder="Note" value={form.note} onChange={onChange} rows="3" />

          <div className="button-row">
            <button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Item"}
            </button>
            <button type="button" className="btn-secondary" onClick={() => navigate("/")}>
              Back to Dashboard
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddItem;
