const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000";
const TOKEN_KEY = "taskflow_token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE";

export async function api<T>(
  path: string,
  opts: { method?: HttpMethod; body?: any; auth?: boolean } = {}
): Promise<T> {
  const method = opts.method ?? "GET";
  const headers: Record<string, string> = { "Content-Type": "application/json" };

  if (opts.auth !== false) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: opts.body ? JSON.stringify(opts.body) : undefined
  });

  if (res.status === 204) return undefined as T;

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const msg = data?.error?.message ?? data?.error ?? "Request failed";
    throw new Error(typeof msg === "string" ? msg : "Request failed");
  }

  return data as T;
}
