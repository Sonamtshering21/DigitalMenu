import pool from '../../../../lib/db'; // Adjust the import path as necessary
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
    const { tokenId } = params; // Extract tokenId from the URL parameters

    // Log the extracted tokenId to the console
    console.log('Extracted tokenId:', tokenId);

    try {
        const client = await pool.connect(); // Get a client from the pool
        const result = await client.query('SELECT * FROM orders WHERE token = $1', [tokenId]);
        client.release(); // Release the client back to the pool

        if (result.rows.length === 0) {
            return NextResponse.json({ message: 'No order found for this token ID.' }, { status: 404 });
        }

        return NextResponse.json({ order: result.rows[0] }); // Respond with the found order
    } catch (error) {
        console.error('Error fetching order:', error);
        return NextResponse.error();
    }
}
