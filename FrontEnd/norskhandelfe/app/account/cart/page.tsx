"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { PATHS } from "@/lib/constants";
import { Cart } from "@/lib/types";
import Image from "next/image";
import { formatPrice, productImageUrl } from "@/lib/format";

export default function CartPage() {
  const router = useRouter();

  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCart = async () => {
    const response = await apiFetch(PATHS.myCart);
    // 404 means the customer has no active cart yet
    setCart(response.ok ? await response.json() : null);
    setIsLoading(false);
  };

  useEffect(() => {
    loadCart();
  }, []);

  // Setting the quantity to 0 removes the item from the cart
  const changeQuantity = async (productId: number, newQuantity: number) => {
    setIsBusy(true);
    setError(null);

    const response = await apiFetch(PATHS.updateCart, {
      method: "POST",
      body: JSON.stringify({ productId, newQuantity }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      setError(data?.message ?? "Could not update the cart.");
    }

    await loadCart();
    setIsBusy(false);
  };

  const clearCart = async () => {
    setIsBusy(true);
    setError(null);
    await apiFetch(PATHS.clearCart, { method: "POST" });
    await loadCart();
    setIsBusy(false);
  };

  const checkout = async () => {
    setIsBusy(true);
    setError(null);

    try {
      const response = await apiFetch(PATHS.checkout, { method: "POST" });
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setError(data?.message ?? "Could not start the payment.");
        return;
      }

      router.push(`/payment?secret=${data.clientSecret}`);
    } catch {
      setError("Could not reach the server. Please try again.");
    } finally {
      setIsBusy(false);
    }
  };

  if (isLoading) {
    return <p className="text-muted">Loading your cart...</p>;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="bg-surface rounded-2xl border border-line p-8 text-center">
        <p className="text-muted mb-4">Your cart is empty.</p>
        <Link
          href="/products"
          className="text-accent font-medium hover:underline"
        >
          Browse the shop
        </Link>
      </div>
    );
  }

  const total = cart.items.reduce(
    (sum, item) => sum + item.totalPriceIncVat,
    0,
  );

  return (
    <div className="bg-surface rounded-2xl border border-line p-6 sm:p-8">
      <ul className="divide-y divide-stone-200">
        {cart.items.map((item) => (
          <li
            key={item.productId}
            className="py-4 flex flex-wrap items-center gap-4"
          >
            <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-surface-muted shrink-0">
              {productImageUrl(item.productImage) && (
                <Image
                  src={productImageUrl(item.productImage)!}
                  alt={item.productName}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              )}
            </div>

            <div className="flex-1 min-w-48">
              <p className="font-medium text-ink first-letter:uppercase">
                {item.productName}
              </p>
              <p className="text-sm text-muted">
                {formatPrice(item.unitPrice * (1 + item.vatRate))} each
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  changeQuantity(item.productId, item.quantity - 1)
                }
                disabled={isBusy}
                className="w-8 h-8 rounded-md border border-line text-muted hover:bg-surface-muted disabled:opacity-50"
              >
                −
              </button>
              <span className="w-8 text-center text-ink">
                {item.quantity}
              </span>
              <button
                onClick={() =>
                  changeQuantity(item.productId, item.quantity + 1)
                }
                disabled={isBusy}
                className="w-8 h-8 rounded-md border border-line text-muted hover:bg-surface-muted disabled:opacity-50"
              >
                +
              </button>
            </div>

            <p className="w-28 text-right text-ink">
              {formatPrice(item.totalPriceIncVat)}
            </p>

            <button
              onClick={() => changeQuantity(item.productId, 0)}
              disabled={isBusy}
              className="text-sm text-muted hover:text-red-600 disabled:opacity-50"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-6 pt-6 border-t border-line flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={clearCart}
          disabled={isBusy}
          className="text-sm text-muted hover:text-red-600 disabled:opacity-50"
        >
          Clear cart
        </button>

        <div className="flex items-center gap-6">
          <p className="text-lg text-ink">
            Total <span className="font-semibold">{formatPrice(total)}</span>
          </p>
          <button
            onClick={checkout}
            disabled={isBusy}
            className="rounded-lg bg-accent px-6 py-3 text-accent-contrast font-medium hover:bg-accent-strong transition disabled:opacity-50"
          >
            Checkout
          </button>
        </div>
      </div>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
    </div>
  );
}
