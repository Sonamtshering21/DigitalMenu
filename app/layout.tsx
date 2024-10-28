{/*
import type { Metadata } from "next";
import localFont from "next/font/local";
/*
import Header from '../components/Header';
import Footer from '../components/Footer';*/ /*
import { AuthProvider } from './Providers'; // Ensure this is set up properly
import { SelectedItemsProvider } from './context/SelectedItemsContext';

import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "DigitalMenu",
  description: "For easy use save time",
};

export default function RootLayout({ children }) {
  
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
       
          <SelectedItemsProvider>
          <AuthProvider>
    
            {children}
          
           {/* <Footer />  Include Footer for consistency */}/*
            </AuthProvider>
          </SelectedItemsProvider>

      </body>
    </html>
  );
}
*/
import type { Metadata } from "next";
import localFont from "next/font/local";
// import Header from '../components/Header';
// import Footer from '../components/Footer';
import { AuthProvider } from './Providers'; // Ensure this is set up properly
import { SelectedItemsProvider } from './context/SelectedItemsContext';

import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
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
