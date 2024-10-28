'use client';

import React, { useState, useEffect } from 'react';
import { useSelectedItems } from '../../context/SelectedItemsContext';
import Image from 'next/image';
import styles from '../menu.module.css';

const SelectedMenuPage = () => {
  const { selectedItems, setSelectedItems } = useSelectedItems();
  const [loading, setLoading] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [token, setToken] = useState('');
  const [enteredToken, setEnteredToken] = useState(''); // State for entered token
  const [showTokenPrompt, setShowTokenPrompt] = useState(false); // State to control token prompt visibility

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
    setSelectedItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const handleUpdateQuantity = (id, quantity) => {
    setSelectedItems(prevItems =>
      prevItems.map(item => item.id === id ? { ...item, quantity } : item)
    );
  };

  // Submit handler
  const handleSubmit = async () => {
    if (selectedItems.length === 0) {
      setSubmitMessage('No items selected to submit.');
      return;
    }

    // Show the token prompt to the user
    setShowTokenPrompt(true);
  };

  const handleConfirmToken = async () => {
    // Check if the entered token matches the generated token
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
          token, // Customer's unique session token
          selectedItems, // Items selected by the customer
          tableNumber: '5', // Replace with actual table number logic if needed
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitMessage('Order saved successfully!');
        setSelectedItems([]); // Clear items after successful submission
        sessionStorage.removeItem('customerToken'); // Clear token if not needed after submission
        setEnteredToken(''); // Clear entered token
        setShowTokenPrompt(false); // Hide the token prompt
      } else {
        setSubmitMessage(`Error saving order: ${result.error}`);
      }
    } catch (error) {
      setSubmitMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Your Selected Items</h1>

      {/* Display the unique token ID for the customer */}
      {token && (
        <div style={{ backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '5px' }}>
          <p>Your unique token ID: <strong>{token}</strong></p>
          <p>Please remember this token to view or update your order.</p>
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
              {selectedItems.map(item => (
                <tr key={item.id}>
                  <td>
                    <Image src={item.image_url || "/placeholder-image.jpg"} alt={item.dish_name} width={100} height={100} />
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

          {/* Submit button to save selected items */}
          <button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Order'}
          </button>

          {submitMessage && <p>{submitMessage}</p>}

          {/* Token input prompt modal */}
          {showTokenPrompt && (
            <div style={{
              position: 'fixed',
              top: '20%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              padding: '20px',
              backgroundColor: '#fff',
              boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
              zIndex: 1000,
              borderRadius: '8px',
            }}>
              <h2>Confirm Your Token</h2>
              <label htmlFor="tokenInput">Enter your token:</label>
              <input
                type="text"
                id="tokenInput"
                value={enteredToken}
                onChange={(e) => setEnteredToken(e.target.value)}
              />
              <div style={{ marginTop: '10px' }}>
                <button onClick={handleConfirmToken} disabled={loading}>
                  Confirm
                </button>
                <button onClick={() => setShowTokenPrompt(false)}>Cancel</button>
              </div>
            </div>
          )}
        </>
      ) : (
        <p>No items selected.</p>
      )}
    </div>
  );
};

export default SelectedMenuPage;
