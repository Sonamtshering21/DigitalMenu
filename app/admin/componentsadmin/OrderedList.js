'use client';
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

const OrderedListPage = () => {
    const { data: session, status } = useSession(); // Get the current session
    const [orders, setOrders] = useState([]); // State to store orders
    const userId = session?.user?.id; // Get user ID from the session

    useEffect(() => {
        const fetchOrders = async () => {
            if (!userId) return; // Exit if userId is not available
            try {
                const response = await fetch(`/api/orders/${userId}`); // Fetch orders for the user
                if (response.ok) {
                    const data = await response.json();
                    setOrders(data); // Update orders state
                } else {
                    console.error('Failed to fetch orders');
                }
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        fetchOrders(); // Call the function to fetch orders
    }, [userId]); // Re-run effect if userId changes

    // Loading state
    if (status === "loading") {
        return <p>Loading...</p>;
    }
    
    

    // Function to update order status or progress based on token
    const updateOrderField = async (tokenId, field, value) => {
        try {
            const response = await fetch(`/api/orders/token/${tokenId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ [field]: value }),
            });
    
            if (response.ok) {
                // Update the local state to reflect the change
                setOrders((prevOrders) =>
                    prevOrders.map((order) =>
                        order.token === tokenId ? { ...order, [field]: value } : order
                    )
                );
            } else {
                console.error(`Failed to update order ${field}`);
            }
        } catch (error) {
            console.error(`Error updating order ${field}:`, error);
        }
    };

    return (
        <div>
            <p>Track Order: Enter Token No</p>
            {orders.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>Si No.</th>
                            <th>Token Id</th>
                            <th>Table Number</th>
                            <th>Created At</th>
                            <th>Selected Items</th>
                            <th>Status</th>
                            <th>Progress</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order, index) => (
                            <tr key={order.id}>
                                <td>{index + 1}</td>
                                <td>{order.token}</td>
                                <td>{order.table_number}</td>
                                <td>{new Date(order.created_at).toLocaleString()}</td>
                                <td>
                                    <ul>
                                        {order.selected_items.map(item => (
                                            <li key={item.id}>
                                                <img
                                                    src={item.image_url}
                                                    alt={item.dish_name}
                                                    style={{ width: '50px', height: '50px', marginRight: '10px' }}
                                                />
                                                <strong>{item.dish_name}</strong> - 
                                                {item.quantity} x ${item.price}
                                            </li>
                                        ))}
                                    </ul>
                                </td>
                                <td>
                                    {/* Make status clickable */}
                                    {order.order_status === 'N/A' ? (
                                        <span
                                            onClick={() => updateOrderField(order.token, 'order_status', 'Confirmed')}
                                            style={{ color: 'blue', cursor: 'pointer' }}
                                        >
                                            N/A
                                        </span>
                                    ) : (
                                        order.order_status
                                    )}
                                </td>
                                <td>
                                    {/* Make progress clickable */}
                                    {order.order_progress === 'N/A' ? (
                                        <span
                                            onClick={() => updateOrderField(order.token, 'order_progress', 'Ready to Eat')}
                                            style={{ color: 'blue', cursor: 'pointer' }}
                                        >
                                            N/A
                                        </span>
                                    ) : (
                                        order.order_progress
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No orders found.</p>
            )}
            <style jsx>{`
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 20px;
                }
                th, td {
                    border: 1px solid #ddd;
                    padding: 8px;
                    text-align: left;
                }
                th {
                    background-color: #f2f2f2;
                }
                img {
                    vertical-align: middle;
                }
            `}</style>
        </div>
    );
};

export default OrderedListPage;
