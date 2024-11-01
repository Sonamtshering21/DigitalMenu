import { NextResponse } from 'next/server';
import pool from '../../../../../lib/db'; // Adjust the path as necessary

export async function GET(req, { params }) 
{
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
            `SELECT order_status, order_progress, selected_items 
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
            { order_status: order.order_status, order_progress: order.order_progress, selected_items: order.selected_items },
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

    const body = await req.json(); // Read the body once
    const { order_status, order_progress, source, payment_status, payment_method, transaction_id } = body;
   

    if (!source) {
        return NextResponse.json(
            { message: 'Source is required' },
            { status: 400 }
        );
    }

    const client = await pool.connect();
    try {
        // Initialize variables for updates
        const updates = [];
        const values = [];
        let index = 1;
        let totalAmount = 0;

        // Check for selected_items to calculate total price if order is confirmed
        if (source === 'orderedList') {
            if (order_status === 'Confirmed') {
                // Fetch selected items to calculate total amount
                const orderResult = await client.query(
                    `SELECT selected_items FROM orders WHERE token = $1`,
                    [tokenId]
                );

                if (orderResult.rowCount > 0) {
                    const order = orderResult.rows[0];
                    let selectedItems = [];

                    // Parse the selected_items field if it's a string
                    if (typeof order.selected_items === 'string') {
                        selectedItems = JSON.parse(order.selected_items);
                    } else {
                        selectedItems = order.selected_items; // Already an object
                    }

                    // Calculate the total price
                    totalAmount = selectedItems.reduce((total, item) => {
                        return total + (item.price * item.quantity);
                    }, 0);
                    
                    // Log the total amount calculated for debugging
                    console.log('Total amount calculated:', totalAmount);
                }
            }

            // Build the query to update order status, progress, and total amount
            if (order_status) {
                updates.push(`order_status = $${index++}`);
                values.push(order_status);
            }
            if (order_progress) {
                updates.push(`order_progress = $${index++}`);
                values.push(order_progress);
            }
            // Update the total_amount if it's confirmed
            if (order_status === 'Confirmed') {
                updates.push(`total_amount = $${index++}`); // Assuming 'total_amount' is the field name in your database
                values.push(totalAmount);

                // Log the total amount to be updated in the database
                console.log('Updating total_amount to:', totalAmount);
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

        } else if (source === 'paymentList') {
            // Assuming payment_status and payment_method are included in the request body
           
           
            const updates = [];
            const values = [];
            let index = 1;

            // Build the query to update order payment status and method
            if (payment_status) {
                updates.push(`payment_status = $${index++}`);
                values.push(payment_status);
            }
            if (payment_method) {
                updates.push(`payment_method = $${index++}`);
                values.push(payment_method);
            }
            // Update the transaction_id if the payment status is confirmed
            if (transaction_id) {
                updates.push(`transaction_id = $${index++}`); // Assuming 'transaction_id' is the field name in your database
                values.push(transaction_id);
            }

            // Ensure that at least one field is being updated
            if (updates.length === 0) {
                return NextResponse.json({ message: 'No fields to update' }, { status: 400 });
            }

            // Add the tokenId to the values for the WHERE clause
            values.push(tokenId);
            const query = `UPDATE orders SET ${updates.join(', ')} WHERE token = $${index}`;

            await client.query(query, values); // Execute the update query

            return NextResponse.json({ message: 'Payment updated successfully' }, { status: 200 });
        } else {
            return NextResponse.json({ message: 'Invalid source provided' }, { status: 400 });
        }
    } catch (error) {
        console.error('Error updating order:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    } finally {
        client.release();
    }
}