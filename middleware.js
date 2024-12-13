export { default } from "next-auth/middleware";
export const config = { 
    matcher: ["/dashboard/:path*","/admin/:path*","/qr-codes/:path*"] // Apply middleware to multiple routes
  };