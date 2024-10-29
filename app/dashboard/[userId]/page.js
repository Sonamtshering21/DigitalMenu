// /app/dashboard/[userId]/page.js
'use client';

import { useSession } from "next-auth/react";
import { useState, useEffect } from 'react';
import Header from '@/components/Header'; // Import your Header component
import style from '../dashboard.module.css';

export default function UserDashboard({ params }) {
  const { userId } = params; // Get userId from the URL parameters
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    companyName: '',
    address: '',
    contactInfo: '',
    description: '',
    socialLinks: '',
  });

  const [errors, setErrors] = useState({});
  const [userData, setUserData] = useState(null); // User data state

  useEffect(() => {
    // Check if the user ID from the session matches the URL userId
    if (session?.user?.id !== userId) {
      console.error("Access denied: User ID mismatch.");
      return; // Handle access denial here (e.g., redirect or show an error)
    }

    // Fetch user-specific data here
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/user/${userId}`); // Replace with your API endpoint
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const data = await response.json();
        setUserData(data); // Set user data
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchData();
  }, [userId, session]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = {};

    // Validation
    if (!formData.companyName) validationErrors.companyName = 'Company name is required.';
    if (!formData.address) validationErrors.address = 'Address is required.';
    if (!formData.contactInfo) validationErrors.contactInfo = 'Contact info is required.';
    if (!formData.description) validationErrors.description = 'Description is required.';

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const userId = session?.user?.id;
      if (!userId) {
        console.error("User ID not found in session.");
        return;
      }

      // Add userId to the form data
      const requestData = { ...formData, userId };

      // Send data to the API
      const response = await fetch('/api/dashboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit data');
      }

      const result = await response.json();
      console.log(result.message); // Handle success message

      // Clear form
      setFormData({
        companyName: '',
        address: '',
        contactInfo: '',
        description: '',
        socialLinks: '',
      });
      setErrors({});
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <>
      <Header />
      <div className={style.maindashboard}>
        <h1>Welcome to Digital Menu</h1>
        <div>
          Name: <span className="font-bold">{session?.user?.name}</span>
        </div>
        {userData && (
          <div>
            <h2>User Data:</h2>
            <pre>{JSON.stringify(userData, null, 2)}</pre> {/* Display fetched user data */}
          </div>
        )}
        <div className={style.dashboardsection}>
          <div className={style.admindashboard}>
            <h2>Please Complete the below process to avail the service:</h2>
            <form onSubmit={handleSubmit}>
              <div>
                <label htmlFor="companyName">
                  Company Name / Restaurant Name *
                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    required
                  />
                  {errors.companyName && <p className={style.error}>{errors.companyName}</p>}
                </label>
              </div>
              <div>
                <label htmlFor="address">
                  Address of the Company *
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                  {errors.address && <p className={style.error}>{errors.address}</p>}
                </label>
              </div>
              <div>
                <label htmlFor="contactInfo">
                  Contact Info of the Company *
                  <input
                    type="text"
                    id="contactInfo"
                    name="contactInfo"
                    value={formData.contactInfo}
                    onChange={handleChange}
                    required
                  />
                  {errors.contactInfo && <p className={style.error}>{errors.contactInfo}</p>}
                </label>
              </div>
              <div>
                <label htmlFor="description">
                  Description of the Company *
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                  />
                  {errors.description && <p className={style.error}>{errors.description}</p>}
                </label>
              </div>
              <div>
                <label htmlFor="socialLinks">
                  Link/Website/TikTok/Social Media
                  <input
                    type="text"
                    id="socialLinks"
                    name="socialLinks"
                    value={formData.socialLinks}
                    onChange={handleChange}
                  />
                </label>
              </div>
              <button type="submit">Submit</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
