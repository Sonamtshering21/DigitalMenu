'use client';
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import style from './adminstyle/OrderedList.module.css';
import Image from 'next/image';

const PaymentListPage = () => {
    const { data: session, status } = useSession();
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [orderCounts, setOrderCounts] = useState({
        totalOrders: 0,
        deliveredOrders: 0,
        pendingOrders: 0,
        paymentsOrders: 0,
        confirmedPayments: 0 // New field for confirmed payments
    });
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [searchToken, setSearchToken] = useState('');
    const userId = session?.user?.id;

    const [paymentMethodInput, setPaymentMethodInput] = useState({});
    const [transactionIdInput, setTransactionIdInput] = useState({});

    useEffect(() => {
        const fetchOrders = async () => {
            if (!userId) return;
            try {
                const response = await fetch(`/api/orders/${userId}?date=${selectedDate}`);
                if (response.ok) {
                    const data = await response.json();
                    setOrders(data.orders);

                    // Count orders based on different criteria
                    const confirmedPaymentsCount = data.orders.filter(
                        order => order.payment_status === 'Confirmed'
                    ).length;

                    setOrderCounts({
                        totalOrders: data.orders.length,
                        deliveredOrders: data.orders.filter(order => order.status === 'Delivered').length,
                        pendingOrders: data.orders.filter(order => order.status === 'N/A').length,
                        paymentsOrders: data.orders.filter(order => order.payment_status !== 'N/A').length,
                        confirmedPayments: confirmedPaymentsCount // Set confirmed payments count
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
        if (searchToken) {
            const lowercasedToken = searchToken.toLowerCase();
            const filtered = orders.filter(order => 
                order.token.toString().toLowerCase().includes(lowercasedToken)
            );
            setFilteredOrders(filtered);
        } else {
            setFilteredOrders(orders);
        }
    }, [searchToken, orders]);

    if (status === "loading") {
        return <p>Loading...</p>;
    }

    const updateOrderField = async (tokenId, field, value) => {
        try {
            const response = await fetch(`/api/orders/token/${tokenId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ [field]: value, source: 'paymentList' }),
            });

            if (response.ok) {
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

    const handlePaymentMethodSubmit = (token) => {
        const value = paymentMethodInput[token];
        if (value) {
            updateOrderField(token, 'payment_method', value);
            setPaymentMethodInput(prev => ({ ...prev, [token]: '' }));
        }
    };

    const handleTransactionIdSubmit = (token) => {
        const value = transactionIdInput[token];
        if (value) {
            updateOrderField(token, 'transaction_id', value);
            setTransactionIdInput(prev => ({ ...prev, [token]: '' }));
        }
    };

    const handleKeyDown = (e, token, field) => {
        if (e.key === 'Enter') {
            if (field === 'paymentMethod') {
                handlePaymentMethodSubmit(token);
            } else if (field === 'transactionId') {
                handleTransactionIdSubmit(token);
            }
        }
    };

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
                    <p>Confirmed Payments: <span>{orderCounts.confirmedPayments}</span></p>
                    <p>Pending Payments: <span>{orderCounts.totalOrders-orderCounts.confirmedPayments}</span></p>
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
                            <th>Total Amount</th>
                            <th>Payment Status</th>
                            <th>Payment Method</th>
                            <th>Transaction Id</th>
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
                                                    src={item.image_url}
                                                    alt={item.dish_name}
                                                    width={50}    // Numeric value for width
                                                    height={50}   // Numeric value for height
                                                    style={{ marginRight: '10px' }} // Optional margin styling
                                                />
                                                <strong>{item.dish_name}</strong> - 
                                                {item.quantity} x ${item.price}
                                            </li>
                                        ))}
                                    </ul>
                                </td>
                                <td>{order.total_amount}</td>
                                <td>
                                    {order.payment_status === 'N/A' ? (
                                        <span
                                            onClick={() => updateOrderField(order.token, 'payment_status', 'Confirmed')}
                                            style={{ color: 'blue', cursor: 'pointer' }}
                                        >
                                            N/A
                                        </span>
                                    ) : (
                                        order.payment_status
                                    )}
                                </td>
                                <td>
                                    {order.payment_method === 'N/A' ? (
                                        <div>
                                            <input
                                                type="text"
                                                value={paymentMethodInput[order.token] || ''}
                                                onChange={(e) => setPaymentMethodInput(prev => ({ ...prev, [order.token]: e.target.value }))}
                                                onKeyDown={(e) => handleKeyDown(e, order.token, 'paymentMethod')} // Handle key down
                                                placeholder=""
                                            />
                                        </div>
                                    ) : (
                                        order.payment_method
                                    )}
                                </td>
                                <td>
                                    {order.transaction_id === 'N/A' ? (
                                        <div>
                                            <input
                                                type="text"
                                                value={transactionIdInput[order.token] || ''}
                                                onChange={(e) => setTransactionIdInput(prev => ({ ...prev, [order.token]: e.target.value }))}
                                                onKeyDown={(e) => handleKeyDown(e, order.token, 'transactionId')} // Handle key down
                                                placeholder=""
                                            />
                                        </div>
                                    ) : (
                                        order.transaction_id
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
                tr:hover {
                    background-color: #f5f5f5;
                }
                input {
                    width: 100%;
                    padding: 8px;
                    box-sizing: border-box;
               
                }
                input:focus {
                    border-color: #007bff;
                    outline: none;
                }
            `}</style>
        </div>
    );
};

export default PaymentListPage;
