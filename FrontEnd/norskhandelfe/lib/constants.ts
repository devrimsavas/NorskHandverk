//BASE
export const BASE_API_URL = process.env.NEXT_PUBLIC_BASE_API_URL;
//products
export const API_GET_ALL_PRODUCTS = `${BASE_API_URL}/product`;
//customers
export const API_GET_ALL_CUSTOMERS = `${BASE_API_URL}/customer`;

//categories
export const API_GET_ALL_CATEGORIES = `${BASE_API_URL}/Category`;

//BRANDS
//get brands
export const API_GET_ALL_BRANDS = `${BASE_API_URL}/brand`;
//post a brand
export const API_CREATE_BRAND = `${BASE_API_URL}/brand`;

//CARTS
export const API_GET_ALL_CARTS = `${BASE_API_URL}/cart`;

//ORDERS

//get all orders
export const API_GET_ALL_ORDERS = `${BASE_API_URL}/order`;

//checkout
export const API_CHECK_OUT_ORDER = (customerId: number) =>
  `${BASE_API_URL}/order/checkout/${customerId}`;

// PATHS FOR apiFetch (the base url is added by apiFetch)
export const PATHS = {
  login: "/Auth/login",
  register: "/Customer",
  products: "/Product",
  product: (id: number | string) => `/Product/${id}`,
  cart: "/Cart",
  myProfile: "/Customer/me",
  myCart: "/Cart/me",
  updateCart: "/Cart/updatecart",
  clearCart: "/Cart/clearcart",
  checkout: "/Order/checkout",
};
