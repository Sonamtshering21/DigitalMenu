'use client';
import { useSession } from 'next-auth/react';
import React, { useState, useEffect } from 'react';
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
    image: null // Change to image file
  });
  const [showForm, setShowForm] = useState(false); // State to control form visibility
  const [isEditingAll, setIsEditingAll] = useState(false); // State to track if all items are being edited
  const [changes, setChanges] = useState({}); // Track changes for each item
  const [successMessage, setSuccessMessage] = useState(''); // State for success message
  const [errorMessage, setErrorMessage] = useState(''); // State for error message

  useEffect(() => {
    const fetchMenuItems = async () => {
      if (userId) {
        try {
          const response = await fetch(`/api/menu?user_id=${userId}`);
          if (!response.ok) throw new Error('Failed to fetch menu items');
          const data = await response.json();
          setMenuItems(data.map(item => ({ ...item, price: parseFloat(item.price) || 0 })));
        } catch (error) {
          setErrorMessage(error.message);
          console.error('Error fetching menu items:', error);
        }
      }
    };

    fetchMenuItems();
  }, [userId]);

  const handleRemove = async (id) => {
    try {
      const response = await fetch(`/api/menu?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMenuItems(prevItems => prevItems.filter(item => item.id !== id));
        setChanges(prevChanges => {
          const newChanges = { ...prevChanges };
          delete newChanges[id]; // Remove deleted item changes
          return newChanges;
        });
      } else {
        throw new Error('Failed to delete the item');
      }
    } catch (error) {
      setErrorMessage(error.message);
      console.error('Error removing item:', error);
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();

    if (newItem.dish_name && newItem.price && newItem.image) {
        const formData = new FormData();
        formData.append('file', newItem.image); // Append the image file

        try {
            // Start uploading the image
            const uploadResponse = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            // Check if the image upload was successful
            if (!uploadResponse.ok) throw new Error('Failed to upload image');

            // Get the uploaded image URL from the response
            const uploadData = await uploadResponse.json();
            const imageUrl = uploadData.url; // Get the image URL from the response

            // Now, add the menu item to the database
            const response = await fetch('/api/menu', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...newItem,
                    image_url: imageUrl,
                    user_id: userId,
                }),
            });

            // Check if adding the menu item was successful
            if (response.ok) {
                const addedItem = await response.json();
                const newMenuItem = {
                    ...addedItem,
                    price: parseFloat(addedItem.price),
                };

                // Update the state with the new item
                setMenuItems((prevItems) => [...prevItems, newMenuItem]);
                // Reset the form inputs
                setNewItem({ dish_name: '', description: '', price: '', image: null });
                setShowForm(false); // Hide the form if needed
                setSuccessMessage('Item successfully added!'); // Show success message
                setTimeout(() => setSuccessMessage(''), 3000); // Clear success message after 3 seconds
            } else {
                throw new Error('Failed to add the item');
            }
        } catch (error) {
            setErrorMessage(error.message); // Set the error message
            console.error('Error adding item:', error); // Log the error for debugging
        }
    } else {
        setErrorMessage('Please fill in all fields and select an image.'); // Prompt for missing fields
    }
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
        body: JSON.stringify(itemsToUpdate),
      });

      if (response.ok) {
        setMenuItems(prevItems => 
          prevItems.map(item => ({
            ...item,
            ...changes[item.id],
          }))
        );
        setIsEditingAll(false);
        setChanges({});
      } else {
        throw new Error('Failed to update items');
      }
    } catch (error) {
      setErrorMessage(error.message);
      console.error('Error saving changes:', error);
    }
  };

  const handleInputChange = (id, field, value) => {
    setChanges(prevChanges => ({
      ...prevChanges,
      [id]: {
        ...prevChanges[id],
        [field]: value,
      },
    }));
  };

  return (
    <div>
      <h1>Menu Items</h1>
      {successMessage && <div className={styles.successMessage}>{successMessage}</div>}
      {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Si No</th>
            <th>Image</th>
            <th>Dish Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {menuItems.map((item, index) => (
            <tr key={item.id}>
              <td>{index + 1}</td>
              <td>
                <Image src={item.image_url || "/placeholder-image.jpg"} alt={item.dish_name} width={100} height={100} />
              </td>
              <td>
                {isEditingAll ? (
                  <input
                    type="text"
                    value={changes[item.id]?.dish_name !== undefined ? changes[item.id].dish_name : item.dish_name}
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
                    value={changes[item.id]?.description !== undefined ? changes[item.id].description : item.description}
                    onChange={(e) => handleInputChange(item.id, 'description', e.target.value)}
                  />
                ) : (
                  item.description
                )}
              </td>
              <td>
                {isEditingAll ? (
                  <input
                    type="text"
                    value={changes[item.id]?.price !== undefined ? changes[item.id]?.price : item.price}
                    onChange={(e) => {
                      const newValue = e.target.value;
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

      <button onClick={() => setIsEditingAll(!isEditingAll)} className={styles.btn}>
        {isEditingAll ? 'Cancel Editing' : 'Edit All Items'}
      </button>
      {isEditingAll && (
        <button onClick={handleSaveAllEdits} className={styles.btn}>Save All Edits</button>
      )}

      <button onClick={() => setShowForm(!showForm)} className={styles.btn}>
        {showForm ? 'Cancel' : 'Add Menu Item'}
      </button>

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
            onChange={(e) => {
              const value = e.target.value;
              if (value === '' || /^\d*\.?\d*$/.test(value)) {
                setNewItem({ ...newItem, price: value === '' ? '' : parseFloat(value) });
              }
            }}
            required
            step="0.01"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setNewItem({ ...newItem, image: e.target.files[0] })}
            required
          />
          <button type="submit" className={styles.btn}>Add Item</button>
        </form>
      )}
    </div>
  );
};

export default MenuList;
