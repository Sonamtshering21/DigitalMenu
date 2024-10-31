import pool from '../../../lib/db'; // Adjust the import path according to your project structure
//import { getSession } from 'next-auth/react'; 
export async function POST(req) {
    try {
        const { token, tableNumber, userId, selectedItems } = await req.json(); // Parse incoming JSON

        const client = await pool.connect(); // Connect to the PostgreSQL client

        // Insert order using token, table number, user_id, and store selected items as JSON
        const result = await client.query(
            'INSERT INTO orders (token, table_number, user_id, selected_items, order_status, order_progress) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [token, tableNumber, userId, JSON.stringify(selectedItems), 'N/A', 'N/A'] // Include userId and default values in the values array
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
