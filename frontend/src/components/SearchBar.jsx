import { useEffect, useState } from "react";
import { searchItems } from "../api/items";

function SearchBar({ onSelectItem, onClearSelection }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setSuggestions([]);
      onClearSelection();
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const result = await searchItems(trimmed);
        setSuggestions(result);
      } catch {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, onClearSelection]);

  return (
    <div className="search-wrapper">
      <input
        className="search-input"
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by item name or batch number…"
      />
      {loading && <div className="search-loading">Searching…</div>}

      {!loading && suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((item) => (
            <li key={item._id}>
              <button
                type="button"
                className="suggestion-item"
                onClick={() => {
                  setQuery(item.itemName);
                  setSuggestions([]);
                  onSelectItem(item);
                }}
              >
                <span>{item.itemName}</span>
                <span className="suggestion-batch">{item.batchNumber}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchBar;
