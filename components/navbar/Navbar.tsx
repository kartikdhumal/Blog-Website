"use client"
import { SafeUser } from '@/types/type'
import { Avatar, Box, Divider, IconButton, ListItemIcon, Menu, MenuItem, Tooltip } from '@mui/material'
import logo from '../../app/logo.png'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import React, { useState } from 'react'
import { FaBarsStaggered } from "react-icons/fa6";
import { IoIosCloseCircle } from "react-icons/io";
import Settings from '@mui/icons-material/Settings';
import AddIcon from '@mui/icons-material/Add';
import HomeIcon from '@mui/icons-material/Home';
import Logout from '@mui/icons-material/Logout';
import toast from 'react-hot-toast'

interface UserMenuProps {
  currentUser: SafeUser | null
}


function Navbar({ currentUser }: UserMenuProps) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);
  const open = Boolean(anchorEl);

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };


  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await signOut();
    toast.success('You have been successfully logged out');
  }
  const handleLinkClick = () => {
    setIsNavbarOpen(false);
  };

  const handleNavigation = () => {
    setIsNavbarOpen(!isNavbarOpen);
  };
  return (
    <header>
      <nav className='bg-[#001f50] shadow-xl lg:shadow-md sm:shadow-sm flex justify-between px-4 lg:py-5 sm:py-5'>
        <div className='lg:px-10 sm:px-2 flex items-center'>
          <h1 className={`${!isNavbarOpen ? 'sm:block' : 'sm:hidden'} lg:text-3xl w-50 sm:block font-bold sm:text-2xl sm:h-10 text-white`} style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>
            <Link href={'/'}><img src={logo.src} alt='logo' className='w-auto h-10'></img></Link>
          </h1>

        </div>
        <div className={`flex-grow lg:w-96 sm:w-screen  lg:flex gap-4 justify-center lg:flex-row ${isNavbarOpen ? 'flex' : 'hidden'} sm:flex-col items-center lg:px-16 sm:px-2 text-md`}>
          {!currentUser && (
            <>
              <div className='w-full flex justify-end items-center'>
                <IoIosCloseCircle onClick={handleNavigation} className={`${isNavbarOpen ? 'sm:block' : 'sm:hidden'} mt-2 text-white`} size={30} />
              </div>
              <div className="flex lg:w-auto items-center lg:flex-row lg:gap-7 sm:gap-4 sm:h-auto sm:w-full sm:flex-col">
                <Link
                  className="py-2 w-full text-center font-bold px-6 bg-[#90caf9] text-sm text-[#001f50] rounded-xl transition duration-200"
                  href="/login"
                  onClick={handleLinkClick}
                >
                  <button>Login</button>
                </Link>
                <Link
                  className="w-full text-center py-2  font-bold px-6 bg-[#90caf9] text-sm text-[#001f50] rounded-xl transition duration-200"
                  href="/register"
                  onClick={handleLinkClick}
                >
                  <button>Register</button>
                </Link>
              </div>
            </>
          )}
        </div>
        {currentUser && (
          <div className='w-40 lg:mr-10 sm:mr-1'>
            <Box sx={{ display: 'flex', alignItems: 'center', borderRadius: "50%", justifyContent: "space-around", textAlign: 'center' }}>
              <Link href='/' onClick={handleLinkClick}><HomeIcon sx={{
                '&:hover': {
                  color: "white", transition: "color 0.2s ease-in"
                }, width: 32, height: 32, borderRadius: "50%", color: "#90caf9"
              }} /></Link>

          {/* ---- only admin can create blogs --- */}
              {
                currentUser?.isAdmin && (
                  <Link href='/create' onClick={handleLinkClick}><AddIcon sx={{
                    '&:hover': {
                      color: "white", transition: "color 0.2s ease-in"
                    }, width: 32, height: 32, borderRadius: "50%", color: "#90caf9"
                  }} /></Link>
                )
              }

              <Tooltip title="Profile">
                <IconButton
                  onClick={handleClick}
                  size="small"
                  aria-controls={open ? 'account-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? 'true' : undefined}
                >
                  <Avatar src={'avatar'} sx={{
                    '&:hover': {
                      backgroundColor: "white", transition: "color 0.3s ease-in"
                    }, width: 32, height: 32, backgroundColor: "#90caf9", color: "#001f50"
                  }}></Avatar>
                </IconButton>
              </Tooltip>
            </Box>
            <Menu
              anchorEl={anchorEl}
              id="account-menu"
              className='menu'
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: 'visible',
                  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                  borderRadius: "10px",
                  backgroundColor: "#EDF4F2",
                  color: "#001f50",
                  fontWeight: "bold",
                  mt: 1.5,
                  '& .MuiAvatar-root': {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  '&::before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: "#001f50",
                    transform: 'translateY(-50%) rotate(45deg)',
                    zIndex: 0,
                  },
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem onClick={handleClose}>
                <Avatar src={'avatar'} sx={{ width: 32, height: 32, backgroundColor: "#001f50", color: "#90caf9" }}></Avatar>
                {
                  currentUser?.name ? currentUser?.name : 'USER'
                }
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleClose}>
                <ListItemIcon>
                  <Settings fontSize="small" sx={{ color: "#001f50" }} />
                </ListItemIcon>
                <Link href={`/profile/${currentUser?.id}`}> Profile </Link>
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <Logout fontSize="small" sx={{ color: "#001f50" }} />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </div>
        )}

        {!currentUser && (
          <FaBarsStaggered onClick={handleNavigation} className={`${!isNavbarOpen ? 'sm:block' : 'sm:hidden'} lg:hidden mt-2 text-white`} size={25} />
        )}
      </nav>
    </header>
  )
}

export default Navbar
