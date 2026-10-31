"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";
import { apiFetch } from "@/lib/api";
import { PATHS } from "@/lib/constants";
import { Product } from "@/lib/types";

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      const response = await apiFetch(PATHS.product(id));
      if (response.ok) {
        setProduct(await response.json());
      } else {
        setNotFound(true);
      }
    };

    loadProduct();
  }, [id]);

  if (notFound)
    return <p className="text-muted">This product could not be found.</p>;
  if (!product) return <p className="text-muted">Loading...</p>;

  return <ProductForm product={product} />;
}
