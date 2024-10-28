
import pool from '../../../lib/db'; // Adjust the import path according to your project structure

export async function GET() {
    try {
        const client = await pool.connect();
        client.release(); // Release the client back to the pool
        return new Response(JSON.stringify({ message: 'Connected to PostgreSQL database successfully!' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error connecting to PostgreSQL database:', error);
        return new Response(JSON.stringify({ error: 'Error connecting to PostgreSQL database' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}