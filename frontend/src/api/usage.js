const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

async function request(url, options = {}) {
  const response = await fetch(url, options);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Request failed.");
  }
  return data;
}

// GET /api/usage?search=keyword
export function getAllUsageHistory(search = "") {
  const qs = search ? `?search=${encodeURIComponent(search)}` : "";
  return request(`${API_BASE_URL}/api/usage${qs}`);
}

// GET /api/usage/monthly
export function getMonthlyUsageSummary() {
  return request(`${API_BASE_URL}/api/usage/monthly`);
}
