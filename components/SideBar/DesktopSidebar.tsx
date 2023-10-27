'use client'
import useRoutes from '@/app/hooks/useRoutes'
import Image from 'next/image';
import React from 'react'
import logo from '@/app/favicon.ico'
import DesktopSidebarItem from './DesktopSidebarItem';
import { User } from '@prisma/client';
interface DesktopSidebarProps {
  currentUser: User;
}

const DesktopSidebar:React.FC<DesktopSidebarProps> = ({currentUser}) => {
  const routes = useRoutes();
  return (
    <div className='bg-gray-100 min-h-screen top-0 sticky w-40 flex flex-col  xs:hidden md:flex items-center justify-between '>
      <div className='flex flex-col items-center gap-4'>
        <Image src={logo} alt="logo" width={200} height={200} />
        {routes.map((route) => (
         <DesktopSidebarItem key={route.label} href={route.href} label={route.label} icon={route.icon} onClick={route.onClick} isActive={route.isActive}   />
        ))}
      </div>
      <Image src={currentUser.image || '/images/user.png'} alt='user' width={60} height={60} className='object-cover rounded-full my-8 '/>
      
      
    </div>
  )
}

export default DesktopSidebar