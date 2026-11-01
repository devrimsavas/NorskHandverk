"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "@/components/CheckOutForm";

// Created once, outside the component, so Stripe.js is not reloaded on every render
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

const PaymentContent = () => {
  const searchParams = useSearchParams();
  const clientSecret = searchParams.get("secret");

  if (!clientSecret) {
    return (
      <p className="max-w-md mx-auto py-20 text-center text-danger">
        No payment was found. Please start the checkout from your cart.
      </p>
    );
  }

  return (
    <section className="min-h-screen bg-page py-16 px-4">
      <div className="max-w-md mx-auto bg-surface rounded-2xl border border-line p-8">
        <h1 className="text-2xl font-semibold text-ink mb-1 text-center">
          Complete payment
        </h1>
        <p className="text-sm text-muted text-center mb-6">
          Test mode: use card 4242 4242 4242 4242
        </p>
        <Elements
          stripe={stripePromise}
          options={{ clientSecret, appearance: { theme: "stripe" } }}
        >
          <CheckoutForm clientSecret={clientSecret} />
        </Elements>
      </div>
    </section>
  );
};

export default function PaymentPage() {
  return (
    // useSearchParams needs a Suspense boundary in the App Router
    <Suspense
      fallback={
        <p className="py-20 text-center text-muted">Loading payment...</p>
      }
    >
      <PaymentContent />
    </Suspense>
  );
}
