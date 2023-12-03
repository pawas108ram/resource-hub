import { User } from '@prisma/client'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import Token from '@/public/images/toke.png'
import Coin from '@/public/images/coin.png'
import { dateString } from '@/app/libs/utility functions/dateString'

const UserCard = ({user,ranking}:{user:User,ranking:number}) => {
  return (
      <div className='flex lg:flex-row items-center justify-between bg-black text-white py-2 px-4 rounded w-full xs:flex-col '>
          <div className='flex flex-row items-center gap-3'>
              <span className='lg:text-lg xs:text-sm'>Rank {ranking}</span>
              <Image src={user.image || '/images/user.png'} width={50} height={50} className='rounded-full h-9 w-9 bg-white xs:hidden lg:flex' alt='user-image ' />
              <Link href={`user/${user.id}`} className='underline xs:text-sm lg:text-lg'>{user.name}</Link>


          </div>
          <div className='flex flex-row items-center gap-4 lg:w-2/6 xs:w-full justify-center'>
              <div className='flex flex-col gap-0.5 lg:text-sm  xs:hidden'>
                  <span className='whitespace-nowrap'>Joined :{dateString(new Date(user.createdAt))}</span>
              </div>
              <div className='flex flex-row items-center gap-2 w-1/2 justify-center '>
                  <Image src={Coin} width={20} height={20} alt='coin' className='h-9 w-9 rounded-full' />
                  <span className='whitespace-nowrap'>{user.coins} coins</span>
              </div>
              <div className='flex flex-row items-center gap-1 w-1/2 justify-center '>
                  <Image src={Token} width={20} height={20} alt='coin' className='h-9 w-9 rounded-full object-cover' />
                  <span>{user.keys} keys</span>
              </div>
          </div>
      
    </div>
  )
}

export default UserCard
