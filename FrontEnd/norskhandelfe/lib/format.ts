const nokFormatter = new Intl.NumberFormat("nb-NO", {
  style: "currency",
  currency: "NOK",
});

// 1062.5 -> "kr 1 062,50"
export function formatPrice(value: number): string {
  return nokFormatter.format(value);
}

// Product images live in public/images/products
export function productImageUrl(fileName: string): string | null {
  return fileName ? `/images/products/${fileName}` : null;
}
