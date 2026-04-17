import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ItemsTable from "../components/ItemsTable";
import { getAllItems, searchItems, useItem } from "../api/items";

const LOW_STOCK_THRESHOLD = 3;

// ─── Use Item Modal ────────────────────────────────────────────────────────────
function UseItemModal({ item, onClose, onConfirm, busy, error }) {
  const [usedQty, setUsedQty] = useState(1);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">Use / Sell Item</h2>

        <div className="modal-item-info">
          <span className="modal-item-name">{item.itemName}</span>
          <span className="modal-item-meta">
            Batch:&nbsp;<strong>{item.batchNumber}</strong>&nbsp;|&nbsp;In
            stock:&nbsp;<strong>{item.quantity}</strong>
          </span>
        </div>

        {error && <div className="alert error">{error}</div>}

        <label className="modal-label" htmlFor="use-qty">
          Quantity used / sold
        </label>
        <input
          id="use-qty"
          type="number"
          min="1"
          max={item.quantity}
          value={usedQty}
          onChange={(e) => setUsedQty(Number(e.target.value))}
          className="modal-input"
        />

        {usedQty >= item.quantity && (
          <p className="modal-warn">
            ⚠️ Using all stock will automatically remove this item from inventory.
          </p>
        )}

        <div className="modal-actions">
          <button
            type="button"
            onClick={() => onConfirm(usedQty)}
            disabled={busy || usedQty < 1 || usedQty > item.quantity}
          >
            {busy ? "Processing…" : "Confirm"}
          </button>
          <button type="button" className="secondary" onClick={onClose} disabled={busy}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Dashboard Page ────────────────────────────────────────────────────────────
function DashboardPage() {
  const navigate = useNavigate();

  // ── Inventory ──────────────────────────────────────────────────────────────
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: "", text: "" });

  // ── Search ─────────────────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSearch, setActiveSearch] = useState("");
  const debounceTimer = useRef(null);
  const searchWrapperRef = useRef(null);

  // ── Use Item modal ──────────────────────────────────────────────────────────
  const [useTarget, setUseTarget] = useState(null);
  const [useBusy, setUseBusy] = useState(false);
  const [useError, setUseError] = useState("");

  // ── Sorted / filtered display list ────────────────────────────────────────
  const displayItems = useMemo(() => {
    const source = activeSearch
      ? items.filter(
          (i) =>
            i.itemName?.toLowerCase().includes(activeSearch.toLowerCase()) ||
            i.batchNumber?.toLowerCase().includes(activeSearch.toLowerCase())
        )
      : items;

    return [...source].sort((a, b) => {
      const aLow = Number(a.quantity) < LOW_STOCK_THRESHOLD ? 0 : 1;
      const bLow = Number(b.quantity) < LOW_STOCK_THRESHOLD ? 0 : 1;
      return aLow - bLow;
    });
  }, [items, activeSearch]);

  // ── Helpers ────────────────────────────────────────────────────────────────
  const showMessage = (type, text) => {
    setStatusMessage({ type, text });
    window.setTimeout(() => setStatusMessage({ type: "", text: "" }), 4000);
  };

  const loadItems = async () => {
    setLoading(true);
    try {
      const data = await getAllItems();
      setItems(data);
    } catch (error) {
      showMessage("error", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  // Close suggestions on outside click
  useEffect(() => {
    const handler = (e) => {
      if (searchWrapperRef.current && !searchWrapperRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── Search ──────────────────────────────────────────────────────────────────
  const handleSearchChange = useCallback((e) => {
    const value = e.target.value;
    setSearchQuery(value);
    clearTimeout(debounceTimer.current);

    if (!value.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      setActiveSearch("");
      return;
    }

    debounceTimer.current = setTimeout(async () => {
      try {
        const results = await searchItems(value.trim());
        setSuggestions(results.slice(0, 8));
        setShowSuggestions(results.length > 0);
      } catch {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);
  }, []);

  const handleSuggestionClick = (item) => {
    setSearchQuery(item.itemName);
    setActiveSearch(item.itemName);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleSearchClear = () => {
    setSearchQuery("");
    setActiveSearch("");
    setSuggestions([]);
    setShowSuggestions(false);
  };

  // ── Use Item modal ──────────────────────────────────────────────────────────
  const handleOpenUse = (item) => {
    setUseTarget(item);
    setUseError("");
  };

  const handleCloseUse = () => {
    if (useBusy) return;
    setUseTarget(null);
    setUseError("");
  };

  const handleConfirmUse = async (qty) => {
    setUseBusy(true);
    setUseError("");
    try {
      const result = await useItem(useTarget._id, qty);
      setUseTarget(null);

      if (result.deleted) {
        // Remove from local state immediately — no refetch needed
        setItems((prev) => prev.filter((i) => i._id !== useTarget._id));
        showMessage("success", result.message);
      } else {
        // Update quantity in local state immediately
        setItems((prev) =>
          prev.map((i) =>
            i._id === result.item._id ? result.item : i
          )
        );
        showMessage("success", result.message);
      }
    } catch (err) {
      setUseError(err.message);
    } finally {
      setUseBusy(false);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <main className="page">
      <div className="container">
        {/* Header */}
        <header className="page-header">
          <div>
            <h1>Cath Lab Inventory</h1>
          </div>
          <div className="header-actions">
            <button type="button" onClick={() => navigate("/add-item")}>
              Add Item
            </button>
            <button type="button" className="danger" onClick={() => navigate("/low-stock")}>
              Low Stock
            </button>
            <button type="button" className="warning" onClick={() => navigate("/expiry-items")}>
              Expiry Items
            </button>
          </div>
        </header>

        {/* Status alert */}
        {(statusMessage.text || "").trim() !== "" && (
          <div className={`alert ${statusMessage.type}`}>{statusMessage.text}</div>
        )}

        {/* Main card */}
        <section className="card">
          <div className="section-heading">
            <div>
              <h2>Products</h2>
              <p className="section-subtitle">
                View and manage hospital medical inventory from the dashboard.
              </p>
            </div>

            {/* Smart Search */}
            <div className="search-wrapper" ref={searchWrapperRef}>
              <input
                type="text"
                className="search-input"
                placeholder="Search by item name or batch number…"
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                aria-label="Search inventory"
              />
              {searchQuery && (
                <button
                  type="button"
                  className="search-clear-btn"
                  onClick={handleSearchClear}
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
              {showSuggestions && (
                <ul className="suggestions-dropdown" role="listbox">
                  {suggestions.map((item) => (
                    <li
                      key={item._id}
                      className="suggestion-item"
                      role="option"
                      onMouseDown={() => handleSuggestionClick(item)}
                    >
                      <span className="suggestion-name">{item.itemName}</span>
                      {item.batchNumber && (
                        <span className="suggestion-batch">Batch {item.batchNumber}</span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Active filter chip */}
          {activeSearch && (
            <div className="filter-chip">
              Showing results for: <strong>{activeSearch}</strong>
              <button type="button" className="chip-clear" onClick={handleSearchClear}>
                ✕ Clear
              </button>
            </div>
          )}

          <ItemsTable
            items={displayItems}
            loading={loading}
            onSell={handleOpenUse}
            lowStockThreshold={LOW_STOCK_THRESHOLD}
          />
        </section>
      </div>

      {/* Use Item Modal */}
      {useTarget && (
        <UseItemModal
          item={useTarget}
          onClose={handleCloseUse}
          onConfirm={handleConfirmUse}
          busy={useBusy}
          error={useError}
        />
      )}
    </main>
  );
}

export default DashboardPage;
