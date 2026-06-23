import { API_BASE_URL, apiRequest, asArray } from "./config";

export function getAllItems() {
  return apiRequest(`${API_BASE_URL}/api/items`).then(asArray);
}

export function getItemById(id) {
  return apiRequest(`${API_BASE_URL}/api/items/${id}`);
}

export function createItem(payload) {
  return apiRequest(`${API_BASE_URL}/api/items`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export function updateItem(id, payload) {
  return apiRequest(`${API_BASE_URL}/api/items/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export function deleteItem(id) {
  return apiRequest(`${API_BASE_URL}/api/items/${id}`, {
    method: "DELETE",
  });
}

export function getLowStockItems() {
  return apiRequest(`${API_BASE_URL}/api/items/low-stock`).then(asArray);
}

export function getExpiryItems() {
  return apiRequest(`${API_BASE_URL}/api/items/expiry`).then((data) => ({
    expired: asArray(data?.expired),
    nearExpiry: asArray(data?.nearExpiry),
  }));
}

export function searchItems(q) {
  return apiRequest(`${API_BASE_URL}/api/items/search?q=${encodeURIComponent(q)}`).then(asArray);
}

export function sellItem(id, soldQuantity) {
  return apiRequest(`${API_BASE_URL}/api/items/${id}/sell`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ soldQuantity }),
  });
}

export function recordUsage(id, usedQuantity, note = "") {
  return apiRequest(`${API_BASE_URL}/api/items/${id}/usage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ usedQuantity, note }),
  });
}
