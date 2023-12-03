'use client'
import useRoutes from '@/app/hooks/useRoutes'
import React from 'react'
import MobileFooterItem from './MobileFooterItem';
import Avatar from '../Avatar';
import { User } from '@prisma/client';

const MobileFooter = ({currentUser}:{currentUser:User}) => {
    const routes = useRoutes();
    return (
      

        <div className=' bg-gray-200 w-full fixed bottom-0 xs:flex flex-row items-center md:hidden   justify-around'>
            {routes.map((route) =>
              (<MobileFooterItem key={route.label} href={route.href} onClick={route.onClick} icon={route.icon} label={route.label} isActive={route.isActive} />))}
        <Avatar currentUser={currentUser} height={50} width={50} />
          
          
      
    </div>
  )
}

export default MobileFooter
