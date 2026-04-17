// Default state for both Add and Edit forms
const initialFormState = {
  itemName: "",
  category: "",
  quantity: 0,
  batchNumber: "",
  expiryDate: "",
  note: "",
};

function ItemForm({
  formData,
  setFormData,
  onSubmit,
  submitLabel,
  backLabel = "Back to Dashboard",
  onBack,
  busy = false,
}) {
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    // Only quantity is parsed as a number
    const parsedValue = name === "quantity" ? Number(value) : value;

    setFormData((current) => ({
      ...current,
      [name]: parsedValue,
    }));
  };

  return (
    <form onSubmit={onSubmit} className="form-grid">
      <input
        name="itemName"
        placeholder="Item Name"
        value={formData.itemName}
        onChange={handleInputChange}
        required
      />
      <input
        name="category"
        placeholder="Category"
        value={formData.category}
        onChange={handleInputChange}
        required
      />
      <input
        name="quantity"
        type="number"
        min="0"
        placeholder="Quantity"
        value={formData.quantity}
        onChange={handleInputChange}
        required
      />
      <input
        name="batchNumber"
        placeholder="Batch Number"
        value={formData.batchNumber}
        onChange={handleInputChange}
        required
      />
      <input
        name="expiryDate"
        type="date"
        value={formData.expiryDate}
        onChange={handleInputChange}
        required
      />
      {/* Note spans full width */}
      <textarea
        name="note"
        placeholder="Note (optional)"
        value={formData.note}
        onChange={handleInputChange}
        rows={3}
        className="note-textarea"
      />

      <div className="form-actions">
        <button type="submit" disabled={busy}>
          {busy ? "Saving..." : submitLabel}
        </button>
        <button type="button" className="secondary" onClick={onBack}>
          {backLabel}
        </button>
      </div>
    </form>
  );
}

export { initialFormState };
export default ItemForm;
