"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { PATHS } from "@/lib/constants";
import { Category } from "@/lib/types";

// Norwegian VAT rates (merverdiavgift)
const vatOptions = [
  { value: "0.25", label: "25% (general rate)" },
  { value: "0.15", label: "15% (food)" },
  { value: "0.12", label: "12% (transport, culture, hotels)" },
  { value: "0", label: "0% (exempt)" },
];

interface FormState {
  name: string;
  description: string;
  defaultVatRate: string;
  ucpCategoryCode: string;
}

const emptyForm: FormState = {
  name: "",
  description: "",
  defaultVatRate: "0.25",
  ucpCategoryCode: "",
};

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    isError: boolean;
  } | null>(null);

  const loadCategories = async () => {
    const response = await apiFetch(PATHS.categories);
    if (response.ok) {
      const data: Category[] = await response.json();
      // Active categories first, then alphabetical
      setCategories(
        data.sort(
          (a, b) =>
            Number(a.isDeleted) - Number(b.isDeleted) ||
            a.name.localeCompare(b.name),
        ),
      );
    } else {
      setMessage({ text: "Could not load categories.", isError: true });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const updateField = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const startEdit = (category: Category) => {
    setEditingId(category.id);
    setForm({
      name: category.name,
      description: category.description,
      defaultVatRate: String(category.defaultVatRate),
      ucpCategoryCode: category.ucpCategoryCode ?? "",
    });
    setMessage(null);
  };

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const showError = async (response: Response) => {
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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setIsSaving(true);

    const body = {
      name: form.name.trim(),
      description: form.description.trim(),
      defaultVatRate: Number(form.defaultVatRate),
      ucpCategoryCode: form.ucpCategoryCode.trim() || null,
    };

    const response = await apiFetch(
      editingId ? PATHS.category(editingId) : PATHS.categories,
      {
        method: editingId ? "PUT" : "POST",
        body: JSON.stringify(body),
      },
    );

    if (response.ok) {
      setMessage({
        text: `"${body.name}" was ${editingId ? "updated" : "added"}.`,
        isError: false,
      });
      resetForm();
      await loadCategories();
    } else {
      await showError(response);
    }
    setIsSaving(false);
  };

  const deleteCategory = async (category: Category) => {
    if (!window.confirm(`Delete the category "${category.name}"?`)) return;
    setMessage(null);

    const response = await apiFetch(PATHS.category(category.id), {
      method: "DELETE",
    });
    if (response.ok) {
      setMessage({ text: `"${category.name}" was deleted.`, isError: false });
      if (editingId === category.id) resetForm();
      await loadCategories();
    } else {
      await showError(response);
    }
  };

  if (isLoading) {
    return <p className="text-muted">Loading categories...</p>;
  }

  const inputClass =
    "w-full rounded-lg border border-line bg-surface px-3 py-2 text-ink focus:outline-none focus:ring-2 focus:ring-accent";
  const labelClass = "block text-sm font-medium text-ink mb-1";

  return (
    <div className="space-y-8">
      <form
        onSubmit={handleSubmit}
        className="max-w-2xl bg-surface rounded-2xl border border-line p-6 space-y-4"
      >
        <h2 className="text-lg font-semibold text-ink">
          {editingId ? "Edit category" : "New category"}
        </h2>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className={labelClass}>
              Name
            </label>
            <input
              id="name"
              required
              maxLength={50}
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="vat" className={labelClass}>
              VAT rate
            </label>
            <select
              id="vat"
              value={form.defaultVatRate}
              onChange={(e) => updateField("defaultVatRate", e.target.value)}
              className={inputClass}
            >
              {vatOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="description" className={labelClass}>
            Description
          </label>
          <input
            id="description"
            required
            maxLength={250}
            value={form.description}
            onChange={(e) => updateField("description", e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="ucp" className={labelClass}>
            Google category code (optional)
          </label>
          <input
            id="ucp"
            value={form.ucpCategoryCode}
            onChange={(e) => updateField("ucpCategoryCode", e.target.value)}
            className={inputClass}
          />
          <p className="text-xs text-muted mt-1">
            Reserved for the planned Universal Commerce Protocol integration.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={isSaving}
            className="rounded-lg bg-accent px-5 py-2 text-sm font-medium text-accent-contrast hover:bg-accent-strong transition disabled:opacity-50"
          >
            {isSaving
              ? "Saving..."
              : editingId
                ? "Save changes"
                : "Add category"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="text-sm text-muted hover:text-ink"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {message && (
        <p
          className={`text-sm ${message.isError ? "text-danger" : "text-accent"}`}
        >
          {message.text}
        </p>
      )}

      <div className="overflow-x-auto rounded-2xl border border-line bg-surface">
        <table className="min-w-full text-sm">
          <thead className="bg-surface-muted text-left text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Description</th>
              <th className="px-4 py-3 font-medium text-right">VAT</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line text-ink">
            {categories.map((category) => (
              <tr
                key={category.id}
                className={category.isDeleted ? "opacity-50" : ""}
              >
                <td className="px-4 py-3 font-medium">{category.name}</td>
                <td className="px-4 py-3 text-muted">{category.description}</td>
                <td className="px-4 py-3 text-right">
                  {Math.round(category.defaultVatRate * 100)}%
                </td>
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  {category.isDeleted ? (
                    <span className="text-muted">Deleted</span>
                  ) : (
                    <>
                      <button
                        onClick={() => startEdit(category)}
                        className="text-accent font-medium hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteCategory(category)}
                        className="ml-4 text-muted hover:text-danger"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
