'use client'
import { useState } from "react";
import Header from "@/components/Header";
import styles from './dashboard.module.css';

export default function Dashboard() {
  const [formData, setFormData] = useState({
    companyName: '',
    address: '',
    contactInfo: '',
    description: '',
    socialLinks: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = {};
    
    // Validation
    if (!formData.companyName) validationErrors.companyName = "Company name is required.";
    if (!formData.address) validationErrors.address = "Address is required.";
    if (!formData.contactInfo) validationErrors.contactInfo = "Contact info is required.";
    if (!formData.description) validationErrors.description = "Description is required.";

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Handle successful submission (e.g., send data to the server)
    console.log("Form submitted:", formData);
    // Clear form
    setFormData({
      companyName: '',
      address: '',
      contactInfo: '',
      description: '',
      socialLinks: ''
    });
    setErrors({});
  };

  return (
    <>
      <Header />
      <div className={styles.admindashboard}>
        <h1>Welcome To Digital Menu</h1>
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
              {errors.companyName && <p className={styles.error}>{errors.companyName}</p>}
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
              {errors.address && <p className={styles.error}>{errors.address}</p>}
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
              {errors.contactInfo && <p className={styles.error}>{errors.contactInfo}</p>}
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
              {errors.description && <p className={styles.error}>{errors.description}</p>}
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
    </>
  );
}
