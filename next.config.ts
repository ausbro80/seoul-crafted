import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Route hero images can easily be several MB; the default 1MB was blocking uploads.
      bodySizeLimit: "25mb",
    },
  },
};

export default nextConfig;
