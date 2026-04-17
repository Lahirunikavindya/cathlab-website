import { Navigate, Route, Routes } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import AddItemPage from "./pages/AddItemPage";
import EditItemPage from "./pages/EditItemPage";
import LowStockPage from "./pages/LowStockPage";
import ExpiryItemsPage from "./pages/ExpiryItemsPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/add-item" element={<AddItemPage />} />
      <Route path="/edit-item/:id" element={<EditItemPage />} />
      <Route path="/low-stock" element={<LowStockPage />} />
      <Route path="/expiry-items" element={<ExpiryItemsPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
