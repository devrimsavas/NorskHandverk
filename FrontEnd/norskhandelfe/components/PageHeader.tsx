import React from "react";
import Link from "next/link";
import MainNav from "./MainNav";

const PageHeader=()=> {
    return(
        <header className="fixed top-0 w-full bg-gray-900 text-primary-light shadow-md px-0 overflow-hidden">
            <div className="relative z-10 flex justify-between items-center p-2">
                
                <MainNav/>
                
            </div>
        </header>
    )
}

export default PageHeader;