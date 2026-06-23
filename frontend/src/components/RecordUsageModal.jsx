import { useEffect, useMemo, useState } from "react";
import { recordUsage } from "../api/items";
import InventorySelect from "./InventorySelect";
import {
  getAvailableCategories,
  getAvailableInventoryGroups,
  getAvailableItemNames,
  getAvailableSubCategories,
  getStockRecords,
} from "../utils/inventoryHelpers";

const initialSelection = {
  inventoryGroup: "",
  category: "",
  subCategory: "",
  itemName: "",
  selectedId: "",
};

function RecordUsageModal({ open, items = [], onClose, onSuccess }) {
  const [selection, setSelection] = useState(initialSelection);
  const [usedQuantity, setUsedQuantity] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    if (!open) {
      setSelection(initialSelection);
      setUsedQuantity("");
      setNote("");
      setMessage({ type: "", text: "" });
    }
  }, [open]);

  const inventoryGroups = useMemo(() => getAvailableInventoryGroups(items), [items]);
  const categories = useMemo(
    () =>
      selection.inventoryGroup
        ? getAvailableCategories(items, selection.inventoryGroup)
        : [],
    [items, selection.inventoryGroup]
  );
  const subCategories = useMemo(
    () =>
      selection.inventoryGroup && selection.category
        ? getAvailableSubCategories(items, selection.inventoryGroup, selection.category)
        : [],
    [items, selection.inventoryGroup, selection.category]
  );
  const itemNames = useMemo(
    () =>
      selection.inventoryGroup && selection.category && selection.subCategory
        ? getAvailableItemNames(
            items,
            selection.inventoryGroup,
            selection.category,
            selection.subCategory
          )
        : [],
    [items, selection.inventoryGroup, selection.category, selection.subCategory]
  );
  const stockRecords = useMemo(
    () =>
      selection.inventoryGroup &&
      selection.category &&
      selection.subCategory &&
      selection.itemName
        ? getStockRecords(
            items,
            selection.inventoryGroup,
            selection.category,
            selection.subCategory,
            selection.itemName
          )
        : [],
    [
      items,
      selection.inventoryGroup,
      selection.category,
      selection.subCategory,
      selection.itemName,
    ]
  );

  const selectedItem = items.find((item) => item._id === selection.selectedId);

  const onSelectionChange = (e) => {
    const { name, value } = e.target;
    setSelection((prev) => {
      const next = { ...prev, [name]: value };

      if (name === "inventoryGroup") {
        next.category = "";
        next.subCategory = "";
        next.itemName = "";
        next.selectedId = "";
      } else if (name === "category") {
        next.subCategory = "";
        next.itemName = "";
        next.selectedId = "";
      } else if (name === "subCategory") {
        next.itemName = "";
        next.selectedId = "";
      } else if (name === "itemName") {
        next.selectedId = "";
      }

      return next;
    });
  };

  useEffect(() => {
    if (stockRecords.length === 1) {
      const id = stockRecords[0]._id;
      setSelection((prev) => (prev.selectedId === id ? prev : { ...prev, selectedId: id }));
      return;
    }

    setSelection((prev) => {
      if (prev.selectedId && !stockRecords.some((item) => item._id === prev.selectedId)) {
        return { ...prev, selectedId: "" };
      }
      return prev;
    });
  }, [stockRecords]);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (!selection.selectedId) {
      setMessage({ type: "error", text: "Please select an item from inventory." });
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
      const data = await recordUsage(selection.selectedId, qty, note);
      setMessage({ type: "success", text: data.message || "Usage recorded successfully." });
      setSelection(initialSelection);
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
    setSelection(initialSelection);
    setUsedQuantity("");
    setNote("");
    onClose();
  };

  const noStockAvailable = inventoryGroups.length === 0;

  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && handleClose()}>
      <div className="modal-panel">
        <div className="modal-header">
          <div>
            <h3>📋 Record Usage</h3>
            <p className="modal-subtitle">
              Select the item from the inventory catalog, then enter how many units were used.
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

        {noStockAvailable ? (
          <div className="empty-box">
            <span className="empty-box-icon">📦</span>
            <p>No in-stock items available to record usage.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="form-grid">
            <InventorySelect
              id="inventoryGroup"
              label="Inventory Group *"
              value={selection.inventoryGroup}
              onChange={onSelectionChange}
              options={inventoryGroups}
              disabled={false}
              placeholder="— Select inventory group —"
              fullWidth
            />

            <InventorySelect
              id="category"
              label="Category *"
              value={selection.category}
              onChange={onSelectionChange}
              options={categories}
              disabled={!selection.inventoryGroup}
              placeholder="— Select category —"
              fullWidth
            />

            <InventorySelect
              id="subCategory"
              label="Sub Category *"
              value={selection.subCategory}
              onChange={onSelectionChange}
              options={subCategories}
              disabled={!selection.category}
              placeholder="— Select sub category —"
              fullWidth
            />

            <InventorySelect
              id="itemName"
              label="Item Name *"
              value={selection.itemName}
              onChange={onSelectionChange}
              options={itemNames}
              disabled={!selection.subCategory}
              placeholder="— Select item —"
              fullWidth
            />

            {stockRecords.length > 1 && (
              <div className="form-group form-full">
                <label htmlFor="usage-batch">Batch *</label>
                <select
                  id="usage-batch"
                  name="selectedId"
                  value={selection.selectedId}
                  onChange={onSelectionChange}
                  required
                >
                  <option value="">— Select batch —</option>
                  {stockRecords.map((item) => (
                    <option key={item._id} value={item._id}>
                      Batch: {item.batchNumber} | Stock: {item.quantity} | Exp:{" "}
                      {new Date(item.expiryDate).toLocaleDateString("en-GB")}
                    </option>
                  ))}
                </select>
              </div>
            )}

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
                  flexWrap: "wrap",
                }}
              >
                <span>
                  📦 Available: <strong>{selectedItem.quantity} units</strong>
                </span>
                <span>
                  🏷 Batch: <strong>{selectedItem.batchNumber}</strong>
                </span>
              </div>
            )}

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
                disabled={!selectedItem}
                required
              />
            </div>

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
              <button type="submit" className="btn-success" disabled={loading || !selectedItem}>
                {loading ? "Recording…" : "✔ Record Usage"}
              </button>
              <button type="button" className="btn-secondary" onClick={handleClose}>
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default RecordUsageModal;
