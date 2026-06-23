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
  let data = null;

  if (contentType.includes("application/json")) {
    data = await response.json();
  } else if (!response.ok) {
    throw new Error(`Server error (${response.status}). Please try again shortly.`);
  }

  if (!response.ok) {
    throw new Error(data?.message || "Request failed.");
  }

  return data;
}
