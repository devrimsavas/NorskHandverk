import Image from "next/image";
import Link from "next/link";

const stack = [
  {
    area: "Backend",
    items: "ASP.NET Core 9 Web API, Entity Framework Core, AutoMapper",
  },
  { area: "Database", items: "PostgreSQL" },
  {
    area: "Frontend",
    items: "Next.js 16, React 19, TypeScript, Tailwind CSS 4",
  },
  { area: "Payments", items: "Stripe Payment Intents, webhooks, refunds" },
  { area: "Auth", items: "JWT bearer tokens with customer and admin roles" },
];

const features = [
  {
    title: "Secure payment flow",
    text: "Order totals are calculated on the server. Stripe webhooks are verified with their signature before an order is marked as paid.",
  },
  {
    title: "Safe checkout retries",
    text: "Refreshing or retrying checkout reuses the existing payment intent instead of creating duplicate orders or charges.",
  },
  {
    title: "Cancellations and refunds",
    text: "Unpaid orders cancel their payment intent, paid orders are refunded through Stripe, and reserved stock is returned.",
  },
  {
    title: "Role-based access",
    text: "Customers only reach their own profile, cart and orders. The customer id always comes from the token, never from the request.",
  },
  {
    title: "Order history that stays correct",
    text: "Product name, price and VAT are copied into each order line, so later price changes do not rewrite past orders.",
  },
  {
    title: "Light and dark theme",
    text: "Colors are defined as design tokens, so the whole interface switches theme from one place.",
  },
];

const AboutPage = () => {
  return (
    <section className="bg-page py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-14">
        <div className="relative aspect-21/9 rounded-2xl overflow-hidden bg-surface-muted">
          <Image
            src="/images/about.png"
            alt="A collection of Norwegian handcrafts on an oak shelf"
            fill
            priority
            sizes="(min-width: 896px) 896px, 100vw"
            className="object-cover"
          />
        </div>

        <header className="space-y-4">
          <p className="text-sm uppercase tracking-widest text-muted">
            About this app
          </p>
          <h1 className="text-4xl font-semibold text-ink">NorskHandverk</h1>
          <p className="text-lg text-muted leading-relaxed">
            A full-stack demo web shop for handmade Norwegian crafts. It covers
            the whole path of an order: browsing, cart, Stripe payment, order
            history and cancellation with refund.
          </p>
        </header>

        <div className="rounded-2xl border border-line bg-surface p-6 space-y-2">
          <h2 className="font-semibold text-ink">Try the payment flow</h2>
          <p className="text-sm text-muted leading-relaxed">
            Payments run in Stripe test mode, so no real money is charged and no
            orders are shipped. Create an account, add something to your cart
            and pay with the test card{" "}
            <span className="font-mono text-ink">4242 4242 4242 4242</span>, any
            future expiry date and any CVC.
          </p>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-ink">Highlights</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="space-y-1">
                <h3 className="font-medium text-ink">{feature.title}</h3>
                <p className="text-sm text-muted leading-relaxed">
                  {feature.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-ink">Tech stack</h2>
          <dl className="divide-y divide-line rounded-2xl border border-line bg-surface">
            {stack.map((row) => (
              <div
                key={row.area}
                className="grid sm:grid-cols-4 gap-1 sm:gap-4 px-6 py-4"
              >
                <dt className="text-sm font-medium text-ink">{row.area}</dt>
                <dd className="sm:col-span-3 text-sm text-muted">
                  {row.items}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="flex flex-wrap gap-4">
          <Link
            href="/products"
            className="rounded-lg bg-accent px-6 py-3 font-medium text-accent-contrast hover:bg-accent-strong transition"
          >
            Visit the shop
          </Link>
          <a
            href="https://github.com/devrimsavas/NorskHandverk"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-line px-6 py-3 font-medium text-ink hover:bg-surface-muted transition"
          >
            Source code on GitHub
          </a>
        </div>
      </div>
    </section>
  );
};

export default AboutPage;
