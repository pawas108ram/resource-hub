'use client'
import { User } from '@prisma/client'
import Image from 'next/image'
import React from 'react'
import EditUserModal from './modals/EditUserModal'

const Avatar = ({ currentUser, height = 60, width = 60 }: { currentUser: User, height?: number, width?: number }) => {
  const [editUserModal, setEditUserModal] = React.useState(false);

  return (
    
    <>
      {editUserModal && <EditUserModal onClose={() => setEditUserModal(false)} currentUser={currentUser} />}
      <div>
         <button onClick={()=>setEditUserModal(true)}  > 
           <Image src={currentUser?.image || '/images/user.png'} alt='user' width={width} height={height} className='object-contain rounded-full my-8 w-11 h-11 p-1 bg-cyan-200  '/>
         </button>
      </div>
    </>
  )
}

export default Avatar
