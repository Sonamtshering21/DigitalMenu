import pool from '../../../lib/db'; // Adjust the import path according to your project structure

export async function GET() {
    try {
        const client = await pool.connect(); // Connect to the PostgreSQL client
        const result = await client.query('SELECT * FROM menu_items'); // Fetch all menu items
        client.release(); // Release the client back to the pool
        
        // Return the result as JSON
        return new Response(JSON.stringify(result.rows), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error fetching menu items:', error);
        return new Response(JSON.stringify({ error: 'Error fetching menu items' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
