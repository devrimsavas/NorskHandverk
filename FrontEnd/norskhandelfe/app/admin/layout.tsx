"use client";

import { useEffect, ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const tabs = [
  { href: "/admin/products", label: "Products" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/customers", label: "Customers" },
  { href: "/admin/brands", label: "Brands" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/carts", label: "Carts" },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, isReady } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isAdmin = user?.role === "Admin";

  // Visitors go to the login page, customers go back to the shop
  useEffect(() => {
    if (!isReady) return;
    if (!user) {
      router.replace("/login");
    } else if (!isAdmin) {
      router.replace("/");
    }
  }, [isReady, user, isAdmin, router]);

  if (!isReady || !isAdmin) {
    return null;
  }

  return (
    <section className="min-h-screen bg-page py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <h1 className="text-3xl font-semibold text-ink">Admin</h1>

        <nav className="mt-6 mb-8 flex flex-wrap gap-2 border-b border-line">
          {tabs.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className={`px-4 py-2 -mb-px border-b-2 text-sm font-medium transition ${
                pathname.startsWith(tab.href)
                  ? "border-accent text-accent"
                  : "border-transparent text-muted hover:text-ink"
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </nav>

        {children}
      </div>
    </section>
  );
}
