{/* import { connectPostgreSQL } from "../lib/db"; 
import pool from "@/lib/db";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";    
import { AuthOptions } from "next-auth"; 
import { JWT } from "next-auth/jwt"; 

interface CustomToken extends JWT {
  id: string; 
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
          await connectPostgreSQL(); 

          const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
          const user = rows[0];

          if (!user) {
            return null; 
          }

          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (!passwordsMatch) {
            return null; 
          }

          return user; 
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
        token.id = user.id; 
      }
      return token;
    },
    async session({ session, token }) {
      const customToken = token as CustomToken; 

      if (session.user) {
        session.user.id = customToken.id; 
      } else {
        session.user = { id: customToken.id }; 
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 60, // 30 minutes
    updateAge: 10 * 60, // Refresh every 10 minutes
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/",
  },
};
*/}

import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";    
import { AuthOptions } from "next-auth"; 
import { JWT } from "next-auth/jwt"; 
import supabase from '../lib/subabaseclient'

interface CustomToken extends JWT {
  id: string; 
}

// Initialize Supabase client


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
          // Fetch user by email from Supabase
          const { data: user, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

          if (userError) {
            console.error("Error fetching user:", userError);
            return null; // User not found
          }

          if (!user) {
            return null; // User not found
          }

          // Compare the provided password with the stored hashed password
          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (!passwordsMatch) {
            return null; // Passwords do not match
          }

          return user; // Successful authorization
        } catch (error) {
          console.error("Error during authorization:", error);
          throw new Error("Authorization failed");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id; 
      }
      return token;
    },
    async session({ session, token }) {
      const customToken = token as CustomToken; 

      if (session.user) {
        session.user.id = customToken.id; 
      } else {
        session.user = { id: customToken.id }; 
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 60, // 30 minutes
    updateAge: 10 * 60, // Refresh every 10 minutes
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/",
  },
};
