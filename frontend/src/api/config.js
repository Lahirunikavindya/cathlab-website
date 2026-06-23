export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://cathlab-backend.vercel.app";

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
    throw new Error("Unexpected server response. Please check the API URL configuration.");
  }

  return data;
}

export function asArray(data) {
  return Array.isArray(data) ? data : [];
}
