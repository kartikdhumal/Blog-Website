"use client"
import { SafeUser } from '@/types/type'
import { Session } from 'inspector'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import React, { useState } from 'react'
import { FaBarsStaggered } from "react-icons/fa6";
import { IoIosCloseCircle } from "react-icons/io";

interface UserMenuProps {
  currentUser: SafeUser | null
}


function Navbar({ currentUser }: UserMenuProps) {

  const [isNavbarOpen, setIsNavbarOpen] = useState(false);

  const handleLinkClick = () => {
    setIsNavbarOpen(false);
  };

  const handleNavigation = () => {
    setIsNavbarOpen(!isNavbarOpen);
  };
  return (
    <header>
    <nav className='bg-blue-700 shadow-xl lg:shadow-md sm:shadow-sm flex justify-between px-4 py-2'>
        <div className='lg:px-10 sm:px-2 flex items-center'>
          <h1 className={`${!isNavbarOpen ? 'sm:block' : 'sm:hidden'} lg:text-3xl w-50 sm:block font-bold sm:text-2xl sm:h-10 text-white`} style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>
            <Link href={'/'}>DKTales</Link>
          </h1> 

       {currentUser?.name && (
        isNavbarOpen ? " " :
  <div className="lg:ml-40 sm:ml-10 lg:text-[14px] vm:text-[13px] rounded-xl lg:px-3 vm:px-1 lg:py-1 vm:py-1 bg-sky-200 text-blue-700 font-bold">{`Heyy,`} <span>{currentUser.name}</span></div>

)}

        </div>
        <div className={`flex-grow lg:w-96 sm:w-screen  lg:flex gap-4 justify-center lg:flex-row ${isNavbarOpen ? 'flex' : 'hidden'} sm:flex-col items-center lg:px-16 sm:px-2 text-md`}>
          {currentUser ? (
            <>
              <div className='w-full flex justify-end items-center'>
                <IoIosCloseCircle onClick={handleNavigation} className={`${isNavbarOpen ? 'sm:block' : 'sm:hidden'} mt-2 text-white`} size={30} />
              </div>
              <div className={`lg:flex sm:flex ${isNavbarOpen ? 'flex-col' : 'flex-row'} items-center gap-7`}>
                <Link href='/' onClick={handleLinkClick} className="text-white">Home</Link>
                <Link href='/create' onClick={handleLinkClick} className="text-white"> Start </Link>
                <Link href={`/profile/${currentUser.id}`} onClick={handleLinkClick} className="text-white">Profile</Link>
                <button className="lg:w-auto sm:w-full flex items-center text-white bg-gradient-to-r from-red-500 via-red-600 to-red-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 rounded-lg text-sm px-4 py-2 font-bold text-center ml-2" onClick={() => signOut()}>LogOut</button>
              </div>
            </>
          ) : (
            <>
              <div className='w-full flex justify-end items-center'>
                <IoIosCloseCircle onClick={handleNavigation} className={`${isNavbarOpen ? 'sm:block' : 'sm:hidden'} mt-2 text-white`} size={30} />
              </div>
              <div className="flex lg:w-auto items-center lg:flex-row lg:gap-7 sm:gap-4 sm:h-auto sm:w-full sm:flex-col">
              <Link
    className="inline-block py-2 px-6 bg-gradient-to-r from-blue-500 to-blue-600 hover:bg-blue-700 text-sm text-white font-bold rounded-xl transition duration-200 shadow-md border-solid border-black border-1"
    href="/register"
    onClick={handleLinkClick}
  >
    <button style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>Register</button>
  </Link>
  <Link
    className="inline-block py-2 px-6 bg-gradient-to-r from-blue-500 to-blue-600 hover:bg-blue-700 text-sm text-white font-bold rounded-xl transition duration-200 shadow-md border-solid border-black border-1"
    href="/login"
    onClick={handleLinkClick}
  >
    <button style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>Login</button>
  </Link>
              </div>
            </>
          )}
        </div>
        <FaBarsStaggered onClick={handleNavigation} className={`${!isNavbarOpen ? 'sm:block' : 'sm:hidden'} lg:hidden mt-2 text-white`} size={25} />
      </nav>
    </header>
  )
}

export default Navbar
