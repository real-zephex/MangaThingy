import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "goodproxy.dramaflix.workers.dev",
      },
    ],
    unoptimized: true,
  },
};

export default nextConfig;
