'use client'
import React, {useState,useEffect} from 'react';
import { API_GET_ALL_CARTS } from '@/lib/constants';
interface Item {
    productId:number;
    productName:string;
    unitPrice:number;
    vatRate:number;
    quantity:number;
    totalPrice:number;
    totalPriceIncVat:number
}
interface Cart {
    cartNumber:string;
    customerId:number;
    statusName:string;
    items:Item[]
}

//main component 
const Cart=()=> {
    //set
    const [carts,setCarts]=useState<Cart[]>([])

    //fetch
    const getCarts=async()=> {
        try {
            const response=await fetch(API_GET_ALL_CARTS, {cache: "no-cache"})
            if (!response.ok) {return}
            const data=await response.json();
            //set 
            setCarts(data);       

        }catch(err) {
            console.error(err);
        }
    }
    useEffect(()=> {
        getCarts()
    },[])   
    return (
    <div className="w-full">

        <div className="w-full overflow-x-auto rounded-xl border border-gray-200 shadow bg-gray-30">
            <h1 className="text-black">CARTS</h1>

            <table className="min-w-full text-left border-collapse text-xs">

                <thead className="bg-gray-100 text-black uppercase font-semibold">
                    <tr>
                        <th className="px-2 py-2">Cart Number</th>
                        <th className="px-2 py-2">Customer ID</th>
                        <th className="px-2 py-2">Status</th>
                        <th className="px-2 py-2">Product</th>
                        <th className="px-2 py-2">Unit Price</th>
                        <th className="px-2 py-2">VAT</th>
                        <th className="px-2 py-2">Qty</th>
                        <th className="px-2 py-2">Total</th>
                        <th className="px-2 py-2">Total Inc VAT</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-black">
  {carts.map((cart) => (
    <React.Fragment key={cart.cartNumber}>

      <tr className="bg-gray-50">
        <td className="px-2 py-2 font-medium">{cart.cartNumber}</td>
        <td className="px-2 py-2">{cart.customerId}</td>
        <td className="px-2 py-2">{cart.statusName}</td>
        <td className="px-2 py-2" colSpan={6}>
          {cart.items.length} item(s)
        </td>
      </tr>

      {cart.items.length > 0 ? (
        cart.items.map((item) => (
          <tr
            key={`${cart.cartNumber}-${item.productId}`}
            className="bg-amber-100  hover:bg-gray-100 transition"
          >
            <td className="px-2 py-2"></td>
            <td className="px-2 py-2"></td>
            <td className="px-2 py-2"></td>

            <td className="px-2 py-2 font-semibold">{item.productName}</td>
            <td className="px-2 py-2">{item.unitPrice}</td>
            <td className="px-2 py-2">{item.vatRate}</td>
            <td className="px-2 py-2">{item.quantity}</td>
            <td className="px-2 py-2">{item.totalPrice}</td>
            <td className="px-2 py-2">{item.totalPriceIncVat}</td>
          </tr>
        ))
      ) : (
        <tr className="hover:bg-gray-100 transition">
          <td className="px-2 py-2"></td>
          <td className="px-2 py-2"></td>
          <td className="px-2 py-2"></td>
          <td className="px-2 py-2 italic text-gray-500" colSpan={6}>
            No items
          </td>
        </tr>
      )}

    </React.Fragment>
  ))}
</tbody>


                

            </table>

        </div>

    </div>
)




}

export default Cart;