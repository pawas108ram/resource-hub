'use state'


import {  ResourceUser, SheetUser, User} from '@prisma/client'
import axios from 'axios';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
interface UserAvatarProps {
    sheetUser?: SheetUser & {
        user:User
    }
    resourceUser?: ResourceUser & {
        user:User
    }
}

const UserAvatar: React.FC<UserAvatarProps> = ({ sheetUser,resourceUser }) => {
    
    
  
    


   
  return (
      <div className="flex flex-col gap-1">
          {sheetUser && <Image src={sheetUser.user.image || '/images/user.png'} alt='avatar' width={40} height={40} className='rounded-full p-1 bg-white ' />}
          {resourceUser && <Image src={resourceUser.user.image || '/images/user.png'} alt='avatar' width={40} height={40} className='rounded-full p-1 bg-white ' />}

          
         
          
          
            
      </div>
  )
}

export default UserAvatar
