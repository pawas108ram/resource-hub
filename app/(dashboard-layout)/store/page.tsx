'use client'
import { StoreProducts } from '@/app/libs/const/StoreProducts'
import Heading from '@/components/Heading'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import StoreProduct from './StoreProduct'
import { getCurrentUser } from '@/app/_actions/getCurrentUser'
import Loader from '@/components/Loader'
import { useSession } from 'next-auth/react'
import { User } from '@prisma/client'
import { pusherClient } from '@/app/libs/pusher'
import { FaCoins } from 'react-icons/fa'

const StorePage = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const session = useSession();
  const email = session?.data?.user?.email;
  useEffect(() => {
    const fetchUser = async () => {
      const user = await fetch('/api/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      }).then(res => res.json());

      setCurrentUser(user);
    }
    if(email){
      fetchUser()
    }
  }, [email])
  useEffect(() => {
    pusherClient.subscribe('user');
    pusherClient.bind('update:user', (data: User) => {
      setCurrentUser(data);
    });
    return () => {
      pusherClient.unsubscribe('user');
      pusherClient.unbind('update:user');
    }
  }
    , [currentUser])

    
  return (
      <div className='bg-black/90 w-full max-h-screen text-white flex flex-col items-center p-4 gap-8 overflow-hidden xs:p-2 xs:pb-32 lg:pb-0 '>
          {currentUser !== null ? <> <Heading body='ResourceHub Store' className='text-white underline' />
              <div className='flex flex-row  gap-2 items-center justify-end p-2 w-full h-full overflow-hidden '>
                  <div className="flex flex-col gap-1 outline outline-1 outline-white py-2 px-4 items-center flex-shrink-0 ">
            <span className='   font-semibold flex flex-row items-center gap-2  '><FaCoins size={20} /> {currentUser.coins} coins</span>
                        <span className='   font-semibold flex flex-row items-center gap-2'><Image src='/images/pendrive.png' width={18} height={18} alt='pendrive'/>   {currentUser.keys} pendrives</span>
                  </div>
               </div>
             <div className='grid lg:grid-cols-4 xs:grid-cols-2  gap-2  xs:w-full lg:w-5/6 bg-white/10 rounded p-3 xs:h-full  lg:h-auto lg:overflow-visible xs:overflow-y-auto'>
                  {StoreProducts.map((product, ele) => (
                      <StoreProduct key={ele} product={product} currentUserCoins={currentUser.coins} />
                  ))}
             
              
        </div></> : <div className='flex flex-col items-center justify-center h-screen w-full gap-4  '>
          <Loader />
          <span className='text-3xl text-white font-semibold animate-pulse'>Loading...</span>
      </div>}
      
    </div>
  )
  
}

export default StorePage
