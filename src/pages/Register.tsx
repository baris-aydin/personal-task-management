import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export default function Register() {
  const nav = useNavigate();
  const { register } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      await register(email, password);
      nav("/");
    } catch (e: any) {
      setErr(e?.message ?? "Register failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-sm rounded-xl border p-6 bg-background">
        <h1 className="text-xl font-semibold mb-1">Create account</h1>
        <p className="text-sm opacity-70 mb-4">Sign up for TaskFlow</p>

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
            placeholder="Password (min 6 chars)"
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
            {busy ? "Creating..." : "Create Account"}
          </button>
        </form>

        <div className="text-sm mt-4 opacity-80">
          Already have an account? <Link className="underline" to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
}
