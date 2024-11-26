'use client';

import { useSession } from "next-auth/react";
import { useState, useEffect } from 'react';
import Header from '@/components/Header'; 
import style from '../dashboard.module.css';
import Image from "next/image";
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
  const [isLoading, setIsLoading] = useState(true); // Loading state for API check

  useEffect(() => {
    if (Number(session?.user?.id) !== Number(userId)) {
      console.error("Access denied: User ID mismatch.");
      return; // Handle access denial here (e.g., redirect or show an error)
    }

    const fetchData = async () => {
      try {
        const response = await fetch(`/api/user/${userId}`);
        if (!response.ok) throw new Error('Failed to fetch user data');
        const data = await response.json();
        setUserData(data);
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
        setCompanyDetails(data?.user_id ? data : null);
      } catch (error) {
        console.error('Error fetching company details:', error);
        setCompanyDetails(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompanyDetails();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = {};

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

      const requestData = { ...formData, userId };

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
      console.log(result.message);

      // Update company details and clear form
      setCompanyDetails({
        user_id: userId,
        company_name: formData.companyName,
        address: formData.address,
        contact_info: formData.contactInfo,
        description: formData.description,
        social_links: formData.socialLinks,
        created_at: new Date().toISOString(),
      });
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

  const createdAt = companyDetails?.created_at
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
            <pre>{JSON.stringify(userData, null, 2)}</pre>
          </div>
        )}

        {companyDetails ? (
          <div className={style.details}>
            <Image src="/correct.png" alt="img" width={30} height={30} />
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
          !isLoading && (
            <div className={style.admindashboard}>
              <h2>No Company Details Found, Please Provide Them:</h2>
              <form onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="companyName">
                    Company Name / Restaurant Name: <span>* </span>
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
                    Address of the Company <span>*</span>
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
                    Contact Info of the Company <span>*</span>
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
                    Description of the Company <span>*</span>
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
          )
        )}
      </div>
    </>
  );
}
