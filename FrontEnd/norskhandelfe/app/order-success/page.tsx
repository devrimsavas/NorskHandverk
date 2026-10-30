// app/order-success/page.tsx
'use client'
import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

const SuccessContent = () => {
    const searchParams = useSearchParams();
    // Stripe automatically appends payment_intent_client_secret to the URL
    const paymentIntent = searchParams.get('payment_intent');

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-green-100">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
                <p className="text-gray-600 mb-8">
                    Your order has been confirmed. Thank you for your purchase.
                </p>

                <div className="bg-gray-50 rounded-lg p-4 mb-8 text-left">
                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Payment Reference</p>
                    <p className="text-sm font-mono text-gray-700 break-all">{paymentIntent}</p>
                </div>

                <div className="space-y-3">
                    <Link 
                        href="/account/orders" 
                        className="block w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
                    >
                        View My Orders
                    </Link>
                    <Link 
                        href="/" 
                        className="block w-full text-gray-500 py-2 text-sm hover:text-gray-800 transition"
                    >
                        Return to Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

const OrderSuccessPage = () => {
    return (
        // Suspense is mandatory for useSearchParams in Next.js
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading status...</div>}>
            <SuccessContent />
        </Suspense>
    );
};

export default OrderSuccessPage;