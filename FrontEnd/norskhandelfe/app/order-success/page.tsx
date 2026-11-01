"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

// Stripe adds redirect_status to the return url: succeeded, processing or failed
const results = {
  succeeded: {
    title: "Payment successful",
    text: "Thank you for your order. You can follow it in your account.",
    iconClass:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    icon: "M5 13l4 4L19 7",
  },
  processing: {
    title: "Payment processing",
    text: "Your payment is being processed. Your order will update as soon as it is confirmed.",
    iconClass:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    icon: "M12 8v4l3 3",
  },
  failed: {
    title: "Payment failed",
    text: "Your payment was not completed. You can try again from your orders.",
    iconClass: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
    icon: "M6 18L18 6M6 6l12 12",
  },
};

const ResultContent = () => {
  const searchParams = useSearchParams();
  const status = searchParams.get("redirect_status");
  const paymentIntent = searchParams.get("payment_intent");

  const result =
    status === "succeeded"
      ? results.succeeded
      : status === "processing"
        ? results.processing
        : results.failed;

  return (
    <section className="min-h-screen bg-page flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-surface rounded-2xl border border-line p-8 text-center">
        <div
          className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 ${result.iconClass}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d={result.icon}
            />
          </svg>
        </div>

        <h1 className="text-2xl font-semibold text-ink mb-2">{result.title}</h1>
        <p className="text-muted mb-8">{result.text}</p>

        {paymentIntent && (
          <div className="bg-surface-muted rounded-lg p-4 mb-8 text-left">
            <p className="text-xs uppercase font-medium text-muted mb-1">
              Payment reference
            </p>
            <p className="text-sm font-mono text-ink break-all">
              {paymentIntent}
            </p>
          </div>
        )}

        <div className="space-y-3">
          <Link
            href="/account/orders"
            className="block w-full rounded-lg bg-accent py-3 font-medium text-accent-contrast hover:bg-accent-strong transition"
          >
            View my orders
          </Link>
          <Link
            href="/products"
            className="block w-full py-2 text-sm text-muted hover:text-ink transition"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    </section>
  );
};

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={<p className="py-20 text-center text-muted">Loading...</p>}
    >
      <ResultContent />
    </Suspense>
  );
}
