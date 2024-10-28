

"use client";
import React from 'react';
import Link from 'next/link';
import style from '../components/style/Header.module.css';
import { useSession, signOut } from "next-auth/react";

const Header = () => {
  const { data: session } = useSession();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/menu' }); // Redirect after sign out, if desired
  };

  return (
    <div className={style.header1}>
      <ul>
        {/* Always visible public link */}
        <li>
          <Link href='/menu' className='hover:text-blue-400'>Menu</Link>
        </li>

      
        {session ? (
          <>
            <li>
              <Link href='/admin' className='hover:text-blue-400'>Admin</Link>
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
            <Link href='/' className='hover:text-blue-400'>Login</Link>
          </li>
        )}
      </ul>
    </div>
  );
};

export default Header;


