"use client";

import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/lib/api";
import { PATHS } from "@/lib/constants";
import { Order } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { orderStatusStyles, defaultStatusStyle } from "@/lib/orderStatus";

const ALL = "All";
const statusFilters = [
  ALL,
  "Awaiting Payment",
  "Ordered",
  "In Progress",
  "Delivered",
  "Canceled",
];

// The next step an admin can take for each status (matches the backend rules)
const nextAction: Record<string, { status: string; label: string }> = {
  Ordered: { status: "InProgress", label: "Mark in progress" },
  "In Progress": { status: "Delivered", label: "Mark delivered" },
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState(ALL);
  const [busyOrderId, setBusyOrderId] = useState<number | null>(null);
  const [message, setMessage] = useState<{
    text: string;
    isError: boolean;
  } | null>(null);

  const loadOrders = async () => {
    const response = await apiFetch(PATHS.orders);
    if (response.ok) {
      const data: Order[] = await response.json();
      // Newest first
      setOrders(
        data.sort(
          (a, b) =>
            new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime(),
        ),
      );
    } else {
      setMessage({ text: "Could not load orders.", isError: true });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const visibleOrders = useMemo(
    () =>
      filter === ALL ? orders : orders.filter((o) => o.statusName === filter),
    [orders, filter],
  );

  const runAction = async (order: Order, request: () => Promise<Response>) => {
    setBusyOrderId(order.id);
    setMessage(null);

    const response = await request();
    const data = await response.json().catch(() => null);

    setMessage({
      text: response.ok
        ? (data?.message ?? `Order ${order.orderNumber} updated.`)
        : (data?.message ?? "The action failed."),
      isError: !response.ok,
    });

    await loadOrders();
    setBusyOrderId(null);
  };

  const advanceStatus = (order: Order, status: string) =>
    runAction(order, () =>
      apiFetch(PATHS.orderStatus(order.id), {
        method: "PATCH",
        body: JSON.stringify({ status }),
      }),
    );

  const cancelOrder = (order: Order) => {
    const warning =
      order.statusName === "Ordered"
        ? `Cancel order ${order.orderNumber}? The customer will be refunded.`
        : `Cancel order ${order.orderNumber}?`;
    if (!window.confirm(warning)) return;

    runAction(order, () =>
      apiFetch(PATHS.cancelOrder(order.id), { method: "POST" }),
    );
  };

  if (isLoading) {
    return <p className="text-muted">Loading orders...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {statusFilters.map((name) => {
          const count =
            name === ALL
              ? orders.length
              : orders.filter((o) => o.statusName === name).length;
          return (
            <button
              key={name}
              onClick={() => setFilter(name)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                filter === name
                  ? "bg-accent text-accent-contrast"
                  : "border border-line text-muted hover:text-ink"
              }`}
            >
              {name} ({count})
            </button>
          );
        })}
      </div>

      {message && (
        <p
          className={`text-sm ${message.isError ? "text-red-600" : "text-accent"}`}
        >
          {message.text}
        </p>
      )}

      {visibleOrders.length === 0 && (
        <p className="text-muted">No orders here.</p>
      )}

      <div className="space-y-4">
        {visibleOrders.map((order) => {
          const action = nextAction[order.statusName];
          const canCancel =
            order.statusName === "Awaiting Payment" ||
            order.statusName === "Ordered";
          const isBusy = busyOrderId === order.id;

          return (
            <article
              key={order.id}
              className="bg-surface rounded-2xl border border-line p-6"
            >
              <header className="flex flex-wrap items-start justify-between gap-3 mb-4">
                <div>
                  <p className="font-medium text-ink">{order.orderNumber}</p>
                  <p className="text-sm text-muted">
                    {new Date(order.orderDate).toLocaleString("nb-NO")} ·{" "}
                    {order.customerName} ({order.customerEmail})
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${orderStatusStyles[order.statusName] ?? defaultStatusStyle}`}
                >
                  {order.statusName}
                </span>
              </header>

              <ul className="text-sm text-ink space-y-1">
                {order.items.map((item) => (
                  <li key={item.productId} className="first-letter:uppercase">
                    {item.quantity} × {item.productName}
                  </li>
                ))}
              </ul>

              <footer className="mt-4 pt-4 border-t border-line flex flex-wrap items-center justify-between gap-3">
                <p className="text-ink">
                  Total{" "}
                  <span className="font-semibold">
                    {formatPrice(order.totalPriceIncVat)}
                  </span>
                </p>

                <div className="flex gap-3">
                  {action && (
                    <button
                      onClick={() => advanceStatus(order, action.status)}
                      disabled={isBusy}
                      className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-contrast hover:bg-accent-strong disabled:opacity-50"
                    >
                      {action.label}
                    </button>
                  )}
                  {canCancel && (
                    <button
                      onClick={() => cancelOrder(order)}
                      disabled={isBusy}
                      className="rounded-lg border border-line px-4 py-2 text-sm text-muted hover:border-red-300 hover:text-red-600 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </footer>
            </article>
          );
        })}
      </div>
    </div>
  );
}
