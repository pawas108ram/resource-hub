
import DesktopSideBar from '@/components/SideBar/DesktopSidebar'
import MobileFooter from '@/components/SideBar/MobileFooter'

import React from 'react'
import { getCurrentUser } from '../_actions/getCurrentUser'

const DashBoardLayout = async ({ children }: { children: React.ReactNode }) => {
   const currentUser = await getCurrentUser();
  return (
      <div className='flex md:flex-row xs:flex-col'>
          <DesktopSideBar currentUser={currentUser!} />
          {children}
          <MobileFooter currentUser={currentUser!} />
    </div>
  )
}

export default DashBoardLayout
