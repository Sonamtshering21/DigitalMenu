import supabase from '../../../../lib/subabaseclient'; 
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
    const { tokenId } = params; // Extract tokenId from the URL parameters

    // Log the extracted tokenId to the console
    console.log('Extracted tokenId:', tokenId);

    try {
        // Use Supabase to fetch the order with the specified token ID
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .eq('token', tokenId)
            .single(); // Fetch a single order

        if (error) {
            console.error('Error fetching order:', error);
            return NextResponse.json({ message: 'Error fetching order.' }, { status: 500 });
        }

        if (!data) {
            return NextResponse.json({ message: 'No order found for this token ID.' }, { status: 404 });
        }

        return NextResponse.json({ order: data }); // Respond with the found order
    } catch (error) {
        console.error('Unexpected error:', error);
        return NextResponse.error();
    }
}
