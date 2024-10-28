export { default } from "next-auth/middleware";
export const config = { 
    matcher: ["/dashboard","/admin"] // Apply middleware to multiple routes
  };