import React from "react";
import Link from "next/link";
import MainNav from "./MainNav";
import AuthNav from "./AuthNav";

const PageHeader=()=> {
    return(
        <header className="fixed top-0 w-full bg-gray-900 text-primary-light shadow-md px-0 overflow-hidden">
            <div className="relative z-10 flex justify-between items-center p-2">
                
                <MainNav/>
                <AuthNav/>
                
            </div>
        </header>
    )
}

export default PageHeader;