import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow product images served by the backend
    remotePatterns: [
      {
        protocol: "https",
        hostname: "localhost",
        port: "7140",
        pathname: "/images/**",
      },
    ],
    // In development the backend uses a self-signed certificate that Next.js' image
    // optimizer does not trust, so images are loaded directly by the browser instead
    unoptimized: process.env.NODE_ENV === "development",
  },
};

export default nextConfig;
