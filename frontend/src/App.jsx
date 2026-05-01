import { Navigate, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import AddItem from "./pages/AddItem";
import LowStock from "./pages/LowStock";
import ExpiryItems from "./pages/ExpiryItems";
import UsageHistory from "./pages/UsageHistory";
import "./index.css";
import "./styles/dashboard.css";
import "./styles/form.css";
import "./styles/table.css";

function App() {
  return (
    <div className="app-shell">
      <Header />
      <Routes>
        <Route path="/"               element={<Dashboard />} />
        <Route path="/add-item"       element={<AddItem />} />
        <Route path="/low-stock"      element={<LowStock />} />
        <Route path="/expiry-items"   element={<ExpiryItems />} />
        <Route path="/usage-history"  element={<UsageHistory />} />
        <Route path="*"               element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
