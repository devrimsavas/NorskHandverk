"use client";
import React, { useState, useEffect } from "react";
import { API_GET_ALL_ORDERS } from "@/lib/constants";

interface Item {
  productId: number;
  productName: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

interface Order {
  orderNumber: string;
  statusName: string;
  customerId: number;
  orderDate: string;
  items: Item[];
  totalPrice: number;
  totalPriceIncVat: number;
}

const Order = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  const getOrders = async () => {
    try {
      const response = await fetch(API_GET_ALL_ORDERS, { cache: "no-cache" });
      if (!response.ok) return;
      const data = await response.json();
      setOrders(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-gray-200 shadow-sm bg-white p-4">
      <table className="min-w-full text-left border-collapse text-sm">
        <thead className="bg-gray-100 text-gray-800 uppercase font-semibold">
          <tr>
            <th className="px-3 py-2">Order Number</th>
            <th className="px-3 py-2">Customer Id</th>
            <th className="px-3 py-2">Status</th>
            <th className="px-3 py-2">Product</th>
            <th className="px-3 py-2">Unit Price</th>
            <th className="px-3 py-2">Qty</th>
            <th className="px-3 py-2">Item Total</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200 text-gray-800">
          {orders.map((order) => (
            <React.Fragment key={order.orderNumber}>
              {/* Order Header */}
              <tr className="bg-gray-50 font-medium">
                <td className="px-3 py-2">{order.orderNumber}</td>
                <td className="px-3 py-2">{order.customerId}</td>
                <td className="px-3 py-2">{order.statusName}</td>
                <td className="px-3 py-2" colSpan={4}>
                  {order.items.length} item(s)
                </td>
              </tr>

              {/* Items */}
              {order.items.map((item) => (
                <tr
                  key={`${order.orderNumber}-${item.productId}`}
                  className="hover:bg-gray-50 transition"
                >
                  <td className="px-3 py-2"></td>
                  <td className="px-3 py-2"></td>
                  <td className="px-3 py-2"></td>

                  <td className="px-3 py-2 font-semibold">
                    {item.productName}
                  </td>
                  <td className="px-3 py-2">{item.unitPrice}</td>
                  <td className="px-3 py-2">{item.quantity}</td>
                  <td className="px-3 py-2">{item.totalPrice}</td>
                </tr>
              ))}

              {/* ORDER TOTAL ROW (ONLY ONCE) */}
              <tr className="bg-gray-100 font-semibold">
                <td className="px-3 py-2" colSpan={5}></td>
                <td className="px-3 py-2 text-right">Total:</td>
                <td className="px-3 py-2">{order.totalPrice}</td>
              </tr>

              <tr className="bg-gray-200 font-bold">
                <td className="px-3 py-2" colSpan={5}></td>
                <td className="px-3 py-2 text-right">Total Inc VAT:</td>
                <td className="px-3 py-2">{order.totalPriceIncVat}</td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Order;
