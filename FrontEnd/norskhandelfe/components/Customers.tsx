'use client'
import React, {useState,useEffect} from "react";
import { API_GET_ALL_CUSTOMERS } from "@/lib/constants";
interface Customer {
    id:number;
    name:string,
    email:string,
    role:string,
    address:string,
    telephoneNumber:string,
    memberShipStatus:string,
    isDeleted:boolean
}

const Customers=()=> {
    const [customers,setCustomers]=useState<Customer[]>([])
    const getCustomers=async()=> {
        try {
            const url=API_GET_ALL_CUSTOMERS;
            const response=await fetch(url,{cache:"no-store"});
            if (!response.ok) return;
            const data=await response.json();
            //we set here
            setCustomers(data)
        }catch(err) {
            console.error(err)
        }
    }
    //use effect 
    useEffect(()=> {
        getCustomers();
    },[])

    return (
    <div className="w-full bg-gray-50 p-8">
        <div className="w-full">

            <div className="w-full overflow-x-auto rounded-xl border border-gray-200 shadow bg-blue-200">
                <h1 className="text-black">CUSTOMERS</h1>

                <table className="min-w-full text-left border-collapse text-xs">

                    <thead className="bg-gray-100 text-black uppercase font-semibold">
                        <tr>
                            <th className="px-2 py-2">ID</th>
                            <th className="px-2 py-2">Name</th>
                            <th className="px-2 py-2">Email</th>
                            <th className="px-2 py-2">Role</th>
                            <th className="px-2 py-2">Address</th>
                            <th className="px-2 py-2">Phone</th>
                            <th className="px-2 py-2">Membership</th>
                            <th className="px-2 py-2">Deleted</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200 text-black">
                        {customers.map((customer)=>(
                            <tr key={customer.id} className="hover:bg-gray-100 transition">

                                <td className="px-2 py-2 font-medium">#{customer.id}</td>
                                <td className="px-2 py-2 font-semibold">{customer.name}</td>
                                <td className="px-2 py-2">{customer.email}</td>
                                <td className="px-2 py-2">{customer.role}</td>
                                <td className="px-2 py-2">{customer.address}</td>
                                <td className="px-2 py-2">{customer.telephoneNumber}</td>
                                <td className="px-2 py-2">{customer.memberShipStatus}</td>
                                <td className="px-2 py-2">{customer.isDeleted ? "yes" : "no"}</td>

                            </tr>
                        ))}
                    </tbody>

                </table>

            </div>
        </div>
    </div>
)


    
    
}

export default Customers;
 