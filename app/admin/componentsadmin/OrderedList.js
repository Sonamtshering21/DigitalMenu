'use client';
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import style from './adminstyle/OrderedList.module.css';

const OrderedListPage = () => {
    const { data: session, status } = useSession(); // Get the current session
    const [orders, setOrders] = useState([]); // State to store all orders
    const [filteredOrders, setFilteredOrders] = useState([]); // State to store filtered orders based on search
    const [orderCounts, setOrderCounts] = useState({ totalOrders: 0, deliveredOrders: 0, pendingOrders: 0 }); // State to store counts
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); // State to store selected date
    const [searchToken, setSearchToken] = useState(''); // State for search input
    const userId = session?.user?.id; // Get user ID from the session

    useEffect(() => {
        const fetchOrders = async () => {
            if (!userId) return; // Exit if userId is not available
            try {
                const response = await fetch(`/api/orders/${userId}?date=${selectedDate}`); // Fetch orders for the user based on the selected date
                if (response.ok) {
                    const data = await response.json();
                    setOrders(data.orders); // Update orders state
                    setOrderCounts(data.counts); // Update order counts state
                    setFilteredOrders(data.orders); // Initialize filtered orders
                } else {
                    console.error('Failed to fetch orders');
                }
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        fetchOrders(); // Call the function to fetch orders
    }, [userId, selectedDate]); // Re-run effect if userId or selectedDate changes

    useEffect(() => {
        // Filter orders based on search input
        if (searchToken) {
            const lowercasedToken = searchToken.toLowerCase();
            const filtered = orders.filter(order => 
                order.token.toString().toLowerCase().includes(lowercasedToken)
            );
            setFilteredOrders(filtered); // Update filtered orders state
        } else {
            setFilteredOrders(orders); // Reset to all orders if search input is empty
        }
    }, [searchToken, orders]); // Re-run effect if searchToken or orders change

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
                setFilteredOrders((prevOrders) =>
                    prevOrders.map((order) =>
                        order.token === tokenId ? { ...order, [field]: value } : order
                    )
                );
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

    
     // Format: MM/DD/YYYY

    return (
        <div>
            <div className={style.statustop}>
                <div>
                    <p>Search Order:</p>
                    <input
                        type="text"
                        value={searchToken}
                        onChange={(e) => setSearchToken(e.target.value)} // Update search input
                        placeholder="Enter Token Id"
                    />
                    </div>
                    <div>
                    <p>Order Date:</p>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)} // Update selected date
                    />
                </div>
                <div className={style.statusdetails}>
                    <p>Total Orders: <span>{orderCounts.totalOrders}</span></p>
                    <p>Delivered Orders: <span>{orderCounts.deliveredOrders}</span></p>
                    <p>Pending Orders: <span>{orderCounts.pendingOrders}</span></p>
                </div>
            </div>

            {filteredOrders.length > 0 ? (
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
                        {filteredOrders.map((order, index) => (
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
