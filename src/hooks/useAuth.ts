import { useEffect, useState } from "react";
import { api, setToken, clearToken, getToken } from "@/lib/api";

export function useAuth() {
  const [token, setTokState] = useState<string | null>(getToken());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Validate token (optional but nice)
    async function validate() {
      const t = getToken();
      if (!t) {
        setTokState(null);
        setLoading(false);
        return;
      }
      try {
        await api<{ userId: string }>("/api/auth/me");
        setTokState(t);
      } catch {
        clearToken();
        setTokState(null);
      } finally {
        setLoading(false);
      }
    }
    validate();
  }, []);

  async function login(email: string, password: string) {
    const res = await api<{ token: string }>("/api/auth/login", {
      method: "POST",
      body: { email, password },
      auth: false
    });
    setToken(res.token);
    setTokState(res.token);
  }

  async function register(email: string, password: string) {
    const res = await api<{ token: string }>("/api/auth/register", {
      method: "POST",
      body: { email, password },
      auth: false
    });
    setToken(res.token);
    setTokState(res.token);
  }

  function logout() {
    clearToken();
    setTokState(null);
  }

  return { token, loading, isAuthed: !!token, login, register, logout };
}
