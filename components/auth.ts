import { connectPostgreSQL } from "../lib/db";
import pool from "@/lib/db";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";    
import { AuthOptions } from "next-auth"; // Import the AuthOptions type
import { JWT } from "next-auth/jwt"; // Import JWT type
//import { Session } from "next-auth"; // Import Session type

interface CustomToken extends JWT {
  id: string; // Extend the JWT type to include user ID
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "your.email@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) {
          throw new Error("No credentials provided");
        }

        const { email, password } = credentials;

        try {
          await connectPostgreSQL(); // Connect to PostgreSQL

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
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id; // Assign user id to token
      }
      return token;
    },
    async session({ session, token }) {
      const customToken = token as CustomToken; // Assert that token is of CustomToken type

      if (session.user) {
        session.user.id = customToken.id; // Assign user ID to session
      } else {
        session.user = { id: customToken.id }; // Initialize session.user with ID if undefined
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/",
  },
};
