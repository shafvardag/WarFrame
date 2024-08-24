import React from 'react'
import Link from 'next/link';


const index = () => {

  return (
    <div className='w-full h-screen flex flex-col justify-center items-center'> 
        <h1 className='text-5xl'>Welcome Back !</h1>
        <Link href={`/items/`} className='underline text-blue-600 text-2xl uppercase'>Items</Link>
    </div>
  )
}

export default index