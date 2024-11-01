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
  const [companyDetails, setCompanyDetails] = useState(null); // Company data state
  const [isSubmitted, setIsSubmitted] = useState(false); // Track submission status
  const [isLoading, setIsLoading] = useState(true); // Loading state for API check

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

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      if (!userId) return;

      try {
        const response = await fetch(`/api/company?user_id=${userId}`);
        if (!response.ok) throw new Error('Failed to fetch company details');

        const data = await response.json();
        if (data && data.user_id) {
          setCompanyDetails(data);
        } else {
          setCompanyDetails(null); // Reset company details if no user_id found
        }
      } catch (error) {
        console.error('Error fetching company details:', error);
        setCompanyDetails(null); // Set to null to show the form
      } finally {
        // Wait for 3 seconds after the API call before displaying the form
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      }
    };

    fetchCompanyDetails();
  }, [userId]);

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

      // Clear form and mark as submitted
      setIsSubmitted(true);
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

  const createdAt = companyDetails && companyDetails.created_at
    ? new Date(companyDetails.created_at).toISOString().split('T')[0]
    : null;

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

        {companyDetails ? (
          <div className={style.details}>
            <h1><strong>Company Details</strong></h1>
            <p><strong>Company ID:</strong> {companyDetails.user_id}</p>
            <p><strong>Company Name:</strong> {companyDetails.company_name}</p>
            <p><strong>Address:</strong> {companyDetails.address}</p>
            <p><strong>Contact Info:</strong> {companyDetails.contact_info}</p>
            <p><strong>Description:</strong> {companyDetails.description}</p>
            <p><strong>Social Links:</strong> <a href={companyDetails.social_links} target="_blank" rel="noopener noreferrer">{companyDetails.social_links}</a></p>
            <p><strong>Account Created on:</strong> {createdAt}</p>
          </div>
        ) : (
          !isLoading && ( // Show form only if not loading
            <div>
              <h2>No Company Details Found, Please Provide Them:</h2>
              <div className={style.dashboardsection}>
                <div className={style.admindashboard}>
                  <h2>Please Complete the below process to avail the service:</h2>
                  {!isSubmitted ? (
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
                  ) : (
                    <div>
                      <p>Submission Successful!</p>
                      <button disabled>Edit</button> {/* Edit button is disabled */}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </>
  );
}
