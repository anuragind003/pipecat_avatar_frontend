import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // Ensure Turbopack uses this frontend folder as the root for lockfile detection.
    root: path.join(__dirname),
  },
  reactCompiler: true,
};

export default nextConfig;
