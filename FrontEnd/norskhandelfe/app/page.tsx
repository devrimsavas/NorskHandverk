import Image from "next/image";
import Link from "next/link";
import FeaturedProducts from "@/components/FeaturedProducts";

const highlights = [
  {
    title: "Made by hand in Norway",
    text: "Every piece is crafted by local makers, from Setesdal wool to fjord-side ceramics.",
  },
  {
    title: "Natural materials",
    text: "Norwegian oak, pure wool and stoneware, finished to last for generations.",
  },
  {
    title: "Secure checkout",
    text: "Card payments are handled by Stripe. Cancel before shipping and get a full refund.",
  },
];

export default function Home() {
  return (
    <div className="bg-page">
      {/* Hero */}
      <section className="relative h-[70vh] min-h-105 overflow-hidden">
        <Image
          src="/images/hero.jpg"
          alt="A Nordic workshop with handmade crafts by a fjord"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-r from-stone-950/70 via-stone-950/30 to-transparent" />

        <div className="relative h-full max-w-6xl mx-auto px-4 sm:px-6 flex items-center">
          <div className="max-w-lg text-white space-y-5">
            <p className="text-sm uppercase tracking-widest text-stone-200">
              Norsk håndverk
            </p>
            <h1 className="text-4xl sm:text-5xl font-semibold leading-tight">
              Handmade crafts from Norwegian makers
            </h1>
            <p className="text-lg text-stone-200">
              Wood, wool and clay, shaped by hand and made to be used every day.
            </p>
            <Link
              href="/products"
              className="inline-block rounded-lg bg-white px-6 py-3 font-medium text-stone-900 hover:bg-stone-100 transition"
            >
              Shop the collection
            </Link>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 grid md:grid-cols-3 gap-8">
        {highlights.map((item) => (
          <div key={item.title}>
            <h2 className="text-lg font-semibold text-ink">{item.title}</h2>
            <p className="mt-2 text-muted leading-relaxed">{item.text}</p>
          </div>
        ))}
      </section>

      {/* Featured products */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
        <div className="flex items-end justify-between mb-8">
          <h2 className="text-2xl font-semibold text-ink">Featured pieces</h2>
          <Link
            href="/products"
            className="text-sm font-medium text-accent hover:underline"
          >
            View all
          </Link>
        </div>
        <FeaturedProducts />
      </section>
    </div>
  );
}
