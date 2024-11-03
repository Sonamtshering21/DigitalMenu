import supabase from '../../../../lib/subabaseclient';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
    const { userId } = params;

    const url = new URL(req.url);
    const dateParam = url.searchParams.get('date') || new Date().toISOString().split('T')[0];

    const startDate = new Date(dateParam);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(dateParam);
    endDate.setHours(23, 59, 59, 999);

    try {
        // Fetch the orders for the given user and date range
        const { data: orders, error: ordersError } = await supabase
            .from('orders')
            .select('*')
            .eq('user_id', userId)
            .gte('created_at', startDate.toISOString())
            .lte('created_at', endDate.toISOString());

        if (ordersError) {
            console.error('Error fetching orders:', ordersError);
            return NextResponse.json({ message: 'Error fetching orders.' }, { status: 500 });
        }

        // Fetch total order count
        const { count: totalOrdersCount, error: totalCountError } = await supabase
            .from('orders')
            .select('*', { count: 'exact' })
            .eq('user_id', userId)
            .gte('created_at', startDate.toISOString())
            .lte('created_at', endDate.toISOString());

        if (totalCountError) {
            console.error('Error fetching total orders count:', totalCountError);
            return NextResponse.json({ message: 'Error fetching total orders count.' }, { status: 500 });
        }

        // Fetch pending order count
        const { count: pendingOrdersCount, error: pendingCountError } = await supabase
            .from('orders')
            .select('*', { count: 'exact' })
            .eq('user_id', userId)
            .gte('created_at', startDate.toISOString())
            .lte('created_at', endDate.toISOString())
            .eq('order_progress', 'N/A');

        if (pendingCountError) {
            console.error('Error fetching pending orders count:', pendingCountError);
            return NextResponse.json({ message: 'Error fetching pending orders count.' }, { status: 500 });
        }

        // Fetch delivered order count
        const { count: deliveredOrdersCount, error: deliveredCountError } = await supabase
            .from('orders')
            .select('*', { count: 'exact' })
            .eq('user_id', userId)
            .gte('created_at', startDate.toISOString())
            .lte('created_at', endDate.toISOString())
            .eq('order_progress', 'Ready to Eat');

        if (deliveredCountError) {
            console.error('Error fetching delivered orders count:', deliveredCountError);
            return NextResponse.json({ message: 'Error fetching delivered orders count.' }, { status: 500 });
        }

        // Return both order details and counts in the response
        return NextResponse.json({
            orders,
            counts: {
                totalOrders: totalOrdersCount || 0,
                pendingOrders: pendingOrdersCount || 0,
                deliveredOrders: deliveredOrdersCount || 0,
            },
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return NextResponse.error();
    }
}