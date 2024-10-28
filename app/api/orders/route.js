import pool from '../../../lib/db'; // Adjust the import path according to your project structure

export async function POST(req) {
    try {
        const { token, tableNumber, selectedItems } = await req.json(); // Parse incoming JSON

        const client = await pool.connect(); // Connect to the PostgreSQL client

        // Insert order using token and table number, and store selected items as JSON
        const result = await client.query(
            'INSERT INTO orders (token, table_number, selected_items) VALUES ($1, $2, $3) RETURNING *',
            [token, tableNumber, JSON.stringify(selectedItems)]
        );

        client.release(); // Release the client back to the pool

        const newOrder = result.rows[0]; // Get the newly created order
        return new Response(JSON.stringify({ success: true, order: newOrder }), {
            status: 201, // Created
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error saving order:', error);
        return new Response(JSON.stringify({ success: false, error: 'Error saving order.' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
