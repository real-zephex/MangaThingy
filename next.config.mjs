/** @type {import('next').NextConfig} */

const remotePatterns = [
  "avt.mkklcdnv6temp.com",
  "flamecomics.me",
  "cm.blazefast.co",
  "flamecomics.com",
  "sup-proxy.zephex0-f6c.workers.dev",
  "cdn.readdetectiveconan.com",
  "manga-scrapers.onrender.com",
  "cdn.mangaworld.ac",
  "mangareader.tv",
  "mn2.mkklcdnv6temp.com",
  "gogocdn.net",
  "lh3.googleusercontent.com",
  "avatars.githubusercontent.com",
  "xfs-n13.xfspp.com",
  "xfs-n00.xfspp.com",
  "xfs-n09.xfspp.com",
];

const nextConfig = {
  images: {
    remotePatterns: remotePatterns.map((hostname) => ({
      hostname,
    })),
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

export default nextConfig;
