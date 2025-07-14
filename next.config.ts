import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    HUGGING_FACE_TOKEN: process.env.HUGGING_FACE_TOKEN,
  },
};

export default nextConfig;
