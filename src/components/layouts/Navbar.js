import React from 'react'
import { signOut, useSession } from "next-auth/react";

import Link from 'next/link';

const Navbar = () => {
  const handleSignOut = () => {
    signOut({ callbackUrl: `/login/` });
  };  
  const { data: session } = useSession();
  return (
    <div className='bg-gray-800 py-6 text-white'>
      <div className='flex justify-between items-center container mx-auto'>
        <h1 className='font-semibold'>ICON</h1>
        <ul className='flex justify-center items-center space-x-12'>
          <li><Link href={`/`}> Home</Link></li>
          <li><Link href={`/dashboard/`}> Dashboard</Link></li>
          <li><Link href={`/items/`}> Items</Link></li>
        </ul>
        <div className="m-1 hs-dropdown group relative inline-flex">
          <button id="hs-dropdown-hover-event mb-2" type="button" className="hs-dropdown-toggle py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none" >
            Menu
            <svg className="group-hover:rotate-180 transition-all ease-in-out duration-300 size-4" xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" > <path d="m6 9 6 6 6-6" /> </svg>
          </button>
          <div className="hs-dropdown-menu transition-opacity transition-transform duration-300 left-[-145px] top-[40px] ease-out transform opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 pointer-events-none group-hover:pointer-events-auto absolute min-w-60 bg-white shadow-md rounded-lg p-1 space-y-0.5 mt-2" role="menu" aria-orientation="vertical" aria-labelledby="hs-dropdown-hover-event" >
            <a className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100" href="#">{session?.user?.name || "Actions"}</a>
            <a className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100" href="/favorites/" >Favorites</a>
            <button onClick={handleSignOut}  className="flex w-full items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100">Logout</button>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Navbar