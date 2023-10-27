import DesktopSideBar from '@/components/SideBar/DesktopSidebar'
import MobileFooter from '@/components/SideBar/MobileFooter'

import React from 'react'
import { getCurrentUser } from '../_actions/getCurrentUser'

const DashBoardLayout = async ({ children }: { children: React.ReactNode }) => {
    const currentUser = await getCurrentUser();
  return (
      <div className='flex flex-row'>
          <DesktopSideBar currentUser={currentUser!} />
          {children}
          <MobileFooter/>
    </div>
  )
}

export default DashBoardLayout
