'use client'
import { getAllSolutions } from '@/app/_actions/getAllSolutions';
import { Solution, SolutionDislikes, SolutionLikes, SolutionType, SolutionViews, User } from '@prisma/client';
import React, { useEffect, useState } from 'react'
import SolutionCard, { handleTypeColor } from './components/SolutionCard';

import { solutionTypes } from '@/app/libs/const/solutionType';
import clsx from 'clsx';

import SolutionFilterComponent from './components/SolutionFilterComponent';
import { useSearchParams } from 'next/navigation';
import { pusherClient } from '@/app/libs/pusher';





export type UserSolutionType = Solution & {
  author: User;
  likes: SolutionLikes[],
  dislikes: SolutionDislikes[],
  seenBy:SolutionViews[]
}
const SolutionPage = ({ params }: { params: { questionId: string, sheetId: string } }) => {
  const [allSolutions, setAllSolutions] = React.useState<UserSolutionType[]>();
  const searchParams = useSearchParams();
  const paramString=searchParams?.toString() || '';
  

 

  useEffect(() => {
    const fetchAllSolutions = async() => {
      const solutions = await getAllSolutions(params.questionId, paramString);
      setAllSolutions(solutions);
    }
    fetchAllSolutions();
  }, [params.questionId, searchParams, paramString]);
  useEffect(() => {
    pusherClient.subscribe(`question-${params.questionId}`);
    pusherClient.bind('create:solution', async () => {
      const solutions = await getAllSolutions(params.questionId, paramString);
      setAllSolutions(solutions);
      
    })
    pusherClient.bind('update:solution', async () => {
      const solutions = await getAllSolutions(params.questionId, paramString);
      setAllSolutions(solutions);
      
    })
    pusherClient.bind('delete:solution', (data: number) => {
      setAllSolutions((prev) => prev?.filter((sol) => sol.id !== data));
    })
      
    



  }, [params.questionId,paramString]);

  const [activeVariant, setActiveVariant] = useState<SolutionType>('BruteForce');

  
 
  
  
  return (
    <div className='flex flex-col gap-4 p-4 bg-white/10 rounded shadow-sm '>
      <div className='flex flex-row items-center w-full bg-black/20 shadow-sm shadow-white/20 justify-around lg:p-3 xs:p-1 rounded sticky top-0 z-20 '>
        {solutionTypes.map((type) => (
          <button key={type.value} onClick={()=>setActiveVariant(type.value)} className={clsx(' py-2 xl:px-4 xs:px-1 rounded font-semibold lg:text-xl xs:text-xs xl:w-1/4 xs:w-auto hover:scale-110 transition duration-300',handleTypeColor(type.value),(type.value===activeVariant)?'bg-black/80 scale-105   border-2 border-white/90 ':'bg-white/10 opacity-90')}>{type.label}</button>
        )
        )}
        <SolutionFilterComponent sheetId={params.sheetId} questionId={params.questionId} />
      
      </div>
      {allSolutions !=undefined && allSolutions?.filter((solutionType) => solutionType.type === activeVariant).length > 0 ? allSolutions?.filter((solutionType) => solutionType.type === activeVariant).map((sol) => (
          <SolutionCard key={sol.id} solution={sol} questionId={params.questionId} sheetId={params.sheetId} />
        )) : <span className='bg-black text-white text-2xl font-bold p-3 rounded text-center'>No Solutions of {activeVariant} type yet</span>}
      
    </div>
  )
}

export default SolutionPage
