// app/api/auth/register/route.js
import { connectPostgreSQL } from "../../../lib/db"; // Update the import for PostgreSQL
import pool from "../../../lib/db"; // Import the pool for querying
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Connect to PostgreSQL
    await connectPostgreSQL();

    // Check if the email is already registered
    const existingUser = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rowCount > 0) {
      return NextResponse.json({ message: "Email already has an account." }, { status: 409 });
    }

    // Insert the new user into the PostgreSQL database
    await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3)',
      [name, email, hashedPassword]
    );

    return NextResponse.json({ message: "Account successfully created." }, { status: 201 });
  } catch (error) {
    console.error("Registration error:", error); // Log the error for debugging

    // Handle unique constraint violation specifically
    if (error.code === '23505') {
      return NextResponse.json({ message: "Email already has an account." }, { status: 409 });
    }

    return NextResponse.json(
      { message: "An error occurred while registering the user." },
      { status: 500 }
    );
  }
}
