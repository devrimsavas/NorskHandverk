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
    <div className="flex items-center gap-3">
      <span className="text-sm text-stone-300">Hi, {user.name}</span>
      <button
        onClick={handleLogout}
        className="text-sm font-medium rounded-md border border-stone-500 px-3 py-1.5 text-stone-200 hover:bg-stone-800"
      >
        Log out
      </button>
    </div>
  );
};

export default AuthNav;
