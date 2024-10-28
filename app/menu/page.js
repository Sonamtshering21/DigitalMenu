/*
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation'; 
import { useSelectedItems } from '../context/SelectedItemsContext';  
import Image from 'next/image';
import Link from 'next/link';
import styles from './menu.module.css';

const MenuPage = () => {
  const { selectedItems, setSelectedItems } = useSelectedItems();
  const [menuItems, setMenuItems] = useState([]);
  const [showError, setShowError] = useState(false);
  const [tableNumber, setTableNumber] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get table number from the URL
  useEffect(() => {
    const tableParam = searchParams.get('table');
    if (tableParam) {
      setTableNumber(tableParam);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await fetch('/api/menu');
        const data = await response.json();
        setMenuItems(data.map(item => ({ ...item, price: parseFloat(item.price) || 0 })));
      } catch (error) {
        console.error('Error fetching menu items:', error);
      }
    };
    fetchMenuItems();
  }, []);

  const handleAddToOrder = (item, quantity) => {
    if (quantity <= 0) {
      setShowError(true);
      return;
    }

    const existingItem = selectedItems.find(selected => selected.id === item.id);
    if (existingItem) {
      setSelectedItems(prevItems =>
        prevItems.map(selected =>
          selected.id === item.id
            ? { ...existingItem, quantity: existingItem.quantity + quantity }
            : selected
        )
      );
    } else {
      setSelectedItems(prevItems => [...prevItems, { ...item, quantity }]);
    }

    setShowError(false);
  };

  const handleSubmit = () => {
    router.push(`/menu/selectedmenu?table=${tableNumber}`);
  };

  return (
    <div className={styles.menuarea}>
      <h1>Our Menu</h1>
      <label>
        Table Number:
        <input
          type="text"
          value={tableNumber}
          onChange={(e) => setTableNumber(e.target.value)}
          placeholder="Enter table number"
        />
      </label>
      {showError && <p style={{ color: 'red' }}>Please enter a valid quantity.</p>}
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
              <td><Image src={item.image_url || "/placeholder-image.jpg"} alt={item.name} width={100} height={100} /></td>
              <td><Link href={`/menu/${item.id}`}>{item.dish_name}</Link></td>
              <td>{item.description}</td>
              <td>
                <input type="number" min="1" defaultValue="1" id={`quantity-${item.id}`} />
              </td>
              <td>${item.price.toFixed(2)}</td>
              <td>
                <button onClick={() => {
                  const quantity = parseInt(document.getElementById(`quantity-${item.id}`).value) || 1;
                  handleAddToOrder(item, quantity);
                }}>
                  +
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className={styles.btn} onClick={handleSubmit}>View</button>
    </div>
  );
};

export default MenuPage;
*/
// Ensure this is inside your `app/menu/page.js` file if using the new app structure

'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation'; 
import { useSelectedItems } from '../context/SelectedItemsContext';  
import Image from 'next/image';
import Link from 'next/link';
import styles from './menu.module.css';

const MenuPage = () => {
  const { selectedItems, setSelectedItems } = useSelectedItems();
  const [menuItems, setMenuItems] = useState([]);
  const [showError, setShowError] = useState(false);
  const [tableNumber, setTableNumber] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get table number from the URL
  useEffect(() => {
    const tableParam = searchParams.get('table');
    if (tableParam) {
      setTableNumber(tableParam);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await fetch('/api/menu');
        const data = await response.json();
        setMenuItems(data.map(item => ({ ...item, price: parseFloat(item.price) || 0 })));
      } catch (error) {
        console.error('Error fetching menu items:', error);
      }
    };
    fetchMenuItems();
  }, []);

  const handleAddToOrder = (item, quantity) => {
    if (quantity <= 0) {
      setShowError(true);
      return;
    }

    const existingItem = selectedItems.find(selected => selected.id === item.id);
    if (existingItem) {
      setSelectedItems(prevItems =>
        prevItems.map(selected =>
          selected.id === item.id
            ? { ...existingItem, quantity: existingItem.quantity + quantity }
            : selected
        )
      );
    } else {
      setSelectedItems(prevItems => [...prevItems, { ...item, quantity }]);
    }

    setShowError(false);
  };

  const handleSubmit = () => {
    if (!tableNumber) {
      setShowError(true); // Show an error if table number is not valid
      return;
    }
    router.push(`/menu/selectedmenu?table=${tableNumber}`);
  };

  return (
    <div className={styles.menuarea}>
      <h1>Our Menu</h1>
      <label>
        Table Number:
        <input
          type="text"
          value={tableNumber}
          onChange={(e) => setTableNumber(e.target.value)}
          placeholder="Enter table number"
        />
      </label>
      {showError && <p style={{ color: 'red' }}>Please enter a valid quantity.</p>}
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
                <Image src={item.image_url || "/placeholder-image.jpg"} alt={item.name} width={100} height={100} />
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
                }}>
                  +
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className={styles.btn} onClick={handleSubmit}>View</button>
    </div>
  );
};

// Wrap your component in Suspense at the point of rendering in the app's directory
export default function MenuPageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MenuPage />
    </Suspense>
  );
}
