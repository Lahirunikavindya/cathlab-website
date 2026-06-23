import { API_BASE_URL, apiRequest, asArray } from "./config";

export function getAllUsageHistory(search = "") {
  const qs = search ? `?search=${encodeURIComponent(search)}` : "";
  return apiRequest(`${API_BASE_URL}/api/usage${qs}`).then(asArray);
}

export function getMonthlyUsageSummary() {
  return apiRequest(`${API_BASE_URL}/api/usage/monthly`).then(asArray);
}
