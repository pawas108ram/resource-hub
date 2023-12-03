
'use client'
import Heading from '@/components/Heading'
import { User } from '@prisma/client';
import React, { useEffect, useState } from 'react'
import UserCard from './component/UserCard';
import Loader from '@/components/Loader';
import { MdSkipNext, MdSkipPrevious } from 'react-icons/md';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';


const LeaderBoardPage = () => {
    const [leaderBoardUsers, setLeaderBoardUsers] = useState<User[] | null>(null);
    const router = useRouter();
    const params = useSearchParams();
    const page = params?.get('page') || '1';
    useEffect(() => {
        const fetchLeaderBoardUsers = async () => {
            const res = await fetch('/api/leaderboard?page='+page);
            if (res.ok) {
                const data = await res.json();
                setLeaderBoardUsers(data);
            }
        }
        fetchLeaderBoardUsers();
        
    },[page])
    
    
  return (
      <div className='bg-black/90 w-full h-screen text-white flex flex-col p-3 items-center gap-6 overflow-hidden xs:pb-32 lg:pb-3'>
          <Heading body='LeaderBoard' className='text-white underline' />
          <div className='flex flex-col items-center gap-2 bg-white/10 rounded p-2 lg:w-5/6 xs:w-full h-full overflow-y-auto'>
              {leaderBoardUsers !== null ? leaderBoardUsers?.map((user, ele) => (
                 <UserCard key={ele} user={user} ranking={ele+1} />
              )) : <div className='flex flex-col items-center justify-center gap-1 h-full w-full'>
                      <Loader />
                      <span>Loading...</span>
              </div>}
              {leaderBoardUsers?.length === 0 && <span className='bg-black flex flex-row items-center justify-center h-full w-full text-white font-semibold text-2xl'>No Users Found</span>}
                      
          </div>
          <div className='flex flex-row items-center gap-4 bg-white/10 p-4'>
              
              {page !== '1' && <Link href={`/leaderboard?page=${(parseInt(page))-1}`} className='p-4 rounded-full bg-black text-white' ><MdSkipPrevious size={20} /></Link>}
              <Link href={`/leaderboard?page=${(parseInt(page))+1}`} className='p-4 rounded-full bg-black text-white' 
    ><MdSkipNext size={20} /></Link>
          </div>
      
    </div>
  )
}

export default LeaderBoardPage
