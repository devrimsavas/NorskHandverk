
'use client'
import React from "react";
import { useState  } from "react";

interface Product {
    id:number;
    title:string;
    description:string;
    price:number;
    productImage:string;
    priceIncVat:number;
    quantity:number;
    categoryName:string;
    brandName:string;
    dateAdded:string;
    status:boolean;
    isDeleted:boolean;

}

const CreateTable=()=> {
    //first product and set products
    const [products,setProducts]=useState<Product[]>([])
    //fetch 
    const getProduct=async()=> {
        try {
            const url="https://localhost:7140/api/Product";
            const response=await fetch(url);
            if (!response.ok) {
                console.error("fetch error");
                return;
            }
            const data=await response.json();
            console.log(data);
            //set products 
            setProducts(data);
        }catch(err) {
            console.error(err);
        }
    } //end fetch
    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className=" mx-auto">
                <button 
                    className="mb-6 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-md font-medium"
                    onClick={getProduct}
                    >
                        Get Products
                </button>
                <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm bg-white">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-100 text-gray-700 uppercase text-xs font-semibold">
                            <tr>
                                <th className="px-6 py-4">ID </th>
                                <th className="px-6 py-4">Title  </th>
                                <th className="px-6 py-4">description </th>
                                <th className="px-6 py-4">Price </th>

                                <th className="px-6 py-4">productImage </th>
                                <th className="px-6 py-4">priceIncVat </th>
                                <th className="px-6 py-4">quantity </th>
                                <th className="px-6 py-4">Category Name </th>
                                <th className="px-6 py-4">Brand Name </th>
                                <th className="px-6 py-4">Date Added </th>
                                <th className="px-6 py-4">Status  </th>
                                <th className="px-6 py-4">Is Deleted </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200" >
                            {products.map((product)=> (
                                <tr key={product.id} className="hover:bg-gray-900">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">#{product.id}</td>
                                    <td className="px-6 py-4 text-sm text-gray-700 font-semibold">{product.title}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{product.description}</td>
                                    <td className="px-6 py-4 text-sm text-right text-emerald-600 font-bold">${product.price}</td>
                                    
                                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{product.productImage}</td>
                                    <td className="px-6 py-4 text-sm text-right text-emerald-600 font-bold">${product.priceIncVat}</td>
                                    <td className="px-6 py-4 text-sm text-right text-emerald-600 font-bold">${product.quantity}</td>
                                    <td className="px-6 py-4 text-sm text-right text-emerald-600 font-bold">${product.categoryName}</td>
                                    <td className="px-6 py-4 text-sm text-right text-emerald-600 font-bold">${product.brandName}</td>

                                    <td className="px-6 py-4 text-sm text-right text-emerald-600 font-bold">${product.dateAdded}</td>
                                    <td className="px-6 py-4 text-sm text-right text-emerald-600 font-bold">${product.status}</td>
                                    <td className="px-6 py-4 text-sm text-right text-emerald-600 font-bold">${product.isDeleted===true ? "yes"  : "no"}</td>



                                </tr>
                            ))
                            
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

    )

}


export default CreateTable;