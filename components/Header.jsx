

"use client";
import React from 'react';
import Link from 'next/link';
import style from '../components/style/Header.module.css';
import { useSession, signOut } from "next-auth/react";

const Header = () => {
  const { data: session } = useSession();
  const userId = session?.user?.id; 

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/menu' }); // Redirect after sign out, if desired
  };

  return (
    <div className={style.header1}>
      <ul>
        {/* Always visible public link */}
        <li>
          <Link href='/menu' className='hover:text-green-300'>Menu</Link>
        </li>

      
        {session ? (
          <>
            <li>
                    <Link href={`/dashboard/${userId}`} className='hover:text-green-300'>
                        Company Details
                    </Link>
                </li>
              <li>
              <Link href='/admin' className='hover:text-green-300'>Dashboard</Link>
            </li>
            <li>
              <Link href='/qr-codes' className='hover:text-green-300'>QRcode</Link>
            </li>
           
           
            <li>
              <span>{session.user.name}</span>
              <button
                onClick={handleSignOut}
                className="font-bold"
                style={{ marginLeft: "5px" }}
              >
                Sign out
              </button>
            </li>
          </>
        ) : ( 
          // If not logged in, show a link to log in
          <li>
            <Link href='/' className='hover:text-green-300'>Login</Link>
          </li>
        )}
      </ul>
    </div>
  );
};

export default Header;


