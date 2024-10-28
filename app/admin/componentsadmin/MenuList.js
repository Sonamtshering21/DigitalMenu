'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link'
import Image from 'next/image'
import styles from './adminstyle/MenuList.module.css'
const MenuList = () => {
  const[menuItems, setMenuItems]=useState([]);

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

    return (
        <div>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Image</th>
                        <th>Dishname</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                  {menuItems.map(item =>(
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td><Image src ={item.image_url || "/placeholder-image.jpg"} alt={item.name} width={100} height={100} /></td>
                      <td><Link href={`/menu/${item.id}`}>{item.dish_name}</Link></td>
                      <td>{item.description}</td>
                      <td>{item.price.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
            </table>
            
        </div>
    );
};

export default MenuList;