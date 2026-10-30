"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { PATHS } from "@/lib/constants";
import { Product } from "@/lib/types";
import { formatPrice, productImageUrl } from "@/lib/format";
import { useAuth } from "@/context/AuthContext";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user, isReady, logout } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    isError: boolean;
  } | null>(null);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const response = await apiFetch(PATHS.product(id));
        if (!response.ok) {
          setNotFound(true);
          return;
        }
        setProduct(await response.json());
      } catch {
        setNotFound(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;

    setIsAdding(true);
    setMessage(null);

    try {
      const response = await apiFetch(PATHS.cart, {
        method: "POST",
        body: JSON.stringify({ cartItem: { productId: product.id, quantity } }),
      });

      if (response.status === 401) {
        // Token expired: clear the stale login
        logout();
        setMessage({
          text: "Your session has expired. Please log in again.",
          isError: true,
        });
        return;
      }

      if (!response.ok) {
        const text = await response.text();
        setMessage({ text: text || "Could not add to cart.", isError: true });
        return;
      }

      // Stock was reserved by the backend, so reflect it here
      setProduct({ ...product, quantity: product.quantity - quantity });
      setQuantity(1);
      setMessage({ text: "Added to your cart.", isError: false });
    } catch {
      setMessage({
        text: "Could not reach the server. Please try again.",
        isError: true,
      });
    } finally {
      setIsAdding(false);
    }
  };

  if (isLoading) {
    return (
      <p className="max-w-5xl mx-auto px-6 py-12 text-stone-500">Loading...</p>
    );
  }

  if (notFound || !product) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-12">
        <p className="text-stone-700 mb-4">This product could not be found.</p>
        <Link href="/products" className="text-emerald-800 hover:underline">
          Back to the shop
        </Link>
      </div>
    );
  }

  const imageUrl = productImageUrl(product.productImage);
  const isSoldOut = product.status === "Out_Of_Stock" || product.quantity === 0;

  return (
    <section className="min-h-screen bg-stone-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <Link
          href="/products"
          className="text-sm text-stone-500 hover:text-stone-800"
        >
          ← Back to the shop
        </Link>

        <div className="mt-6 grid md:grid-cols-2 gap-10">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-stone-100">
            {imageUrl && (
              <Image
                src={imageUrl}
                alt={product.title}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
                priority
              />
            )}
          </div>

          <div className="space-y-5">
            <div>
              <p className="text-xs uppercase tracking-wide text-stone-500">
                {product.categoryName} · {product.brandName}
              </p>
              <h1 className="text-3xl font-semibold text-stone-900 mt-1 first-letter:uppercase">
                {product.title}
              </h1>
            </div>

            <p className="text-2xl text-stone-800">
              {formatPrice(product.priceIncVat)}
            </p>
            <p className="text-stone-600 leading-relaxed">
              {product.description}
            </p>

            <p className="text-sm text-stone-500">
              {isSoldOut ? "Sold out" : `${product.quantity} in stock`}
            </p>

            {isReady && !user && !isSoldOut && (
              <Link
                href="/login"
                className="inline-block rounded-lg bg-emerald-800 px-6 py-3 text-white font-medium hover:bg-emerald-900"
              >
                Log in to add to cart
              </Link>
            )}

            {isReady && user && !isSoldOut && (
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={1}
                  max={product.quantity}
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(
                      Math.max(
                        1,
                        Math.min(product.quantity, Number(e.target.value)),
                      ),
                    )
                  }
                  className="w-20 rounded-lg border border-stone-300 px-3 py-3 text-stone-900"
                />
                <button
                  onClick={handleAddToCart}
                  disabled={isAdding}
                  className="rounded-lg bg-emerald-800 px-6 py-3 text-white font-medium hover:bg-emerald-900 transition disabled:opacity-50"
                >
                  {isAdding ? "Adding..." : "Add to cart"}
                </button>
              </div>
            )}

            {message && (
              <p
                className={`text-sm ${message.isError ? "text-red-600" : "text-emerald-700"}`}
              >
                {message.text}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
