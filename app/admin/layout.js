// app/admin/layout.js
import Header from '@/components/Header';
import React from 'react';
import Sidebar from './componentsadmin/Sidebar'; 
import styles from './admin.module.css';

const AdminLayout = ({ children }) => {
  return (
    <div className={styles.container}> {/* Use the container class here */}
      <Header />
      <Sidebar />
      <div className={styles.innerdisplay}>
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
