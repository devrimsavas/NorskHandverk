"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { apiFetch } from "@/lib/api";
import { PATHS } from "@/lib/constants";
import { Product } from "@/lib/types";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await apiFetch(PATHS.products);
        if (!response.ok) {
          setError("Could not load products.");
          return;
        }
        setProducts(await response.json());
      } catch {
        setError("Could not reach the server. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  return (
    <section className="min-h-screen bg-page py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <header className="mb-10">
          <h1 className="text-3xl font-semibold text-ink">Shop</h1>
          <p className="text-muted mt-1">
            Handmade in Norway, from wood, wool and clay
          </p>
        </header>

        {isLoading && <p className="text-muted">Loading products...</p>}

        {error && <p className="text-red-600">{error}</p>}

        {!isLoading && !error && products.length === 0 && (
          <p className="text-muted">No products yet.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
