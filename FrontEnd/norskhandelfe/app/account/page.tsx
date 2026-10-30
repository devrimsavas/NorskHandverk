"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { PATHS } from "@/lib/constants";
import { Customer } from "@/lib/types";
import { useAuth } from "@/context/AuthContext";

interface ProfileForm {
  name: string;
  surname: string;
  email: string;
  address: string;
  telephoneNumber: string;
  password: string;
}

export default function ProfilePage() {
  const { user, login } = useAuth();

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [form, setForm] = useState<ProfileForm | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      const response = await apiFetch(PATHS.myProfile);
      if (!response.ok) {
        setMessage({ text: "Could not load your profile.", isError: true });
        return;
      }

      const data: Customer = await response.json();
      setCustomer(data);
      setForm({
        name: data.name,
        surname: data.surname,
        email: data.email,
        address: data.address,
        telephoneNumber: data.telephoneNumber,
        password: "",
      });
    };

    loadProfile();
  }, []);

  const updateField = (field: keyof ProfileForm, value: string) => {
    setForm((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;

    setIsSaving(true);
    setMessage(null);

    // Only send the password when the user typed a new one
    const { password, ...details } = form;
    const body = password ? { ...details, password } : details;

    try {
      const response = await apiFetch(PATHS.myProfile, {
        method: "PUT",
        body: JSON.stringify(body),
      });

      if (response.status === 409) {
        setMessage({ text: "This email is already used by another account.", isError: true });
        return;
      }

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        const messages = data?.errors
          ? Object.values(data.errors as Record<string, string[]>).flat()
          : [];
        setMessage({ text: messages.join(" ") || "Could not save your profile.", isError: true });
        return;
      }

      const updated: Customer = await response.json();
      setCustomer(updated);
      setForm({ ...form, password: "" });

      // Keep the greeting in the navigation bar in sync with the new name
      if (user) {
        login({ ...user, name: updated.name });
      }

      setMessage({ text: "Your profile has been saved.", isError: false });
    } catch {
      setMessage({ text: "Could not reach the server. Please try again.", isError: true });
    } finally {
      setIsSaving(false);
    }
  };

  if (!form || !customer) {
    return message ? <p className="text-red-600">{message.text}</p> : <p className="text-muted">Loading...</p>;
  }

  const inputClass =
    "w-full rounded-lg border border-line px-3 py-2 text-ink focus:outline-none focus:ring-2 focus:ring-accent";
  const labelClass = "block text-sm font-medium text-muted mb-1";

  return (
    <div className="max-w-xl bg-surface rounded-2xl border border-line p-8">
      <p className="text-sm text-muted mb-6">
        Membership: <span className="font-medium text-ink">{customer.memberShipStatus}</span>
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className={labelClass}>First name</label>
            <input id="name" required minLength={3} value={form.name}
              onChange={(e) => updateField("name", e.target.value)} className={inputClass} />
          </div>
          <div>
            <label htmlFor="surname" className={labelClass}>Last name</label>
            <input id="surname" required value={form.surname}
              onChange={(e) => updateField("surname", e.target.value)} className={inputClass} />
          </div>
        </div>

        <div>
          <label htmlFor="email" className={labelClass}>Email</label>
          <input id="email" type="email" required value={form.email}
            onChange={(e) => updateField("email", e.target.value)} className={inputClass} />
        </div>

        <div>
          <label htmlFor="address" className={labelClass}>Address</label>
          <input id="address" required value={form.address}
            onChange={(e) => updateField("address", e.target.value)} className={inputClass} />
        </div>

        <div>
          <label htmlFor="phone" className={labelClass}>Phone</label>
          <input id="phone" type="tel" required value={form.telephoneNumber}
            onChange={(e) => updateField("telephoneNumber", e.target.value)} className={inputClass} />
        </div>

        <div>
          <label htmlFor="password" className={labelClass}>New password</label>
          <input id="password" type="password" minLength={6} value={form.password}
            onChange={(e) => updateField("password", e.target.value)} className={inputClass} />
          <p className="text-xs text-muted mt-1">Leave empty to keep your current password</p>
        </div>

        {message && (
          <p className={`text-sm ${message.isError ? "text-red-600" : "text-accent"}`}>{message.text}</p>
        )}

        <button
          type="submit"
          disabled={isSaving}
          className="rounded-lg bg-accent px-6 py-2.5 text-accent-contrast font-medium hover:bg-accent-strong transition disabled:opacity-50"
        >
          {isSaving ? "Saving..." : "Save changes"}
        </button>
      </form>
    </div>
  );
}