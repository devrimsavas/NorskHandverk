"use client";

import { useEffect, useMemo, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { apiFetch } from "@/lib/api";
import { PATHS } from "@/lib/constants";
import { Product } from "@/lib/types";

const ALL = "All";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(ALL);

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

  // Categories come from the products themselves, sorted alphabetically
  const categories = useMemo(
    () => [ALL, ...Array.from(new Set(products.map((p) => p.categoryName))).sort()],
    [products]
  );

  // Filtered in the browser: the catalog is small, so every product is already loaded
  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesCategory = category === ALL || product.categoryName === category;
      const matchesSearch =
        term === "" ||
        product.title.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term);

      return matchesCategory && matchesSearch;
    });
  }, [products, search, category]);

  return (
    <section className="min-h-screen bg-page py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold text-ink">Shop</h1>
          <p className="text-muted mt-1">Handmade in Norway, from wood, wool and clay</p>
        </header>

        {!isLoading && !error && products.length > 0 && (
          <div className="mb-10 space-y-4">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products"
              aria-label="Search products"
              className="w-full sm:max-w-sm rounded-lg border border-line bg-surface px-4 py-2.5 text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent"
            />

            <div className="flex flex-wrap gap-2">
              {categories.map((name) => (
                <button
                  key={name}
                  onClick={() => setCategory(name)}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                    category === name
                      ? "bg-accent text-accent-contrast"
                      : "border border-line text-muted hover:text-ink"
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>
        )}

        {isLoading && <p className="text-muted">Loading products...</p>}

        {error && <p className="text-red-600">{error}</p>}

        {!isLoading && !error && products.length === 0 && (
          <p className="text-muted">No products yet.</p>
        )}

        {!isLoading && products.length > 0 && filteredProducts.length === 0 && (
          <p className="text-muted">No products match your search.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}