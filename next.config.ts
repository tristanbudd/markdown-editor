import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.css?raw": {
        loaders: ["raw-loader"],
        as: "*.js",
      },
    },
  },
}

export default nextConfig
