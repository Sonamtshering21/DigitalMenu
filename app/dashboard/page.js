/*import UserInfo from "@/components/UserInfo";

import Menu from "@/app/menu/page"
import Admin from "@/app/admin/page" */

import Header from "@/components/Header";
import styles from './dashboard.module.css'
export default function Dashboard() {
  return (
    <>
      <Header /> 
      <div className={styles.admindashboard}>
        Welcome to Karma Resturant

      </div>
    </>
  );
}
