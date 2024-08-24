import React from 'react'
import { signOut } from "next-auth/react";
import Link from 'next/link';

const Navbar = () => {
  const handleSignOut = () => {
    signOut({ callbackUrl: `/login/` });
  };  
  return (
    <div className='bg-gray-800 py-6 text-white'>
      <div className='flex justify-between items-center container mx-auto'>
        <h1 className='font-semibold'>ICON</h1>
        <ul className='flex justify-center items-center space-x-12'>
          <li><Link href={`/`}> Home</Link></li>
          <li><Link href={`/dashboard/`}> Dashboard</Link></li>
          <li><Link href={`/items/`}> Items</Link></li>
        </ul>
        <button onClick={handleSignOut} className='border border-gray-500 rounded-md px-5 py-2'>Logout</button>
      </div>
    </div>
  )
}

export default Navbar