import Link from "next/link";
import MainNav from "./MainNav";
import AuthNav from "./AuthNav";
import ThemeToggle from "./ThemeToggle";

const PageHeader = () => {
  return (
    <header className="fixed top-0 inset-x-0 z-50 h-16 bg-stone-950/90 backdrop-blur border-b border-white/10">
      <div className="h-full max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-6">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="text-lg font-semibold tracking-tight text-white"
          >
            NorskHandverk
          </Link>
          <MainNav />
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <AuthNav />
        </div>
      </div>
    </header>
  );
};

export default PageHeader;
