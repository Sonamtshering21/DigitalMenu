import { NextResponse } from 'next/server';
import pool from '../../../../../lib/db'; // Adjust the path as necessary

// GET method to fetch order status by tokenId
export async function GET(req, { params }) {
    const { tokenId } = params; // Extract tokenId from params

    // Log the received tokenId for debugging
    console.log('Received tokenId:', tokenId);

    if (!tokenId) {
        return NextResponse.json(
            { message: 'Token ID is required' },
            { status: 400 }
        );
    }

    const client = await pool.connect();
    try {
        const result = await client.query(
            `SELECT order_status, order_progress 
             FROM orders 
             WHERE token = $1`,
            [tokenId]
        );

        // Log the result of the query for debugging
        console.log('Query result:', result);

        if (result.rowCount === 0) {
            return NextResponse.json(
                { message: 'Order not found' },
                { status: 404 }
            );
        }

        const order = result.rows[0];
        return NextResponse.json(
            { order_status: order.order_status, order_progress: order.order_progress },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error fetching order status:', error);
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        );
    } finally {
        client.release();
    }
}

// PATCH method to update order status or progress by tokenId
export async function PATCH(req, { params }) {
    const { tokenId } = params; // Extract tokenId from params

    if (!tokenId) {
        return NextResponse.json(
            { message: 'Token ID is required' },
            { status: 400 }
        );
    }

    const { order_status, order_progress } = await req.json(); // Get fields to update from request body

    const client = await pool.connect();
    try {
        // Build the query to update order status or progress
        const updates = [];
        const values = [];
        let index = 1;

        if (order_status) {
            updates.push(`order_status = $${index++}`);
            values.push(order_status);
        }
        if (order_progress) {
            updates.push(`order_progress = $${index++}`);
            values.push(order_progress);
        }

        // Ensure that at least one field is being updated
        if (updates.length === 0) {
            return NextResponse.json({ message: 'No fields to update' }, { status: 400 });
        }

        // Add the tokenId to the values for the WHERE clause
        values.push(tokenId);
        const query = `UPDATE orders SET ${updates.join(', ')} WHERE token = $${index}`;

        await client.query(query, values); // Execute the update query

        return NextResponse.json({ message: 'Order updated successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error updating order:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    } finally {
        client.release();
    }
}

