import Link from "next/link";

const PageFooter = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-stone-950 text-stone-400">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 grid gap-8 sm:grid-cols-3">
        <div className="space-y-2">
          <p className="text-lg font-semibold text-white">NorskHandverk</p>
          <p className="text-sm leading-relaxed">
            Handmade crafts from Norwegian makers. Wood, wool and clay.
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-semibold text-stone-200">Shop</p>
          <ul className="space-y-1 text-sm">
            <li>
              <Link href="/products" className="hover:text-white">
                All products
              </Link>
            </li>
            <li>
              <Link href="/account/cart" className="hover:text-white">
                My cart
              </Link>
            </li>
            <li>
              <Link href="/account/orders" className="hover:text-white">
                My orders
              </Link>
            </li>
          </ul>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-semibold text-stone-200">About</p>
          <ul className="space-y-1 text-sm">
            <li>
              <Link href="/aboutus" className="hover:text-white">
                About this app
              </Link>
            </li>
            <li>
              <a
                href="https://github.com/devrimsavas/NorskHandverk"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                Source code on GitHub
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <p className="max-w-6xl mx-auto px-4 sm:px-6 py-4 text-xs text-stone-500">
          © {year} NorskHandverk · Devrim Savas Yilmaz Demo project: no real orders are shipped,
          payments run in Stripe test mode.
        </p>
      </div>
    </footer>
  );
};

export default PageFooter;
