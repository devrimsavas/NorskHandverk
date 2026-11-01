"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { PATHS } from "@/lib/constants";
import { Product } from "@/lib/types";
import { formatPrice, productImageUrl } from "@/lib/format";
import ProductImage from "@/components/ProductImage";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<{
    text: string;
    isError: boolean;
  } | null>(null);

  const loadProducts = async () => {
    const response = await apiFetch(PATHS.products);
    if (response.ok) {
      setProducts(await response.json());
    } else {
      setMessage({ text: "Could not load products.", isError: true });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const deleteProduct = async (product: Product) => {
    if (
      !window.confirm(
        `Delete "${product.title}"? It will be hidden from the shop.`,
      )
    )
      return;

    setMessage(null);
    const response = await apiFetch(PATHS.product(product.id), {
      method: "DELETE",
    });

    setMessage(
      response.ok
        ? { text: `"${product.title}" was deleted.`, isError: false }
        : { text: "Could not delete the product.", isError: true },
    );

    await loadProducts();
  };

  if (isLoading) {
    return <p className="text-muted">Loading products...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-muted">{products.length} products</p>
        <Link
          href="/admin/products/new"
          className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-contrast hover:bg-accent-strong transition"
        >
          New product
        </Link>
      </div>

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
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Brand</th>
              <th className="px-4 py-3 font-medium text-right">
                Price inc. VAT
              </th>
              <th className="px-4 py-3 font-medium text-right">Stock</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line text-ink">
            {products.map((product) => {
              const imageUrl = productImageUrl(product.productImage);

              return (
                <tr key={product.id}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-surface-muted shrink-0">
                        <ProductImage
                          fileName={product.productImage}
                          alt={product.title}
                          sizes="48px"
                          compact
                        />
                      </div>
                      <span className="font-medium first-letter:uppercase">
                        {product.title}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {product.categoryName}
                  </td>
                  <td className="px-4 py-3 text-muted">{product.brandName}</td>
                  <td className="px-4 py-3 text-right">
                    {formatPrice(product.priceIncVat)}
                  </td>
                  <td
                    className={`px-4 py-3 text-right ${product.quantity === 0 ? "text-danger" : ""}`}
                  >
                    {product.quantity}
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="text-accent font-medium hover:underline"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => deleteProduct(product)}
                      className="ml-4 text-muted hover:text-danger"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
