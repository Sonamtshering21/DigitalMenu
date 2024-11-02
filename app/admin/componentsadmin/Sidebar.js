// app/components/admin/Sidebar.js
"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // Import the new hook
import styles from '../admin.module.css'
import Image from 'next/image';


const Sidebar = () => {
    const pathname = usePathname(); // Get the current path

    return (
        <div className={styles.sidebar}>
            <h1>Customer Details</h1>
            <ul>
                <li>
                    <Link href="/admin/OrderedList" className={pathname === '/admin/OrderedList' ? styles.activeLink : ''}>
                    <div className={styles.flexContainer}>
                        <Image 
                            src='/ordered.png'
                            alt="Payment List Icon" 
                            width={20}  // Adjust width as needed
                            height={20} // Adjust height as needed
                            className={styles.icon}
                        />
                        <span>Ordered List</span>
                        </div>
                    </Link>
                </li>
                {/*<li>
                    <Link href="/admin/NowDrinksList" className={pathname === '/admin/NowDrinksList' ? styles.activeLink : ''}>
                        Now Drinks List
                    </Link>
                </li>*/}
                <li>
                    <Link href="/admin/PaymentList" className={pathname === '/admin/PaymentList' ? styles.activeLink : ''}>
                    <div className={styles.flexContainer}>
                        <Image 
                            src='/payment.png'
                            alt="Payment List Icon" 
                            width={20}  // Adjust width as needed
                            height={20} // Adjust height as needed
                            className={styles.icon}
                        />
                        <span>Payment List</span>
                        </div>
                                </Link>
                </li>
                {/*<li>
                    <Link href="/admin/CustomerReview" className={pathname === '/admin/CustomerReview' ? styles.activeLink : ''}>
                        Customer Review
                    </Link>
                </li> */}
            </ul>
            <h1>Setting</h1>
            <ul>
                {/*
                <li>
                    <Link href="/admin/ProfileSetting" className={pathname === '/admin/ProfileSetting' ? styles.activeLink : ''}>
                        Profile Setting
                    </Link>
                </li>
                */}
                <li>
                    <Link href="/admin/MenuList" className={pathname === '/admin/MenuList' ? styles.activeLink : ''}>
                    <div className={styles.flexContainer}>
                        <Image 
                            src='/menu.png'
                            alt="Payment List Icon" 
                            width={20}  // Adjust width as needed
                            height={20} // Adjust height as needed
                            className={styles.icon}
                        />
                        <span>Menu Items</span>
                        </div>
                    </Link>
                </li>
                {/*
                <li>
                    <Link href="/admin/DrinkList" className={pathname === '/admin/DrinkList' ? styles.activeLink : ''}>
                        Drink List
                    </Link>
                </li>
                
                <li>
                    <Link href="/admin/Post" className={pathname === '/admin/Post' ? styles.activeLink : ''}>
                        Post
                    </Link>
                </li>
                <li>
                    <Link href="/admin/AnalysisReport" className={pathname === '/admin/AnalysisReport' ? styles.activeLink : ''}>
                        Analysis Report
                    </Link>
                </li>
                <li>
                    <Link href="/admin/FeatureFeedback" className={pathname === '/admin/FeatureFeedback' ? styles.activeLink : ''}>
                        Feature Feedback
                    </Link>
                </li>
                */}
            </ul>
        </div>
    );
};

export default Sidebar;
