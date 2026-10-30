"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { PATHS } from "@/lib/constants";
import { AuthUser } from "@/lib/auth";
import { useAuth } from "@/context/AuthContext";

interface RegisterForm {
  name: string;
  surname: string;
  email: string;
  password: string;
  address: string;
  telephoneNumber: string;
}

const emptyForm: RegisterForm = {
  name: "",
  surname: "",
  email: "",
  password: "",
  address: "",
  telephoneNumber: "",
};

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [form, setForm] = useState<RegisterForm>(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const updateField = (field: keyof RegisterForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await apiFetch(PATHS.register, {
        method: "POST",
        body: JSON.stringify(form),
      });

      if (response.status === 409) {
        setError("An account with this email already exists.");
        return;
      }

      if (!response.ok) {
        // ASP.NET validation errors come as { errors: { Field: ["message"] } }
        const data = await response.json().catch(() => null);
        const messages = data?.errors
          ? Object.values(data.errors as Record<string, string[]>).flat()
          : [];
        setError(
          messages.length > 0
            ? messages.join(" ")
            : "Registration failed. Please check your details.",
        );
        return;
      }

      // Registered: log in with the same credentials
      const loginResponse = await apiFetch(PATHS.login, {
        method: "POST",
        body: JSON.stringify({ email: form.email, password: form.password }),
      });

      if (!loginResponse.ok) {
        router.push("/login");
        return;
      }

      const auth: AuthUser = await loginResponse.json();
      login(auth);
      router.push("/");
    } catch {
      setError("Could not reach the server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-stone-300 px-3 py-2 text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-700";
  const labelClass = "block text-sm font-medium text-stone-700 mb-1";

  return (
    <section className="min-h-screen bg-stone-50 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md bg-white rounded-2xl border border-stone-200 shadow-sm p-8">
        <h1 className="text-2xl font-semibold text-stone-900 mb-1">
          Create an account
        </h1>
        <p className="text-sm text-stone-500 mb-6">
          Order handmade crafts from Norwegian makers
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className={labelClass}>
                First name
              </label>
              <input
                id="name"
                required
                minLength={3}
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="surname" className={labelClass}>
                Last name
              </label>
              <input
                id="surname"
                required
                value={form.surname}
                onChange={(e) => updateField("surname", e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className={labelClass}>
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="password" className={labelClass}>
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              value={form.password}
              onChange={(e) => updateField("password", e.target.value)}
              className={inputClass}
            />
            <p className="text-xs text-stone-500 mt-1">At least 6 characters</p>
          </div>

          <div>
            <label htmlFor="address" className={labelClass}>
              Address
            </label>
            <input
              id="address"
              required
              value={form.address}
              onChange={(e) => updateField("address", e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="phone" className={labelClass}>
              Phone
            </label>
            <input
              id="phone"
              type="tel"
              required
              value={form.telephoneNumber}
              onChange={(e) => updateField("telephoneNumber", e.target.value)}
              className={inputClass}
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-emerald-800 text-white py-2.5 font-medium hover:bg-emerald-900 transition disabled:opacity-50"
          >
            {isLoading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="text-sm text-stone-500 mt-6 text-center">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-emerald-800 font-medium hover:underline"
          >
            Log in
          </Link>
        </p>
      </div>
    </section>
  );
}
