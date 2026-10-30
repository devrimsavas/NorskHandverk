"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { PATHS } from "@/lib/constants";
import { Order } from "@/lib/types";
import { formatPrice } from "@/lib/format";

const statusStyles: Record<string, string> = {
  "Awaiting Payment": "bg-amber-100 text-amber-800",
  Ordered: "bg-emerald-100 text-emerald-800",
  "In Progress": "bg-sky-100 text-sky-800",
  Delivered: "bg-stone-200 text-stone-800",
  Canceled: "bg-red-100 text-red-700",
};

export default function OrdersPage() {
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [busyOrderId, setBusyOrderId] = useState<number | null>(null);
  const [message, setMessage] = useState<{
    text: string;
    isError: boolean;
  } | null>(null);

  const loadOrders = async () => {
    const response = await apiFetch(PATHS.myOrders);
    if (response.ok) {
      setOrders(await response.json());
    } else {
      setMessage({ text: "Could not load your orders.", isError: true });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const cancelOrder = async (order: Order) => {
    const warning =
      order.statusName === "Ordered"
        ? `Cancel order ${order.orderNumber}? The payment will be refunded.`
        : `Cancel order ${order.orderNumber}?`;
    if (!window.confirm(warning)) return;

    setBusyOrderId(order.id);
    setMessage(null);

    const response = await apiFetch(PATHS.cancelOrder(order.id), {
      method: "POST",
    });
    const data = await response.json().catch(() => null);

    setMessage({
      text:
        data?.message ??
        (response.ok ? "Order canceled." : "Could not cancel the order."),
      isError: !response.ok,
    });

    await loadOrders();
    setBusyOrderId(null);
  };

  // Checkout returns the same payment intent for an order that is awaiting payment
  const completePayment = async (order: Order) => {
    setBusyOrderId(order.id);
    setMessage(null);

    const response = await apiFetch(PATHS.checkout, { method: "POST" });
    const data = await response.json().catch(() => null);

    if (response.ok && data?.clientSecret) {
      router.push(`/payment?secret=${data.clientSecret}`);
      return;
    }

    setMessage({
      text: data?.message ?? "Could not resume the payment.",
      isError: true,
    });
    await loadOrders();
    setBusyOrderId(null);
  };

  if (isLoading) {
    return <p className="text-stone-500">Loading your orders...</p>;
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center">
        <p className="text-stone-600 mb-4">You have no orders yet.</p>
        <Link
          href="/products"
          className="text-emerald-800 font-medium hover:underline"
        >
          Browse the shop
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {message && (
        <p
          className={`text-sm ${message.isError ? "text-red-600" : "text-emerald-700"}`}
        >
          {message.text}
        </p>
      )}

      {orders.map((order) => {
        const canCancel =
          order.statusName === "Awaiting Payment" ||
          order.statusName === "Ordered";
        const isBusy = busyOrderId === order.id;

        return (
          <article
            key={order.id}
            className="bg-white rounded-2xl border border-stone-200 p-6"
          >
            <header className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div>
                <p className="font-medium text-stone-900">
                  {order.orderNumber}
                </p>
                <p className="text-sm text-stone-500">
                  {new Date(order.orderDate).toLocaleDateString("nb-NO")}
                </p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  statusStyles[order.statusName] ??
                  "bg-stone-100 text-stone-700"
                }`}
              >
                {order.statusName}
              </span>
            </header>

            <ul className="text-sm text-stone-700 space-y-1">
              {order.items.map((item) => (
                <li key={item.productId} className="flex justify-between">
                  <span className="first-letter:uppercase">
                    {item.quantity} × {item.productName}
                  </span>
                </li>
              ))}
            </ul>

            <footer className="mt-4 pt-4 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
              <p className="text-stone-900">
                Total{" "}
                <span className="font-semibold">
                  {formatPrice(order.totalPriceIncVat)}
                </span>
              </p>

              <div className="flex gap-3">
                {order.statusName === "Awaiting Payment" && (
                  <button
                    onClick={() => completePayment(order)}
                    disabled={isBusy}
                    className="rounded-lg bg-emerald-800 px-4 py-2 text-sm text-white font-medium hover:bg-emerald-900 disabled:opacity-50"
                  >
                    Complete payment
                  </button>
                )}
                {canCancel && (
                  <button
                    onClick={() => cancelOrder(order)}
                    disabled={isBusy}
                    className="rounded-lg border border-stone-300 px-4 py-2 text-sm text-stone-700 hover:border-red-300 hover:text-red-600 disabled:opacity-50"
                  >
                    {isBusy ? "Working..." : "Cancel order"}
                  </button>
                )}
              </div>
            </footer>
          </article>
        );
      })}
    </div>
  );
}
