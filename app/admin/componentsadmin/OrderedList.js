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
                const response = await fetch(`/api/orders/${userId}`); // Fetch from the correct API endpoint
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

    return (
        <div>
            <h1>Your Orders</h1>
            {orders.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Table Number</th>
                            <th>Token</th>
                            <th>Created At</th>
                            <th>Selected Items</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.id}>
                                <td>{order.id}</td>
                                <td>{order.table_number}</td>
                                <td>{order.token}</td>
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
