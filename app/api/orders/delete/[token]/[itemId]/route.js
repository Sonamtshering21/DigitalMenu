import pool from '../../../../../../lib/db'; // Adjust the import path according to your project structure

export async function DELETE(request, { params }) {
    const { token, itemId } = params; // Destructure to get token and itemId from the params
    console.log(`Attempting to delete item with ID ${itemId} from order with token ${token}`);

    const client = await pool.connect();

    try {
        // Fetch the order using the token
        const order = await client.query('SELECT * FROM orders WHERE token = $1', [token]);
        if (!order.rows.length) {
            console.log(`No order found with token: ${token}`);
            return new Response(JSON.stringify({ success: false, error: 'Order not found' }), { status: 404 });
        }

        const orderDetails = order.rows[0];
        const selectedItems = orderDetails.selected_items;

        // Check the order status
        if (orderDetails.order_status !== 'N/A') {
            console.log(`Cannot delete item: order status is '${orderDetails.order_status}'`);
            return new Response(JSON.stringify({ success: false, error: 'Cannot delete item: order status is not N/A' }), { status: 403 });
        }

        console.log(`Current selected items: ${JSON.stringify(selectedItems)}`);

        // Filter out the item to be deleted
        const updatedItems = selectedItems.filter(item => item.id !== parseInt(itemId));
        console.log(`Updated selected items after deletion attempt: ${JSON.stringify(updatedItems)}`);

        // If no items were deleted, return a not found error
        if (updatedItems.length === selectedItems.length) {
            console.log(`Item with ID ${itemId} not found in selected_items.`);
            return new Response(JSON.stringify({ success: false, error: 'Item not found in selected items' }), { status: 404 });
        }

        // Update the order in the database with the new selected_items
        await client.query('UPDATE orders SET selected_items = $1 WHERE token = $2', [JSON.stringify(updatedItems), token]);

        return new Response(JSON.stringify({ success: true, message: 'Item deleted successfully' }), { status: 200 });
    } catch (error) {
        console.error('Error deleting item:', error);
        return new Response(JSON.stringify({ success: false, error: 'Internal server error' }), { status: 500 });
    } finally {
        client.release();
    }
}
