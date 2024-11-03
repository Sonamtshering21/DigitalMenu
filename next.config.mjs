// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export', // Set output to export for static generation
  images: {
      remotePatterns: [
          {
              protocol: 'https',
              hostname: 'th.bing.com', // Allow images from this domain
              port: '',
              pathname: '/**',
          },
      ],
  },
};

export default nextConfig;
