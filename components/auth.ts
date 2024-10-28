import { connectPostgreSQL } from "../lib/db";

import pool from "@/lib/db";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";    
import { AuthOptions } from "next-auth"; // Import the AuthOptions type

export const authOptions: AuthOptions = { // Type the authOptions variable
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "your.email@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Check if credentials are provided
        if (!credentials) {
          throw new Error("No credentials provided");
        }

        const { email, password } = credentials;

        try {
          await connectPostgreSQL(); // Connect to PostgreSQL

          // Fetch the user from PostgreSQL
          const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
          const user = rows[0]; // Get the first user from the result

          if (!user) {
            return null; // No user found
          }

          // Compare passwords
          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (!passwordsMatch) {
            return null; // Password does not match
          }

          return user; // User authenticated
        } catch (error) {
          console.error("Error during authorization: ", error);
          throw new Error("Authorization failed");
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
