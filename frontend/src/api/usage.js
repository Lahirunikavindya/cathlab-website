import { API_BASE_URL, apiRequest } from "./config";

export function getAllUsageHistory(search = "") {
  const qs = search ? `?search=${encodeURIComponent(search)}` : "";
  return apiRequest(`${API_BASE_URL}/api/usage${qs}`);
}

export function getMonthlyUsageSummary() {
  return apiRequest(`${API_BASE_URL}/api/usage/monthly`);
}
