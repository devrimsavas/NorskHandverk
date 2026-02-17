'use client'
import React,{useState,useEffect} from 'react';
import { API_GET_ALL_CATEGORIES } from '@/lib/constants';
interface Category {
    id:number;
    name:string;
    description:string;
    defaultVatRate:number;
    ucpCategoryCode:string;
    isDeleted:boolean
}
//MAIN COMPONENT 
const Category=()=> {
    //set 
    const [categories,setCategories]=useState<Category[]>([])
    //fetch 
    const getCategories=async()=> {
        try {
            const url=API_GET_ALL_CATEGORIES;
            const response=await fetch(url, {cache:"no-cache"});
            if (!response.ok) return;
            const data=await response.json();
            //set 
            setCategories(data);
        }catch(err) {
            console.error(err);
        }

    }
    //effect 
    useEffect(()=> {
        getCategories()
    },[])
    return (
    <div className="w-full ">

        <div className="w- overflow-x-scroll rounded-xl border border-gray-200 shadow bg-lime-700">
            <h1 className="text-black">CATEGORIES</h1>

            <table className="min-w-full text-left border-collapse text-xs">

                <thead className="bg-gray-100 text-black uppercase font-semibold">
                    <tr>
                        <th className="px-2 py-2">ID</th>
                        <th className="px-2 py-2">Name </th>
                        <th className="px-2 py-2">Description</th>
                        <th className="px-2 py-2">Default Vat Rate</th>
                        <th className="px-2 py-2">UCP Code</th>
                        <th className="px-2 py-2">Deleted</th>
                    </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 text-black">
                    {categories.map((category)=>(
                        <tr key={category.id} className="hover:bg-gray-100 transition">
                            

                            <td className="px-2 py-2 font-medium">#{category.id}</td>
                            <td className="px-2 py-2 font-mono">{category.name}</td>
                            <td className="px-2 py-2 font-semibold">{category.description}</td>
                            <td className="px-2 py-2">{category.defaultVatRate}</td>
                            <td className="px-2 py-2">{category.ucpCategoryCode}</td>
                            <td className="px-2 py-2">
                                {category.isDeleted ? "yes" : "no"}
                            </td>

                        </tr>
                    ))}
                </tbody>

            </table>

        </div>

    </div>
)


}

export default Category;
