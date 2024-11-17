import type { Metadata } from "next";
import { AuthProvider } from './Providers'; // Ensure this is set up properly
import { SelectedItemsProvider } from './context/SelectedItemsContext';
import { Outfit } from 'next/font/google';


import "./globals.css";

// Use the correct property for weight
const outfit = Outfit({ subsets: ['latin'], weight: ['100', '400', '700', '900'] });

export const metadata: Metadata = {
  title: "DigitalMenu",
  description: "For easy use save time",
};

// Define the type for the props
interface RootLayoutProps {
  children: React.ReactNode; // Use ReactNode for children
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={outfit.className}> {/* Use the Outfit font here */}
        <SelectedItemsProvider>
          <AuthProvider>
            {children}
            {/* <Footer />  Include Footer for consistency */}
          </AuthProvider>
        </SelectedItemsProvider>
      </body>
    </html>
  );
}
