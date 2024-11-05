export { default } from "next-auth/middleware";
export const config = { 
    matcher: ["/dashboard","/admin","/qr-codes"] // Apply middleware to multiple routes
  };