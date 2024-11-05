// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
    // Uncomment the line below if you need static export for your project
    // output: 'export', // Set output to export for static generation
  
    env: {
      CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
      CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
      CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
    },
  
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'th.bing.com', // Allow images from this domain
          port: '',
          pathname: '/**',
        },
        {
          protocol: 'https',
          hostname: 'res.cloudinary.com', // Allow images from Cloudinary
          port: '',
          pathname: `/${process.env.CLOUDINARY_CLOUD_NAME}/**`, // Adjust based on Cloudinary URL format
        },
      ],
    },
  };
  
  export default nextConfig;
  