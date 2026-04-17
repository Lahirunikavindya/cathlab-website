import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getItemById, updateItem } from "../api/items";
import ItemForm, { initialFormState } from "../components/ItemForm";

function toDateInputValue(dateLike) {
  const date = new Date(dateLike);
  if (Number.isNaN(date.getTime())) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function EditItemPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState(initialFormState);
  const [statusMessage, setStatusMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadItem = async () => {
      try {
        const item = await getItemById(id);
        setFormData({
          itemName: item.itemName || "",
          category: item.category || "",
          quantity: item.quantity ?? 0,
          batchNumber: item.batchNumber || "",
          expiryDate: item.expiryDate ? toDateInputValue(item.expiryDate) : "",
          note: item.note || "",
        });
      } catch (error) {
        setStatusMessage({ type: "error", text: error.message });
      } finally {
        setLoading(false);
      }
    };

    loadItem();
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);

    try {
      await updateItem(id, formData);
      navigate("/");
    } catch (error) {
      setStatusMessage({ type: "error", text: error.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="page form-page">
      <div className="form-shell">
        <section className="card form-card">
          <div className="section-heading">
            <div>
              <h1>Edit Medical Item</h1>
              <p className="section-subtitle">Update an existing cath lab inventory record.</p>
            </div>
          </div>

          {(statusMessage.text || "").trim() !== "" && (
            <div className={`alert ${statusMessage.type}`}>{statusMessage.text}</div>
          )}

          {loading ? (
            <p className="section-subtitle">Loading item details...</p>
          ) : (
            <ItemForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleSubmit}
              submitLabel="Update Item"
              onBack={() => navigate("/")}
              busy={saving}
            />
          )}
        </section>
      </div>
    </main>
  );
}

export default EditItemPage;
