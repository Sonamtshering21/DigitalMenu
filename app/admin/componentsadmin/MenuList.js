'use client';
import { useSession } from 'next-auth/react';
import React, { useState, useEffect } from 'react';
//import Link from 'next/link';
import Image from 'next/image';
import styles from './adminstyle/MenuList.module.css';

const MenuList = () => {
  const { data: session } = useSession();
  const userId = session?.user?.id; // Retrieve user ID from session
  const [menuItems, setMenuItems] = useState([]);
  const [newItem, setNewItem] = useState({
    dish_name: '',
    description: '',
    price: '',
    image_url: ''
  });
  const [showForm, setShowForm] = useState(false); // State to control form visibility
  const [isEditingAll, setIsEditingAll] = useState(false); // State to track if all items are being edited
  const [changes, setChanges] = useState({}); // Track changes for each item

  useEffect(() => {
    const fetchMenuItems = async () => {
      if (userId) {
        try {
          const response = await fetch(`/api/menu?user_id=${userId}`);
          const data = await response.json();
          setMenuItems(data.map(item => ({ ...item, price: parseFloat(item.price) || 0 })));
        } catch (error) {
          console.error('Error fetching menu items:', error);
        }
      }
    };

    fetchMenuItems();
  }, [userId]);

  // Function to handle removing an item
  const handleRemove = async (id) => {
    try {
      const response = await fetch(`/api/menu?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMenuItems((prevItems) => prevItems.filter(item => item.id !== id));
        setChanges((prevChanges) => {
          const newChanges = { ...prevChanges };
          delete newChanges[id]; // Remove deleted item changes
          return newChanges;
        });
      } else {
        console.error('Failed to delete the item');
      }
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  // Function to handle adding a new menu item
  /*
  const handleAddItem = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/menu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...newItem, user_id: userId }),
      });

      if (response.ok) {
        const addedItem = await response.json();
        setMenuItems((prevItems) => [...prevItems, addedItem]);
        setNewItem({ dish_name: '', description: '', price: '', image_url: '' });
        setShowForm(false);
      } else {
        console.error('Failed to add the item');
      }
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };
  */
  const handleAddItem = async (e) => {
    e.preventDefault();
  
    // Validate the newItem object
    if (newItem.dish_name && newItem.price && newItem.image_url) {
      try {
        const response = await fetch('/api/menu', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...newItem, user_id: userId }),
        });
  
        if (response.ok) {
          const addedItem = await response.json();
          // Ensure price is set as a number
          const newMenuItem = { ...addedItem, price: parseFloat(addedItem.price) };
  
          setMenuItems((prevItems) => [...prevItems, newMenuItem]);
          setNewItem({ dish_name: '', description: '', price: '', image_url: '' });
          setShowForm(false);
        } else {
          console.error('Failed to add the item');
        }
      } catch (error) {
        console.error('Error adding item:', error);
      }
    } else {
      console.error('Please fill in all fields.');
    }
  };
  // Function to handle input changes and track changes
  const handleInputChange = (id, field, value) => {
    setMenuItems((prevItems) =>
      prevItems.map((item) => 
        item.id === id ? { ...item, [field]: value } : item
      )
    );
    
    setChanges((prevChanges) => ({
      ...prevChanges,
      [id]: {
        ...prevChanges[id],
        [field]: value,
      }
    }));
  };

  const handleSaveAllEdits = async () => {
    try {
      const itemsToUpdate = menuItems.map(item => ({
        id: item.id,
        user_id: item.user_id,
        dish_name: changes[item.id]?.dish_name || item.dish_name,
        description: changes[item.id]?.description || item.description,
        price: changes[item.id]?.price || item.price,
        image_url: changes[item.id]?.image_url || item.image_url,
      }));

      const response = await fetch('/api/menu', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(itemsToUpdate), // Ensure this is an array
      });

      if (response.ok) {
        // Update local state without full page reload
        setMenuItems((prevItems) => 
          prevItems.map(item => ({
            ...item,
            ...changes[item.id], // Update only the changed fields
          }))
        );
        setIsEditingAll(false); // Set editing state to false
        setChanges({}); // Clear changes after saving
      } else {
        const errorData = await response.json();
        console.error('Failed to update items:', errorData);
      }
    } catch (error) {
      console.error('Error saving changes:', error);
    }
  };
  
  return (
    <div>
      <h1>Menu Items</h1>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Image</th>
            <th>Dish Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {menuItems.map(item => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>
                <Image src={item.image_url || "/placeholder-image.jpg"} alt={item.dish_name} width={100} height={100} />
              </td>
              <td>
                {isEditingAll ? (
                  <input
                    type="text"
                    value={item.dish_name}
                    onChange={(e) => handleInputChange(item.id, 'dish_name', e.target.value)}
                  />
                ) : (
                  item.dish_name
                )}
              </td>
              <td>
                {isEditingAll ? (
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => handleInputChange(item.id, 'description', e.target.value)}
                  />
                ) : (
                  item.description
                )}
              </td>
              <td>
             {isEditingAll ? (
                  <input
                    type="text" // Change type to "text" to allow deleting the first number
                    value={item.price !== undefined && item.price !== null ? item.price : ''}
                    onChange={(e) => {
                      const newValue = e.target.value; // Get the new input value as a string
                      // Allow empty input or validate as a number
                      if (newValue === '' || /^\d*\.?\d*$/.test(newValue)) {
                        handleInputChange(item.id, 'price', newValue === '' ? '' : parseFloat(newValue));
                      }
                    }}
                    step="0.01"
                  />
                ) : (
                  typeof item.price === 'number' ? item.price.toFixed(2) : 'N/A'
                )}
              </td>
              <td>
                <button onClick={() => handleRemove(item.id)}>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Button to toggle edit mode for the entire table */}
      <button onClick={() => setIsEditingAll(!isEditingAll)}>
        {isEditingAll ? 'Cancel Editing' : 'Edit All Items'}
      </button>
      {isEditingAll && (
        <button onClick={handleSaveAllEdits}>Save All Edits</button>
      )}

      {/* Button to show/hide the form */}
      <button onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Cancel' : 'Add Menu Item'}
      </button>

      {/* Conditionally render the form based on showForm state */}
      {showForm && (
        <form onSubmit={handleAddItem} className={styles.addItemForm}>
          <input
            type="text"
            placeholder="Dish Name"
            value={newItem.dish_name}
            onChange={(e) => setNewItem({ ...newItem, dish_name: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Description"
            value={newItem.description}
            onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Price"
            value={newItem.price}
            onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Image URL"
            value={newItem.image_url}
            onChange={(e) => setNewItem({ ...newItem, image_url: e.target.value })}
            required
          />
          <button type="submit">Add Menu Item</button>
        </form>
      )}
    </div>
  );
};

export default MenuList;
