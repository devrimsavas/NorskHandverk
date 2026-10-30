// Matches ProductReadDTO in the backend
export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  productImage: string;
  priceIncVat: number;
  quantity: number;
  categoryName: string;
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
  productImage:string;
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
