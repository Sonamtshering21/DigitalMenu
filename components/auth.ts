import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { AuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import supabase from "../lib/subabaseclient"; // Supabase client should be initialized in this module

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
          // Fetch user by email from Supabase
          const { data: user, error: userError } = await supabase
            .from("users")
            .select("*")
            .eq("email", email)
            .single();

          if (userError) {
            console.error("Error fetching user:", userError);
            return null; // Return null if no user is found or an error occurs
          }

          if (!user) {
            return null; // No user found
          }

          // Compare provided password with stored hashed password
          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (!passwordsMatch) {
            return null; // Passwords do not match
          }

          return user; // Return the authenticated user
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
        token.id = user.id; // Assign user id to token
      }
      return token;
    },
    async session({ session, token }) {
      const customToken = token as CustomToken;

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
    maxAge: 30 * 60, // 30 minutes
    updateAge: 10 * 60, // Refresh every 10 minutes
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/", // Redirect to home or another sign-in page
  },
};
