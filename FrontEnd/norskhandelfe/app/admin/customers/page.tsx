"use client";

import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/lib/api";
import { PATHS } from "@/lib/constants";
import { Customer } from "@/lib/types";

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState<{
    text: string;
    isError: boolean;
  } | null>(null);

  const loadCustomers = async () => {
    const response = await apiFetch(PATHS.customers);
    if (response.ok) {
      setCustomers(await response.json());
    } else {
      setMessage({ text: "Could not load customers.", isError: true });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const visibleCustomers = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return customers;
    return customers.filter(
      (c) =>
        `${c.name} ${c.surname}`.toLowerCase().includes(term) ||
        c.email.toLowerCase().includes(term),
    );
  }, [customers, search]);

  const deleteCustomer = async (customer: Customer) => {
    if (
      !window.confirm(
        `Delete the account of ${customer.name} ${customer.surname}?`,
      )
    )
      return;

    setMessage(null);
    const response = await apiFetch(PATHS.customer(customer.id), {
      method: "DELETE",
    });
    const data = await response.json().catch(() => null);

    setMessage(
      response.ok
        ? {
            text: `${customer.name} ${customer.surname} was deleted.`,
            isError: false,
          }
        : {
            text: data?.message ?? "Could not delete the customer.",
            isError: true,
          },
    );

    await loadCustomers();
  };

  if (isLoading) {
    return <p className="text-muted">Loading customers...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email"
          aria-label="Search customers"
          className="w-full sm:max-w-sm rounded-lg border border-line bg-surface px-4 py-2.5 text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent"
        />
        <p className="text-muted">{visibleCustomers.length} accounts</p>
      </div>

      {message && (
        <p
          className={`text-sm ${message.isError ? "text-danger" : "text-accent"}`}
        >
          {message.text}
        </p>
      )}

      <div className="overflow-x-auto rounded-2xl border border-line bg-surface">
        <table className="min-w-full text-sm">
          <thead className="bg-surface-muted text-left text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Phone</th>
              <th className="px-4 py-3 font-medium">Membership</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line text-ink">
            {visibleCustomers.map((customer) => {
              const isAdmin = customer.role === "Admin";

              return (
                <tr
                  key={customer.id}
                  className={customer.isDeleted ? "opacity-50" : ""}
                >
                  <td className="px-4 py-3 font-medium capitalize">
                    {customer.name} {customer.surname}
                  </td>
                  <td className="px-4 py-3 text-muted">{customer.email}</td>
                  <td className="px-4 py-3 text-muted">
                    {customer.telephoneNumber}
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {customer.memberShipStatus}
                  </td>
                  <td className="px-4 py-3">
                    {customer.isDeleted ? (
                      <span className="text-muted">Deleted</span>
                    ) : isAdmin ? (
                      <span className="rounded-full bg-accent px-2.5 py-0.5 text-xs font-medium text-accent-contrast">
                        Admin
                      </span>
                    ) : (
                      <span className="text-muted">Active</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {!customer.isDeleted && !isAdmin && (
                      <button
                        onClick={() => deleteCustomer(customer)}
                        className="text-muted hover:text-danger"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
