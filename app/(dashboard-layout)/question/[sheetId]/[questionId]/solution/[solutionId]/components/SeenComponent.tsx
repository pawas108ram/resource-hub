'use client'
import { pusherClient } from '@/app/libs/pusher';
import React, { useEffect, useState } from 'react'
import { IoEye } from 'react-icons/io5'

const SeenComponent = ({ solutionId}: { solutionId: number}) => {
    const [seenCount, setSeenCount] = useState<number>(0);
    useEffect(() => {
        const fetchSeenCount = async () => {
            const seen = await fetch(`/api/solution/singleSolution/seen`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ solutionId: solutionId })
            });
            
        }
        fetchSeenCount();
        
        
    }, [solutionId])
    useEffect(() => {
        const fetchSeenCount = async () => {
            const seen = await fetch(`/api/solution/singleSolution/seen/${solutionId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                
            }).then((res) => res.json());
            
            setSeenCount(seen);
        }
        fetchSeenCount();
    }, [solutionId])
    
    useEffect(() => {
        pusherClient.subscribe(`solution-${solutionId}`);
        pusherClient.bind('solution:seen', (data:number) => {
            if (solutionId === data) {
                setSeenCount((prev) => prev + 1);
            }
        })
    },[solutionId])
    
   

  return (
    <div className='flex flex-row items-center gap-1 text-black/90 '>
    <IoEye />
    <span className='text-sm'>Seen By:</span>
    <span className='text-sm'>{seenCount}</span>
</div>
  )
}

export default SeenComponent
