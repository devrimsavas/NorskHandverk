"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { apiFetch } from "@/lib/api";
import { PATHS } from "@/lib/constants";
import { Product } from "@/lib/types";

const FeaturedProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await apiFetch(PATHS.products);
        if (response.ok) {
          const data: Product[] = await response.json();
          // Show the first four products that are in stock
          setProducts(data.filter((p) => p.status === "Available" && p.quantity > 0).slice(0, 4));
        }
      } catch {
        // The home page still works without featured products
      }
    };

    loadProducts();
  }, []);

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default FeaturedProducts;