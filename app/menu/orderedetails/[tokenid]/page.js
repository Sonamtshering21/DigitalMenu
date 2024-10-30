"use client"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const TrackerPage = () => {
  const router = useRouter();
  const { tokenid } = router.query; // Get the token ID from the query params
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (tokenid) {
      const fetchOrderDetails = async () => {
        try {
          const response = await fetch(`/api/orders/${tokenid}`); // Adjust the API endpoint as needed
          if (!response.ok) {
            throw new Error('Failed to fetch order details');
          }
          const data = await response.json();
          setOrderDetails(data);
        } catch (err) {
          console.error(err);
          setError('Error fetching order details.');
        } finally {
          setLoading(false);
        }
      };

      fetchOrderDetails();
    }
  }, [tokenid]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Order Tracking for Token ID: {tokenid}</h1>
      {orderDetails ? (
        <div>
          <p>Status: {orderDetails.status}</p>
          <p>Items: {orderDetails.items.map(item => item.name).join(', ')}</p>
          {/* Add more details as needed */}
        </div>
      ) : (
        <p>No order found with this Token ID.</p>
      )}
    </div>
  );
};

export default TrackerPage;
