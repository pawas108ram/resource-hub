'use client'
import useRoutes from '@/app/hooks/useRoutes'
import Image from 'next/image';
import React from 'react'
import logo from '@/app/favicon.ico'
import DesktopSidebarItem from './DesktopSidebarItem';
import { User } from '@prisma/client';
import Avatar from '../Avatar';
interface DesktopSidebarProps {
  currentUser: User;
}

const DesktopSidebar:React.FC<DesktopSidebarProps> = ({currentUser}) => {
  const routes = useRoutes();
  return (
    <div className='bg-gray-100 h-screen top-0 sticky flex flex-col  xs:hidden md:flex items-center justify-between z-20 p-4'>
      <div className='flex flex-col items-center gap-4 h-full justify-center'>
        
        {routes.map((route) => (
         <DesktopSidebarItem key={route.label} href={route.href} label={route.label} icon={route.icon} onClick={route.onClick} isActive={route.isActive}   />
        ))}
        
      </div>
      <div className='z-[99999]'>
        <Avatar currentUser={currentUser} height={40} width={40} />
      </div>
     
      
      
    </div>
  )
}

export default DesktopSidebar