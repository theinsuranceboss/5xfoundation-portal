import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Use custom build directory only for local development to avoid Windows file locks.
  // Production builds (both local and Netlify) will use the default '.next' directory.
  distDir: process.env.NODE_ENV === 'development' ? '.next-dev-local' : undefined,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'placeholder.co',
      },
    ],
  },
};

export default nextConfig;
