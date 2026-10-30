// app/payment/page.tsx
'use client'
import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '@/components/CheckOutForm';
//this is a test 

// Initialize Stripe with your Public Key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const PaymentContent = () => {
    const searchParams = useSearchParams();
    const clientSecret = searchParams.get('secret');

    if (!clientSecret) {
        return <div className="p-10 text-red-500 font-bold">Error: No payment secret found!</div>;
    }

    const options = {
        clientSecret,
        // Optional: customize the appearance of the form
        appearance: { theme: 'stripe' as const },
    };

    return (
        <section className="min-h-screen bg-gray-50 py-20">
            <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Complete Payment</h2>
                {/* Wrap the form in the Elements provider */}
                <Elements stripe={stripePromise} options={options}>
                    <CheckoutForm clientSecret={clientSecret} />
                </Elements>
            </div>
        </section>
    );
};

const PaymentPage = () => {
    return (
        // Suspense is required when using useSearchParams in Next.js 13+ app dir
        <Suspense fallback={<div>Loading payment environment...</div>}>
            <PaymentContent />
        </Suspense>
    );
};

export default PaymentPage;