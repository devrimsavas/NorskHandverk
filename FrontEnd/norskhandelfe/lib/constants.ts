export const BASE_API_URL = process.env.NEXT_PUBLIC_BASE_API_URL;

// Backend root (without /api), where uploaded files are served
export const BACKEND_URL = (BASE_API_URL ?? "").replace(/\/api\/?$/, "");

// API paths for apiFetch (the base url is added by apiFetch)
export const PATHS = {
  // Auth and profile
  login: "/Auth/login",
  register: "/Customer",
  myProfile: "/Customer/me",

  // Catalog
  products: "/Product",
  product: (id: number | string) => `/Product/${id}`,
  productImage: (id: number) => `/Product/${id}/image`,
  brands: "/Brand",
  brand: (id: number) => `/Brand/${id}`,
  categories: "/Category",
  category: (id: number) => `/Category/${id}`,

  // Cart
  cart: "/Cart",
  carts: "/Cart",
  myCart: "/Cart/me",
  updateCart: "/Cart/updatecart",
  clearCart: "/Cart/clearcart",

  // Orders
  checkout: "/Order/checkout",
  orders: "/Order",
  myOrders: "/Order/me",
  cancelOrder: (id: number) => `/Order/cancel/${id}`,
  orderStatus: (id: number) => `/Order/${id}/status`,

  // Customers (admin)
  customers: "/Customer",
  customer: (id: number) => `/Customer/${id}`,
};
