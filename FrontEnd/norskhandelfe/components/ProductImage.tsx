import Image from "next/image";
import { productImageUrl } from "@/lib/format";

interface ProductImageProps {
  fileName: string;
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
  // Small thumbnails show only the icon, without the text
  compact?: boolean;
}

// Fills its parent, which must be "relative" and have a size
const ProductImage = ({
  fileName,
  alt,
  sizes,
  className = "",
  priority,
  compact,
}: ProductImageProps) => {
  const imageUrl = productImageUrl(fileName);

  if (!imageUrl) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-surface-muted text-muted">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className={compact ? "w-5 h-5" : "w-8 h-8"}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="9" cy="9" r="2" />
          <path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21" />
        </svg>
        {!compact && <span className="text-sm">Image coming soon</span>}
      </div>
    );
  }

  return (
    <Image
      src={imageUrl}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={`object-cover ${className}`}
    />
  );
};

export default ProductImage;
