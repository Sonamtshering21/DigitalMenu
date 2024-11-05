"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // State for success message

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      setError("All fields are necessary.");
      return;
    }

    try {
      const res = await fetch("api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      if (res.ok) {
        const form = e.target;
        form.reset();
        setSuccessMessage("Account created successfully!"); // Set success message
        setError(""); // Clear any previous error messages
        setTimeout(() => {
          router.push("/"); // Redirect after 2 seconds
        }, 2000);
      } else {
        const data = await res.json();
        setError(data.message); // Set the error message from the server
        setSuccessMessage(""); // Clear success message if error occurs
      }
    } catch (error) {
      console.log("Error during registration: ", error);
      setError("An unexpected error occurred. Please try again."); // Generic error message
      setSuccessMessage(""); // Clear success message if error occurs
    }
  };

  return (
    <div className="grid place-items-center h-screen">
  <div className="shadow-lg p-9 rounded-lg border-t-4 border-green-400 bg-white max-w-sm w-full">
    <h1 className="text-2xl font-bold my-4 text-center text-gray-800">Register</h1>

    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input
        onChange={(e) => setName(e.target.value)}
        type="text"
        placeholder="Full Name"
        required
        className="border border-gray-300 rounded-lg p-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
      />
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
        className="bg-green-600 text-white font-bold cursor-pointer px-6 py-2 rounded-lg transition duration-200 ease-in-out hover:bg-green-500"
      >
        Register
      </button>

      {error && (
        <div className="bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="bg-green-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">
          {successMessage}
        </div>
      )}

      <Link className="text-sm mt-3 text-right text-gray-600 hover:text-green-600" href={"/"}>
        Already have an account? <span className="underline">Login</span>
      </Link>
    </form>
  </div>
</div>

  );
}
