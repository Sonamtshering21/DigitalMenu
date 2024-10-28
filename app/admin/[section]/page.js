// app/admin/[section]/page.js
import OrderedList from '../componentsadmin/OrderedList';
import MenuList from '../componentsadmin/MenuList'
// import other components as needed

export default function SectionPage({ params }) {
    const { section } = params;

    const renderContent = () => {
        switch (section) {
            case 'OrderedList':
                return <OrderedList />;
            case 'MenuList':
                return <MenuList />;
            // Add other cases for different sections
            default:
                return <p>Select a valid section.</p>;
        }
    };

    return (
        <div>
            <h1>{section.replace(/([A-Z])/g, ' $1')}</h1>
            {renderContent()}
        </div>
    );
}
