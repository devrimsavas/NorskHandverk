'use client'
import React, { useState, useEffect } from "react";
import { API_GET_ALL_PRODUCTS } from "@/lib/constants";

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

const Products = () => {

    const [products,setProducts]=useState<Product[]>([])

    const getProduct=async()=> {
        try {
            //const url="https://localhost:7140/api/Product";
            const url=API_GET_ALL_PRODUCTS;
            const response=await fetch(url,{ cache:"no-store" });
            if (!response.ok) return;
            const data=await response.json();
            setProducts(data);
        }catch(err){
            console.error(err);
        }
    }

    useEffect(()=>{
        getProduct();
        
    },[])

    return (
  <div className="w-full overflow-x-auto rounded-xl border border-gray-200 shadow-sm bg-white p-4">

    <table className="min-w-full text-left border-collapse text-sm">

      <thead className="bg-gray-100 text-gray-800 uppercase font-semibold">
        <tr>
          <th className="px-3 py-2">ID</th>
          <th className="px-3 py-2">Title</th>
          <th className="px-3 py-2">Description</th>
          <th className="px-3 py-2">Price</th>
          <th className="px-3 py-2">Image</th>
          <th className="px-3 py-2">Price Inc Vat</th>
          <th className="px-3 py-2">Quantity</th>
          <th className="px-3 py-2">Category</th>
          <th className="px-3 py-2">Brand</th>
          <th className="px-3 py-2">Date</th>
          <th className="px-3 py-2">Status</th>
          <th className="px-3 py-2">Deleted</th>
        </tr>
      </thead>

      <tbody className="divide-y divide-gray-200 text-gray-800">
        {products.map((product)=>(
          <tr key={product.id} className="hover:bg-gray-50 transition">

            <td className="px-3 py-2 font-medium">#{product.id}</td>
            <td className="px-3 py-2 font-semibold">{product.title}</td>
            <td className="px-3 py-2 max-w-xs truncate">{product.description}</td>
            <td className="px-3 py-2 font-semibold text-emerald-600">
              ${product.price}
            </td>
            <td className="px-3 py-2 truncate">{product.productImage}</td>
            <td className="px-3 py-2">{product.priceIncVat}</td>
            <td className="px-3 py-2">{product.quantity}</td>
            <td className="px-3 py-2">{product.categoryName}</td>
            <td className="px-3 py-2">{product.brandName}</td>
            <td className="px-3 py-2">{product.dateAdded}</td>
            <td className="px-3 py-2">{product.status ? "true" : "false"}</td>
            <td className="px-3 py-2">{product.isDeleted ? "yes" : "no"}</td>

          </tr>
        ))}
      </tbody>

    </table>
  </div>
);

}

export default Products;
