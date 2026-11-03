import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow product images served by the backend
    remotePatterns: [
      // Local development: images served by the backend from wwwroot
      {
        protocol: "https",
        hostname: "localhost",
        port: "7140",
        pathname: "/images/**",
      },
      // Production: signed links to the private Backblaze B2 bucket
      {
        protocol: "https",
        hostname: "s3.eu-central-003.backblazeb2.com",
        pathname: "/norskhandverk-images/**",
      },
    ],
    // In development the backend uses a self-signed certificate that Next.js' image
    // optimizer does not trust, so images are loaded directly by the browser instead
    unoptimized: process.env.NODE_ENV === "development",
  },
};

export default nextConfig;
