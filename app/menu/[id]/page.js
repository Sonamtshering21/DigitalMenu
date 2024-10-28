'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
// Import your styles
import styles from '../menu.module.css';
import Image from 'next/image';

const MenuItemPage = () => {
  const router = useRouter();
  const { id } = router.query; // Get the id from the query params
  const [item, setItem] = useState(null);
  
  useEffect(() => {
    if (id) {
      const fetchMenuItem = async () => {
        try {
          const response = await fetch(`/api/menu/${id}`); // Fetch data for the specific menu item
          const data = await response.json();
          setItem(data);
        } catch (error) {
          console.error('Error fetching menu item:', error);
        }
      };

      fetchMenuItem();
    }
  }, [id]);

  if (!item) {
    return <p>Loading...</p>; // Show loading state while fetching data
  }

  return (
    <div className={styles.menuDetail}>
      <h1>{item.dish_name}</h1>
      <Image src={item.image_url || "/placeholder-image.jpg"} alt={item.dish_name} width={300} height={300} />
      <p><strong>Description:</strong> {item.description}</p>
      <p><strong>Price:</strong> ${item.price.toFixed(2)}</p>
      {/* Add additional details or actions here */}
      <button onClick={() => router.back()}>Back to Menu</button>
    </div>
  );
};

export default MenuItemPage;
