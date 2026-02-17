import Image from "next/image";
import CreateTable from "@/components/Products";
import Customers from "@/components/Customers";
import Category from "@/components/Category";
import Brand from "@/components/Brand";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <main className="max-w-7xl mx-auto space-y-12 px-4">

        <h1 className="text-3xl font-bold text-center text-gray-800 tracking-wide">
          ADMIN DASHBOARD
        </h1>

        <CreateTable/>
        <Customers/>
        <Category/>
        <Brand/>

      </main>
    </div>
  );
}


