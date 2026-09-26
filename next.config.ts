import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "**.cdninstagram.com" },
      { protocol: "https", hostname: "**.fbcdn.net" },
      { protocol: "https", hostname: "**.twimg.com" },
      { protocol: "https", hostname: "**.redd.it" },
      { protocol: "https", hostname: "**.pinimg.com" },
      { protocol: "https", hostname: "i.vimeocdn.com" },
    ],
  },
};

export default nextConfig;
