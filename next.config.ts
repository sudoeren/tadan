import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.higgs.ai",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  outputFileTracingIncludes: {
    "/**": ["./drizzle/**/*", "./scripts/**/*"],
  },
};

export default nextConfig;
