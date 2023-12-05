'use client'

import { FullSheetCommentType } from '../modals/CommentModal'
import Image from 'next/image';

import { BiSolidDislike, BiSolidLike } from 'react-icons/bi';
import { useEffect, useState } from 'react';
import Replies from './Replies';
import ReplyModal from '../modals/ReplyModal';
import { MdCancel, MdClose, MdSettings } from 'react-icons/md';
import { SheetCommentLikeAction } from '@/app/_actions/SheetCommentLikeAction';
import { SheetCommentDisLikeAction } from '@/app/_actions/SheetCommentDislikeAction';
import CommentUpdateModal from '../modals/CommentUpdateModal';
import { dateString } from '@/app/libs/utility functions/dateString';
import { User } from '@prisma/client';
import { getCurrentUser } from '@/app/_actions/getCurrentUser';
import { pusherClient } from '@/app/libs/pusher';

interface CommentCardProps{
    comment: FullSheetCommentType;
    currentUserId: number;
    
}

const CommentCard: React.FC<CommentCardProps> = ({ comment,currentUserId }) => {
    const [showReplies, setShowReplies] = useState(false);
    const [replyModal, setReplyModal] = useState(false);
    const [updateModal, setUpdateModal] = useState(false);
    const [likes, setLikes] = useState(comment.likes?.length || 0);
    const [dislikes, setDislikes] = useState(comment.dislikes?.length || 0);
    useEffect(() => {
        pusherClient.subscribe('comment');
        pusherClient.bind('like:solutioncomment', (data: { likes: number, dislikes: number, commentId: number }) => {
            {
                if (comment.id === data.commentId) {
                    setLikes(data.likes);
                    setDislikes(data.dislikes);
                }
            }
        });
        pusherClient.bind('dislike:solutioncomment', (data: { likes: number, dislikes: number, commentId: number }) => {
            {
                if (comment.id === data.commentId) {
                    setLikes(data.likes);
                    setDislikes(data.dislikes);
                }
            }
        });
        return () => {
            pusherClient.unsubscribe('comment');
            pusherClient.unbind('like:solutioncomment');
            pusherClient.unbind('dislike:solutioncomment');
        }
    }, [comment.id]);
   
    

    return (
      <div className='relative' >
            {replyModal && <ReplyModal onClose={() => setReplyModal(false)} parentComment={comment} />}
          <div className='flex flex-col  gap-2  lg:p-2 bg-white/10 text-white  rounded xs:p-0.5 '>
              <div className="flex flex-row items-center justify-between">
                  <span className='flex flex-row items-center lg:gap-2 xs:gap-0.5'>
                      <Image src={comment?.author?.image || '/images/user.png'} alt='avatar' width={40} height={40} className='rounded-full p-1 h-11 w-11 bg-white' />
                        <span className='lg:text-lg xs:text-sm font-semibold '>{comment.author.name}</span>
                        <span className='lg:text-sm xs:text-xs font-semibold bg-black/90 text-white py-1 px-4 rounded'>{dateString(new Date(comment.updatedAt))}</span>
                  </span>
                  {comment.authorId===currentUserId &&   <div className='relative'><button onClick={() => setUpdateModal((prev) => !prev)}>{updateModal ? <MdCancel size={24} /> : <MdSettings size={24} />}</button>
                        {updateModal && <CommentUpdateModal comment={comment} onClose={() => setUpdateModal(false)} />}
                    </div>}
              </div>
              <span className=' bg-black/90 text-white  py-1 px-4 rounded lg:text-sm xs:text-xs font-medium'>{comment.body}</span>
              <div className='flex flex-row items-center lg:gap-6 xs:gap-1 justify-between px-2 py-1 '>
                  <button className='flex flex-row items-center gap-1'>
                      <span className='bg-green-500 p-1 rounded-full'><BiSolidLike size={24} onClick={()=>SheetCommentLikeAction(comment.id)} /> </span>
                      {comment.likes?.length || '0'}
                  </button>
                  <button className='flex flex-row items-center gap-1'>
                      <span className='bg-red-500 p-1 rounded-full' onClick={()=>SheetCommentDisLikeAction(comment.id)}><BiSolidDislike size={24} /> </span>
                      {comment.dislikes?.length || '0'}
                  </button>
                    <button className='lg:text-sm xs:text-xs text-blue-600 font-semibold' onClick={() => setShowReplies((prev) => !prev)}>{showReplies ? <div className='flex flex-row items-center gap-2'>
                        <MdClose size={20} /><span>Hide Replies</span>
                    </div>: 'Show Replies'}</button>
                  <button className='text-xs text-white font-bold' onClick={()=>setReplyModal(true)}>Reply </button>
                 
                </div>
               
                {showReplies && <Replies  parentComment={comment} currentUserId={currentUserId} />}
          
          
          
            </div>
            
      </div>
  )
}

export default CommentCard
