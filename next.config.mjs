/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "avt.mkklcdnv6temp.com",
      },
      {
        hostname: "flamecomics.me",
      },
      {
        hostname: "cm.blazefast.co",
      },
      {
        hostname: "flamecomics.com",
      },
      {
        hostname: "sup-proxy.zephex0-f6c.workers.dev",
      },
      {
        hostname: "cdn.readdetectiveconan.com",
      },
      {
        hostname: "manga-scrapers.onrender.com",
      },
      {
        hostname: "cdn.mangaworld.ac",
      },
      {
        hostname: "mangareader.tv",
      },
      {
        hostname: "mn2.mkklcdnv6temp.com",
      },
    ],
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

export default nextConfig;
