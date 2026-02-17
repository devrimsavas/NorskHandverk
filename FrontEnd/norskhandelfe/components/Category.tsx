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

const Category = () => {

  const [categories,setCategories] = useState<Category[]>([]);

  const getCategories = async () => {
    try {
      const response = await fetch(API_GET_ALL_CATEGORIES,{ cache:"no-store" });
      if (!response.ok) return;
      const data = await response.json();
      setCategories(data);
    } catch(err) {
      console.error(err);
    }
  }

  useEffect(()=>{
    getCategories();
  },[])

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-gray-200 shadow-sm bg-white p-4">

      <table className="min-w-full text-left border-collapse text-sm">

        <thead className="bg-gray-100 text-gray-800 uppercase font-semibold">
          <tr>
            <th className="px-3 py-2">ID</th>
            <th className="px-3 py-2">Name</th>
            <th className="px-3 py-2">Description</th>
            <th className="px-3 py-2">Default Vat Rate</th>
            <th className="px-3 py-2">UCP Code</th>
            <th className="px-3 py-2">Deleted</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200 text-gray-800">
          {categories.map((category)=>(
            <tr key={category.id} className="hover:bg-gray-50 transition">

              <td className="px-3 py-2 font-medium">#{category.id}</td>
              <td className="px-3 py-2 font-semibold">{category.name}</td>
              <td className="px-3 py-2">{category.description}</td>
              <td className="px-3 py-2">{category.defaultVatRate}</td>
              <td className="px-3 py-2">{category.ucpCategoryCode}</td>
              <td className="px-3 py-2">
                {category.isDeleted ? "yes" : "no"}
              </td>

            </tr>
          ))}
        </tbody>

      </table>

    </div>
  )
}

export default Category;
