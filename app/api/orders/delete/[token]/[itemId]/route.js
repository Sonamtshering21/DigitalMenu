import supabase from '../../../../../../lib/subabaseclient'; // Adjust the import path according to your project structure

export async function DELETE(request, { params }) {
    const { token, itemId } = params; 
    console.log(`Attempting to delete item with ID ${itemId} from order with token ${token}`);

    try {
        // Fetch the order using the token
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .select('*')
            .eq('token', token)
            .single();

        if (orderError) {
            console.log(`Error fetching order: ${orderError.message}`);
            return new Response(JSON.stringify({ success: false, error: 'Order not found' }), { status: 404 });
        }

        // Check order status, default to 'N/A' if order_status is null
        const orderStatus = order.order_status || 'N/A';
        if (orderStatus !== 'N/A') {
            console.log(`Cannot delete item: order status is '${orderStatus}'`);
            return new Response(JSON.stringify({ success: false, error: 'Cannot delete item: order status is not N/A' }), { status: 403 });
        }

        const selectedItems = order.selected_items || [];
        console.log(`Current selected items: ${JSON.stringify(selectedItems)}`);

        const updatedItems = selectedItems.filter(item => item.id !== parseInt(itemId));
        console.log(`Updated selected items after deletion attempt: ${JSON.stringify(updatedItems)}`);

        // Check if the item was found for deletion
        if (updatedItems.length === selectedItems.length) {
            console.log(`Item with ID ${itemId} not found in selected_items.`);
            return new Response(JSON.stringify({ success: false, error: 'Item not found in selected items' }), { status: 404 });
        }

        const { error: updateError } = await supabase
            .from('orders')
            .update({ selected_items: updatedItems })
            .eq('token', token);

        if (updateError) {
            console.error('Error updating order:', updateError.message);
            return new Response(JSON.stringify({ success: false, error: 'Internal server error' }), { status: 500 });
        }

        return new Response(JSON.stringify({ success: true, message: 'Item deleted successfully' }), { status: 200 });
    } catch (error) {
        console.error('Unexpected error deleting item:', error);
        return new Response(JSON.stringify({ success: false, error: 'Internal server error' }), { status: 500 });
    }
}
