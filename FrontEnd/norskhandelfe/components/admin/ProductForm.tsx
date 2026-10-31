"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { PATHS } from "@/lib/constants";
import { Brand, Category, Product } from "@/lib/types";
import { formatPrice } from "@/lib/format";

interface ProductFormProps {
  // Missing when creating a new product
  product?: Product;
}

interface FormState {
  title: string;
  description: string;
  price: string;
  discount: string;
  quantity: string;
  categoryId: string;
  brandId: string;
}

const ProductForm = ({ product }: ProductFormProps) => {
  const router = useRouter();
  const isEdit = product !== undefined;

  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<FormState>({
    title: product?.title ?? "",
    description: product?.description ?? "",
    price: product ? String(product.price) : "",
    discount: product ? String(product.discount) : "0",
    quantity: product ? String(product.quantity) : "",
    categoryId: product ? String(product.categoryId) : "",
    brandId: product ? String(product.brandId) : "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadOptions = async () => {
      const [brandResponse, categoryResponse] = await Promise.all([
        apiFetch(PATHS.brands),
        apiFetch(PATHS.categories),
      ]);
      if (brandResponse.ok) setBrands(await brandResponse.json());
      if (categoryResponse.ok) {
        const data: Category[] = await categoryResponse.json();
        setCategories(data.filter((c) => !c.isDeleted));
      }
    };

    loadOptions();
  }, []);

  const updateField = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // Same formula as the backend: discount off the net price, then VAT
  const selectedCategory = categories.find(
    (c) => String(c.id) === form.categoryId,
  );
  const previewPrice =
    selectedCategory && form.price
      ? (Number(form.price) - Number(form.discount || 0)) *
        (1 + selectedCategory.defaultVatRate)
      : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSaving(true);

    const body = {
      title: form.title.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      discount: Number(form.discount || 0),
      quantity: Number(form.quantity),
      categoryId: Number(form.categoryId),
      brandId: Number(form.brandId),
    };

    try {
      const response = await apiFetch(
        isEdit ? PATHS.product(product.id) : PATHS.products,
        {
          method: isEdit ? "PUT" : "POST",
          body: JSON.stringify(body),
        },
      );

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        const validation = data?.errors
          ? Object.values(data.errors as Record<string, string[]>)
              .flat()
              .join(" ")
          : null;
        setError(validation || data?.message || "Could not save the product.");
        return;
      }

      router.push("/admin/products");
    } catch {
      setError("Could not reach the server. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-line bg-surface px-3 py-2 text-ink focus:outline-none focus:ring-2 focus:ring-accent";
  const labelClass = "block text-sm font-medium text-ink mb-1";

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl bg-surface rounded-2xl border border-line p-8 space-y-5"
    >
      <h2 className="text-xl font-semibold text-ink">
        {isEdit ? "Edit product" : "New product"}
      </h2>

      <div>
        <label htmlFor="title" className={labelClass}>
          Title
        </label>
        <input
          id="title"
          required
          maxLength={50}
          value={form.title}
          onChange={(e) => updateField("title", e.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="description" className={labelClass}>
          Description
        </label>
        <textarea
          id="description"
          rows={4}
          maxLength={200}
          value={form.description}
          onChange={(e) => updateField("description", e.target.value)}
          className={inputClass}
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="category" className={labelClass}>
            Category
          </label>
          <select
            id="category"
            required
            value={form.categoryId}
            onChange={(e) => updateField("categoryId", e.target.value)}
            className={inputClass}
          >
            <option value="" disabled>
              Select a category
            </option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({Math.round(c.defaultVatRate * 100)}% VAT)
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="brand" className={labelClass}>
            Brand
          </label>
          <select
            id="brand"
            required
            value={form.brandId}
            onChange={(e) => updateField("brandId", e.target.value)}
            className={inputClass}
          >
            <option value="" disabled>
              Select a brand
            </option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div>
          <label htmlFor="price" className={labelClass}>
            Price (excl. VAT)
          </label>
          <input
            id="price"
            type="number"
            required
            min="0.01"
            step="0.01"
            value={form.price}
            onChange={(e) => updateField("price", e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="discount" className={labelClass}>
            Discount (excl. VAT)
          </label>
          <input
            id="discount"
            type="number"
            min="0"
            step="0.01"
            value={form.discount}
            onChange={(e) => updateField("discount", e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="quantity" className={labelClass}>
            Stock
          </label>
          <input
            id="quantity"
            type="number"
            required
            min="0"
            step="1"
            value={form.quantity}
            onChange={(e) => updateField("quantity", e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      {previewPrice !== null && (
        <p className="text-sm text-muted">
          Customers will pay{" "}
          <span className="font-medium text-ink">
            {formatPrice(previewPrice)}
          </span>{" "}
          including VAT.
        </p>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={isSaving}
          className="rounded-lg bg-accent px-6 py-2.5 font-medium text-accent-contrast hover:bg-accent-strong transition disabled:opacity-50"
        >
          {isSaving ? "Saving..." : isEdit ? "Save changes" : "Create product"}
        </button>
        <Link
          href="/admin/products"
          className="text-sm text-muted hover:text-ink"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
};

export default ProductForm;
