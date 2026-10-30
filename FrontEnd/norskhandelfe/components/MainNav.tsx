"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const MainNav = () => {
  const pathname = usePathname();
  const { user } = useAuth();
  const isAdmin = user?.role === "Admin";

  const navLink = (href: string, label: string) => {
    // Shop stays active on product detail pages too
    const isActive = pathname === href || pathname.startsWith(`${href}/`);

    return (
      <Link
        href={href}
        className={`text-sm font-medium transition ${
          isActive ? "text-white" : "text-stone-400 hover:text-white"
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <nav className="flex items-center gap-6">
      {navLink("/products", "Shop")}

      {/* Old admin pages: visible to admins only until they move under /admin */}
      {isAdmin && (
        <>
          {navLink("/customerpage", "Customers")}
          {navLink("/brandspage", "Brands")}
          {navLink("/categorypage", "Categories")}
          {navLink("/cartpage", "Carts")}
          {navLink("/orderspage", "Orders")}
        </>
      )}

      {navLink("/aboutus", "About App")}
    </nav>
  );
};

export default MainNav;
