import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/blog/athx-vs-hyrox-vs-crossfit-lequel-choisir-athlete-hybride",
        destination: "/blog/difference-athx-hyrox-crossfit-comparatif-athlete-hybride",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
