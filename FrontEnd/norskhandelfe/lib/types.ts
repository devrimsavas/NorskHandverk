// Matches ProductReadDTO in the backend
export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discount: number;
  productImage: string;
  priceIncVat: number;
  quantity: number;
  categoryId: number;
  categoryName: string;
  brandId: number;
  brandName: string;
  dateAdded: string;
  status: "Available" | "Out_Of_Stock";
  isDeleted: boolean;
}

// Matches ReadCustomerDTO in the backend
export interface Customer {
  id: number;
  name: string;
  surname: string;
  email: string;
  role: string;
  address: string;
  telephoneNumber: string;
  memberShipStatus: string;
  isDeleted: boolean;
}

// Matches ReadCartItemDTO and ReadCartDTO in the backend
export interface CartItem {
  productId: number;
  productName: string;
  productImage: string;
  unitPrice: number;
  vatRate: number;
  quantity: number;
  totalPrice: number;
  totalPriceIncVat: number;
}

export interface Cart {
  id: number;
  cartNumber: string;
  customerId: number;
  statusName: string;
  items: CartItem[];
}

// Matches ReadOrderItemDTO and ReadOrderDTO in the backend
export interface OrderItem {
  productId: number;
  productName: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

export interface Order {
  id: number;
  orderNumber: string;
  statusName: string;
  customerId: number;
  customerName: string;
  customerEmail: string;
  orderDate: string;
  items: OrderItem[];
  totalPrice: number;
  totalPriceIncVat: number;
}

// Matches BrandReadDTO in the backend
export interface Brand {
  id: number;
  name: string;
}

// Matches CategoryReadDTO in the backend
export interface Category {
  id: number;
  name: string;
  description: string;
  defaultVatRate: number;
  isDeleted: boolean;
}
