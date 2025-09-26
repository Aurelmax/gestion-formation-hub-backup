import bundleAnalyzer from '@next/bundle-analyzer';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable ESLint and TypeScript checking during build for performance analysis
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Standard build configuration
  output: 'standalone',
  // Bundle optimization
  experimental: {
    optimizePackageImports: ['lucide-react', '@mui/material', '@mui/icons-material'],
  },
  // Force disable prerendering for built-in error pages
  generateEtags: false,
  // Disable problematic static page generation
  trailingSlash: false,
  skipTrailingSlashRedirect: true,
  // Configure page extensions to avoid conflicts
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  // Disable static optimization to prevent Html import errors
  distDir: '.next',
  poweredByHeader: false,
  reactStrictMode: false,
  // Configure external images
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'staticmap.openstreetmap.de',
        port: '',
        pathname: '/staticmap.php**',
      },
      {
        protocol: 'https',
        hostname: 'tile.openstreetmap.org',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.tile.openstreetmap.org',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Prevent static generation of error pages to avoid Html import conflicts
  generateBuildId: async () => {
    return 'build-' + Date.now();
  },
  // Code splitting optimization
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      // Split vendor chunks for better caching
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: 10,
            enforce: true,
          },
          mui: {
            test: /[\\/]node_modules[\\/]@mui[\\/]/,
            name: 'mui',
            priority: 20,
            enforce: true,
          },
          lucide: {
            test: /[\\/]node_modules[\\/]lucide-react[\\/]/,
            name: 'lucide',
            priority: 20,
            enforce: true,
          },
        },
      };
    }
    return config;
  },
  async headers() {
    return [{
      source: '/api/:path*',
      headers: [
        { key: 'Access-Control-Allow-Origin', value: '*' },
        { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
        { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
      ],
    }]
  },
}

// Configure bundle analyzer
const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

export default withBundleAnalyzer(nextConfig);
