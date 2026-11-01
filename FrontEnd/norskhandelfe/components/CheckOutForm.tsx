"use client";

import React, { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

interface CheckoutFormProps {
  clientSecret: string;
}

const CheckoutForm = ({ clientSecret }: CheckoutFormProps) => {
  const stripe = useStripe();
  const elements = useElements();

  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements || !isReady) return;

    setIsLoading(true);
    setMessage(null);

    try {
      // On success Stripe redirects to the return url, so the code below only runs on errors
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/order-success`,
        },
      });

      if (error.type === "card_error" || error.type === "validation_error") {
        setMessage(error.message ?? "Please check your card details.");
      } else {
        setMessage("An unexpected error occurred. Please try again.");
      }
    } catch {
      setMessage(
        "The payment could not be started. Please refresh the page and try again.",
      );
    } finally {
      // Always release the button, whatever happened
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement
        onReady={() => setIsReady(true)}
        onLoadError={() =>
          setMessage(
            "The payment form could not be loaded. Please refresh the page or try again later.",
          )
        }
      />

      <button
        disabled={isLoading || !stripe || !elements || !isReady}
        className="w-full rounded-lg bg-accent py-3 font-medium text-accent-contrast hover:bg-accent-strong transition disabled:opacity-50"
      >
        {isLoading
          ? "Processing..."
          : isReady
            ? "Pay now"
            : "Loading payment form..."}
      </button>

      {message && <p className="text-sm text-danger text-center">{message}</p>}
    </form>
  );
};

export default CheckoutForm;
