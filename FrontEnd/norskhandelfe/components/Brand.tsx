'use client'
import React,{useEffect,useState} from 'react';
import { API_GET_ALL_BRANDS } from '@/lib/constants';

interface Brand {
    id:number;
    name:string;

}

const Brand=()=> {
    //set 
    const [brands,setBrands]=useState<Brand[]>([]);
    //fetch and set
    const getBrands=async()=> {
        try {
            const url=API_GET_ALL_BRANDS;
        const response=await fetch(url, {cache:"no-cache"});
        if (!response.ok) return;
        const data=await response.json();
        //set
       setBrands(data);

        }catch(err) {
            console.error(err);
        }
        
    }
    //use efect
    useEffect(()=> {
        getBrands()
    },[])

    return (
    <div className="w-full">

        <div className="w-full overflow-x-auto rounded-xl border border-gray-200 shadow bg-white">
            <h1 className="text-black">BRANDS</h1>

            <table className="min-w-full text-left border-collapse text-xs">

                <thead className="bg-gray-100 text-black uppercase font-semibold">
                    <tr>
                        <th className="px-2 py-2">ID</th>
                        <th className="px-2 py-2">Name</th>
                    </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 text-black">
                    {brands.map((brand)=>(
                        <tr key={brand.id} className="hover:bg-gray-100 transition">

                            <td className="px-2 py-2 font-medium">#{brand.id}</td>
                            <td className="px-2 py-2 font-semibold">{brand.name}</td>

                        </tr>
                    ))}
                </tbody>

            </table>

        </div>

    </div>
)




}

export default Brand;



