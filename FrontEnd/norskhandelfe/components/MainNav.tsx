'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";

const MainNav=()=>{
    const pathname=usePathname()
    const navLink=(href:string,label:string)=> (
        <Link
            href={href}
            className={`transition font-medium text-base md:text-lg px-3 py-1 rounded-md ${
                pathname===href 
                ? "bg-amber-500 text-amber-950"
                :"text-blue hover:bg-white hover:text-amber-950"
            }`
            }
            >{label}</Link>
        );
        return (
            <nav className={`flex gap-4 md:gap-6 `}>
                {navLink("/","Home")}
                {navLink("/products","Shop")}
                {navLink("/customerpage","Customers")}
                {navLink("/brandspage","Brands")}
                {navLink("/categorypage","Categories")}
                {navLink("/cartpage","Carts")}
                {navLink("/orderspage","Orders")}
                {navLink("aboutus","About App")}
                


            </nav>
        )
}

export default MainNav;