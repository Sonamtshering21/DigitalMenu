"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // New loading state

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true

    if (!email || !password) {
      setError("Please fill in all fields");
      setLoading(false); // Reset loading
      return;
    }

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res.error) {
        setError("Invalid Credentials");
      } else {
        router.replace("dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false); // Reset loading after processing
    }
  };

  return (
    <div className="grid place-items-center h-screen">
  <div className="shadow-lg p-9 rounded-lg border-t-4 border-green-400 bg-white max-w-sm w-full">
    <h1 className="text-2xl font-bold my-4 text-center text-gray-800">Login</h1>

    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-3">
      <input
        onChange={(e) => setEmail(e.target.value)}
        type="text"
        placeholder="Email"
        required
        className="border border-gray-300 rounded-lg p-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
      />
      <input
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        placeholder="Password"
        required
        className="border border-gray-300 rounded-lg p-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
      />
      <button
        type="submit"
        className="bg-green-600 text-white font-bold cursor-pointer px-6 py-2 rounded-lg transition duration-200 ease-in-out hover:bg-green-500 disabled:bg-green-300"
        disabled={loading}
      >
        {loading ? "Logging in..." : "Login"}
      </button>
      {error && (
        <div className="bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">
          {error}
        </div>
      )}
      <Link className="text-sm mt-3 text-right text-gray-600 hover:text-green-600" href={"/register"}>
      Don&apos;t have an account? <span className="underline">Register</span>
      </Link>
    </form>
  </div>
</div>
  );
}
