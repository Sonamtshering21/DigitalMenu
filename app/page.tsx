/*
import LoginForm from "@/components/LoginForm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/components/auth";

export default async function Home() {
  // Get the session on the server side
  const session = await getServerSession(authOptions);

  // Redirect to the dashboard if a session exists
  if (session) {
    redirect("/dashboard");
  }

  // Render the login form if no session exists
  return (
    <main>
      <LoginForm />
    </main>
  );
}
 */
import LoginForm from "@/components/LoginForm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/components/auth";

export default async function Home() {
  // Get the session on the server side
  const session = await getServerSession(authOptions);

  // Redirect to the dashboard if a session exists
  if (session) {
    redirect("/dashboard");
  }

  // Render the login form if no session exists
  return (
    <main>
      <LoginForm />
    </main>
  );
}
