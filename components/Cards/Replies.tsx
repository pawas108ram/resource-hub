'use client'

import React, { useEffect, useState } from 'react'
import { FullSheetCommentType } from '../modals/CommentModal';

import Content from '../Content';
import Image from 'next/image';
import {  MdCancel, MdSettings } from 'react-icons/md';
import { FaRegEyeSlash ,FaRegEye } from 'react-icons/fa';
import { BiDislike, BiLike, BiSolidDislike, BiSolidLike } from 'react-icons/bi';
import { SheetCommentLikeAction } from '@/app/_actions/SheetCommentLikeAction';
import { SheetCommentDisLikeAction } from '@/app/_actions/SheetCommentDislikeAction';
import { dateString } from '@/app/libs/utility functions/dateString';
import { User } from '@prisma/client';
import ReplyModal from '../modals/ReplyModal';
import CommentUpdateModal from '../modals/CommentUpdateModal';

interface RepliesCardProps{

    parentComment: FullSheetCommentType;
    currentUserId: number;
   
    
}

const Replies: React.FC<RepliesCardProps> = ({ parentComment,currentUserId }) => {
    const [replies, setReplies] = useState<(FullSheetCommentType & {
        parent: Comment & {
        author: User;
    }} )[]>([]);
    const [replyLimit, setReplyLimit] = useState(5);
    const [showReplies, setShowReplies] = useState(false);
    const [replyModal, setReplyModal] = useState(false);
    const [updateModal, setUpdateModal] = useState(false);

    
    useEffect(() => {
        const fetchData = async () => {
            const data = await fetch(`/api/sheets/comments/replies/${parentComment.id}`).then((res) => res.json());
            setReplies(data);
        }
        fetchData();
        console.log(replies);
    }, [parentComment.id,replies]);
    
    
  return (
     
          
          <div className='p-2 flex flex-col rounded bg-gray-400 '>
              <Content body='Replies' className='text-gray-700' />
              {replies !== undefined && replies.length !== 0 ? (replies.slice(0, replyLimit).map((reply) => (
                  
                  <>
                       {replyModal && <ReplyModal onClose={() => setReplyModal(false)} parentComment={reply} />}
                      <div key={reply.id} className='bg-gray-200 lg:py-2 lg:px-3 flex flex-col text-sm gap-1 rounded mt-2 xs:p-1'>
                           <span className='text-xs font-semibold text-gray-500'>Replying to @{reply.parent.author.name}</span>
                          <div className='flex flex-row items-center justify-between lg:px-4 xs:px-1'>
                              <div className='flex flex-row items-center lg:gap-4 xs:gap-0.5  '>
                                  <Image src={reply?.author?.image || '/images/user.png'} alt='avatar' width={30} height={30} className='rounded-full p-1 bg-white h-9 w-9'/>
                                  <span className='lg:text-sm xs:text-xs font-semibold '>{reply.author.name}</span>
                                  <span className='lg:text-sm xs:text-xs font-semibold bg-black/90 text-white py-1 px-4 rounded'>{dateString(new Date(reply.updatedAt))}</span>
                              </div>
                              {reply.authorId===currentUserId &&   <div className='relative'><button onClick={() => setUpdateModal((prev) => !prev)}>{updateModal ? <MdCancel size={24} /> : <MdSettings size={24} />}</button>
                                  {updateModal && <CommentUpdateModal comment={reply} onClose={() => setUpdateModal(false)} />}
                              </div>}
                          </div>
                          <Content body={reply.body || ''} className='  lg:text-sm xs:text-xs text-black/80 font-medium ' />
                          <div className='flex flex-row items-center lg:gap-4 xs:gap-1 lg:px-4 xs:px-1 justify-between'>
                              <button className='text-sm  flex flex-row gap-2 items-center' onClick={() => SheetCommentLikeAction(reply.id)}><span className='bg-green-500 p-2 rounded-full'><BiSolidLike size={18}  /></span><span>{reply?.likes?.length}</span></button>
                              <button className='text-sm  flex flex-row gap-2 items-center ' onClick={() => SheetCommentDisLikeAction(reply.id)}><span className='bg-red-500 p-2 rounded-full'><BiSolidDislike size={18} /></span><span>{reply?.dislikes?.length}</span></button>
                              <button className='text-sm text-blue-600 font-semibold' onClick={() => setShowReplies((prev) => !prev)}>{showReplies ? <div className='flex flex-row items-center gap-2'>
                                  <FaRegEyeSlash size={20} />
                              </div> : <FaRegEye size={20} />}</button>
                          <button className='text-xs text-gray-700 font-bold' onClick={()=>setReplyModal(true)}>Reply</button>
                          </div>
                          {showReplies && <Replies  parentComment={reply} currentUserId={currentUserId} />}
                      </div>
                      
                  </>
              ))):<span className='bg-black p-3 text-white text-xl'>No Replies Yet</span>}
          
          {replies.length > replyLimit && <button className=' text-blue-600 font-bold bg-white px-4 rounded py-2 text-lg' onClick={() => setReplyLimit((prev) => prev + 5)}>Load More</button>}
         
          
          
          </div>
     
  )
}

export default Replies
