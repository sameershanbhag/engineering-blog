import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Pin the workspace root to this project; a stray lockfile in the home
  // directory otherwise confuses Turbopack's root inference.
  turbopack: {
    root: path.join(__dirname),
  },
  images: {
    // Allowed hosts for real avatar/cover images. Add your backend/CDN host
    // here when wiring the real service.
    remotePatterns: [
      { protocol: "https", hostname: "i.pravatar.cc" },
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "fastly.picsum.photos" },
      { protocol: "https", hostname: "images.unsplash.com" },
      // OAuth provider avatars
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
};

export default nextConfig;
