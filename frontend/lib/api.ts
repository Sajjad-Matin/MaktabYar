const API_BASE =
  process.env.BACKEND_API?.replace(/\/$/, "") ||
  "http://localhost:5000/api";

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const headers = new Headers(options.headers);

  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }

  // Attach JWT token if available
  const token = localStorage.getItem('token');
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    cache: "no-store",
    ...options,
    headers,
  });

  const contentType = res.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await res.json()
    : await res.text();

  if (!res.ok) {
    // Handle 401 Unauthorized - clear auth state and redirect to login
    if (res.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }

    const message =
      typeof data === "object" && data !== null && "message" in data
        ? String(data.message)
        : typeof data === "string"
          ? data
          : "API error";

    throw new Error(message);
  }

  return data as T;
}
