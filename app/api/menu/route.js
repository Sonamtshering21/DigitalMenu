import pool from '../../../lib/db'; // Adjust the import path according to your project structure

export async function GET(request) {
    const { searchParams } = new URL(request.url); // Use the request to get search parameters
    const userId = searchParams.get('user_id');
     // Assuming you're also using this in your query

    try {
        const client = await pool.connect(); // Connect to the PostgreSQL client

        // Ensure user_id is provided to prevent SQL injection
        if (!userId) {
            return new Response(JSON.stringify({ error: 'User ID is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Update the query to filter by user_id and optionally table_no
        const result = await client.query('SELECT * FROM menu_items WHERE user_id = $1', [userId]);
        
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
