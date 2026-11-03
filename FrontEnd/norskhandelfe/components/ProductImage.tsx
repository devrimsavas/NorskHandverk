import Image from "next/image";

interface ProductImageProps {
  // Full image URL from the backend, or null if the product has no image
  src: string | null;
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
  // Small thumbnails show only the icon, without the text
  compact?: boolean;
}

// Fills its parent, which must be "relative" and have a size
const ProductImage = ({
  src,
  alt,
  sizes,
  className = "",
  priority,
  compact,
}: ProductImageProps) => {
  if (!src) {
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
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={`object-cover ${className}`}
    />
  );
};

export default ProductImage;
