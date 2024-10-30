import pool from '../../../../lib/db'; // Adjust the import path as necessary
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
    const { userId } = params; // Extract userId from the URL parameters

    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM orders WHERE user_id = $1', [userId]);
        client.release();

        return NextResponse.json(result.rows); // Respond with the user's orders
    } catch (error) {
        console.error('Error fetching orders:', error);
        return NextResponse.error();
    }
}
