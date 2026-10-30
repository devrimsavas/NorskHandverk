"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { PATHS } from "@/lib/constants";
import { AuthUser } from "@/lib/auth";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await apiFetch(PATHS.login, {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      if (response.status === 401) {
        setError("Invalid email or password.");
        return;
      }

      if (!response.ok) {
        setError("Please enter a valid email and password.");
        return;
      }

      const auth: AuthUser = await response.json();
      login(auth);

      // Account and admin pages come later; go home for now
      router.push("/");
    } catch {
      setError("Could not reach the server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-stone-50 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm bg-white rounded-2xl border border-stone-200 shadow-sm p-8">
        <h1 className="text-2xl font-semibold text-stone-900 mb-1">
          Welcome back
        </h1>
        <p className="text-sm text-stone-500 mb-6">
          Log in to your NorskHandverk account
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-stone-700 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-stone-300 px-3 py-2 text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-stone-700 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-stone-300 px-3 py-2 text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-emerald-800 text-white py-2.5 font-medium hover:bg-emerald-900 transition disabled:opacity-50"
          >
            {isLoading ? "Logging in..." : "Log in"}
          </button>
        </form>

        <p className="text-sm text-stone-500 mt-6 text-center">
          New here?{" "}
          <Link
            href="/register"
            className="text-emerald-800 font-medium hover:underline"
          >
            Create an account
          </Link>
        </p>
      </div>
    </section>
  );
}
