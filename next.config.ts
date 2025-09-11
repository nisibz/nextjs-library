import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3100",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "nestjs-library-tests.nisibz.com/",
        pathname: "/uploads/**",
      },
    ],
  },
  output: "standalone",
};

export default nextConfig;
