"use client";

import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/lib/api";
import { PATHS } from "@/lib/constants";
import { Cart } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import ProductImage from "@/components/ProductImage";

const ALL = "all";
const statusFilters = [
  { value: ALL, label: "All" },
  { value: "active", label: "Active" },
  { value: "checkedOut", label: "Checked out" },
  { value: "abandoned", label: "Abandoned" },
  { value: "completed", label: "Completed" },
];

const statusStyles: Record<string, string> = {
  active: "bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-200",
  checkedOut:
    "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200",
  abandoned:
    "bg-stone-200 text-stone-700 dark:bg-stone-700/60 dark:text-stone-300",
  completed:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200",
};

export default function AdminCartsPage() {
  const [carts, setCarts] = useState<Cart[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState(ALL);

  useEffect(() => {
    const loadCarts = async () => {
      const response = await apiFetch(PATHS.carts);
      if (response.ok) {
        const data: Cart[] = await response.json();
        // Newest carts have the highest ids
        setCarts(
          data.sort(
            (a, b) =>
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
          ),
        );
      } else {
        setError("Could not load carts.");
      }
      setIsLoading(false);
    };

    loadCarts();
  }, []);

  const visibleCarts = useMemo(
    () =>
      filter === ALL ? carts : carts.filter((c) => c.statusName === filter),
    [carts, filter],
  );

  if (isLoading) {
    return <p className="text-muted">Loading carts...</p>;
  }

  if (error) {
    return <p className="text-danger">{error}</p>;
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted">
        Read-only overview. Active carts hold reserved stock until they are
        checked out or cleared.
      </p>

      <div className="flex flex-wrap gap-2">
        {statusFilters.map((option) => {
          const count =
            option.value === ALL
              ? carts.length
              : carts.filter((c) => c.statusName === option.value).length;
          return (
            <button
              key={option.value}
              onClick={() => setFilter(option.value)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                filter === option.value
                  ? "bg-accent text-accent-contrast"
                  : "border border-line text-muted hover:text-ink"
              }`}
            >
              {option.label} ({count})
            </button>
          );
        })}
      </div>

      {visibleCarts.length === 0 && (
        <p className="text-muted">No carts here.</p>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {visibleCarts.map((cart) => {
          const total = cart.items.reduce(
            (sum, item) => sum + item.totalPriceIncVat,
            0,
          );

          return (
            <article
              key={cart.id}
              className="bg-surface rounded-2xl border border-line p-5"
            >
              <header className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <p className="font-medium text-ink capitalize">
                    {cart.customerName}
                  </p>
                  <p className="text-xs text-muted">
                    {cart.customerEmail} · #{cart.id} · last change{" "}
                    {new Date(cart.updatedAt).toLocaleString("nb-NO")}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyles[cart.statusName] ?? "bg-surface-muted text-muted"}`}
                >
                  {statusFilters.find((s) => s.value === cart.statusName)
                    ?.label ?? cart.statusName}
                </span>
              </header>

              {cart.items.length === 0 ? (
                <p className="text-sm text-muted">Empty cart</p>
              ) : (
                <ul className="space-y-2">
                  {cart.items.map((item) => (
                    <li
                      key={item.productId}
                      className="flex items-center gap-3 text-sm"
                    >
                      <div className="relative w-10 h-10 rounded-md overflow-hidden shrink-0">
                        <ProductImage
                          fileName={item.productImage}
                          alt={item.productName}
                          sizes="40px"
                          compact
                        />
                      </div>
                      <span className="flex-1 text-ink first-letter:uppercase">
                        {item.quantity} × {item.productName}
                      </span>
                      <span className="text-muted">
                        {formatPrice(item.totalPriceIncVat)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}

              <footer className="mt-4 pt-3 border-t border-line text-right text-sm text-ink">
                Total{" "}
                <span className="font-semibold">{formatPrice(total)}</span>
              </footer>
            </article>
          );
        })}
      </div>
    </div>
  );
}
