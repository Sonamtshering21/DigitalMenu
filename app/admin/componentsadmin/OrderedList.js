"use client"
import React, { useEffect, useState } from 'react';

import { useSession } from 'next-auth/react';
import style from './adminstyle/OrderedList.module.css';
import Image from 'next/image';

const OrderedListPage = () => {
    const { data: session, status } = useSession();
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [orderCounts, setOrderCounts] = useState({
        totalOrders: 0,
        deliveredOrders: 0,
        pendingOrders: 0,
        paymentsOrders: 0,
        confirmedPayments: 0
    });
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [searchToken, setSearchToken] = useState('');
    const userId = session?.user?.id;

    useEffect(() => {
        const fetchOrders = async () => {
            if (!userId) return;
            try {
                const response = await fetch(`/api/orders/${userId}?date=${selectedDate}`);
                if (response.ok) {
                    const data = await response.json();
                    setOrders(data.orders);

                    setOrderCounts({
                        totalOrders: data.orders.length,
                        deliveredOrders: data.orders.filter(order => order.order_status === 'Confirmed').length,
                        pendingOrders: data.orders.filter(order => order.order_progress !== 'N/A').length,
                        paymentsOrders: data.orders.filter(order => order.payment_status !== 'N/A').length,
                        confirmedPayments: data.orders.filter(order => order.payment_status === 'Confirmed').length
                    });

                    setFilteredOrders(data.orders);
                } else {
                    console.error('Failed to fetch orders');
                }
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        fetchOrders();
    }, [userId, selectedDate]);

    useEffect(() => {
        const lowercasedToken = searchToken.toLowerCase();
        const filtered = orders.filter(order => 
            order.token.toString().toLowerCase().includes(lowercasedToken)
        );
        setFilteredOrders(searchToken ? filtered : orders);
    }, [searchToken, orders]);

    const updateOrderField = async (tokenId, field, value) => {
        try {
            const response = await fetch(`/api/orders/token/${tokenId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ [field]: value, source: 'orderedList' }),
            });

            if (response.ok) {
                setFilteredOrders(prevOrders =>
                    prevOrders.map(order => 
                        order.token === tokenId ? { ...order, [field]: value } : order
                    )
                );
                setOrders(prevOrders =>
                    prevOrders.map(order => 
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

    if (status === "loading") {
        return <p>Loading...</p>; // Consider adding a spinner or skeleton here
    }

    return (
        <div>
            <div className={style.statustop}>
                <div>
                    <p>Search Order:</p>
                    <input
                        type="text"
                        value={searchToken}
                        onChange={(e) => setSearchToken(e.target.value)}
                        placeholder="Enter Token Id"
                    />
                </div>
                <div>
                    <p>Order Date:</p>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                    />
                </div>
                <div className={style.statusdetails}>
                    <p>Total Orders: <span>{orderCounts.totalOrders}</span></p>
                    <p>Delivered Orders: <span>{orderCounts.pendingOrders}</span></p>
                    <p>Pending Orders: <span>{Number(orderCounts.totalOrders) - Number(orderCounts.pendingOrders)}</span></p>
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
                                                <Image
    src={item.image_url || '/noimage.jpgs'} // Provide a fallback image if the URL is invalid
    alt={item.dish_name}
    width={50}
    height={50}
    style={{ marginRight: '10px' }}
/>
                                                <strong>{item.dish_name}</strong> - 
                                                {item.quantity} x ${item.price}
                                            </li>
                                        ))}
                                    </ul>
                                </td>
                                <td>
                                    <button
                                        onClick={() => order.order_status === 'N/A' && updateOrderField(order.token, 'order_status', 'Confirmed')}
                                        style={{ color: order.order_status === 'N/A' ? 'blue' : 'black' }}
                                        aria-label={`Change status of order ${order.token}`}
                                    >
                                        {order.order_status === 'N/A' ? 'N/A' : order.order_status}
                                    </button>
                                </td>
                                <td>
                                    <button
                                        onClick={() => order.order_progress === 'N/A' && updateOrderField(order.token, 'order_progress', 'Ready to Eat')}
                                        style={{ color: order.order_progress === 'N/A' ? 'blue' : 'black' }}
                                        aria-label={`Change progress of order ${order.token}`}
                                    >
                                        {order.order_progress === 'N/A' ? 'N/A' : order.order_progress}
                                    </button>
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
