"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSelectedItems } from '../../context/SelectedItemsContext';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from '../menu.module.css';

const SelectedMenuPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tableNumber = searchParams.get('table'); // Retrieve tableNumber from URL
  const userId = searchParams.get('user_id');
  const { selectedItems, setSelectedItems } = useSelectedItems();
  const [loading, setLoading] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [token, setToken] = useState('');
  const [enteredToken, setEnteredToken] = useState('');
  const [showTokenPrompt, setShowTokenPrompt] = useState(false);

  // Generate a unique token for each customer session
  useEffect(() => {
    const generateToken = () => Math.floor(Math.random() * 100000).toString();
    const storedToken = sessionStorage.getItem('customerToken');
    if (!storedToken) {
      const newToken = generateToken();
      sessionStorage.setItem('customerToken', newToken);
      setToken(newToken);
    } else {
      setToken(storedToken);
    }
  }, []);

  const handleRemoveItem = (id) => {
    setSelectedItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const handleUpdateQuantity = (id, quantity) => {
    setSelectedItems((prevItems) =>
      prevItems.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const handleSubmit = async () => {
    if (selectedItems.length === 0) {
      setSubmitMessage('No items selected to submit.');
      return;
    }

    // Show the token prompt to the user
    setShowTokenPrompt(true);
  };

  const handleConfirmToken = async () => {
    if (enteredToken !== token) {
      setSubmitMessage('Token does not match. Please enter the correct token.');
      return;
    }

    setLoading(true);
    setSubmitMessage('');

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          selectedItems,
          tableNumber,
          userId,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitMessage('Order saved successfully!');
        setSelectedItems([]);
        sessionStorage.removeItem('customerToken');
        setEnteredToken('');
        setShowTokenPrompt(false);
      } else {
        setSubmitMessage(`Error saving order: ${result.error}`);
      }
    } catch (error) {
      setSubmitMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Calculate the total price of selected items
  const totalPrice = selectedItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div className={styles.selectedmenu}>
      <h1>Your Selected Items</h1>

      {token && (
        <div style={{ backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '5px' }}>
          <p>Your unique token ID: <strong>{token}</strong></p>
          <p>Please <strong>Save/Copy/Screenshot</strong> this token to view or update your order.</p>
        </div>
      )}

      {selectedItems.length > 0 ? (
        <>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Image</th>
                <th>Dish Name</th>
                <th>Description</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {selectedItems.map((item) => (
                <tr key={item.id}>
                  <td>
                    <Image src={item.image_url || '/placeholder-image.jpg'} alt={item.dish_name} width={100} height={100} />
                  </td>
                  <td>{item.dish_name}</td>
                  <td>{item.description}</td>
                  <td>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleUpdateQuantity(item.id, parseInt(e.target.value))}
                    />
                  </td>
                  <td>${(item.price * item.quantity).toFixed(2)}</td>
                  <td>
                    <button onClick={() => handleRemoveItem(item.id)}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Display the total price below the table */}
          <div className={styles.totalPrice}>
            <strong>Total Price: </strong>${totalPrice.toFixed(2)}
          </div>

          <button onClick={handleSubmit} disabled={loading} className={styles.btn}>
            {loading ? 'Submitting...' : 'Submit Order'}
          </button>

          {submitMessage && <p>{submitMessage}</p>}

          {showTokenPrompt && (
            <div style={{
              position: 'fixed',
              top: '80%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              padding: '20px',
              backgroundColor: '#fff',
              boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
              zIndex: 1000,
              borderRadius: '8px',
            }}>
              <h2>Confirm Your Token</h2>
              <label htmlFor="tokenInput">Enter your token: </label>
              <input
                type="text"
                id="tokenInput"
                value={enteredToken}
                style={{
                  border: '0.1rem solid #000',  // Customize color and thickness
                  borderRadius: '0.2rem',        // Optional: adds rounded corners
                  padding: '0.5rem',             // Optional: adds padding for better appearance
                }}
                onChange={(e) => setEnteredToken(e.target.value)}
              />
              <div style={{ marginTop: '10px' }}>
                <button className={styles.btn} onClick={handleConfirmToken} disabled={loading}>
                  Confirm
                </button>
                <button className={styles.btn} onClick={() => setShowTokenPrompt(false)}>Cancel</button>
              </div>
              
            </div>
            
          )}
        </>
      ) : (
        <><p>No items selected.</p>
        <button onClick={() => router.back()} className={styles.btn}>Go Back</button></>
      )}
    </div>
  );
};

// Wrap your component in Suspense
const SuspenseWrapper = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <SelectedMenuPage />
  </Suspense>
);

export default SuspenseWrapper;
