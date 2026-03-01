import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Image optimization */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "goodproxy.goodproxy.workers.dev",
      },
    ],
  },

  /* Compression and optimization */
  compress: true,
  poweredByHeader: false,

  /* Enable React 19 optimizations */
  ...(process.env.NODE_ENV === "production" && {
    experimental: {
      optimizePackageImports: ["@radix-ui/react-*", "lucide-react"],
    },
  }),
};

export default nextConfig;
