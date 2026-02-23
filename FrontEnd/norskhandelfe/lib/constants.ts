//BASE
const BASE_API_URL=process.env.NEXT_PUBLIC_BASE_API_URL 
//products
export const API_GET_ALL_PRODUCTS=`${BASE_API_URL}/product`;
//customers
export const API_GET_ALL_CUSTOMERS=`${BASE_API_URL}/customer`;

//categories 
export const API_GET_ALL_CATEGORIES=`${BASE_API_URL}/Category`;

//BRANDS
//get brands
export const API_GET_ALL_BRANDS=`${BASE_API_URL}/brand`;
//post a brand
export const API_CREATE_BRAND=`${BASE_API_URL}/brand`;



//Carts
export const API_GET_ALL_CARTS=`${BASE_API_URL}/cart`




//Orders

export const API_GET_ALL_ORDERS=`${BASE_API_URL}/order`
