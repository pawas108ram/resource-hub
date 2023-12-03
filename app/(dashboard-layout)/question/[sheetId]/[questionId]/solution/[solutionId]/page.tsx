import { getSolutionById } from '@/app/_actions/getSolutionById';
import { ComplexityToO } from '@/app/libs/utility functions/complexityToO';
import { dateString } from '@/app/libs/utility functions/dateString';
import Content from '@/components/Content';

import Loader from '@/components/Loader';
import SubHeading from '@/components/SubHeading';
import { Comment, CommentDislikes, CommentLikes, Solution, SolutionDislikes, SolutionLikes, SolutionViews, User } from '@prisma/client';
import Image from 'next/image';
import React from 'react'
import { BiSolidDislike, BiSolidLike } from 'react-icons/bi';
import { IoEye } from 'react-icons/io5';
import SolutionCommentCreation from './components/SolutionCommentCreation';

import { FaComment, FaFilter } from 'react-icons/fa';

import SolutionComment from './components/SolutionComment';
import SolutionComments from './components/SolutionComments';
import { getCommentsBySolutionId } from '@/app/_actions/getCommentsBySolutionId';
import { getCurrentUser } from '@/app/_actions/getCurrentUser';
import SeenComponent from './components/SeenComponent';
import LikeAndDislikeComponent from './components/LikeAndDislikeComponent';


export type SolutionCommentType = Comment & {
    author: User;
    likes: CommentLikes[];
    dislikes: CommentDislikes[];
    
   
}



export type FullSolutionType = Solution & {
    likes: SolutionLikes[];
    dislikes: SolutionDislikes[];
    seenBy: SolutionViews[];
    
    author: User;

}

const SingleSolutionPage = async({ params }: { params: { solutionId: string } }) => {
    const solution: FullSolutionType = await getSolutionById(params.solutionId);
    
    const currentUser = await getCurrentUser();
   
   
    
    
    
    return (
        <>
            {solution !== undefined ? <div className='flex flex-col gap-2  bg-white/20 w-full    rounded text-white   h-5/6 my-4 p-2 overflow-hidden xs:pb-12 overflow-y-auto '>
                <div className='flex flex-row items-start gap-4  w-full '>
                    <Image src={solution.author.image || '/images/user.png'} alt='author' width={50} height={50} className='rounded-full object-cover' />
                    <div className='flex flex-col lg:gap-2 xs:gap-0.5 w-full'>
                        <SubHeading body={solution.title} />
                       
                        <div className='flex flex-row items-center gap-4 text-gray-300 lg:text-sm xs:text-xs'>
                            <span>{solution.author.name}</span>
                            <span className='xs:hidden xl:flex'>Created:{dateString(new Date(solution.createdAt))}</span>
                            <span className='xs:hidden xl:flex'>Updated:{dateString(new Date(solution.updatedAt))}</span>
                            <SeenComponent solutionId={solution.id} />
                            {solution && <LikeAndDislikeComponent solutionId={solution.id}  />}
                            

                        </div>
                        
                    </div>
                </div>
                <Content body='Complexity Analysis' />
                        <div className='flex lg:flex-row lg:justify-normal items-center lg:gap-4 py-1 px-4 bg-black/20 xs:justify-center xs:gap-2 xs:text-xs lg:text-base  '>
                            <span >Time Complexity: {ComplexityToO(solution.timeComplexity)}</span>
                            <span >Space Complexity: {ComplexityToO(solution.spaceComplexity)}</span>
                </div>
                <Content body='Approach Preview' />
                <pre className='flex flex-wrap bg-black/20 py-2 px-4 rounded whitespace-break-spaces'>{solution.body}</pre>
                <Content body={`${solution.language} Code`} />
                <pre className='flex flex-wrap bg-black/20 py-2 px-4 rounded whitespace-break-spaces'>{solution.code}</pre>
                <SubHeading body='Create Comments' />
                <SolutionCommentCreation solutionId={solution.id} />
                <SolutionComments solutionId={solution.id}  currentUser={currentUser!} />

            </div>:<div className='flex flex-row items-center justify-center min-h-screen w-full'><Loader/></div>}
        </>
   
  )
}

export default SingleSolutionPage
