"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import styles from './style/login.module.css'

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
    <div className={styles.container}>
      <div className={styles['login-box']}>
        <h1 className={styles.title}>Login</h1>
        
        <form onSubmit={handleSubmit} className={styles.form}>
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
          <button
            type="submit"
            className={styles.button}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          {error && <div className={styles['error-message']}>{error}</div>}
          <Link className={styles.link} href={"/register"}>
            Don&apos;t have an account? <span>Register</span>
          </Link>
        </form>
      </div>
    </div>
  );
}
