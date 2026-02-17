'use client'
import React, { useState, useEffect } from "react";
import { API_GET_ALL_CUSTOMERS } from "@/lib/constants";

interface Customer {
  id: number;
  name: string;
  email: string;
  role: string;
  address: string;
  telephoneNumber: string;
  memberShipStatus: string;
  isDeleted: boolean;
}

const Customers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);

  const getCustomers = async () => {
    try {
      const response = await fetch(API_GET_ALL_CUSTOMERS, { cache: "no-store" });
      if (!response.ok) return;
      const data = await response.json();
      setCustomers(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getCustomers();
  }, []);

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-gray-200 shadow-sm bg-white p-4">

      <table className="min-w-full text-left border-collapse text-sm">

        <thead className="bg-gray-100 text-gray-800 uppercase font-semibold">
          <tr>
            <th className="px-3 py-2">ID</th>
            <th className="px-3 py-2">Name</th>
            <th className="px-3 py-2">Email</th>
            <th className="px-3 py-2">Role</th>
            <th className="px-3 py-2">Address</th>
            <th className="px-3 py-2">Phone</th>
            <th className="px-3 py-2">Membership</th>
            <th className="px-3 py-2">Deleted</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200 text-gray-800">
          {customers.map((customer) => (
            <tr key={customer.id} className="hover:bg-gray-50 transition">

              <td className="px-3 py-2 font-medium">#{customer.id}</td>
              <td className="px-3 py-2 font-semibold">{customer.name}</td>
              <td className="px-3 py-2">{customer.email}</td>
              <td className="px-3 py-2">{customer.role}</td>
              <td className="px-3 py-2">{customer.address}</td>
              <td className="px-3 py-2">{customer.telephoneNumber}</td>
              <td className="px-3 py-2">{customer.memberShipStatus}</td>
              <td className="px-3 py-2">{customer.isDeleted ? "yes" : "no"}</td>

            </tr>
          ))}
        </tbody>

      </table>

    </div>
  );
};

export default Customers;
