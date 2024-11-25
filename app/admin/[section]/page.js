// app/admin/[section]/page.js
import OrderedList from '../componentsadmin/OrderedList';
import MenuList from '../componentsadmin/MenuList'
import PaymentList from '../componentsadmin/PaymentList'
import styles from '@/app/admin/admin.module.css'
// import other components as needed

export default function SectionPage({ params }) {
    const { section } = params;

    const renderContent = () => {
        switch (section) {
            case 'OrderedList':
                return <OrderedList />;
            case 'PaymentList':
                return <PaymentList />;
            case 'MenuList':
                return <MenuList />;
            // Add other cases for different sections
            default:
                return <p>Select a valid section.</p>;
        }
    };

    return (
        <div className={styles.pageContainer}>
            <h1 className={styles.pageTitle}>
                {section.replace(/([A-Z])/g, ' $1')}
            </h1>
            <div className={styles.contentContainer}>
                {renderContent()}
            </div>
        </div>
    );
}