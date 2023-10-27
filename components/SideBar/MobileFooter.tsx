'use client'
import useRoutes from '@/app/hooks/useRoutes'
import React from 'react'
import MobileFooterItem from './MobileFooterItem';

const MobileFooter = () => {
    const routes = useRoutes();
    return (
      

        <div className=' bg-gray-200 w-full fixed bottom-0 xs:flex flex-row items-center md:hidden py-6 px-3 justify-around'>
            {routes.map((route) =>
                (<MobileFooterItem key={route.label} href={route.href} onClick={route.onClick} icon={route.icon} label={route.label} isActive={route.isActive} />))}
          
          
      
    </div>
  )
}

export default MobileFooter
