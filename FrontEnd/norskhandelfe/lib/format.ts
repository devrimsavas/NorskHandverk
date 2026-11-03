//import { BACKEND_URL } from "./constants";

const nokFormatter = new Intl.NumberFormat("nb-NO", {
  style: "currency",
  currency: "NOK",
});

// 1062.5 -> "kr 1 062,50"
export function formatPrice(value: number): string {
  return nokFormatter.format(value);
}

// Product images are served by the backend from wwwroot/images/products
/*
export function productImageUrl(fileName: string): string | null {
  return fileName ? `${BACKEND_URL}/images/products/${fileName}` : null;
}
  */
