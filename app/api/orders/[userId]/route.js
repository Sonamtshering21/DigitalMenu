import pool from '../../../../lib/db'; // Adjust the import path as necessary
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
    const { userId } = params; // Extract userId from the URL parameters

    const url = new URL(req.url);
    const dateParam = url.searchParams.get('date') || new Date().toISOString().split('T')[0]; // Use selected date or default to today

    try {
        const client = await pool.connect();

        // Query to get all orders for the user created on the selected date
        const ordersResult = await client.query(
            'SELECT * FROM orders WHERE user_id = $1 AND created_at::date = $2',
            [userId, dateParam]
        );

        // Query to get total, pending, and delivered order counts for orders created on the selected date
        const countsResult = await client.query(
            `SELECT
                COUNT(*) AS total_orders,
                COUNT(CASE WHEN order_progress = 'N/A' THEN 1 END) AS pending_orders,
                COUNT(CASE WHEN order_progress = 'Ready to Eat' THEN 1 END) AS delivered_orders
             FROM orders
             WHERE user_id = $1 AND created_at::date = $2`,
            [userId, dateParam]
        );

        client.release();

        // Extract counts from the counts result
        const { total_orders, pending_orders, delivered_orders } = countsResult.rows[0];

        // Return both order details and counts in the response
        return NextResponse.json({
            orders: ordersResult.rows,
            counts: {
                totalOrders: parseInt(total_orders),
                pendingOrders: parseInt(pending_orders),
                deliveredOrders: parseInt(delivered_orders)
            }
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        return NextResponse.error();
    }
}
