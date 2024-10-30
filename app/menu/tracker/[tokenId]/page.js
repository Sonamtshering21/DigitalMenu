"use client";
import React, { useEffect, useState, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from '../../menu.module.css'; // Ensure you have the correct styles

const TokenPage = () => {
    const router = useRouter();
    const { tokenId } = useParams();
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

    return (
        <div className={styles.menuarea}>
            <h1>Order Details for Token ID: {tokenId}</h1>

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
                        <th>Status</th>
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
                            <td>N/A</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Table for Order Details */}
            <h2>Order Details</h2>
            <table className={styles.table}>
                <tbody>
                    <tr>
                        <td><strong>Table Number:</strong></td>
                        <td>{order.table_number}</td>
                    </tr>
                    <tr>
                        <td><strong>User ID:</strong></td>
                        <td>{order.user_id}</td>
                    </tr>
                </tbody>
            </table>

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
