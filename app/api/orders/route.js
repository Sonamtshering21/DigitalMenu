import supabase from '../../../lib/subabaseclient'; 
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const { token, tableNumber, userId, selectedItems } = await req.json(); // Parse incoming JSON

        // Insert order using Supabase
        const { data, error } = await supabase
            .from('orders')
            .insert([
                {
                    token,
                    table_number: tableNumber,
                    user_id: userId,
                    selected_items: selectedItems,
                    order_status: 'N/A',
                    order_progress: 'N/A'
                }
            ])
            .single(); // Use .single() to retrieve the inserted row if it exists

        if (error) {
            console.error('Error inserting order:', error);
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, order: data }, { status: 201 });
    } catch (error) {
        console.error('Unexpected error:', error);
        return NextResponse.json({ success: false, error: 'Unexpected error while saving order.' }, { status: 500 });
    }
}
