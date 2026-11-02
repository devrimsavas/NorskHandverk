"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const AuthNav = () => {
  const { user, isReady, logout } = useAuth();
  const router = useRouter();

  // Avoid flashing "Log in" before the stored login has been read
  if (!isReady) {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (!user) {
    return (
      <div className="flex items-center gap-3">
        <Link
          href="/login"
          className="text-sm font-medium text-stone-200 hover:text-white"
        >
          Log in
        </Link>
        <Link
          href="/register"
          className="text-sm font-medium rounded-md bg-emerald-700 px-3 py-1.5 text-white hover:bg-emerald-600"
        >
          Sign up
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href="/account/cart"
        aria-label="Cart"
        className="w-9 h-9 flex items-center justify-center rounded-md text-stone-300 hover:text-white hover:bg-white/10 transition"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        </svg>
      </Link>

      <Link
        href="/account/orders"
        title={`Logged in as ${user.name}`}
        className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium text-stone-200 hover:text-white hover:bg-white/10 transition"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
        My account
      </Link>

      <button
        onClick={handleLogout}
        className="ml-1 text-sm font-medium rounded-md border border-stone-600 px-3 py-1.5 text-stone-300 hover:text-white hover:bg-white/10 transition"
      >
        Log out
      </button>
    </div>
  );
};

export default AuthNav;
