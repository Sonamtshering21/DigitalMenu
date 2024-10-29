import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string; // Add user ID
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }

  interface User {
    id: string; // Add user ID
    name: string;
    email: string;
    image?: string | null;
  }

  interface JWT {
    id: string; // Add user ID to JWT
  }
}
