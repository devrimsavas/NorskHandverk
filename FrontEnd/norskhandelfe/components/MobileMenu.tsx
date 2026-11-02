"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, isReady, logout } = useAuth();
  const isAdmin = user?.role === "Admin";

  // Close the menu after moving to another page
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    router.push("/");
  };

  const linkClass = "block rounded-md px-3 py-2 text-base text-stone-200 hover:bg-white/10 hover:text-white";

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen((open) => !open)}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
        className="w-9 h-9 flex items-center justify-center rounded-md text-stone-300 hover:text-white hover:bg-white/10 transition"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
          {isOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
        </svg>
      </button>

      {isOpen && (
        <nav className="absolute inset-x-0 top-16 border-b border-white/10 bg-stone-950/95 backdrop-blur px-4 py-4 space-y-1">
          <Link href="/products" className={linkClass}>Shop</Link>
          {isAdmin && <Link href="/admin" className={linkClass}>Admin</Link>}
          <Link href="/aboutus" className={linkClass}>About App</Link>

          {isReady && (
            <div className="mt-3 pt-3 border-t border-white/10 space-y-1">
              {user ? (
                <>
                  <Link href="/account/orders" className={linkClass}>My account</Link>
                  <Link href="/account/cart" className={linkClass}>Cart</Link>
                  <button onClick={handleLogout} className={`${linkClass} w-full text-left`}>
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className={linkClass}>Log in</Link>
                  <Link href="/register" className={linkClass}>Sign up</Link>
                </>
              )}
            </div>
          )}
        </nav>
      )}
    </div>
  );
};

export default MobileMenu;