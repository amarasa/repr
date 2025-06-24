import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export for Netlify deployment
  output: 'export',
  trailingSlash: true,
  
  // Image optimization settings for static export
  images: {
    unoptimized: true,
    domains: ['supabase.co'],
  },
  
  // Disable server-side features for static export
  experimental: {
    esmExternals: true,
  },
};

export default nextConfig;
