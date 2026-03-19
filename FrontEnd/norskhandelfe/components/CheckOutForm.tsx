// components/CheckoutForm.tsx
'use client'
import React, { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

interface CheckoutFormProps {
    clientSecret: string;
}

const CheckoutForm = ({ clientSecret }: CheckoutFormProps) => {
    const stripe = useStripe();
    const elements = useElements();
    const [message, setMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) return;

        setIsLoading(true);

        // Confirm the payment with Stripe
        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                // Where to redirect after successful payment
                return_url: `${window.location.origin}/order-success`,
            },
        });

        // This point is only reached if there is an immediate error (e.g., card declined)
        if (error.type === "card_error" || error.type === "validation_error") {
            setMessage(error.message ?? "An error occurred.");
        } else {
            setMessage("An unexpected error occurred.");
        }

        setIsLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <PaymentElement />
            
            <button
                disabled={isLoading || !stripe || !elements}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition disabled:opacity-50"
            >
                {isLoading ? "Processing..." : "Pay Now"}
            </button>

            {/* Display error messages if any */}
            {message && <div className="text-red-500 text-sm mt-4 text-center">{message}</div>}
        </form>
    );
};

export default CheckoutForm;