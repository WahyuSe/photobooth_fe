import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Allow images from any source (for webcam screenshots)
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [],
  },
  // Disable x-powered-by header
  poweredByHeader: false,
};

export default nextConfig;
