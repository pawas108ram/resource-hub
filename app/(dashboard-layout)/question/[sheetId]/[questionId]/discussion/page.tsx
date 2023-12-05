import Content from '@/components/Content'
import SubHeading from '@/components/SubHeading'
import { TextareaAutosize } from '@mui/material'
import React from 'react'
import QuestionComments from './components/QuestionComments'
import QuestionCommentCreation from './components/QuestionCommentCreation'
import { getCurrentUser } from '@/app/_actions/getCurrentUser'
import { CommentDislikes, CommentLikes, User,Comment } from '@prisma/client'

export type QuestionCommentType = Comment & {
  likes: CommentLikes[],
  dislikes: CommentDislikes[],
  author: User,
  

}

const DiscussionPage = async({ params }: { params: { questionId: string, sheetId: string } }) => {
  const questionId = params.questionId;
  const sheetId = params.sheetId;
  const currentUser=await getCurrentUser();

  return (
    <div className='h-full w-full rounded bg-white/10 flex flex-col gap-3 p-4 '>
      <SubHeading body='Question Discussion' className='text-white underline' />
      <Content body='Dont Post your solution here, Post your solution in the solution section' className='bg-black/70 py-1 px-2 rounded text-white ' />
      <QuestionCommentCreation questionId={questionId} />
      
     
      {currentUser && <QuestionComments questionId={questionId} sheetId={sheetId} currentUser={currentUser} />}

   </div>
  )
}

export default DiscussionPage
