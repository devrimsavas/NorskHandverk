"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { API_GET_ALL_CARTS, API_CHECK_OUT_ORDER } from "@/lib/constants";
import CheckOutButton from "@/components/CheckOutButton";

interface Item {
  productId: number;
  productName: string;
  unitPrice: number;
  vatRate: number;
  quantity: number;
  totalPrice: number;
  totalPriceIncVat: number;
}

interface Cart {
  cartNumber: string;
  customerId: number;
  statusName: string;
  items: Item[];
}

const Cart = () => {
  const [carts, setCarts] = useState<Cart[]>([]);
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const router = useRouter();

  const getCarts = async () => {
    try {
      const response = await fetch(API_GET_ALL_CARTS, { cache: "no-cache" });
      if (!response.ok) return;
      const data = await response.json();
      setCarts(data);
    } catch (err) {
      console.error("Error fetching carts:", err);
    }
  };

  useEffect(() => {
    getCarts();
  }, []);

  const handleCheckout = async (customerId: number) => {
    setLoadingId(customerId);
    try {
      const response = await fetch(API_CHECK_OUT_ORDER(customerId), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error("Checkout request failed");

      const data = await response.json();

      
      const secret = data.clientSecret || data.ClientSecret;

      if (secret) {
        
        router.push(`/payment?secret=${secret}`);
      } else {
        console.error("Client Secret did not come", data);
      }
    } catch (err) {
      console.error("Checkout error:", err);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-gray-200 shadow-sm bg-white p-4">
      <table className="min-w-full text-left border-collapse text-sm">
        <thead className="bg-gray-100 text-gray-800 uppercase font-semibold">
          <tr>
            <th className="px-3 py-2">Cart Number</th>
            <th className="px-3 py-2">Customer ID</th>
            <th className="px-3 py-2">Status</th>
            <th className="px-3 py-2">Product</th>
            <th className="px-3 py-2 text-center">Qty</th>
            <th className="px-3 py-2">Total Inc VAT</th>
            <th className="px-3 py-2 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 text-gray-800">
          {carts.map((cart) => (
            <React.Fragment key={cart.cartNumber}>
              {/* Main Cart Row */}
              <tr className="bg-gray-50 font-medium">
                <td className="px-3 py-2">{cart.cartNumber}</td>
                <td className="px-3 py-2">{cart.customerId}</td>
                <td className="px-3 py-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${cart.statusName === "checkedOut" ? "bg-green-100 text-green-700" : "bg-gray-200"}`}
                  >
                    {cart.statusName}
                  </span>
                </td>
                <td className="px-3 py-2" colSpan={3}>
                  {cart.items.length} item(s) in cart
                </td>
                <td className="px-3 py-2 text-right">
                  {/* Action button appears only for active carts */}
                  {cart.statusName === "active"   && (
                    <CheckOutButton
                      text={
                        loadingId === cart.customerId ? "Wait..." : "Pay Now"
                      }
                      onClick={() => handleCheckout(cart.customerId)}
                      color="accent"
                    />
                  )}
                </td>
              </tr>
              {/* Individual Item Rows */}
              {cart.items.map((item) => (
                <tr
                  key={`${cart.cartNumber}-${item.productId}`}
                  className="hover:bg-gray-50 transition border-b border-gray-50"
                >
                  <td colSpan={3}></td>
                  <td className="px-3 py-2 italic text-gray-600">
                    {item.productName}
                  </td>
                  <td className="px-3 py-2 text-center font-bold">
                    {item.quantity}
                  </td>
                  <td className="px-3 py-2">{item.totalPriceIncVat} NOK</td>
                  <td></td>
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Cart;
