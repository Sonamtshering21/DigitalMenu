// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  //output: 'export', // Set output to export for static generation
  images: {
      domains: ['th.bing.com'], // Allow images from this domain
  },
};

export default nextConfig;
