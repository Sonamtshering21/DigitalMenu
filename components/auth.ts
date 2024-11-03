import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { AuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import supabase from "../lib/subabaseclient"; // Supabase client should be initialized in this module

interface CustomToken extends JWT {
  id: string; // Extend the JWT type to include user ID
}

// Define a custom User type for your application
interface CustomUser {
  id: string;
  email: string;
  name: string; // Include name property
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "your.email@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<CustomUser | null> {
        if (!credentials) {
          throw new Error("No credentials provided");
        }

        const { email, password } = credentials;

        try {
          console.time("Fetch User");
          const { data: user, error: userError } = await supabase
            .from("users")
            .select("id, email, password, name") // Ensure to include the name field
            .eq("email", email)
            .single();
          console.timeEnd("Fetch User");

          if (userError) {
            console.error("Error fetching user:", userError);
            return null;
          }

          if (!user) {
            return null; // No user found
          }

          console.time("Password Compare");
          const passwordsMatch = await bcrypt.compare(password, user.password);
          console.timeEnd("Password Compare");

          if (!passwordsMatch) {
            return null; // Passwords do not match
          }

          // Return a full user object that includes the required fields
          return {
            id: user.id,
            email: user.email,
            name: user.name || '', // Use empty string if name is not available
          }; 
        } catch (error) {
          console.error("Error during authorization:", error);
          throw new Error("Authorization failed");
        }
      }
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
