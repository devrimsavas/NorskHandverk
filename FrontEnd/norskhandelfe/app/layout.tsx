import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";
import PageHeader from "@/components/PageHeader";
import PageFooter from "@/components/PageFooter";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NorskHandverk",
  description: "Handmade Norwegian crafts, from local makers",
};

// Applies the saved theme before the page is painted, so dark mode does not flash white
const themeScript = `(function(){try{var t=localStorage.getItem('norskhandverk_theme');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;if(d)document.documentElement.classList.add('dark');}catch(e){}})();`;
// Only set in production (Vercel), so local visits are not counted
const goatCounterUrl = process.env.NEXT_PUBLIC_GOATCOUNTER_URL;
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-page`}
      >
        <AuthProvider>
          <PageHeader />
          <div className="pt-16 flex-1">{children}</div>
          <PageFooter />
        </AuthProvider>
        {goatCounterUrl && (
          <Script
            data-goatcounter={goatCounterUrl}
            src="https://gc.zgo.at/count.js"
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}
