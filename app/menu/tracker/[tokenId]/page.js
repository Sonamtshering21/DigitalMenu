"use client"; // Ensure this component is treated as a client component

import React, { useEffect, useState, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from '../../menu.module.css';

const TokenPage = () => {
    const router = useRouter();
    const { tokenId } = useParams(); // Extract tokenId from the URL parameters
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            if (tokenId) {
                try {
                    const response = await fetch(`/api/tracker/${tokenId}`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch order');
                    }
                    const result = await response.json();
                    setOrder(result.order);
                } catch (error) {
                    console.error('Error fetching order:', error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchOrder();
    }, [tokenId]);

    const handleCancelItem = async (itemId) => {
        const token = tokenId; // Use tokenId from URL
        try {
            const response = await fetch(`/api/orders/delete/${token}/${itemId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const result = await response.json();

            if (result.success) {
                // Update the order state to remove the canceled item
                setOrder((prevOrder) => ({
                    ...prevOrder,
                    selected_items: prevOrder.selected_items.filter(item => item.id !== itemId),
                }));
            } else {
                console.error('Error canceling item:', result.error);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!order) {
        return <p>No order found for token ID: {tokenId}</p>;
    }

    // Handle selected_items based on its type
    let selectedItems = [];
    if (order.selected_items) {
        if (typeof order.selected_items === 'string') {
            try {
                selectedItems = JSON.parse(order.selected_items); // Parse it if it's a string
            } catch (error) {
                console.error("Failed to parse selected_items:", error);
            }
        } else {
            selectedItems = order.selected_items; // Already an object
        }
    }

    // Calculate the total price
    const totalPrice = selectedItems.reduce((total, item) => {
        return total + item.price * item.quantity;
    }, 0);

    return (
        <div className={styles.menuarea}>
            <h1>Order Details for Token ID: <strong>{tokenId}</strong></h1>

            {/* Table for Selected Items */}
            <h2>Ordered Status</h2>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Dish Name</th>
                        <th>Description</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        {order.order_status === 'N/A' && (
                            <th>Action</th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {selectedItems.map((item) => (
                        <tr key={item.id}>
                            <td>
                                <Image 
                                    src={item.image_url || "/placeholder-image.jpg"} 
                                    alt={item.dish_name} 
                                    width={100} 
                                    height={100} 
                                />
                            </td>
                            <td>{item.dish_name}</td>
                            <td>{item.description}</td>
                            <td>{item.quantity}</td>
                            <td>${item.price.toFixed(2)}</td>
                            
                                {order.order_status === 'N/A' && (
                                   <td> <button onClick={() => handleCancelItem(item.id)} >
                                        Cancel
                                    </button></td>
                                )}
                            
                        </tr>
                    ))}
                </tbody>
            </table>
            {order.order_status === 'N/A' && (
               <p>To add new items, cancel the previous token and make your selection again</p>
                                )}

            {/* Display Total Price */}
            <p>
                <strong>Status:</strong> {order.order_status === "N/A" ? 'Pending' : '✅Approved'}
            </p>
            {order.order_status === 'Confirmed' ? (
                <p>Progress: {order.order_progress === "N/A" ? 'Preparing' : 'Ready to Eat'}</p>
            ) : null}
            <p>Once Approved you cannot cancel order</p>
            <p className={styles.totalPrice}><strong>Total Price:</strong> ${totalPrice.toFixed(2)}</p>

            {/* Table for Order Details */}
            <h2>Order Details</h2>
            <table className={styles.table}>
                <tbody>
                    <tr>
                        <td><strong>Table Number:</strong></td>
                        <td>{order.table_number}</td>
                    </tr>
                    <tr>
                        <td><strong>Payment:</strong></td>
                        <td>{order.payment_status=='N/A' ? 'Not Done' : "Done"}</td>
                    </tr>
                </tbody>
            </table>
            <p>{order.payment_status=='Confirmed' ? 'Thank you for dining at our restaurant! We hope you enjoyed our meal and look forward to welcoming you back soon!' : null}</p>

            <button onClick={() => router.back()} className={styles.btn}>Go Back</button>
        </div>
    );
};

const WrappedTokenPage = () => (
    <Suspense fallback={<div>Loading...</div>}>
        <TokenPage />
    </Suspense>
);

export default WrappedTokenPage;
