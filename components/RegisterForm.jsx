"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./style/register.module.css"; // Import your styles

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
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Register</h1>

        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            onChange={(e) => setName(e.target.value)}
            type="text"
            placeholder="Full Name"
            required
            className={styles.input}
          />
          <input
            onChange={(e) => setEmail(e.target.value)}
            type="text"
            placeholder="Email"
            required
            className={styles.input}
          />
          <input
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            required
            className={styles.input}
          />
          <button type="submit" className={styles.submitButton}>
            Register
          </button>

          {error && <div className={styles.error}>{error}</div>}
          {successMessage && <div className={styles.success}>{successMessage}</div>}

          <Link className={styles.link} href={"/"}>
            Already have an account? <span className={styles.underline}>Login</span>
          </Link>
        </form>
      </div>
    </div>
  );
}
