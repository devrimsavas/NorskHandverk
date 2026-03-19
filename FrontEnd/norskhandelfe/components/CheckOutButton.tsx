//CheckOutButton.tsx
'use client'
import { API_CHECK_OUT_ORDER } from "@/lib/constants";
import Link from 'next/link';

interface ButtonProps {
    text:string;
    href?:string;
    onClick?:()=>void;
    color?: "primary" | "accent" | "danger" | "secondary";
    type?:"button" | "submit";
}

const CheckOutButton=({text,href,onClick,color="primary",type="button"}:ButtonProps)=> {
    const baseClass="px-4 py-2 rounded transition font-semibold";
    const colorClasses={
        primary: "bg-primary-dark text-white hover:bg-primary-light",
        accent: "bg-accent-1 text-white hover:bg-accent-2",
        danger: "bg-red-500 text-white hover:bg-red-600",
        secondary: "bg-secondary text-white hover:bg-secondary-dark",
    };

    const selectedColorClass=colorClasses[color];
    
    if (href) {
        return (
            <Link href={href} className={`${baseClass} ${selectedColorClass}`}>
                {text}
            </Link>
        );
    }
    return (
        <button
        type={type}
        onClick={onClick}
        className={`${baseClass} ${selectedColorClass}`}
        >
            {text}
        </button>
    )


}
export default CheckOutButton;