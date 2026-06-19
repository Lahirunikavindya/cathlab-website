const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://cathlab-website-a3sv.vercel.app";

async function request(url, options = {}) {
  const response = await fetch(url, options);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Request failed.");
  }

  return data;
}

export function getAllItems() {
  return request(`${API_BASE_URL}/api/items`);
}

export function getItemById(id) {
  return request(`${API_BASE_URL}/api/items/${id}`);
}

export function createItem(payload) {
  return request(`${API_BASE_URL}/api/items`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export function updateItem(id, payload) {
  return request(`${API_BASE_URL}/api/items/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export function deleteItem(id) {
  return request(`${API_BASE_URL}/api/items/${id}`, {
    method: "DELETE",
  });
}

export function getLowStockItems() {
  return request(`${API_BASE_URL}/api/items/low-stock`);
}

export function getExpiryItems() {
  return request(`${API_BASE_URL}/api/items/expiry`);
}

export function searchItems(q) {
  return request(`${API_BASE_URL}/api/items/search?q=${encodeURIComponent(q)}`);
}

// Legacy sell (kept for backward compatibility)
export function sellItem(id, soldQuantity) {
  return request(`${API_BASE_URL}/api/items/${id}/sell`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ soldQuantity }),
  });
}

// Record usage: reduces quantity + saves a usage history record
export function recordUsage(id, usedQuantity, note = "") {
  return request(`${API_BASE_URL}/api/items/${id}/usage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ usedQuantity, note }),
  });
}
