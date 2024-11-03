
import supabase from '../../../../../lib/subabaseclient'; // Adjust the import path according to your project structure
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
    const { tokenId } = params; // Extract tokenId from params

    console.log('Received tokenId:', tokenId);

    if (!tokenId) {
        return NextResponse.json(
            { message: 'Token ID is required' },
            { status: 400 }
        );
    }

    try {
        // Query to fetch counts based on order_status, order_progress, and payment_status
        const { data: result, error } = await supabase
            .from('orders')
            .select(`
                COUNT(*) AS total_orders,
                COUNT(*) FILTER (WHERE order_status = 'Confirmed') AS delivered_orders,
                COUNT(*) FILTER (WHERE order_status ='N/A') AS pending_orders,
                COUNT(*) FILTER (WHERE payment_status = 'Confirmed') AS payments_orders
            `)
            .eq('token', tokenId);

        if (error) {
            console.error('Error fetching order counts:', error);
            return NextResponse.json(
                { message: 'Internal Server Error' },
                { status: 500 }
            );
        }

        if (!result.length) {
            return NextResponse.json(
                { message: 'Order not found' },
                { status: 404 }
            );
        }

        const counts = result[0];
        return NextResponse.json(
            {
                totalOrders: counts.total_orders,
                deliveredOrders: counts.delivered_orders,
                pendingOrders: counts.pending_orders,
                paymentsOrders: counts.payments_orders,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Unexpected error fetching order counts:', error);
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        );
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

    try {
        let totalAmount = 0;

        // Check for selected_items to calculate total price if order is confirmed
        if (source === 'orderedList' && order_status === 'Confirmed') {
            // Fetch selected items to calculate total amount
            const { data: order, error: orderError } = await supabase
                .from('orders')
                .select('selected_items')
                .eq('token', tokenId)
                .single();

            if (orderError) {
                console.error('Error fetching order for total amount calculation:', orderError);
                return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
            }

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
            
            console.log('Total amount calculated:', totalAmount);
        }

        // Initialize update fields
        const updates = {};
        if (order_status) updates.order_status = order_status;
        if (order_progress) updates.order_progress = order_progress;
        if (source === 'orderedList' && order_status === 'Confirmed') updates.total_amount = totalAmount;

        // Check for payment updates
        if (source === 'paymentList') {
            if (payment_status) updates.payment_status = payment_status;
            if (payment_method) updates.payment_method = payment_method;
            if (transaction_id) updates.transaction_id = transaction_id;
        }

        // Ensure that at least one field is being updated
        if (Object.keys(updates).length === 0) {
            return NextResponse.json({ message: 'No fields to update' }, { status: 400 });
        }

        const { error: updateError } = await supabase
            .from('orders')
            .update(updates)
            .eq('token', tokenId);

        if (updateError) {
            console.error('Error updating order:', updateError);
            return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
        }

        return NextResponse.json({ message: 'Order updated successfully' }, { status: 200 });

    } catch (error) {
        console.error('Error updating order:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
