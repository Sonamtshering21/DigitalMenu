/*
import { connectPostgreSQL } from "../../../../lib/db";// Update the import for PostgreSQL
import pool from "../../../../lib/db"; 
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";              
export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",     
      credentials: {},

      async authorize(credentials) {
        const { email, password } = credentials;

        try {
          await connectPostgreSQL(); // Connect to PostgreSQL

          // Fetch the user from PostgreSQL
          const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

          const user = rows[0]; // Get the first user from the result

          if (!user) {
            return null; // No user found
          }

          const passwordsMatch = await bcrypt.compare(password, user.password);

          if (!passwordsMatch) {
            return null; // Password does not match
          }

          return user; // User authenticated
        } catch (error) {
          console.log("Error: ", error);
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
*/
import { authOptions } from "@/components/auth";
import NextAuth from "next-auth/next";

const handler = NextAuth(authOptions) ;

export { handler as GET, handler as POST };