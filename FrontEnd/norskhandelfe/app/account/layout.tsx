"use client";

import { useEffect, ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const tabs = [
  { href: "/account", label: "Profile" },
  { href: "/account/cart", label: "Cart" },
  { href: "/account/orders", label: "Orders" },
];

export default function AccountLayout({ children }: { children: ReactNode }) {
  const { user, isReady } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Only logged-in users can see account pages
  useEffect(() => {
    if (isReady && !user) {
      router.replace("/login");
    }
  }, [isReady, user, router]);

  if (!isReady || !user) {
    return null;
  }

  return (
    <section className="min-h-screen bg-page py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <h1 className="text-3xl font-semibold text-ink">My account</h1>

        <nav className="mt-6 mb-8 flex gap-2 border-b border-line">
          {tabs.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className={`px-4 py-2 -mb-px border-b-2 text-sm font-medium transition ${
                pathname === tab.href
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
