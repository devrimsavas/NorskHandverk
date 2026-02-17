'use client'
import React, { useEffect, useState } from 'react';
import { API_GET_ALL_BRANDS } from '@/lib/constants';
import { createBrand } from '@/modules/brandactions';

interface Brand {
  id: number;
  name: string;
}

const Brand = () => {

  const [brands, setBrands] = useState<Brand[]>([]);
  const [newBrandName, setNewBrandName] = useState("");
  const [loading, setLoading] = useState(false);

  const getBrands = async () => {
    try {
      const response = await fetch(API_GET_ALL_BRANDS, { cache: "no-store" });
      if (!response.ok) return;
      const data = await response.json();
      setBrands(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getBrands();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newBrandName.trim()) return;

    try {
      setLoading(true);
      await createBrand({ name: newBrandName });
      setNewBrandName("");
      await getBrands(); // listeyi yenile
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">

      {/* FORM */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="text"
            value={newBrandName}
            onChange={(e) => setNewBrandName(e.target.value)}
            placeholder="New brand name"
            className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm text-black"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-gray-900 text-white px-4 py-2 rounded text-sm hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add"}
          </button>
        </form>
      </div>

      {/* TABLE */}
      <div className="w-full overflow-x-auto rounded-xl border border-gray-200 shadow-sm bg-white p-4">

        <table className="min-w-full text-left border-collapse text-sm">

          <thead className="bg-gray-100 text-gray-800 uppercase font-semibold">
            <tr>
              <th className="px-3 py-2">ID</th>
              <th className="px-3 py-2">Name</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 text-gray-800">
            {brands.map((brand) => (
              <tr key={brand.id} className="hover:bg-gray-50 transition">
                <td className="px-3 py-2 font-medium">#{brand.id}</td>
                <td className="px-3 py-2 font-semibold">{brand.name}</td>
              </tr>
            ))}
          </tbody>

        </table>

      </div>

    </div>
  );
};

export default Brand;
