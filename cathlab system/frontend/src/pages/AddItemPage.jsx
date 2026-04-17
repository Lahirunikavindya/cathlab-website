import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createItem } from "../api/items";
import ItemForm, { initialFormState } from "../components/ItemForm";

function AddItemPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormState);
  const [statusMessage, setStatusMessage] = useState({ type: "", text: "" });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);

    try {
      await createItem(formData);
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
              <h1>Add Medical Item</h1>
              <p className="section-subtitle">Create a new cath lab inventory record.</p>
            </div>
          </div>

          {(statusMessage.text || "").trim() !== "" && (
            <div className={`alert ${statusMessage.type}`}>{statusMessage.text}</div>
          )}

          <ItemForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSubmit}
            submitLabel="Save Item"
            onBack={() => navigate("/")}
            busy={saving}
          />
        </section>
      </div>
    </main>
  );
}

export default AddItemPage;
