import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllItems } from "../api/items";
import ProductTable from "../components/ProductTable";
import SearchBar from "../components/SearchBar";
import SellProductModal from "../components/SellProductModal";

function Dashboard() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [displayItems, setDisplayItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [sellOpen, setSellOpen] = useState(false);

  const loadItems = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllItems();
      setItems(data);
      setDisplayItems(data);
    } catch (error) {
      setMessage({ type: "error", text: "Failed to load products." });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  return (
    <div className="page">
      <div className="page-header">
        <h1>Cath Lab Inventory</h1>
      </div>

      <div className="actions-row">
        <button onClick={() => navigate("/add-item")}>Add Item</button>
        <button onClick={() => navigate("/low-stock")}>Low Stock</button>
        <button onClick={() => navigate("/expiry-items")}>Expiry Items</button>
        <button onClick={() => setSellOpen(true)}>Sell Product</button>
      </div>

      <SearchBar
        onSelectItem={(item) => setDisplayItems([item])}
        onClearSelection={() => setDisplayItems(items)}
      />

      {message.text && (
        <div className={`message ${message.type === "error" ? "msg-error" : "msg-success"}`}>
          {message.text}
        </div>
      )}

      <ProductTable items={displayItems} loading={loading} />

      <SellProductModal
        open={sellOpen}
        items={items}
        onClose={() => setSellOpen(false)}
        onSuccess={async () => {
          setMessage({ type: "success", text: "Product sold and quantity updated." });
          await loadItems();
        }}
      />
    </div>
  );
}

export default Dashboard;
