import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    // Vehicle and character pictures are hosted by the GTA Wiki.
    remotePatterns: [{ protocol: 'https', hostname: 'static.wikia.nocookie.net' }],
  },
};

export default nextConfig;
