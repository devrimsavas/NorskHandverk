'use client';
import { API_CREATE_BRAND } from "@/lib/constants";


export async function createBrand(data:{
    name:string
}) {
    const response=await fetch(API_CREATE_BRAND,{
        method:'POST',
        headers: {'Content-Type':'application/json'},
        body:JSON.stringify(data)
    });
    if (!response.ok) throw new Error("Failed to Create A New Brand");
    return await response.json();
}

