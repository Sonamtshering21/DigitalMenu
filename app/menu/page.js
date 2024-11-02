"use client"
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation'; 
import { useSelectedItems } from '../context/SelectedItemsContext';
import Image from 'next/image';
import Link from 'next/link';
import styles from './menu.module.css';

const MenuPage = () => {
    const { selectedItems, setSelectedItems } = useSelectedItems();
    const [menuItems, setMenuItems] = useState([]);
    const [userId, setUserId] = useState('');
    const [tableNumber, setTableNumber] = useState('');
    const [error, setError] = useState(null);
    const [showError, setShowError] = useState(false);
    const [tokenId, setTokenId] = useState('');
    const [companyDetails, setCompanyDetails] = useState(null);
    
    const router = useRouter();
    const searchParams = useSearchParams();
    const scannedUserId = searchParams.get('user_id');
    const scannedTableNumber = searchParams.get('table');

    useEffect(() => {
        if (scannedUserId) {
            setUserId(scannedUserId);
        }
        if (scannedTableNumber) {
            setTableNumber(scannedTableNumber);
        }
    }, [scannedUserId, scannedTableNumber]);

    useEffect(() => {
        const fetchMenuItems = async () => {
            const idToUse = scannedUserId || userId;
            const tableToUse = scannedTableNumber || tableNumber;

            if (!idToUse || !tableToUse) return;

            try {
                const response = await fetch(`/api/menu?user_id=${idToUse}&table_no=${tableToUse}`);
                if (!response.ok) throw new Error('Network response was not ok');

                const data = await response.json();
                setMenuItems(data.map(item => ({ ...item, price: parseFloat(item.price) || 0 })));
                setError(null);
            } catch (error) {
                console.error('Error fetching menu items:', error);
                setError('Error fetching menu items. Please try again later.');
            }
        };

        fetchMenuItems();
    }, [userId, tableNumber, scannedUserId, scannedTableNumber]);

    const handleAddToOrder = (item, quantity) => {
        if (quantity <= 0) {
            alert('Quantity must be greater than zero.');
            return;
        }

        setSelectedItems(prevItems => {
            const existingItem = prevItems.find(selected => selected.id === item.id);
            if (existingItem) {
                return prevItems.map(selected =>
                    selected.id === item.id
                        ? { ...existingItem, quantity: existingItem.quantity + quantity }
                        : selected
                );
            } else {
                return [...prevItems, { ...item, quantity }];
            }
        });
    };

    const handleSubmit = () => {
        if (!tableNumber) {
            setShowError(true);
            return;
        }

        setShowError(false);
        router.push(`/menu/selectedmenu?user_id=${userId}&table=${tableNumber}`);
    };
    useEffect(() => {
        const fetchCompanyDetails = async () => {
            if (!userId) return;

            try {
                const response = await fetch(`/api/company?user_id=${userId}`);
                if (!response.ok) throw new Error('Failed to fetch company details');

                const data = await response.json();
                setCompanyDetails(data);
            } catch (error) {
                console.error('Error fetching company details:', error);
                setError('Error fetching company details. Please try again later.');
            }
        };

        fetchCompanyDetails();
    }, [userId]);

    const handleSubmittoken = () => {
        // Logic to track the order using the token ID
        console.log('Tracking order for token ID:', tokenId);
        if (!tokenId) {
            setShowError(true);
            return;
        }

        setShowError(false);
        // Redirect to order details using the token ID
        router.push(`/menu/tracker/${tokenId}`); // Change this line to link to the dynamic route
    };

    return (
        <div className={styles.menuarea}>
            <h1><strong>Our Menu</strong></h1>
              {/* Display company details */}
              {companyDetails && (
                <div>
                    <h2>Welcome to <strong>{companyDetails.company_name}</strong></h2>
                    <p>{companyDetails.social_links}</p>
                </div>
            )}
            {(!scannedUserId || !scannedTableNumber) && (
                <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                    <input
                        type="text"
                        placeholder="Enter Company ID"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Enter Table Number"
                        value={tableNumber}
                        onChange={(e) => setTableNumber(e.target.value)}
                        required
                    />
                    <button type="submit">View Menu</button>
                </form>
            )}
            {error && <div className={styles.error}>{error}</div>}
            {showError && <div className={styles.error}>Please enter a valid Company Id and Table No.</div>}
            
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Dish Name</th>
                        <th>Description</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {menuItems.map(item => (
                        <tr key={item.id}>
                            <td>
                                <Image src={item.image_url || "/placeholder-image.jpg"} alt={item.dish_name} width={100} height={100} />
                            </td>
                            <td>
                                <Link href={`/menu/${item.id}`}>{item.dish_name}</Link>
                            </td>
                            <td>{item.description}</td>
                            <td>
                                <input type="number" min="1" defaultValue="1" id={`quantity-${item.id}`} />
                            </td>
                            <td>${item.price.toFixed(2)}</td>
                            <td>
                                <button onClick={() => {
                                    const quantity = parseInt(document.getElementById(`quantity-${item.id}`).value) || 1;
                                    handleAddToOrder(item, quantity);
                                }}>+</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            
            {/* Display selected items */}
            {selectedItems.length > 0 && (
                <div>
                    <h2>Selected Items</h2>
                    <ul>
                        {selectedItems.map(selected => (
                            <li key={selected.id}>
                                {selected.dish_name} - Quantity: {selected.quantity}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <button type="button" className={styles.btn} onClick={handleSubmit}>View</button>
            <div>
                <label htmlFor="tokenId">Order Status:</label>
                <input
                    type="text"
                    id="tokenId"
                    value={tokenId}
                    onChange={(e) => setTokenId(e.target.value)} // Use setTokenId directly
                    placeholder="Enter your token ID"
                    required
                />
                <button type="button" className={styles.btn} onClick={handleSubmittoken}>
                    Track Order
                </button>
            </div> 
            {/* Display company details */}
            {companyDetails && (
                <div className={styles.des}>
                    <p>{companyDetails.description}</p>
                    <p>Address: {companyDetails.address}</p>
                    <p>Contact: {companyDetails.contact_info}</p>
                </div>
            )}
        </div>
    );
};

const WrappedMenuPage = () => (
  <Suspense fallback={<div>Loading...</div>}>
      <MenuPage />
  </Suspense>
);

export default WrappedMenuPage;
