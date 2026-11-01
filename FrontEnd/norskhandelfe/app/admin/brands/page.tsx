"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { PATHS } from "@/lib/constants";
import { Brand } from "@/lib/types";

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [message, setMessage] = useState<{
    text: string;
    isError: boolean;
  } | null>(null);

  const loadBrands = async () => {
    const response = await apiFetch(PATHS.brands);
    if (response.ok) {
      const data: Brand[] = await response.json();
      setBrands(data.sort((a, b) => a.name.localeCompare(b.name)));
    } else {
      setMessage({ text: "Could not load brands.", isError: true });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadBrands();
  }, []);

  // Shows the backend message, or a validation error, after any request
  const showResult = async (response: Response, successText: string) => {
    if (response.ok) {
      setMessage({ text: successText, isError: false });
      return true;
    }
    const data = await response.json().catch(() => null);
    const validation = data?.errors
      ? Object.values(data.errors as Record<string, string[]>)
          .flat()
          .join(" ")
      : null;
    setMessage({
      text: validation || data?.message || "The request failed.",
      isError: true,
    });
    return false;
  };

  const createBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    const name = newName.trim();
    const response = await apiFetch(PATHS.brands, {
      method: "POST",
      body: JSON.stringify({ name }),
    });

    if (await showResult(response, `"${name}" was added.`)) {
      setNewName("");
      await loadBrands();
    }
  };

  const saveBrand = async (brand: Brand) => {
    setMessage(null);

    const name = editName.trim();
    const response = await apiFetch(PATHS.brand(brand.id), {
      method: "PUT",
      body: JSON.stringify({ name }),
    });

    if (
      await showResult(response, `"${brand.name}" was renamed to "${name}".`)
    ) {
      setEditingId(null);
      await loadBrands();
    }
  };

  const deleteBrand = async (brand: Brand) => {
    if (!window.confirm(`Delete the brand "${brand.name}"?`)) return;
    setMessage(null);

    const response = await apiFetch(PATHS.brand(brand.id), {
      method: "DELETE",
    });
    if (await showResult(response, `"${brand.name}" was deleted.`)) {
      await loadBrands();
    }
  };

  if (isLoading) {
    return <p className="text-muted">Loading brands...</p>;
  }

  const inputClass =
    "rounded-lg border border-line bg-surface px-3 py-2 text-ink focus:outline-none focus:ring-2 focus:ring-accent";

  return (
    <div className="max-w-2xl space-y-6">
      <form onSubmit={createBrand} className="flex gap-3">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="New brand name"
          aria-label="New brand name"
          required
          minLength={2}
          className={`flex-1 ${inputClass}`}
        />
        <button
          type="submit"
          className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-contrast hover:bg-accent-strong transition"
        >
          Add brand
        </button>
      </form>

      {message && (
        <p
          className={`text-sm ${message.isError ? "text-danger" : "text-accent"}`}
        >
          {message.text}
        </p>
      )}

      <ul className="divide-y divide-line rounded-2xl border border-line bg-surface">
        {brands.map((brand) => (
          <li key={brand.id} className="flex items-center gap-3 px-4 py-3">
            {editingId === brand.id ? (
              <>
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  aria-label={`New name for ${brand.name}`}
                  autoFocus
                  className={`flex-1 ${inputClass}`}
                />
                <button
                  onClick={() => saveBrand(brand)}
                  className="text-sm font-medium text-accent hover:underline"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="text-sm text-muted hover:text-ink"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <span className="flex-1 text-ink capitalize">{brand.name}</span>
                <button
                  onClick={() => {
                    setEditingId(brand.id);
                    setEditName(brand.name);
                  }}
                  className="text-sm font-medium text-accent hover:underline"
                >
                  Rename
                </button>
                <button
                  onClick={() => deleteBrand(brand)}
                  className="text-sm text-muted hover:text-danger"
                >
                  Delete
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
