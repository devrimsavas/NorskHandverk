import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/types";
import { formatPrice, productImageUrl } from "@/lib/format";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const imageUrl = productImageUrl(product.productImage);
  const isSoldOut = product.status === "Out_Of_Stock" || product.quantity === 0;

  return (
    <Link
      href={`/products/${product.id}`}
      className="group block rounded-2xl bg-surface border border-line overflow-hidden hover:shadow-md transition"
    >
      <div className="relative aspect-square bg-surface-muted">
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={product.title}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover group-hover:scale-105 transition duration-300"
          />
        )}
        {isSoldOut && (
          <span className="absolute top-3 left-3 rounded-full bg-stone-900/80 px-3 py-1 text-xs font-medium text-white">
            Sold out
          </span>
        )}
      </div>

      <div className="p-4 space-y-1">
        <p className="text-xs uppercase tracking-wide text-muted">
          {product.categoryName}
        </p>
        <h3 className="font-medium text-ink first-letter:uppercase">
          {product.title}
        </h3>
        <p className="text-ink">{formatPrice(product.priceIncVat)}</p>
      </div>
    </Link>
  );
};

export default ProductCard;
