// Use same-origin /api paths. Vercel rewrites (production) and Vite proxy (local dev)
// forward these requests to the backend — avoids wrong API URL env var issues.
export const API_BASE_URL = "";

export async function apiRequest(url, options = {}) {
  let response;

  try {
    response = await fetch(url, options);
  } catch {
    throw new Error("Unable to reach the server. Check your internet connection or try again.");
  }

  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  let data = null;

  if (isJson) {
    data = await response.json();
  }

  if (!response.ok) {
    throw new Error(data?.message || `Server error (${response.status}). Please try again shortly.`);
  }

  if (!isJson) {
    throw new Error("Unexpected server response. The API proxy may be misconfigured.");
  }

  return data;
}

export function asArray(data) {
  return Array.isArray(data) ? data : [];
}
