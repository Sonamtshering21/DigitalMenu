// lib/db.js
import { Pool } from 'pg';

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Function to connect to PostgreSQL
export const connectPostgreSQL = async () => {
    try {
        await pool.connect(); // This will check the connection
        console.log('Connected to PostgreSQL database successfully!');
    } catch (error) {
        console.error('Error connecting to PostgreSQL database:', error);
        throw error; // Optional: propagate the error if needed
    }
};

// Test connection on startup (optional)
const testConnection = async () => {
    try {
        await connectPostgreSQL();
    } catch (error) {
        console.error('Initial connection test failed:', error);
    }
};

testConnection(); // Call the test connection function

export default pool; // Export the pool for queries
