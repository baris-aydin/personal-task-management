import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export default function Login() {
  const nav = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      await login(email, password);
      nav("/");
    } catch (e: any) {
      setErr(e?.message ?? "Login failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-sm rounded-xl border p-6 bg-background">
        <h1 className="text-xl font-semibold mb-1">Login</h1>
        <p className="text-sm opacity-70 mb-4">Sign in to your TaskFlow account</p>

        <form onSubmit={onSubmit} className="space-y-3">
          <input
            className="w-full rounded-md border px-3 py-2"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="w-full rounded-md border px-3 py-2"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {err && <div className="text-sm text-red-500">{err}</div>}

          <button
            className="w-full rounded-md border px-3 py-2"
            disabled={busy}
            type="submit"
          >
            {busy ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="text-sm mt-4 opacity-80">
          No account? <Link className="underline" to="/register">Create one</Link>
        </div>
      </div>
    </div>
  );
}
