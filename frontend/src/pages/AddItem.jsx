import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createItem } from "../api/items";
import InventorySelect from "../components/InventorySelect";
import {
  getCategories,
  getInventoryGroups,
  getItems,
  getSubCategories,
} from "../utils/inventoryHelpers";

const initialForm = {
  inventoryGroup: "",
  category: "",
  subCategory: "",
  itemName: "",
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

  const inventoryGroups = useMemo(() => getInventoryGroups(), []);
  const categories = useMemo(
    () => (form.inventoryGroup ? getCategories(form.inventoryGroup) : []),
    [form.inventoryGroup]
  );
  const subCategories = useMemo(
    () =>
      form.inventoryGroup && form.category
        ? getSubCategories(form.inventoryGroup, form.category)
        : [],
    [form.inventoryGroup, form.category]
  );
  const items = useMemo(
    () =>
      form.inventoryGroup && form.category && form.subCategory
        ? getItems(form.inventoryGroup, form.category, form.subCategory)
        : [],
    [form.inventoryGroup, form.category, form.subCategory]
  );

  const onInventoryChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const next = { ...prev, [name]: value };
      if (name === "inventoryGroup") {
        next.category = "";
        next.subCategory = "";
        next.itemName = "";
      } else if (name === "category") {
        next.subCategory = "";
        next.itemName = "";
      } else if (name === "subCategory") {
        next.itemName = "";
      }
      return next;
    });
  };

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

    if (
      !form.inventoryGroup ||
      !form.category ||
      !form.subCategory ||
      !form.itemName ||
      !form.batchNumber ||
      !form.expiryDate
    ) {
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
          <p>Select from the structured cath lab inventory catalog, then enter stock details.</p>
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
          <InventorySelect
            id="inventoryGroup"
            label="Inventory Group *"
            value={form.inventoryGroup}
            onChange={onInventoryChange}
            options={inventoryGroups}
            disabled={false}
            placeholder="— Select inventory group —"
          />

          <InventorySelect
            id="category"
            label="Category *"
            value={form.category}
            onChange={onInventoryChange}
            options={categories}
            disabled={!form.inventoryGroup}
            placeholder="— Select category —"
          />

          <InventorySelect
            id="subCategory"
            label="Sub Category *"
            value={form.subCategory}
            onChange={onInventoryChange}
            options={subCategories}
            disabled={!form.category}
            placeholder="— Select sub category —"
          />

          <InventorySelect
            id="itemName"
            label="Item Name *"
            value={form.itemName}
            onChange={onInventoryChange}
            options={items}
            disabled={!form.subCategory}
            placeholder="— Select item —"
          />

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
