import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: "manga-scrapers.onrender.com",

      }
    ]
  }
};

export default nextConfig;
