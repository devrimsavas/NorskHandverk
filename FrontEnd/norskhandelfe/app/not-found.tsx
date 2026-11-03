import Image from "next/image";
import Link from "next/link";

// Shown for every URL that does not match a page
export default function NotFound() {
  return (
    <section className="min-h-[70vh] bg-page py-12">
      <div className="max-w-2xl mx-auto px-6 text-center">
        <div className="relative aspect-video rounded-2xl overflow-hidden bg-surface-muted">
          <Image
            src="/images/not-found.jpg"
            alt="A lost wooden signpost in a foggy Norwegian forest"
            fill
            sizes="(min-width: 768px) 672px, 100vw"
            className="object-cover"
            priority
          />
        </div>

        <p className="mt-8 text-sm font-medium uppercase tracking-wide text-accent">
          404
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-ink">
          This page wandered off into the forest
        </h1>
        <p className="mt-4 text-muted">
          The page you are looking for does not exist or has been moved.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/products"
            className="rounded-lg bg-accent px-6 py-2.5 font-medium text-accent-contrast hover:bg-accent-strong transition"
          >
            Browse the shop
          </Link>
          <Link
            href="/"
            className="rounded-lg border border-line px-6 py-2.5 font-medium text-ink hover:bg-surface-muted transition"
          >
            Back to home
          </Link>
        </div>
      </div>
    </section>
  );
}
